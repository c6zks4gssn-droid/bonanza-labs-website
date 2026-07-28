import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bonanza Voice — AI-telefonie voor het MKB",
  description:
    "Iedere oproep professioneel beantwoorden, ook wanneer niemand beschikbaar is. AI-telefonie, afspraken registreren, gesprekssamenvattingen en doorverbinden.",
  alternates: {
    canonical: "https://bonanza-labs.com/bonanza-voice",
  },
  openGraph: {
    title: "Bonanza Voice — AI-telefonie voor het MKB",
    description:
      "Iedere oproep professioneel beantwoorden, ook wanneer niemand beschikbaar is. AI-telefonie, afspraken registreren, gesprekssamenvattingen en doorverbinden.",
    url: "https://bonanza-labs.com/bonanza-voice",
    siteName: "BonanzaLabs",
    type: "website",
  },
};

export default function BonanzaVoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}