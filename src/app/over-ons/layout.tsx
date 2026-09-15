import { withPageSocialMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";

export const metadata: Metadata = withPageSocialMetadata({
  title: "Over Clarence Etnel en BonanzaLabs in Groningen",
  description:
    "BonanzaLabs is de onderneming van Clarence Etnel in Groningen voor praktische automatisering in horeca, bouw en installatie. KvK 88564517.",
  alternates: {
    canonical: "https://www.bonanza-labs.com/over-ons",
  },
  openGraph: {
    title: "Over BonanzaLabs — Praktische automatisering vanuit Groningen",
    description:
      "Nederlandse eenmanszaak voor afgebakende automatiseringspilots en implementaties.",
    url: "https://www.bonanza-labs.com/over-ons",
    siteName: "BonanzaLabs",
    type: "website",
  },
});

export default function OverOnsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
