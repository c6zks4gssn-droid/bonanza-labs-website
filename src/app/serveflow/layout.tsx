import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ServeFlow — AI automatisering voor horeca",
  description:
    "Minder gemiste reserveringen, telefoontjes en no-shows. Online reserveringen, WhatsApp-bevestigingen, no-showpreventie en reviews voor restaurants en cafés.",
  alternates: {
    canonical: "https://bonanza-labs.com/serveflow",
  },
  openGraph: {
    title: "ServeFlow — AI automatisering voor horeca",
    description:
      "Minder gemiste reserveringen, telefoontjes en no-shows. Online reserveringen, WhatsApp-bevestigingen, no-showpreventie en reviews voor restaurants en cafés.",
    url: "https://bonanza-labs.com/serveflow",
    siteName: "BonanzaLabs",
    type: "website",
  },
};

export default function ServeFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}