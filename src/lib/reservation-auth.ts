import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

function safeEqual(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function requireReservationApiAuth(
  request: NextRequest,
): NextResponse | null {
  const expected = process.env.RESERVATION_API_SECRET?.trim();
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "Reserverings-API is niet geconfigureerd." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const bearer = request.headers.get("authorization");
  const supplied = bearer?.startsWith("Bearer ")
    ? bearer.slice(7).trim()
    : request.headers.get("x-reservation-secret")?.trim() ?? "";

  if (!supplied || !safeEqual(supplied, expected)) {
    return NextResponse.json(
      { ok: false, error: "Niet geautoriseerd." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  return null;
}
