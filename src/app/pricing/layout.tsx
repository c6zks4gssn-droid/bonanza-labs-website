import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prijzen — BonanzaLabs",
  description:
    "Flow Assessment vanaf €497. Implementaties vanaf €2.500. Beheer vanaf €197 per maand. Eerst begrijpen wat er mis gaat, daarna pas bouwen.",
  alternates: {
    canonical: "https://bonanza-labs.com/pricing",
  },
  openGraph: {
    title: "Prijzen — BonanzaLabs",
    description:
      "Flow Assessment vanaf €497. Implementaties vanaf €2.500. Beheer vanaf €197 per maand. Eerst begrijpen wat er mis gaat, daarna pas bouwen.",
    url: "https://bonanza-labs.com/pricing",
    siteName: "BonanzaLabs",
    type: "website",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}