import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// In-memory idempotency store (for development)
// In production, use a database (Postgres, Redis, Vercel KV, etc.)
const processedSessionIds = new Set<string>();

// Product catalog — must match src/app/api/checkout/route.ts
const PRODUCTS: Record<string, { name: string; amount: number; mode: "payment" | "subscription"; interval?: string }> = {
  "tradeflow-pilot": { name: "TradeFlow Pilot (14 dagen)", amount: 89500, mode: "payment" },
  "tradeflow-onderhoud": { name: "TradeFlow Onderhoud", amount: 19700, mode: "subscription", interval: "month" },
  "serveflow-pilot": { name: "ServeFlow Pilot (14 dagen)", amount: 89500, mode: "payment" },
  "serveflow-onderhoud": { name: "ServeFlow Onderhoud", amount: 19700, mode: "subscription", interval: "month" },
  "bonanza-voice-setup": { name: "Bonanza Voice Setup", amount: 149500, mode: "payment" },
  "bonanza-voice-onderhoud": { name: "Bonanza Voice Onderhoud", amount: 29700, mode: "subscription", interval: "month" },
};

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

      // Idempotency check: skip if already processed
      if (processedSessionIds.has(session.id)) {
        console.log(`Session ${session.id} already processed, skipping`);
        return NextResponse.json({ received: true, duplicate: true });
      }

      // Mark as processed
      processedSessionIds.add(session.id);

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

      // Match against known products by checking line items
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        for (const item of lineItems.data) {
          const productKey = Object.keys(PRODUCTS).find((key) => {
            const p = PRODUCTS[key];
            return p.name === item.description;
          });

          if (productKey) {
            console.log(`  Matched product: ${productKey} (${PRODUCTS[productKey].name})`);
          } else {
            console.log(`  Line item: ${item.description} — ${item.amount_total} cents`);
          }
        }
      } catch (lineItemErr) {
        console.error("Failed to fetch line items:", lineItemErr);
      }

      // TODO: In production, persist to database:
      // - Store payment record (session.id, amount, email, product, timestamp)
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
    processedCount: processedSessionIds.size,
  });
}