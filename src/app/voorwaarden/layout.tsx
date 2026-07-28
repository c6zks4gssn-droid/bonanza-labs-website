import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voorwaarden ServeFlow-pilot",
  description:
    "Voorwaarden voor de ServeFlow 14-dagen pilot en overige diensten van BonanzaLabs.",
  alternates: { canonical: "/voorwaarden" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
