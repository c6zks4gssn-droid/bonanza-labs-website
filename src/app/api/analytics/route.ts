import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import {
  isRedisConfigured,
  redisCommand,
  redisPipeline,
  storageKey,
} from "@/lib/server-store";
import { sanitizeEvent, type AnalyticsEvent } from "@/lib/analytics";

export const dynamic = "force-dynamic";

// Eerste-party analytics. Geen cookie, geen IP, geen user-agent, geen
// derde partij. Zie /src/lib/analytics.ts voor de onderbouwing.
//
// Waarom een eigen route en geen third-party script: /cookies en /privacy
// beloven letterlijk "geen analytics- of marketingcookies" en "geen Google
// Analytics, advertentiepixels of andere tracking". Dat is een
// verkoopargument. Dit moet die belofte waarmaken, niet breken.
//
// Rate limiting zonder IP-opslag: per IP worden wél korte tellers bijgehouden,
// maar alleen als losse teller, nooit gekoppeld aan een ander gegeven en met
// een korte bewaartijd. Zonder dit zou één script de hele database kunnen
// vullen met ruis.

const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_PER_WINDOW = 60;
const STREAM_LIMIT = 2000;

function ipHash(ip: string): string {
  // HMAC-SHA256 met een geheime sleutel. Waarom niet gewoon hashen: een
  // gewone hash van een IP-adres is met brute force terug te rekenen (IPv4 is
  // maar 2^32 waarden). Met HMAC is de uitkomst zonder de sleutel niet naar
  // een IP te herleiden.
  //
  // Dit is alleen een rate-limit-teller: hij telt verzoeken per IP per minuut
  // en wordt na 60 seconden verwijderd. Het is geen identificatie van een
  // bezoeker en wordt niet aan andere gegevens gekoppeld.
  const salt = process.env.ANALYTICS_SALT || process.env.ADMIN_PASSWORD || "bonanza-labs";
  return createHmac("sha256", salt).update(ip).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  if (!isRedisConfigured) {
    // Zonder opslag is er niets te meten, maar de site mag niet breken.
    return NextResponse.json({ ok: false, stored: false }, { status: 200 });
  }

  let body: Partial<AnalyticsEvent> & { events?: Partial<AnalyticsEvent>[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, stored: false }, { status: 400 });
  }

  const incoming = Array.isArray(body.events) ? body.events : [body];
  const events = incoming
    .map((event) => sanitizeEvent(event))
    .filter((event): event is AnalyticsEvent => event !== null);

  if (events.length === 0) {
    return NextResponse.json({ ok: true, stored: 0 }, { status: 200 });
  }

  // Rate limit op basis van een gehashte teller. De hash wordt nergens bewaard
  // in een vorm waarmee je een IP kunt terugrekenen, en de teller vervalt na
  // een minuut.
  const forwardedFor = req.headers.get("x-forwarded-for") || "";
  const ip = forwardedFor.split(",")[0].trim() || "unknown";
  const rateKey = storageKey(`analytics:rate:${ipHash(ip)}`);
  const rateCount = await redisCommand<number>("INCR", rateKey);
  if (rateCount === 1) {
    await redisCommand("EXPIRE", rateKey, RATE_LIMIT_WINDOW_SECONDS);
  }
  if ((rateCount || 0) > RATE_LIMIT_MAX_PER_WINDOW) {
    return NextResponse.json({ ok: true, stored: 0 }, { status: 200 });
  }

  const counterKey = storageKey("analytics:counters");
  const streamKey = storageKey("analytics:stream");

  const commands: string[][] = [];

  for (const event of events) {
    // Alle tellers staan in één hash. De veldnaam bepaalt de dimensie:
    //   <eventnaam>                  -> totaal per gebeurtenis
    //   <eventnaam>:<label>          -> per label (bv. welke CTA)
    //   page:<pad>                   -> per pagina
    // Dus elke teller is HINCRBY <hash> <veld> 1 — drie argumenten na het
    // commando. Let op het aantal: HINCRBY heeft key, veld en increment.
    commands.push(["HINCRBY", counterKey, event.name, "1"]);

    if (event.label) {
      commands.push(["HINCRBY", counterKey, `${event.name}:${event.label}`, "1"]);
    }

    if (event.path) {
      commands.push(["HINCRBY", counterKey, `page:${event.path}`, "1"]);
    }

    // Per dag, voor de trend.
    commands.push(["HINCRBY", storageKey(`analytics:day:${event.timestamp.slice(0, 10)}`), event.name, "1"]);

    // Volledige stroom, met een unieke id zodat een tweede identieke
    // gebeurtenis niet door dezelfde lijst-entry wordt overschreven.
    const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    commands.push(["LPUSH", streamKey, JSON.stringify({ id: eventId, ...event })]);
  }

  commands.push(["LTRIM", streamKey, "0", String(STREAM_LIMIT - 1)]);
  // De tellers en de stroom moeten lang genoeg blijven staan om een trend te
  // kunnen zien. De stroom wordt gekort; de tellers niet.
  commands.push(["EXPIRE", counterKey, String(60 * 60 * 24 * 400)]);
  commands.push(["EXPIRE", streamKey, String(60 * 60 * 24 * 90)]);

  try {
    await redisPipeline(commands);
  } catch (error) {
    console.error("Analytics store failed:", error);
    return NextResponse.json({ ok: false, stored: 0 }, { status: 200 });
  }

  return NextResponse.json({ ok: true, stored: events.length }, { status: 200 });
}
