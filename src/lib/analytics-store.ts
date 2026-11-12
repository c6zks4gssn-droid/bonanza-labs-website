// Server-side opslag van analysevenementen.
//
// De kernlogica staat in /src/app/api/analytics/route.ts. Dit bestand bundelt
// dezelfde opslag voor server-side callers, zoals de checkoutroute, die een
// gebeurtenis wil vastleggen zonder een HTTP-verzoek naar zichzelf te doen.
//
// Geen cookie, geen IP, geen user-agent, geen persoonsgegevens. Zie
// /src/lib/analytics.ts.

import { isRedisConfigured, redisPipeline, storageKey } from "@/lib/server-store";

const ANALYTICS_PREFIX = "analytics";
const STREAM_LIMIT = 2000;

export type AnalyticsEventName =
  | "page_view"
  | "cta_click"
  | "checkout_start"
  | "checkout_error"
  | "lead_submit"
  | "quickscan_start"
  | "video_play";

export async function storeAnalyticsEvent(
  name: AnalyticsEventName,
  label?: string,
  path?: string,
): Promise<boolean> {
  if (!isRedisConfigured) return false;

  const timestamp = new Date().toISOString();
  const counterKey = storageKey(`${ANALYTICS_PREFIX}:counters`);
  const streamKey = storageKey(`${ANALYTICS_PREFIX}:stream`);

  const commands: string[][] = [
    // Zelfde veldstructuur als in /src/app/api/analytics/route.ts:
    // alle tellers in één hash, met het veld als dimensie.
    ["HINCRBY", counterKey, name, "1"],
    ["HINCRBY", storageKey(`${ANALYTICS_PREFIX}:day:${timestamp.slice(0, 10)}`), name, "1"],
  ];

  if (label) {
    commands.push(["HINCRBY", counterKey, `${name}:${label}`, "1"]);
  }
  if (path) {
    commands.push(["HINCRBY", counterKey, `page:${path}`, "1"]);
  }

  const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  commands.push([
    "LPUSH",
    streamKey,
    JSON.stringify({ id: eventId, name, label, path, timestamp }),
  ]);
  commands.push(["LTRIM", streamKey, "0", String(STREAM_LIMIT - 1)]);
  commands.push(["EXPIRE", counterKey, String(60 * 60 * 24 * 400)]);
  commands.push(["EXPIRE", streamKey, String(60 * 60 * 24 * 90)]);

  try {
    await redisPipeline(commands);
    return true;
  } catch (error) {
    console.error("Analytics store failed:", error);
    return false;
  }
}
