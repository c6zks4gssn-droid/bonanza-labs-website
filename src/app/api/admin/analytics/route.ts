import { NextRequest, NextResponse } from "next/server";
import { isRedisConfigured, redisCommand, storageKey } from "@/lib/server-store";

export const dynamic = "force-dynamic";

const STREAM_LIMIT = 500;

// HGETALL levert een afwisselend array: [veld, waarde, veld, waarde, ...].
// Deze helper maakt er een object van.
function hgetallToObject(flat?: string[] | null): Record<string, string> {
  const result: Record<string, string> = {};
  if (!Array.isArray(flat)) return result;
  for (let index = 0; index + 1 < flat.length; index += 2) {
    result[String(flat[index])] = String(flat[index + 1]);
  }
  return result;
}

export async function GET(request: NextRequest) {
  if (!isRedisConfigured) {
    return NextResponse.json(
      { error: "Analyticsopslag is niet geconfigureerd" },
      { status: 503 },
    );
  }

  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") || 50);
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(1, Math.min(Math.floor(requestedLimit), STREAM_LIMIT))
    : 50;

  const counterKey = storageKey("analytics:counters");

  // Alle tellers staan in één hash. De veldnaam bepaalt de dimensie:
  //   <eventnaam>            -> totaal
  //   <eventnaam>:<label>    -> per label
  //   page:<pad>             -> per pagina
  // HGETALL geeft een afwisselend array van [veld, waarde, veld, waarde, ...],
  // geen object. Let op: het resultaat komt als JSON-array binnen, dus
  // Object.entries zou de indices als sleutels nemen ("0", "1", ...).
  const rawCounters = await hgetallToObject(
    await redisCommand<string[]>("HGETALL", counterKey),
  );

  const counters: Record<string, number> = {};
  const pages: Record<string, number> = {};
  const labels: Record<string, number> = {};
  const totals: Record<string, number> = {};

  for (const [key, value] of Object.entries(rawCounters)) {
    const count = Number(value) || 0;
    if (key.startsWith("page:")) pages[key.slice("page:".length)] = count;
    else if (key.includes(":")) labels[key] = count;
    else totals[key] = count;
  }

  // De laatste gebeurtenissen, zodat je de volgorde van een bezoek kunt zien.
  const rawStream =
    (await redisCommand<string[]>("LRANGE", storageKey("analytics:stream"), 0, limit - 1)) || [];

  const stream = rawStream.flatMap((entry) => {
    try {
      return [JSON.parse(entry)];
    } catch {
      return [];
    }
  });

  // Per dag, voor de trend over de laatste dagen.
  const days: Record<string, number> = {};
  const dayKeys = await redisCommand<string[]>(
    "KEYS",
    `${storageKey("analytics:day")}:*`,
  );
  for (const dayKey of dayKeys || []) {
    const date = dayKey.split(":").pop() || "";
    const dayCounters = hgetallToObject(
      await redisCommand<string[]>("HGETALL", dayKey),
    );
    const total = Object.values(dayCounters).reduce(
      (sum, value) => sum + (Number(value) || 0),
      0,
    );
    if (total > 0) days[date] = total;
  }

  return NextResponse.json(
    {
      totals,
      labels,
      pages,
      days,
      stream,
      generatedAt: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
