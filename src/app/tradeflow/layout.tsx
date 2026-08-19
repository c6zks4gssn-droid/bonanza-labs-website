import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TradeFlow — offertes en opvolging automatiseren | BonanzaLabs",
  description:
    "TradeFlow helpt bouw- en installatiebedrijven aanvraaginformatie, offertevoorbereiding en opvolging overzichtelijker te maken met menselijke controle op prijs en uitzonderingen.",
  alternates: {
    canonical: "https://www.bonanza-labs.com/tradeflow",
  },
  openGraph: {
    title: "TradeFlow — van aanvraag naar offerte en opvolging",
    description:
      "Praktische workflow-automatisering voor bouw- en installatiebedrijven.",
    url: "https://www.bonanza-labs.com/tradeflow",
    type: "website",
  },
};

export default function TradeFlowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
