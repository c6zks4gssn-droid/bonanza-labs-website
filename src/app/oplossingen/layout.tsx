import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-automatisering voor MKB | Oplossingen",
  description:
    "Praktische automatisering voor horeca, bouw & installatie en zakelijke telefonie. BonanzaLabs begint met één concreet proces en meet wat werkt.",
  alternates: {
    canonical: "https://www.bonanza-labs.com/oplossingen",
  },
  openGraph: {
    title: "BonanzaLabs oplossingen — praktische AI-automatisering voor MKB",
    description:
      "ServeFlow, TradeFlow en Bonanza Voice: afgebakende automatisering rond concrete bedrijfsproblemen.",
    url: "https://www.bonanza-labs.com/oplossingen",
    type: "website",
  },
};

export default function OplossingenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
