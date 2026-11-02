import { withPageSocialMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";

export const metadata: Metadata = withPageSocialMetadata({
  title: "Gratis quickscan en contact | AI-automatisering vanuit Groningen",
  description:
    "Vraag een gratis quickscan van 30 minuten aan: we bekijken samen één proces en je krijgt binnen vijf werkdagen een kort verslag met een advies voor de eerste stap.",
  alternates: {
    canonical: "https://www.bonanza-labs.com/contact",
  },
  openGraph: {
    title: "Contact BonanzaLabs",
    description:
      "Gratis quickscan van 30 minuten: één proces bekijken, kort verslag binnen vijf werkdagen, zonder verplichting.",
    url: "https://www.bonanza-labs.com/contact",
    type: "website",
  },
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
