import { withPageSocialMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";

const url = "https://www.bonanza-labs.com/bonanza-voice/installateurs";
const title = "AI-telefonist voor installateurs | Bonanza Voice – BonanzaLabs";
const description = "Laat minder offerteaanvragen liggen als je bij een klant staat. Bonanza Voice neemt op, stelt intakevragen en zet de aanvraag klaar. Inrichting vanaf €1.495.";

export const metadata: Metadata = withPageSocialMetadata({
  title: { absolute: title },
  description,
  alternates: { canonical: url },
  robots: { index: true, follow: true },
  openGraph: { title, description, url, type: "website", locale: "nl_NL", images: ["https://www.bonanza-labs.com/og-image.png"] },
});

export default function InstallateursLayout({ children }: { children: React.ReactNode }) {
  return children;
}
