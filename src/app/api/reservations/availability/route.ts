import { NextRequest, NextResponse } from "next/server";
import { listReservations } from "@/lib/reservations";

const SLOT_CAPACITY = Math.max(
  1,
  Number.parseInt(process.env.SERVEFLOW_DEMO_SLOT_CAPACITY ?? "20", 10) || 20,
);
const SLOT_MINUTES = 30;
const RESTAURANT_TIME_ZONE = "Europe/Amsterdam";

function partsInAmsterdam(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: RESTAURANT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

function slotKey(date: Date): string {
  const p = partsInAmsterdam(date);
  const minute = Math.floor(Number(p.minute) / SLOT_MINUTES) * SLOT_MINUTES;
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${String(minute).padStart(2, "0")}`;
}

function isValidDemoSlot(date: Date): boolean {
  const p = partsInAmsterdam(date);
  const hour = Number(p.hour);
  const minute = Number(p.minute);
  return hour >= 12 && (hour < 21 || (hour === 21 && minute <= 30));
}

export async function GET(request: NextRequest) {
  const requestedAt = request.nextUrl.searchParams.get("requestedAt")?.trim();
  const partySize = Number(request.nextUrl.searchParams.get("partySize"));

  if (!requestedAt || !Number.isInteger(partySize) || partySize < 1 || partySize > 20) {
    return NextResponse.json(
      {
        ok: false,
        error: "requestedAt (ISO 8601 met tijdzone) en partySize (1-20) zijn verplicht.",
      },
      { status: 400 },
    );
  }

  const requestedDate = new Date(requestedAt);
  if (Number.isNaN(requestedDate.getTime())) {
    return NextResponse.json(
      { ok: false, error: "requestedAt is geen geldige ISO 8601-datum." },
      { status: 400 },
    );
  }
  if (!isValidDemoSlot(requestedDate)) {
    return NextResponse.json({
      ok: true,
      available: false,
      requestedAt: requestedDate.toISOString(),
      partySize,
      reason: "De demo accepteert starttijden tussen 12:00 en 21:30 (Europe/Amsterdam).",
      demo: true,
    }, { headers: { "Cache-Control": "no-store" } });
  }

  const targetSlot = slotKey(requestedDate);
  const reservations = await listReservations();
  const reservedCovers = reservations
    .filter((reservation) => reservation.status !== "cancelled")
    .filter((reservation) => {
      const date = new Date(reservation.requestedAt);
      return !Number.isNaN(date.getTime()) && slotKey(date) === targetSlot;
    })
    .reduce((total, reservation) => total + reservation.partySize, 0);

  const remainingCovers = Math.max(0, SLOT_CAPACITY - reservedCovers);
  const available = remainingCovers >= partySize;

  return NextResponse.json({
    ok: true,
    available,
    requestedAt: requestedDate.toISOString(),
    partySize,
    slotMinutes: SLOT_MINUTES,
    remainingCovers,
    reason: available
      ? "Er is ruimte in dit demoslot. Dit is nog geen reservering."
      : "Dit demoslot heeft onvoldoende ruimte; probeer een ander tijdstip.",
    demo: true,
  }, { headers: { "Cache-Control": "no-store" } });
}
