import { NextRequest, NextResponse } from "next/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://bonanza-labs.com";

type ProductConfig = {
  name: string;
  description: string;
  amount: number;
  mode: "payment" | "subscription";
  interval?: "month";
  offerType: "pilot" | "assessment" | "implementation" | "management";
  durationDays?: number;
};

// Server-side catalog. The browser can only submit a product identifier.
const PRODUCTS: Record<string, ProductConfig> = {
  "serveflow-pilot-14-days": {
    name: "ServeFlow — 14-dagen pilot",
    description:
      "Eén horecalocatie, één reserveringsflow, 14 dagen, geen automatische verlenging.",
    amount: 49700,
    mode: "payment",
    offerType: "pilot",
    durationDays: 14,
  },
  "flow-assessment-standaard": {
    name: "Flow Assessment — Complexe aanvraag",
    description:
      "Uitgebreide procesanalyse en implementatieplan voor meerdere processen, teams of locaties.",
    amount: 99900,
    mode: "payment",
    offerType: "assessment",
  },
  // Kept for backwards compatibility with any checkout session opened before the pilot launch.
  "flow-assessment-intro": {
    name: "Flow Assessment — Introductie",
    description: "Analyse van één kernproces met concrete prioriteiten.",
    amount: 49700,
    mode: "payment",
    offerType: "assessment",
  },
  "tradeflow-implementatie": {
    name: "TradeFlow Implementatie",
    description: "Maatwerkimplementatie op basis van een bevestigde scope.",
    amount: 250000,
    mode: "payment",
    offerType: "implementation",
  },
  "serveflow-implementatie": {
    name: "ServeFlow Implementatie",
    description: "Uitgebreide horeca-implementatie na pilot of assessment.",
    amount: 250000,
    mode: "payment",
    offerType: "implementation",
  },
  "bonanza-voice-implementatie": {
    name: "Bonanza Voice Implementatie",
    description: "Implementatie van AI-telefonie volgens afgesproken scope.",
    amount: 149500,
    mode: "payment",
    offerType: "implementation",
  },
  "beheer-basis": {
    name: "Beheer en Optimalisatie — Basis",
    description: "Maandelijks beheer volgens afzonderlijke overeenkomst.",
    amount: 19700,
    mode: "subscription",
    interval: "month",
    offerType: "management",
  },
  "beheer-uitgebreid": {
    name: "Beheer en Optimalisatie — Uitgebreid",
    description: "Uitgebreid maandelijks beheer volgens afzonderlijke overeenkomst.",
    amount: 49700,
    mode: "subscription",
    interval: "month",
    offerType: "management",
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
      "line_items[0][price_data][product_data][description]": productConfig.description,
      "line_items[0][price_data][product_data][metadata][product_id]": product,
      "line_items[0][price_data][unit_amount]": String(productConfig.amount),
      "line_items[0][quantity]": "1",
      "metadata[product_id]": product,
      "metadata[product_name]": productConfig.name,
      "metadata[offer_type]": productConfig.offerType,
      "metadata[duration_days]": String(productConfig.durationDays || ""),
      mode: productConfig.mode,
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/pricing`,
      customer_creation: productConfig.mode === "payment" ? "always" : "if_required",
      "custom_text[submit][message]":
        productConfig.offerType === "pilot"
          ? "Na betaling plannen we de intake. De pilot duurt 14 dagen en wordt niet automatisch verlengd."
          : "Na betaling nemen we contact op voor de intake en planning.",
    });

    if (productConfig.mode === "subscription") {
      params.set(
        "line_items[0][price_data][recurring][interval]",
        productConfig.interval || "month",
      );
      params.delete("customer_creation");
    } else {
      params.set("payment_intent_data[metadata][product_id]", product);
      params.set("payment_intent_data[metadata][offer_type]", productConfig.offerType);
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
