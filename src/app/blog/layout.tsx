import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kennisbank — praktische automatisering voor het MKB",
  description:
    "Praktische artikelen over offerteprocessen, horeca-automatisering, AI-telefonie en slimmer werken voor Nederlandse MKB-bedrijven.",
  alternates: {
    canonical: "https://www.bonanza-labs.com/blog",
  },
  openGraph: {
    title: "BonanzaLabs Kennisbank",
    description:
      "Praktische artikelen over automatisering voor bouw, installatie, horeca en zakelijke dienstverlening.",
    url: "https://www.bonanza-labs.com/blog",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
