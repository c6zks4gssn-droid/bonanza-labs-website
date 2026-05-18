import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Wallet — Spending Firewall for AI Agents",
  description: "Set rules, approve risky payments, block bad vendors, and audit every agent transaction before money moves.",
};

export default function FirewallLayout({ children }: { children: React.ReactNode }) {
  return children;
}