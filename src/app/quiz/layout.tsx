import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tool Finder: Welke Tool Past Bij Jou? | Bonanza Labs",
  description: "Welke AI tool past bij jouw probleem? Doe de quiz en ontdek direct de juiste tool. 5 vragen, 30 seconden.",
  openGraph: {
    title: "AI Tool Finder Quiz | Bonanza Labs",
    description: "Welke AI tool past bij jouw probleem? Doe de quiz en ontdek direct de juite tool.",
    type: "website",
    url: "https://bonanza-labs.com/quiz",
  },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}