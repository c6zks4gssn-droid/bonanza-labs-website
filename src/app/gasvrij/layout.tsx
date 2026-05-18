import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GasVrij Groningen — Energie Transitie Subsidie Check",
  description: "Check uw subsidie voor gasvrij wonen. Vanaf €4.200 subsidie beschikbaar voor het gasloos maken van uw woning in Groningen.",
};

export default function GasvrijLayout({ children }: { children: React.ReactNode }) {
  return children;
}