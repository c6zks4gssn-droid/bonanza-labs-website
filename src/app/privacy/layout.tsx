import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description:
    "Lees welke persoonsgegevens BonanzaLabs verwerkt, voor welke doelen en hoe je jouw privacyrechten kunt uitoefenen.",
  alternates: {
    canonical: "https://www.bonanza-labs.com/privacy",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
