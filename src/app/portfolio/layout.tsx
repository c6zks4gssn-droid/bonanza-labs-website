import { withPageSocialMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";

export const metadata: Metadata = withPageSocialMetadata({
  title: "Portfolio — BonanzaLabs",
  description:
    "Eigen projecten van BonanzaLabs: een webshop met checkout, een productlancering en open-source beveiliging voor AI-koppelingen.",
  alternates: {
    canonical: "https://www.bonanza-labs.com/portfolio",
  },
  openGraph: {
    title: "Portfolio — BonanzaLabs",
    description:
      "Eigen projecten van BonanzaLabs: een webshop met checkout, een productlancering en open-source beveiliging voor AI-koppelingen.",
    url: "https://www.bonanza-labs.com/portfolio",
    siteName: "BonanzaLabs",
    type: "website",
  },
});

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}