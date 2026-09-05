import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getStripeProduct, STRIPE_PRODUCTS } from "@/lib/stripe-products";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.bonanza-labs.com";

const automaticTaxEnabled = process.env.STRIPE_AUTOMATIC_TAX_ENABLED === "true";
const invoiceCreationEnabled = process.env.STRIPE_INVOICE_CREATION_ENABLED === "true";

export async function POST(req: NextRequest) {
  try {
    const { product } = (await req.json()) as { product?: string };

    if (!product) {
      return NextResponse.json({ error: "Missing product" }, { status: 400 });
    }

    const productConfig = getStripeProduct(product);
    if (!productConfig) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    if (!productConfig.selfService) {
      return NextResponse.json(
        { error: "Dit aanbod vereist eerst een bevestigde offerte of overeenkomst." },
        { status: 403 },
      );
    }

    if (!isStripeConfigured) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const metadata = {
      product_id: product,
      product_name: productConfig.name,
      offer_type: productConfig.offerType,
      duration_days: String(productConfig.durationDays || ""),
    };

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: productConfig.mode,
      locale: "nl",
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      automatic_tax: { enabled: automaticTaxEnabled },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: productConfig.amount,
            product_data: {
              name: productConfig.name,
              description: productConfig.description,
              metadata: { product_id: product },
            },
            ...(productConfig.mode === "subscription"
              ? { recurring: { interval: productConfig.interval || "month" } }
              : {}),
          },
        },
      ],
      metadata,
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/pricing`,
      custom_text: {
        submit: {
          message:
            productConfig.offerType === "pilot"
              ? "Na betaling plannen we de intake. De pilot duurt 14 dagen en wordt niet automatisch verlengd."
              : "Na betaling nemen we contact op voor de intake en planning.",
        },
      },
    };

    if (productConfig.mode === "subscription") {
      sessionParams.subscription_data = { metadata };
    } else {
      sessionParams.customer_creation = "always";
      sessionParams.payment_intent_data = { metadata };
      sessionParams.invoice_creation = { enabled: invoiceCreationEnabled };
    }

    const session = await getStripe().checkout.sessions.create(sessionParams);
    if (!session.url) {
      return NextResponse.json({ error: "Payment setup failed" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const details =
      error instanceof Stripe.errors.StripeError
        ? {
            type: error.type,
            code: error.code,
            message: error.message,
            requestId: error.requestId,
          }
        : error;
    console.error("Checkout error:", details);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: "BonanzaLabs Checkout",
    products: Object.entries(STRIPE_PRODUCTS)
      .filter(([, config]) => config.selfService)
      .map(([productId]) => productId),
    configured: isStripeConfigured,
    automaticTaxEnabled,
    invoiceCreationEnabled,
  });
}
