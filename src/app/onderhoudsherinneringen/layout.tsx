import { withPageSocialMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";

export const metadata: Metadata = withPageSocialMetadata({
  title: "Onderhoudsherinneringen voor installateurs",
  description:
    "TradeFlow Onderhoud stuurt onderhoudsklanten van installateurs op tijd een herinnering voor cv-ketel, warmtepomp of airco. De klant kiest zelf een moment; jij houdt overzicht. Vanaf €995 excl. btw.",
  alternates: {
    canonical: "https://www.bonanza-labs.com/onderhoudsherinneringen",
  },
  openGraph: {
    title: "TradeFlow Onderhoud — jaarlijks onderhoud plannen zonder bellen",
    description:
      "Onderhoudsherinneringen en planning voor installatiebedrijven, met overzicht van wie is ingepland en wie nog niet.",
    url: "https://www.bonanza-labs.com/onderhoudsherinneringen",
    type: "website",
  },
});

export default function OnderhoudsherinneringenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
