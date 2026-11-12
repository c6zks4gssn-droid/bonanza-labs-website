import { PRICES } from "@/lib/pricing";

// De bedragen komen uit /src/lib/pricing.ts. Die is de canonieke bron.
// Hier staat alleen wat Stripe nodig heeft om een checkout te kunnen maken:
// de naam, de omschrijving, het bedrag en of het self-service is.
//
// De browser stuurt alleen een product-id. Namen, prijzen en toegank blijven
// server-side bepaald.

export type StripeProductConfig = {
  name: string;
  description: string;
  amount: number;
  mode: "payment" | "subscription";
  interval?: "month";
  offerType: "pilot" | "assessment" | "implementation" | "management";
  durationDays?: number;
  selfService: boolean;
};

export const STRIPE_PRODUCTS: Record<string, StripeProductConfig> = {
  "serveflow-pilot-14-days": {
    name: "ServeFlow — 14-dagen pilot",
    description:
      "Eén horecalocatie, één reserveringsflow, 14 dagen, geen automatische verlenging.",
    amount: PRICES.serveflowPilot,
    mode: "payment",
    offerType: "pilot",
    durationDays: 14,
    selfService: true,
  },
  "flow-assessment-standaard": {
    name: "Flow Assessment — Complexe aanvraag",
    description:
      "Uitgebreide procesanalyse en implementatieplan voor meerdere processen, teams of locaties. Verrekend bij implementatie binnen 30 dagen.",
    amount: PRICES.flowAssessment,
    mode: "payment",
    offerType: "assessment",
    selfService: true,
  },
  // Retained so older Checkout sessions and webhook retries stay verifiable.
  "flow-assessment-intro": {
    name: "Flow Assessment — Introductie",
    description: "Analyse van één kernproces met concrete prioriteiten.",
    amount: 49700,
    mode: "payment",
    offerType: "assessment",
    selfService: false,
  },
  "tradeflow-implementatie": {
    name: "TradeFlow Implementatie",
    description: "Maatwerkimplementatie op basis van een bevestigde scope.",
    amount: PRICES.tradeflowImplementation,
    mode: "payment",
    offerType: "implementation",
    selfService: false,
  },
  "serveflow-implementatie": {
    name: "ServeFlow Implementatie",
    description: "Uitgebreide horeca-implementatie na pilot of assessment.",
    amount: PRICES.tradeflowImplementation,
    mode: "payment",
    offerType: "implementation",
    selfService: false,
  },
  "bonanza-voice-implementatie": {
    name: "Bonanza Voice Implementatie",
    description: "Eenmalige inrichting van Bonanza Voice. Maatwerk, extra koppelingen of meerdere locaties volgens offerte.",
    amount: PRICES.bonanzaVoiceSetup,
    mode: "payment",
    offerType: "implementation",
    selfService: false,
  },
  "beheer-basis": {
    name: "Beheer en Optimalisatie — Basis",
    description: "Maandelijks beheer volgens afzonderlijke overeenkomst.",
    amount: PRICES.beheerBasis,
    mode: "subscription",
    interval: "month",
    offerType: "management",
    selfService: false,
  },
  "beheer-standaard": {
    name: "Beheer en Optimalisatie — Standaard",
    description: "Maandelijks beheer met evaluatie volgens afzonderlijke overeenkomst.",
    amount: PRICES.beheerStandaard,
    mode: "subscription",
    interval: "month",
    offerType: "management",
    selfService: false,
  },
  "beheer-uitgebreid": {
    name: "Beheer en Optimalisatie — Uitgebreid",
    description: "Uitgebreid maandelijks beheer volgens afzonderlijke overeenkomst.",
    amount: PRICES.beheerUitgebreid,
    mode: "subscription",
    interval: "month",
    offerType: "management",
    selfService: false,
  },
};

export function getStripeProduct(productId: string) {
  return STRIPE_PRODUCTS[productId];
}
