import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ServeFlow 14-dagen pilot — €497",
  description:
    "Test één reserveringsflow voor één horecalocatie gedurende 14 dagen. Geen automatische verlenging en geen gegarandeerde omzet- of no-showclaim.",
  alternates: {
    canonical: "https://bonanza-labs.com/pricing",
  },
  openGraph: {
    title: "ServeFlow 14-dagen pilot — €497 | BonanzaLabs",
    description:
      "Eén locatie, één reserveringsflow, 14 dagen en geen automatische verlenging. Voor complexere aanvragen is het Flow Assessment beschikbaar.",
    url: "https://bonanza-labs.com/pricing",
    siteName: "BonanzaLabs",
    type: "website",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
