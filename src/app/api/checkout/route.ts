import { NextRequest, NextResponse } from "next/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

// Price IDs mapped to product+tier
const PRICE_IDS: Record<string, { price: string; amount: number }> = {
  "frameforge-pro": { price: "price_frameforge_pro", amount: 2900 },
  "fork-doctor-pro": { price: "price_forkdoctor_pro", amount: 900 },
  "agent-wallet-pro": { price: "price_agentwallet_pro", amount: 2900 },
  "search-pro": { price: "price_search_pro", amount: 900 },
};

const PRODUCT_NAMES: Record<string, string> = {
  "frameforge": "FrameForge Pro",
  "fork-doctor": "Fork Doctor Pro",
  "agent-wallet": "Agent Wallet Pro",
  "search": "Search Pro",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product, tier } = body;

    if (!product || !tier) {
      return NextResponse.json({ error: "Missing product or tier" }, { status: 400 });
    }

    const key = `${product}-${tier.toLowerCase()}`;
    const priceConfig = PRICE_IDS[key];

    if (!priceConfig) {
      return NextResponse.json({ error: "Invalid product/tier combination" }, { status: 400 });
    }

    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const productName = PRODUCT_NAMES[product] || product;

    // Create Stripe Checkout Session
    const session = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[0]": "card",
        "line_items[0][price_data][currency]": "usd",
        "line_items[0][price_data][product_data][name]": productName,
        "line_items[0][price_data][unit_amount]": String(priceConfig.amount),
        "line_items[0][price_data][recurring][interval]": "month",
        "line_items[0][quantity]": "1",
        mode: "subscription",
        success_url: `${req.headers.get("origin") || "https://bonanza-labs.com"}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get("origin") || "https://bonanza-labs.com"}/pricing`,
      }),
    });

    const sessionData = await session.json();

    if (sessionData.error) {
      console.error("Stripe error:", sessionData.error);
      return NextResponse.json({ error: "Payment setup failed" }, { status: 500 });
    }

    return NextResponse.json({ url: sessionData.url });
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}