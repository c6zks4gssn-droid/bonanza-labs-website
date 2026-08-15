import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ServeFlow 14-dagen pilot voor horeca",
  description:
    "Test één reserveringsflow voor één horecalocatie gedurende 14 dagen voor €497 ex. btw. Geen automatische verlenging en geen gegarandeerde omzet- of no-showclaim.",
  alternates: {
    canonical: "https://www.bonanza-labs.com/serveflow",
  },
  openGraph: {
    title: "ServeFlow 14-dagen pilot voor horeca | BonanzaLabs",
    description:
      "Eén locatie, één reserveringsflow en 14 dagen meten. De pilot wordt niet automatisch verlengd.",
    url: "https://www.bonanza-labs.com/serveflow",
    siteName: "BonanzaLabs",
    type: "website",
  },
};

export default function ServeFlowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
