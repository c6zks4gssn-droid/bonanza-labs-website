import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact over de ServeFlow-pilot",
  description:
    "Neem contact op met BonanzaLabs over de ServeFlow 14-dagen pilot of een complexer Flow Assessment.",
  alternates: {
    canonical: "https://www.bonanza-labs.com/contact",
  },
  openGraph: {
    title: "Contact over de ServeFlow-pilot | BonanzaLabs",
    description:
      "Bespreek één reserveringsflow voor één horecalocatie of vraag advies over een complexer automatiseringsproces.",
    url: "https://www.bonanza-labs.com/contact",
    siteName: "BonanzaLabs",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
