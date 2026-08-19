import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact BonanzaLabs | AI-automatisering vanuit Groningen",
  description:
    "Bespreek één concreet proces met BonanzaLabs. ServeFlow voor horeca, TradeFlow voor bouw & installatie en afgebakende voice-automation.",
  alternates: {
    canonical: "https://www.bonanza-labs.com/contact",
  },
  openGraph: {
    title: "Contact BonanzaLabs",
    description:
      "Vertel waar je team onnodig tijd verliest en bespreek of een kleine automatiseringsflow zinvol is.",
    url: "https://www.bonanza-labs.com/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
