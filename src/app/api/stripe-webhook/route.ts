import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { kv } from "@vercel/kv";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    if (!STRIPE_WEBHOOK_SECRET) {
      console.error("STRIPE_WEBHOOK_SECRET is not set");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }

    // 1. Read the raw request body
    const body = await req.text();

    // 2. Get the Stripe signature header
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // 3. Verify the event with the webhook secret
    const stripe = new Stripe(STRIPE_SECRET_KEY);

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 4. Process checkout.session.completed events
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Payment status check — only process paid sessions
      if (session.payment_status !== "paid") {
        console.log("Payment not completed, skipping");
        return NextResponse.json({ received: true });
      }

      // Idempotency: check if session already processed (Vercel KV)
      const processed = await kv.get(`stripe:session:${session.id}`);
      if (processed) {
        console.log("Session already processed:", session.id);
        return NextResponse.json({ received: true, duplicate: true });
      }

      // Extract session data
      const amountTotal = session.amount_total;
      const customerEmail = session.customer_details?.email || session.customer_email || "unknown";
      const customerName = session.customer_details?.name || "unknown";
      const mode = session.mode; // "payment" or "subscription"

      console.log(`✅ Payment received:
        Session ID: ${session.id}
        Amount: ${amountTotal} cents (€${amountTotal ? (amountTotal / 100).toFixed(2) : "N/A"})
        Customer email: ${customerEmail}
        Customer name: ${customerName}
        Mode: ${mode}
        Payment status: ${session.payment_status}
        Created: ${new Date(session.created * 1000).toISOString()}`);

      // Get product_id from session metadata or line items
      let productId = "unknown";
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        for (const item of lineItems.data) {
          console.log(`  Line item: ${item.description} — ${item.amount_total} cents`);
        }
      } catch (lineItemErr) {
        console.error("Failed to fetch line items:", lineItemErr);
      }

      // Persist idempotency record to KV
      await kv.set(`stripe:session:${session.id}`, JSON.stringify({
        processed: true,
        amount: session.amount_total,
        email: session.customer_details?.email,
        productId,
        processedAt: new Date().toISOString(),
      }));

      // TODO: In production, also:
      // - Store payment record in database
      // - Trigger fulfillment (send welcome email, create account, schedule onboarding)
      // - Update CRM / pipeline
    } else {
      // 5. Log other events but don't process
      console.log(`📡 Stripe event received (not processed): ${event.type}`);
    }

    // 6. Return 200 for valid events
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    service: "Bonanza Labs Stripe Webhook",
    configured: !!STRIPE_WEBHOOK_SECRET,
  });
}