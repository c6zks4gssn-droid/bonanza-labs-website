import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TradeFlow — AI automatisering voor bouw & installatie",
  description:
    "Van aanvraag naar offerte en opvolging zonder WhatsApp-chaos. Website, offertegenerator, WhatsApp bot en CRM voor bouw-, installatie- en servicebedrijven.",
  alternates: {
    canonical: "https://bonanza-labs.com/tradeflow",
  },
  openGraph: {
    title: "TradeFlow — AI automatisering voor bouw & installatie",
    description:
      "Van aanvraag naar offerte en opvolging zonder WhatsApp-chaos. Website, offertegenerator, WhatsApp bot en CRM voor bouw-, installatie- en servicebedrijven.",
    url: "https://bonanza-labs.com/tradeflow",
    siteName: "BonanzaLabs",
    type: "website",
  },
};

export default function TradeFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}