import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bonanza Voice — AI telefoonassistent voor MKB",
  description:
    "Afgebakende voice-automation voor terugkerende telefoontaken: basisvragen, terugbelverzoeken en gecontroleerde intake met menselijke escalatie.",
  alternates: {
    canonical: "https://www.bonanza-labs.com/bonanza-voice",
  },
  openGraph: {
    title: "Bonanza Voice — gecontroleerde AI-telefonie voor MKB",
    description:
      "Start met één gesprekstype, duidelijke guardrails en menselijke escalatie.",
    url: "https://www.bonanza-labs.com/bonanza-voice",
    type: "website",
  },
};

export default function BonanzaVoiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
