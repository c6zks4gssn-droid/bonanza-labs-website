import type { Metadata } from "next";
import { I18nProvider } from "@/i18n/I18nProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bonanza Labs — Spending Firewall & AI Tools for Agents",
    template: "%s | Bonanza Labs",
  },
  description: "Set rules, approve risky payments, block bad vendors, and audit every agent transaction before money moves. AI tools built for the autonomous economy.",
  metadataBase: new URL("https://bonanza-labs.com"),
  openGraph: {
    title: "Bonanza Labs — Spending Firewall & AI Tools for Agents",
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
    title: "Bonanza Labs — Spending Firewall & AI Tools for Agents",
    description: "Set rules, approve risky payments, block bad vendors, and audit every agent transaction before money moves.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo-256.png",
    apple: "/logo-256.png",
  },
  alternates: {
    canonical: "https://bonanza-labs.com",
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <noscript>
          <style>{`[style*="opacity: 0"], [style*="opacity:0"] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Bonanza Labs',
              url: 'https://bonanza-labs.com',
              logo: 'https://bonanza-labs.com/logo-256.png',
              description: 'AI tools for the autonomous economy. Spending firewall, tender analysis, and more.',
              sameAs: ['https://github.com/c6zks4gssn-droid'],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Bonanza Agent Wallet',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Any',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              description: 'Spending firewall for AI agents. Policy checks, risk scoring, approval queue, audit log, and Stripe checkout.',
            }),
          }}
        />
      </head>
      <body className="bg-[#050508] text-white antialiased">
        <noscript>
          <style>{`[style*="opacity: 0"], [style*="opacity:0"] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}