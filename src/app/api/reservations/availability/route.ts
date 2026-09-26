import { NextRequest, NextResponse } from "next/server";
import { incrementRateLimit } from "@/lib/server-store";

export const dynamic = "force-dynamic";

/**
 * Beschikbaarheidscheck voor het ServeFlow-demorestaurant.
 *
 * Deze route hoort bij de Bonanza Voice-agent (ElevenLabs) en wordt daar
 * aangeroepen als tool `check_serveflow_availability`.
 *
 * Twee harde eigenschappen:
 *  1. Alleen lezen. Er wordt geen reservering gemaakt, geen gast vastgelegd en
 *     geen persoonsgegeven verwerkt. Er gaat niets naar Redis behalve de
 *     rate-limit-teller per IP.
 *  2. Deterministisch. Dezelfde datum en hetzelfde tijdstip geven altijd
 *     hetzelfde antwoord. Een stemagent die twee keer hetzelfde vraagt mag
 *     niet twee verschillende antwoorden krijgen.
 *
 * LET OP: dit is het demorestaurant van de ServeFlow-pilot, niet de live
 * bezetting van een echt restaurant. De bezetting komt uit een vast model
 * (zie demandFor), niet uit een reserveringssysteem van een klant. Dat is
 * bewust: zonder koppeling met een echt systeem mag deze route niet de indruk
 * wekken dat het echte tafels van een klant betreft.
 */

const VENUE = "ServeFlow-demorestaurant";
const TIMEZONE = "Europe/Amsterdam";

// Capaciteit en bediening van het demorestaurant.
const TOTAL_SEATS = 40;
const MAX_ONLINE_PARTY = 8; // grotere gezelschappen gaan telefonisch
const MAX_PARTY_SIZE = 20; // bovengrens die de agent mag doorgeven
const SLOT_MINUTES = 30;
const OPENING_HOUR = 17; // eerste tafel
const LAST_SLOT_HOUR = 21; // laatste tafel
const MAX_DAYS_AHEAD = 90;

// Maandag dicht (0 = zondag).
const CLOSED_WEEKDAYS = new Set([1]);

// Vraagcurve per uur, als fractie van de totale capaciteit.
const DEMAND_BY_HOUR: Record<number, number> = {
  17: 0.35,
  18: 0.62,
  19: 0.82,
  20: 0.74,
  21: 0.45,
};

interface SlotResult {
  time: string;
  seatsLeft: number;
  available: boolean;
}

/** Stabiele hash zodat hetzelfde tijdstip altijd dezelfde bezetting geeft. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Hash terug naar een fractie tussen 0 en 1. */
function hashFraction(input: string): number {
  return hash(input) / 4294967295;
}

/**
 * Deel van de dag in de tijdzone van het restaurant.
 * Serverless draait in UTC, dus UTC-delen gebruiken zou de openingstijden
 * rond middernacht laten verschuiven.
 */
