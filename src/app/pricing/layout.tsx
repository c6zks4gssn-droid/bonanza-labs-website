import { withPageSocialMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";

export const metadata: Metadata = withPageSocialMetadata({
  title: "Prijzen — ServeFlow, TradeFlow, Voice en Assessment",
  description:
    "ServeFlow-pilot €497, Flow Assessment €999, Bonanza Voice-inrichting vanaf €1.495 en TradeFlow op aanvraag. Alle prijzen excl. btw.",
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

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
