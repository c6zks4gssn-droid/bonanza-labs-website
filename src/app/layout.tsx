import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bonanza Labs — The Spending Firewall for AI Agents",
  description: "Set rules, approve risky payments, block bad vendors, and audit every agent transaction before money moves. Open source AI payment infrastructure.",
  metadataBase: new URL("https://bonanza-labs.com"),
  openGraph: {
    title: "Bonanza Labs — The Spending Firewall for AI Agents",
    description: "Set rules, approve risky payments, block bad vendors, and audit every agent transaction before money moves.",
    url: "https://bonanza-labs.com",
    siteName: "Bonanza Labs",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bonanza Labs — Spending Firewall for AI Agents",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bonanza Labs — The Spending Firewall for AI Agents",
    description: "Set rules, approve risky payments, block bad vendors, and audit every agent transaction before money moves.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo-256.png",
    apple: "/logo-256.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050508] text-white antialiased">{children}</body>
    </html>
  );
}