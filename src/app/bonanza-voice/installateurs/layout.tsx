import { withPageSocialMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import { PRICES, formatEuro } from "@/lib/pricing";

const url = "https://www.bonanza-labs.com/bonanza-voice/installateurs";
const title = "AI-telefonist voor installateurs | Bonanza Voice – BonanzaLabs";
const description = `Laat minder offerteaanvragen liggen als je bij een klant staat. Bonanza Voice neemt op, stelt intakevragen en zet de aanvraag klaar. Abonnement vanaf ${formatEuro(PRICES.abonnementStart)} per maand.`;

export const metadata: Metadata = withPageSocialMetadata({
  title: { absolute: title },
  description,
  alternates: { canonical: url },
  robots: { index: true, follow: true },
  openGraph: { title, description, url, type: "website", locale: "nl_NL", images: ["https://www.bonanza-labs.com/og-bonanzalabs.png"] },
});

export default function InstallateursLayout({ children }: { children: React.ReactNode }) {
  return children;
}
