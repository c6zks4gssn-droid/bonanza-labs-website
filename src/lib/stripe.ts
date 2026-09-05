import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export const isStripeConfigured = Boolean(stripeSecretKey);

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeSecretKey) {
    throw new Error("Stripe is not configured");
  }

  stripeClient ??= new Stripe(stripeSecretKey, {
    appInfo: {
      name: "BonanzaLabs website",
      version: "1.0.0",
      url: "https://www.bonanza-labs.com",
    },
  });

  return stripeClient;
}
