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

// The browser submits only a product identifier. Names, prices and purchase
// eligibility remain controlled by the server.
export const STRIPE_PRODUCTS: Record<string, StripeProductConfig> = {
  "serveflow-pilot-14-days": {
    name: "ServeFlow — 14-dagen pilot",
    description:
      "Eén horecalocatie, één reserveringsflow, 14 dagen, geen automatische verlenging.",
    amount: 49700,
    mode: "payment",
    offerType: "pilot",
    durationDays: 14,
    selfService: true,
  },
  "flow-assessment-standaard": {
    name: "Flow Assessment — Complexe aanvraag",
    description:
      "Uitgebreide procesanalyse en implementatieplan voor meerdere processen, teams of locaties.",
    amount: 99900,
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
    amount: 250000,
    mode: "payment",
    offerType: "implementation",
    selfService: false,
  },
  "serveflow-implementatie": {
    name: "ServeFlow Implementatie",
    description: "Uitgebreide horeca-implementatie na pilot of assessment.",
    amount: 250000,
    mode: "payment",
    offerType: "implementation",
    selfService: false,
  },
  "bonanza-voice-implementatie": {
    name: "Bonanza Voice Implementatie",
    description: "Implementatie van AI-telefonie volgens afgesproken scope.",
    amount: 149500,
    mode: "payment",
    offerType: "implementation",
    selfService: false,
  },
  "beheer-basis": {
    name: "Beheer en Optimalisatie — Basis",
    description: "Maandelijks beheer volgens afzonderlijke overeenkomst.",
    amount: 19700,
    mode: "subscription",
    interval: "month",
    offerType: "management",
    selfService: false,
  },
  "beheer-uitgebreid": {
    name: "Beheer en Optimalisatie — Uitgebreid",
    description: "Uitgebreid maandelijks beheer volgens afzonderlijke overeenkomst.",
    amount: 49700,
    mode: "subscription",
    interval: "month",
    offerType: "management",
    selfService: false,
  },
};

export function getStripeProduct(productId: string) {
  return STRIPE_PRODUCTS[productId];
}
