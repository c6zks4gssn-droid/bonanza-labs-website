import type { Metadata } from "next";
import IntelPage from "./IntelPage";

export const metadata: Metadata = {
  title: "Bonanza Intel — Competitive Intelligence Agent for Indie Founders",
  description: "Daily competitive intelligence briefs delivered to your Telegram. No dashboards. No enterprise pricing. Just the signals that matter. €29/mo.",
  openGraph: {
    title: "Bonanza Intel — Your competitors don't sleep. Neither do we.",
    description: "Daily competitive intelligence briefs via Telegram. €29/mo. 5-minute setup.",
    url: "https://bonanza-labs.com/intel",
    siteName: "Bonanza Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bonanza Intel — Your competitors don't sleep. Neither do we.",
    description: "Daily competitive intelligence briefs via Telegram. €29/mo.",
    creator: "@bonanzalabs",
  },
  alternates: {
    canonical: "https://bonanza-labs.com/intel",
  },
};

export default IntelPage;