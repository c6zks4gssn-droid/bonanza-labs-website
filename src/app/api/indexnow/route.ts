import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "847e3d95f661518d66260353ec435c35";
const HOST = "www.bonanza-labs.com";
const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation?: string;
  urlList: string[];
}

async function submitToIndexNow(urls: string[]): Promise<{ endpoint: string; status: number; body: string }[]> {
  const payload: IndexNowPayload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const results = await Promise.all(
    INDEXNOW_ENDPOINTS.map(async (endpoint) => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const body = await res.text();
        return { endpoint, status: res.status, body };
      } catch (e) {
        return { endpoint, status: 0, body: String(e) };
      }
    })
  );
  return results;
}

export async function POST(request: Request) {
  // Auth via shared secret (header x-searchos-key) — alleen de Publisher-agent mag dit aanroepen
  const sharedKey = request.headers.get("x-searchos-key");
  const expectedKey = process.env.SEARCHOS_SHARED_KEY?.trim();
  if (!sharedKey || sharedKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { urls?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.urls) || body.urls.length === 0) {
    return NextResponse.json({ error: "urls[] required, non-empty" }, { status: 400 });
  }

  // Beperk tot URLs van ons domein
  const validUrls = body.urls.filter((u) => {
    const url = new URL(u);
    return url.hostname === "www.bonanza-labs.com" || url.hostname === "bonanza-labs.com";
  });

  if (validUrls.length === 0) {
    return NextResponse.json({ error: "No valid URLs" }, { status: 400 });
  }

  const results = await submitToIndexNow(validUrls);
  const allOk = results.every((r) => r.status >= 200 && r.status < 300);

  return NextResponse.json(
    {
      submitted: validUrls.length,
      endpoints: results,
      success: allOk,
      timestamp: new Date().toISOString(),
    },
    { status: allOk ? 200 : 207 }
  );
}

export async function GET() {
  // GET = health check / info
  return NextResponse.json({
    status: "ready",
    host: HOST,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    endpoints: INDEXNOW_ENDPOINTS,
    method: "POST with x-searchos-key header and {urls: [...]} body",
  });
}