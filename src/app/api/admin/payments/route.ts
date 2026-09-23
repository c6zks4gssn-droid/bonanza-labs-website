import { NextRequest, NextResponse } from "next/server";
import {
  isRedisConfigured,
  readJsonRecordsFromRecentList,
} from "@/lib/server-store";

interface PaymentRecord {
  id?: string;
  [key: string]: unknown;
}

interface PaymentFailureRecord {
  id?: string;
  [key: string]: unknown;
}

interface InvoiceRecord {
  id?: string;
  [key: string]: unknown;
}

interface SubscriptionRecord {
  id?: string;
  [key: string]: unknown;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isRedisConfigured) {
    return NextResponse.json(
      { error: "Betalingenopslag is niet geconfigureerd" },
      { status: 503 },
    );
  }

  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") || 100);
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(1, Math.min(Math.floor(requestedLimit), 200))
    : 100;

  const [payments, failures, invoices, subscriptions] = await Promise.all([
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
    readJsonRecordsFromRecentList<InvoiceRecord>({
      recentList: "stripe:invoices:recent",
      keyPrefix: "stripe:invoice:",
      limit,
    }),
    readJsonRecordsFromRecentList<SubscriptionRecord>({
      recentList: "stripe:subscriptions:recent",
      keyPrefix: "stripe:subscription:",
      limit,
    }),
  ]);

  return NextResponse.json(
    {
      payments: { count: payments.length, items: payments },
      failures: { count: failures.length, items: failures },
      invoices: { count: invoices.length, items: invoices },
      subscriptions: { count: subscriptions.length, items: subscriptions },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
