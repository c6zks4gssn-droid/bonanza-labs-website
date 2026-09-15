import { withPageSocialMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
const title = "Bonanza Voice — AI-telefonist voor MKB";
const description = "Neemt op als jij op de steiger of in de keuken staat. Basisvragen en intake, met overdracht aan een medewerker buiten scope. Per klant ingericht en getest.";
export const metadata: Metadata = withPageSocialMetadata({
  title,
  description: "Bonanza Voice is een AI-telefonist voor horeca, bouw en installatie. Basisvragen, terugbel- en offerteverzoeken. Per klant ingericht en getest. Inrichting vanaf €1.495 excl. btw.",
  alternates: { canonical: "https://www.bonanza-labs.com/bonanza-voice" },
  openGraph: { title, description, url: "https://www.bonanza-labs.com/bonanza-voice", type: "website", images: ["https://www.bonanza-labs.com/og-image.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["https://www.bonanza-labs.com/og-image.png"] },
});
export default function VoiceLayout({ children }: { children: React.ReactNode }) { return children; }
