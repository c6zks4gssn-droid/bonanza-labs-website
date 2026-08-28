#!/usr/bin/env node

const BASE = (process.env.SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const ADMIN_USERNAME = process.env.SMOKE_ADMIN_USERNAME || process.env.ADMIN_USERNAME || "";
const ADMIN_PASSWORD = process.env.SMOKE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "";
const VERCEL_BYPASS_SECRET = process.env.SMOKE_VERCEL_BYPASS_SECRET || "";

let passed = 0;
let failed = 0;
const failures = [];

function pass(name) {
  console.log(`  ✅ ${name}`);
  passed += 1;
}

function fail(name, detail) {
  console.log(`  ❌ ${name} — ${detail}`);
  failed += 1;
  failures.push({ name, detail });
}

function requestHeaders(extra = {}) {
  return {
    ...(VERCEL_BYPASS_SECRET
      ? {
          "x-vercel-protection-bypass": VERCEL_BYPASS_SECRET,
          "x-vercel-set-bypass-cookie": "true",
        }
      : {}),
    ...extra,
  };
}

async function request(path, init = {}) {
  return fetch(`${BASE}${path}`, {
    redirect: "follow",
    ...init,
    headers: requestHeaders(init.headers || {}),
  });
}

async function readJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Geen geldige JSON ontvangen: ${text.slice(0, 180)}`);
  }
}

async function check(name, fn) {
  try {
    await fn();
    pass(name);
  } catch (error) {
    fail(name, error instanceof Error ? error.message : String(error));
  }
}

function basicAuth(username, password) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

async function main() {
  console.log(`\n🧪 BonanzaLabs launch smoke → ${BASE}\n`);

  let health;

  await check("GET /api/health geeft gecontroleerde 200/503 JSON", async () => {
    const response = await request("/api/health");
    if (![200, 503].includes(response.status)) {
      throw new Error(`verwacht 200 of 503, kreeg ${response.status}`);
    }
    health = await readJson(response);
    if (!["ready", "degraded"].includes(health.status)) {
      throw new Error(`ongeldige healthstatus: ${health.status}`);
    }
    if (!Array.isArray(health.services) || !Array.isArray(health.missing)) {
      throw new Error("services of missing ontbreekt");
    }
  });

  await check("Health gebruikt de echte launch-services", async () => {
    const names = new Set((health?.services || []).map((service) => service.name));
    for (const required of [
      "redis",
      "stripe-checkout",
      "stripe-webhook",
      "admin",
      "resend",
      "contact",
      "ai-chat",
    ]) {
      if (!names.has(required)) throw new Error(`service ontbreekt: ${required}`);
    }
  });

  await check("GET /api/checkout bevat ServeFlow-pilot", async () => {
    const response = await request("/api/checkout");
    if (response.status !== 200) throw new Error(`status ${response.status}`);
    const body = await readJson(response);
    if (!Array.isArray(body.products)) throw new Error("productlijst ontbreekt");
    if (!body.products.includes("serveflow-pilot-14-days")) {
      throw new Error("ServeFlow-pilot ontbreekt in checkoutcatalogus");
    }
    if (typeof body.configured !== "boolean") {
      throw new Error("checkout configured-flag ontbreekt");
    }
  });

  await check("GET /api/stripe-webhook rapporteert configuratie", async () => {
    const response = await request("/api/stripe-webhook");
    if (response.status !== 200) throw new Error(`status ${response.status}`);
    const body = await readJson(response);
    if (typeof body.configured !== "boolean") {
      throw new Error("webhook configured-flag ontbreekt");
    }
  });

  await check("POST /api/leads weigert ongeldige invoer", async () => {
    const response = await request("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Test zonder e-mail" }),
    });
    if (response.status !== 400) throw new Error(`verwacht 400, kreeg ${response.status}`);
  });

  await check("POST /api/leads slaat op of faalt veilig zonder Redis", async () => {
    const redisReady = Boolean(
      health?.services?.find((service) => service.name === "redis")?.ok,
    );
    const response = await request("/api/leads", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": `smoke-${Date.now()}`,
      },
      body: JSON.stringify({
        name: "BonanzaLabs Smoke Test",
        email: `smoke+${Date.now()}@example.com`,
        message: "Geautomatiseerde launchcontrole; deze lead mag na de test worden verwijderd.",
        source: "contact-form",
        page: `${BASE}/smoke-test`,
      }),
    });

    if (redisReady) {
      if (response.status !== 200) {
        throw new Error(`Redis is ready maar leadstatus is ${response.status}`);
      }
      const body = await readJson(response);
      if (!body.success || typeof body.id !== "string") {
        throw new Error("lead is niet aantoonbaar opgeslagen");
      }
    } else if (response.status !== 503) {
      throw new Error(`zonder Redis verwacht 503, kreeg ${response.status}`);
    }
  });

  const adminReady = Boolean(
    health?.services?.find((service) => service.name === "admin")?.ok,
  );

  await check("Adminroute weigert ontbrekende of verkeerde credentials", async () => {
    const noAuth = await request("/api/admin/leads?limit=1");
    const wrongAuth = await request("/api/admin/leads?limit=1", {
      headers: { authorization: basicAuth("wrong-user", "wrong-password") },
    });

    const expected = adminReady ? 401 : 503;
    if (noAuth.status !== expected) {
      throw new Error(`zonder auth verwacht ${expected}, kreeg ${noAuth.status}`);
    }
    if (wrongAuth.status !== expected) {
      throw new Error(`verkeerde auth verwacht ${expected}, kreeg ${wrongAuth.status}`);
    }
  });

  await check("Adminroute accepteert correcte Basic Auth", async () => {
    if (!adminReady) return;
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      throw new Error(
        "health meldt admin ready, maar SMOKE_ADMIN_USERNAME/SMOKE_ADMIN_PASSWORD ontbreken",
      );
    }

    const response = await request("/api/admin/leads?limit=1", {
      headers: { authorization: basicAuth(ADMIN_USERNAME, ADMIN_PASSWORD) },
    });
    const redisReady = Boolean(
      health?.services?.find((service) => service.name === "redis")?.ok,
    );
    const expected = redisReady ? 200 : 503;
    if (response.status !== expected) {
      throw new Error(`verwacht ${expected}, kreeg ${response.status}`);
    }
  });

  await check("Healthstatus is consistent met ontbrekende services", async () => {
    const expected = health.missing.length === 0 ? "ready" : "degraded";
    if (health.status !== expected) {
      throw new Error(`status ${health.status}, verwacht ${expected}`);
    }
  });

  console.log(`\n${passed} passed, ${failed} failed.`);
  if (failures.length > 0) {
    console.log("\nMislukte controles:");
    for (const failure of failures) {
      console.log(`  • ${failure.name}: ${failure.detail}`);
    }
  }
  console.log();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("Smoke test gecrasht:", error);
  process.exit(2);
});
