import { NextRequest, NextResponse } from "next/server";
import { requireReservationApiAuth } from "@/lib/reservation-auth";
import {
  createReservation,
  listReservations,
  getReservation,
  confirmReservation,
  cancelReservation,
  isWithinBusinessHours,
  type Reservation,
} from "@/lib/reservations";

/**
 * ServeFlow voice-agent reserverings-API.
 *
 * Dit is het webhook-contract dat de ElevenLabs voice-agent aanroept
 * (via een tool of webhook) om beschikbaarheid te checken en reserveringen
 * te boeken. De agent-id is de bestaande Bonanza Voice agent
 * (agent_2501m036bwdge299b6wq2t6h7h5m).
 *
 * Endpoints:
 *   POST /api/reservations           — boek een reservering
 *   GET  /api/reservations           — lijst (optioneel ?status=)
 *   GET  /api/reservations/:id       — één reservering
 *   PATCH /api/reservations/:id      — { status: "confirmed", slot } | { status: "cancelled" }
 *
 * Body (POST):
 *   { requestedAt: ISO, partySize, name, phone, email?, notes?, source? }
 *
 * Antwoord:
 *   { ok, reservation } met status 201 | 400 (validatie/out-of-hours)
 */

function parseBody(body: unknown): {
  requestedAt?: string;
  partySize?: number;
  name?: string;
  phone?: string;
  email?: string;
  notes?: string;
  source?: Reservation["source"];
} {
  if (typeof body !== "object" || body === null) return {};
  const b = body as Record<string, unknown>;
  return {
    requestedAt: typeof b.requestedAt === "string" ? b.requestedAt : undefined,
    partySize: typeof b.partySize === "number" ? b.partySize : undefined,
    name: typeof b.name === "string" ? b.name.trim() : undefined,
    phone: typeof b.phone === "string" ? b.phone.trim() : undefined,
    email: typeof b.email === "string" ? b.email.trim() : undefined,
    notes: typeof b.notes === "string" ? b.notes.trim() : undefined,
    source: b.source === "voice-agent" ? "voice-agent" : "manual",
  };
}

export async function GET(request: NextRequest) {
  const unauthorized = requireReservationApiAuth(request);
  if (unauthorized) return unauthorized;

  const status = request.nextUrl.searchParams.get("status");
  let all = await listReservations();
  if (status === "pending" || status === "confirmed" || status === "cancelled") {
    all = all.filter((r) => r.status === status);
  }
  return NextResponse.json({ ok: true, count: all.length, reservations: all });
}

export async function POST(request: NextRequest) {
  const unauthorized = requireReservationApiAuth(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const input = parseBody(body);

  if (!input.requestedAt || !input.partySize || !input.name || !input.phone) {
    return NextResponse.json(
      { ok: false, error: "requestedAt, partySize, name, phone zijn verplicht" },
      { status: 400 },
    );
  }
  if (input.partySize < 1 || input.partySize > 20) {
    return NextResponse.json(
      { ok: false, error: "partySize moet 1-20 zijn" },
      { status: 400 },
    );
  }
  if (!isWithinBusinessHours(input.requestedAt)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Gewenste tijd valt buiten openingstijden (12:00-22:00). Stel een andere tijd voor.",
      },
      { status: 400 },
    );
  }

  const reservation: Reservation = await createReservation({
    requestedAt: input.requestedAt,
    partySize: input.partySize,
    name: input.name,
    phone: input.phone,
    email: input.email,
    notes: input.notes,
    source: input.source ?? "voice-agent",
  });
  return NextResponse.json({ ok: true, reservation }, { status: 201 });
}
