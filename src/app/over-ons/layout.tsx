import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over ons — BonanzaLabs",
  description:
    "BonanzaLabs bouwt en exploiteert automatiseringssystemen voor het Nederlandse MKB. Geen vage AI-beloftes, maar systemen die werken.",
  alternates: {
    canonical: "https://bonanza-labs.com/over-ons",
  },
  openGraph: {
    title: "Over ons — BonanzaLabs",
    description:
      "BonanzaLabs bouwt en exploiteert automatiseringssystemen voor het Nederlandse MKB. Geen vage AI-beloftes, maar systemen die werken.",
    url: "https://bonanza-labs.com/over-ons",
    siteName: "BonanzaLabs",
    type: "website",
  },
};

export default function OverOnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}