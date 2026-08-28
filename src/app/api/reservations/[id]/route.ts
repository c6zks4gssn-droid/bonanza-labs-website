import { NextRequest, NextResponse } from "next/server";
import { requireReservationApiAuth } from "@/lib/reservation-auth";
import {
  getReservation,
  confirmReservation,
  cancelReservation,
} from "@/lib/reservations";

/**
 * /api/reservations/[id]
 *   GET    — één reservering
 *   PATCH  — { status: "confirmed", slot: ISO } of { status: "cancelled" }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = requireReservationApiAuth(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const reservation = await getReservation(id);
  if (!reservation) {
    return NextResponse.json({ ok: false, error: "reservering niet gevonden" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, reservation });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = requireReservationApiAuth(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "ongeldige body" }, { status: 400 });
  }

  const status = body.status;
  if (status === "confirmed" && typeof body.slot === "string") {
    const updated = await confirmReservation(id, body.slot);
    if (!updated) {
      return NextResponse.json({ ok: false, error: "reservering niet gevonden" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, reservation: updated });
  }
  if (status === "cancelled") {
    const updated = await cancelReservation(id);
    if (!updated) {
      return NextResponse.json({ ok: false, error: "reservering niet gevonden" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, reservation: updated });
  }

  return NextResponse.json(
    { ok: false, error: 'status moet "confirmed" (met slot) of "cancelled" zijn' },
    { status: 400 },
  );
}