function localParts(date: Date): {
  weekday: number;
  hour: number;
  minute: number;
  dateKey: string;
} {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts: Record<string, string> = {};
  for (const p of fmt.formatToParts(date)) parts[p.type] = p.value;

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const hour = Number(parts.hour === "24" ? "0" : parts.hour);

  return {
    weekday: weekdayMap[parts.weekday] ?? 0,
    hour,
    minute: Number(parts.minute),
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

/** Resterende stoelen voor één tijdslot. */
function seatsLeftFor(dateKey: string, hour: number, weekday: number): number {
  const base = DEMAND_BY_HOUR[hour] ?? 0.5;
  const weekendBoost = weekday === 5 || weekday === 6 ? 1.12 : 1;
  const jitter = 0.7 + 0.6 * hashFraction(`${dateKey}#${hour}`);
  const taken = Math.round(base * weekendBoost * jitter * TOTAL_SEATS);
  return Math.max(0, TOTAL_SEATS - taken);
}

/** Rond een tijd af op het dichtstbijzijnde half uur. */
function slotTime(hour: number, minute: number): { hour: number; minute: number } {
  const rounded = Math.round(minute / SLOT_MINUTES) * SLOT_MINUTES;
  if (rounded >= 60) return { hour: hour + 1, minute: 0 };
  return { hour, minute: rounded };
}

function hhmm(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/**
 * Alternatieven op dezelfde avond, zodat de agent iets kan aanbieden in plaats
 * van alleen "nee". Alleen binnen de openingstijden.
 */
function findAlternatives(
  dateKey: string,
  weekday: number,
  partySize: number,
  skipHour: number,
): SlotResult[] {
  const out: SlotResult[] = [];
  for (let hour = OPENING_HOUR; hour <= LAST_SLOT_HOUR && out.length < 3; hour += 1) {
    if (hour === skipHour) continue;
    const left = seatsLeftFor(dateKey, hour, weekday);
    if (left >= partySize) out.push({ time: hhmm(hour, 0), seatsLeft: left, available: true });
  }
  return out;
}

export async function GET(req: NextRequest) {
  try {
    const requestedAt = (req.nextUrl.searchParams.get("requestedAt") || "").trim();
    const partySizeRaw = (req.nextUrl.searchParams.get("partySize") || "").trim();

    if (!requestedAt) {
      return NextResponse.json(
        { error: "Geef requestedAt mee als ISO 8601 met tijdzone." },
        { status: 400 },
      );
    }

    const partySize = Number(partySizeRaw);
    if (!Number.isInteger(partySize) || partySize < 1 || partySize > MAX_PARTY_SIZE) {
      return NextResponse.json(
        { error: `Geef partySize mee als heel getal tussen 1 en ${MAX_PARTY_SIZE}.` },
        { status: 400 },
      );
    }

    const when = new Date(requestedAt);
    if (Number.isNaN(when.getTime())) {
      return NextResponse.json(
        { error: "requestedAt is geen geldige datum. Gebruik ISO 8601 met tijdzone." },
        { status: 400 },
      );
    }

    // Lichte rate limit: een stemagent mag een paar keer vragen, niet hameren.
    const forwardedFor = req.headers.get("x-forwarded-for") || "unknown";
    const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
    const rateCount = await incrementRateLimit(`rate:availability:${ip}`, 10 * 60);
    if (rateCount > 60) {
      return NextResponse.json(
        { error: "Te veel verzoeken. Probeer het later opnieuw." },
        { status: 429 },
      );
    }

    const now = new Date();
    const { weekday, hour, minute, dateKey } = localParts(when);

    // Verleden en te ver vooruit eerst: dat zijn geen capaciteitsvragen.
    if (when.getTime() < now.getTime()) {
      return NextResponse.json({
        available: false,
        requestedAt,
        partySize,
        venue: VENUE,
        demo: true,
        reason: "past",
        message: "Dat tijdstip ligt in het verleden. Kies een datum en tijd in de toekomst.",
      });
    }

    const daysAhead = (when.getTime() - now.getTime()) / 86400000;
    if (daysAhead > MAX_DAYS_AHEAD) {
      return NextResponse.json({
        available: false,
        requestedAt,
        partySize,
        venue: VENUE,
        demo: true,
        reason: "too_far_ahead",
        message: `De demoomgeving neemt alleen aanvragen aan tot ${MAX_DAYS_AHEAD} dagen vooruit.`,
      });
    }

    if (CLOSED_WEEKDAYS.has(weekday)) {
      return NextResponse.json({
        available: false,
        requestedAt,
        partySize,
        venue: VENUE,
        demo: true,
        reason: "closed",
        message: "Het demorestaurant is op maandag gesloten.",
      });
    }

    const slot = slotTime(hour, minute);
    if (slot.hour < OPENING_HOUR || slot.hour > LAST_SLOT_HOUR) {
      return NextResponse.json({
        available: false,
        requestedAt,
        partySize,
        venue: VENUE,
        demo: true,
        reason: "outside_hours",
        message: `Buiten de openingstijden. Er kan worden gereserveerd van ${hhmm(OPENING_HOUR, 0)} tot ${hhmm(LAST_SLOT_HOUR, 30)}.`,
      });
    }

    if (partySize > MAX_ONLINE_PARTY) {
      return NextResponse.json({
        available: false,
        requestedAt,
        partySize,
        venue: VENUE,
        demo: true,
        reason: "party_too_large",
        maxOnlinePartySize: MAX_ONLINE_PARTY,
        message: `Gezelschappen groter dan ${MAX_ONLINE_PARTY} personen gaan telefonisch. De agent kan dit doorgeven aan het restaurant.`,
      });
    }

    const seatsLeft = seatsLeftFor(dateKey, slot.hour, weekday);
    const available = seatsLeft >= partySize;

    return NextResponse.json({
      available,
      requestedAt,
      partySize,
      venue: VENUE,
      demo: true,
      slot: hhmm(slot.hour, slot.minute),
      seatsLeft,
      reason: available ? "space_available" : "full",
      alternatives: available
        ? []
        : findAlternatives(dateKey, weekday, partySize, slot.hour),
      message: available
        ? `Er is ruimte voor ${partySize} personen om ${hhmm(slot.hour, slot.minute)}.`
        : `Er is geen ruimte meer voor ${partySize} personen om ${hhmm(slot.hour, slot.minute)}.`,
    });
  } catch (error) {
    console.error("Availability check failed:", error);
    return NextResponse.json({ error: "Beschikbaarheid kon niet worden gecontroleerd." }, { status: 500 });
  }
}
