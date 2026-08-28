import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio — BonanzaLabs",
  description:
    "Zelf gebouwd, zelf gelanceerd. Bekijk projecten die BonanzaLabs heeft gebouwd en exploiteert.",
  alternates: {
    canonical: "https://www.bonanza-labs.com/portfolio",
  },
  openGraph: {
    title: "Portfolio — BonanzaLabs",
    description:
      "Zelf gebouwd, zelf gelanceerd. Bekijk projecten die BonanzaLabs heeft gebouwd en exploiteert.",
    url: "https://www.bonanza-labs.com/portfolio",
    siteName: "BonanzaLabs",
    type: "website",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}