import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  acquireLock,
  isRedisConfigured,
  storeJsonRecord,
} from "@/lib/server-store";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

const EXPECTED_AMOUNTS: Record<string, number> = {
  "serveflow-pilot-14-days": 49700,
  "flow-assessment-intro": 49700,
  "flow-assessment-standaard": 99900,
  "tradeflow-implementatie": 250000,
  "serveflow-implementatie": 250000,
  "bonanza-voice-implementatie": 149500,
  "beheer-basis": 19700,
  "beheer-uitgebreid": 49700,
};

export async function POST(req: NextRequest) {
  try {
    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }

    if (!isRedisConfigured) {
      console.error("Upstash Redis is required for durable Stripe idempotency");
      return NextResponse.json({ error: "Payment storage not configured" }, { status: 503 });
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true, ignored: event.type });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true, pending: true });
    }

    const productId = session.metadata?.product_id || "";
    const expectedAmount = EXPECTED_AMOUNTS[productId];

    if (!productId || expectedAmount === undefined) {
      console.error("Unknown Stripe product metadata:", session.metadata);
      return NextResponse.json({ error: "Unknown product" }, { status: 400 });
    }

    if (session.amount_total !== expectedAmount) {
      console.error("Stripe amount mismatch", {
        productId,
        expectedAmount,
        receivedAmount: session.amount_total,
      });
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    const acquired = await acquireLock(`stripe:event:${event.id}`, 60 * 60 * 24 * 7);
    if (!acquired) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    const paymentRecord = {
      eventId: event.id,
      sessionId: session.id,
      productId,
      productName: session.metadata?.product_name || productId,
      offerType: session.metadata?.offer_type || null,
      durationDays: session.metadata?.duration_days || null,
      amount: session.amount_total,
      currency: session.currency,
      mode: session.mode,
      paymentStatus: session.payment_status,
      customerId: session.customer,
      customerEmail: session.customer_details?.email || session.customer_email || null,
      customerName: session.customer_details?.name || null,
      createdAt: new Date(session.created * 1000).toISOString(),
      processedAt: new Date().toISOString(),
    };

    await storeJsonRecord({
      key: `stripe:payment:${session.id}`,
      value: paymentRecord,
      ttlSeconds: 60 * 60 * 24 * 365 * 7,
      recentList: "stripe:payments:recent",
      recentValue: session.id,
      recentLimit: 1000,
    });

    console.log("Stripe payment stored", paymentRecord);

    return NextResponse.json({ received: true, productId });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: "BonanzaLabs Stripe Webhook",
    configured: Boolean(
      STRIPE_SECRET_KEY &&
        STRIPE_WEBHOOK_SECRET &&
        isRedisConfigured,
    ),
  });
}
