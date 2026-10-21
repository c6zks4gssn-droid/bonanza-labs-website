import { withPageSocialMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";

export const metadata: Metadata = withPageSocialMetadata({
  title: "Algemene voorwaarden",
  description:
    "Voorwaarden voor de ServeFlow-pilot, Flow Assessment, Bonanza Voice en overige diensten van BonanzaLabs.",
  alternates: { canonical: "/voorwaarden" },
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
