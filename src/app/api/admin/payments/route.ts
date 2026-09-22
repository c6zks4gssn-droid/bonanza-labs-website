import { NextRequest, NextResponse } from "next/server";
import { isRedisConfigured, readJsonRecordsFromRecentList } from "@/lib/server-store";

// Zelfde opzet als /api/admin/leads. Toegang wordt geregeld door
// src/middleware.ts, dat /admin/:path* en /api/admin/:path* afschermt met
// Basic Auth. Zonder ADMIN_USERNAME en ADMIN_PASSWORD geeft die 503.
//
// Deze types worden ook door de pagina geïmporteerd, zodat de vorm van een
// record maar op één plek staat.

export interface PaymentRecord {
  eventId: string;
  eventType: string;
  sessionId: string;
  productId: string;
  productName: string;
  offerType: string;
  durationDays: string | null;
  subtotal: number | null;
  tax: number;
  total: number | null;
  currency: string | null;
  mode: string;
  paymentStatus: string | null;
  customerId: string | null;
  customerEmail: string | null;
  customerName: string | null;
  invoiceId: string | null;
  createdAt: string;
  processedAt: string;
}

export interface PaymentFailureRecord {
  eventId: string;
  eventType: string;
  sessionId: string;
  productId: string | null;
  customerId: string | null;
  customerEmail: string | null;
  paymentStatus: string | null;
  createdAt: string;
  processedAt: string;
}

export const dynamic = "force-dynamic";

function parseLimit(value: string | null): number {
  const requested = Number(value || 100);
  return Number.isFinite(requested)
    ? Math.max(1, Math.min(Math.floor(requested), 200))
    : 100;
}

export async function GET(request: NextRequest) {
  if (!isRedisConfigured) {
    return NextResponse.json(
      { error: "Betaalopslag is niet geconfigureerd" },
      { status: 503 },
    );
  }

  const limit = parseLimit(request.nextUrl.searchParams.get("limit"));

  // De sleutels zoals de webhook ze schrijft: stripe:payment:<sessionId> met
  // lijst stripe:payments:recent, en stripe:payment-failure:<sessionId> met
  // lijst stripe:payment-failures:recent.
  const [payments, failures] = await Promise.all([
    readJsonRecordsFromRecentList<PaymentRecord>({
      recentList: "stripe:payments:recent",
      keyPrefix: "stripe:payment:",
      limit,
    }),
    readJsonRecordsFromRecentList<PaymentFailureRecord>({
      recentList: "stripe:payment-failures:recent",
      keyPrefix: "stripe:payment-failure:",
      limit,
    }),
  ]);

  return NextResponse.json(
    {
      count: payments.length,
      failureCount: failures.length,
      payments,
      failures,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
