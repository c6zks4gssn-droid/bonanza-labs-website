import { NextRequest, NextResponse } from "next/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://bonanza-labs.com";

type ProductConfig = {
  name: string;
  amount: number;
  mode: "payment" | "subscription";
  interval?: "month";
};

// Server-side catalog. The browser can only submit a product identifier.
const PRODUCTS: Record<string, ProductConfig> = {
  "flow-assessment-intro": {
    name: "Flow Assessment — Introductie",
    amount: 49700,
    mode: "payment",
  },
  "flow-assessment-standaard": {
    name: "Flow Assessment — Standaard",
    amount: 99900,
    mode: "payment",
  },
  "tradeflow-implementatie": {
    name: "TradeFlow Implementatie",
    amount: 250000,
    mode: "payment",
  },
  "serveflow-implementatie": {
    name: "ServeFlow Implementatie",
    amount: 250000,
    mode: "payment",
  },
  "bonanza-voice-implementatie": {
    name: "Bonanza Voice Implementatie",
    amount: 149500,
    mode: "payment",
  },
  "beheer-basis": {
    name: "Beheer en Optimalisatie — Basis",
    amount: 19700,
    mode: "subscription",
    interval: "month",
  },
  "beheer-uitgebreid": {
    name: "Beheer en Optimalisatie — Uitgebreid",
    amount: 49700,
    mode: "subscription",
    interval: "month",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { product } = (await req.json()) as { product?: string };

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

    const params = new URLSearchParams({
      "payment_method_types[0]": "card",
      "line_items[0][price_data][currency]": "eur",
      "line_items[0][price_data][product_data][name]": productConfig.name,
      "line_items[0][price_data][product_data][metadata][product_id]": product,
      "line_items[0][price_data][unit_amount]": String(productConfig.amount),
      "line_items[0][quantity]": "1",
      "metadata[product_id]": product,
      "metadata[product_name]": productConfig.name,
      mode: productConfig.mode,
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/pricing`,
      customer_creation: productConfig.mode === "payment" ? "always" : "if_required",
    });

    if (productConfig.mode === "subscription") {
      params.set(
        "line_items[0][price_data][recurring][interval]",
        productConfig.interval || "month",
      );
      params.delete("customer_creation");
    } else {
      params.set("payment_intent_data[metadata][product_id]", product);
    }

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const data = await response.json();
    if (!response.ok || data.error || !data.url) {
      console.error("Stripe checkout error:", data.error || data);
      return NextResponse.json({ error: "Payment setup failed" }, { status: 500 });
    }

    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: "BonanzaLabs Checkout",
    products: Object.keys(PRODUCTS),
    configured: Boolean(STRIPE_SECRET_KEY),
  });
}
