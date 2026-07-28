import { NextRequest, NextResponse } from "next/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://bonanza-labs.com";

// Product catalog — aligned with website pricing
const PRODUCTS: Record<string, { name: string; amount: number; mode: "payment" | "subscription"; interval?: string }> = {
  "flow-assessment-intro": { name: "Flow Assessment — Introductie", amount: 49700, mode: "payment" },
  "flow-assessment-standaard": { name: "Flow Assessment — Standaard", amount: 99900, mode: "payment" },
  "tradeflow-implementatie": { name: "TradeFlow Implementatie", amount: 250000, mode: "payment" },
  "serveflow-implementatie": { name: "ServeFlow Implementatie", amount: 250000, mode: "payment" },
  "bonanza-voice-implementatie": { name: "Bonanza Voice Implementatie", amount: 149500, mode: "payment" },
  "beheer-basis": { name: "Beheer en Optimalisatie — Basis", amount: 19700, mode: "subscription", interval: "month" },
  "beheer-uitgebreid": { name: "Beheer en Optimalisatie — Uitgebreid", amount: 49700, mode: "subscription", interval: "month" },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product } = body;

    if (!product) {
      return NextResponse.json({ error: "Missing product" }, { status: 400 });
    }

    const productConfig = PRODUCTS[product];

    if (!productConfig) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    if (productConfig.mode === "subscription") {
      // Subscription checkout
      const session = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "payment_method_types[0]": "card",
          "line_items[0][price_data][currency]": "eur",
          "line_items[0][price_data][product_data][name]": productConfig.name,
          "line_items[0][price_data][product_data][metadata][product_id]": product,
          "line_items[0][price_data][unit_amount]": String(productConfig.amount),
          "line_items[0][price_data][recurring][interval]": productConfig.interval || "month",
          "line_items[0][quantity]": "1",
          mode: "subscription",
          success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${BASE_URL}/pricing`,
        }),
      });

      const data = await session.json();
      if (data.error) {
        console.error("Stripe error:", data.error);
        return NextResponse.json({ error: "Payment setup failed" }, { status: 500 });
      }
      return NextResponse.json({ url: data.url });
    } else {
      // One-time payment checkout
      const session = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "payment_method_types[0]": "card",
          "line_items[0][price_data][currency]": "eur",
          "line_items[0][price_data][product_data][name]": productConfig.name,
          "line_items[0][price_data][product_data][metadata][product_id]": product,
          "line_items[0][price_data][unit_amount]": String(productConfig.amount),
          "line_items[0][quantity]": "1",
          mode: "payment",
          success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${BASE_URL}/pricing`,
        }),
      });

      const data = await session.json();
      if (data.error) {
        console.error("Stripe error:", data.error);
        return NextResponse.json({ error: "Payment setup failed" }, { status: 500 });
      }
      return NextResponse.json({ url: data.url });
    }
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    service: "Bonanza Labs Checkout",
    products: Object.keys(PRODUCTS),
    configured: !!STRIPE_SECRET_KEY,
  });
}