import { withPageSocialMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";

export const metadata: Metadata = withPageSocialMetadata({
  title: "Prijzen — ServeFlow, TradeFlow, Voice en Assessment",
  description:
    "ServeFlow-pilot €497, Flow Assessment €1.295, Bonanza Voice-inrichting €495 en TradeFlow vanaf €1.995, beheer vanaf €197 per maand. Alle prijzen excl. btw.",
  alternates: {
    canonical: "https://www.bonanza-labs.com/pricing",
  },
  openGraph: {
    title: "Prijzen — ServeFlow, TradeFlow, Voice en Assessment | BonanzaLabs",
    description:
      "Vergelijk scope en prijzen voor reserveringen, offerteopvolging, AI-telefonie en procesonderzoek. Alle prijzen excl. btw.",
    url: "https://www.bonanza-labs.com/pricing",
    siteName: "BonanzaLabs",
    type: "website",
  },
});

// Prijs-markup voor zoekmachines. Houd de bedragen gelijk aan page.tsx (alle prijzen excl. btw).
const offer = (name: string, price: number, extra: Record<string, unknown> = {}) => ({
  "@type": "Offer",
  name,
  url: "https://www.bonanza-labs.com/pricing",
  priceSpecification: {
    "@type": "PriceSpecification",
    price,
    priceCurrency: "EUR",
    valueAddedTaxIncluded: false,
    ...extra,
  },
});
const monthly = { "@type": "UnitPriceSpecification", unitCode: "MON", unitText: "per maand" };

const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Prijzen BonanzaLabs",
  url: "https://www.bonanza-labs.com/pricing",
  provider: { "@type": "Organization", name: "BonanzaLabs", url: "https://www.bonanza-labs.com" },
  itemListElement: [
    offer("ServeFlow 14-dagen pilot", 497),
    offer("Flow Assessment", 1295),
    offer("Abonnement Start (Bonanza Voice of ServeFlow, 300 belminuten)", 199, monthly),
    offer("Abonnement Groei (Bonanza Voice en ServeFlow, 800 belminuten)", 349, monthly),
    offer("Abonnement Pro (tot drie locaties, 1.000 belminuten)", 499, monthly),
    offer("Inrichting abonnement Start of Groei", 495),
    offer("TradeFlow implementatie", 1995, { "@type": "PriceSpecification", minPrice: 1995 }),
    offer("Beheer Basis", 197, monthly),
    offer("Beheer Standaard", 297, monthly),
    offer("Beheer Uitgebreid", 497, monthly),
  ],
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }} />
      {children}
    </>
  );
}
