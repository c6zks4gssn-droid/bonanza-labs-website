import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — BonanzaLabs",
  description:
    "Neem contact op met BonanzaLabs. Stuur een bericht of boek een Flow Assessment.",
  alternates: {
    canonical: "https://bonanza-labs.com/contact",
  },
  openGraph: {
    title: "Contact — BonanzaLabs",
    description:
      "Neem contact op met BonanzaLabs. Stuur een bericht of boek een Flow Assessment.",
    url: "https://bonanza-labs.com/contact",
    siteName: "BonanzaLabs",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}