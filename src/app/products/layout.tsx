import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products — AI Tools & Infrastructure",
  description: "Browse all Bonanza Labs products: Agent Wallet, Fork Doctor, FrameForge, and more. Open-source tools for the autonomous economy.",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}