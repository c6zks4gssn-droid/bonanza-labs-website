import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gratis AI Prompts Library | Bonanza Labs",
  description: "Battle-tested AI prompts for developers, founders, and marketers. Copy, paste, ship. Updated weekly. No fluff.",
  openGraph: {
    title: "AI Prompts Library | Bonanza Labs",
    description: "Battle-tested AI prompts. Copy, paste, ship. Updated weekly.",
    type: "website",
    url: "https://bonanza-labs.com/prompts",
  },
};

export default function PromptsLayout({ children }: { children: React.ReactNode }) {
  return children;
}