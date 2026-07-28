import type { Metadata } from "next";
import { Instrument_Serif, Geist_Mono, Inter } from "next/font/google";
import { I18nProvider } from "@/i18n/I18nProvider";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BonanzaLabs — Automatisering voor het MKB",
    template: "%s | BonanzaLabs",
  },
  description:
    "Minder handwerk. Snellere opvolging. Meer omzet. BonanzaLabs bouwt praktische automatiseringssystemen voor horeca, bouw, installatie en zakelijke dienstverlening.",
  metadataBase: new URL("https://bonanza-labs.com"),
  openGraph: {
    title: "BonanzaLabs — Automatisering voor het MKB",
    description:
      "Minder handwerk. Snellere opvolging. Meer omzet. BonanzaLabs bouwt praktische automatiseringssystemen voor horeca, bouw, installatie en zakelijke dienstverlening.",
    url: "https://bonanza-labs.com",
    siteName: "BonanzaLabs",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BonanzaLabs — Automatisering voor het MKB",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BonanzaLabs — Automatisering voor het MKB",
    description:
      "Minder handwerk. Snellere opvolging. Meer omzet. BonanzaLabs bouwt praktische automatiseringssystemen voor horeca, bouw, installatie en zakelijke dienstverlening.",
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
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className="dark">
      <head>
        <noscript>
          <style>{`[style*="opacity: 0"], [style*="opacity:0"] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "BonanzaLabs",
              url: "https://bonanza-labs.com",
              logo: "https://bonanza-labs.com/logo-256.png",
              description: "Automatiseringssystemen voor het Nederlandse MKB.",
              sameAs: ["https://github.com/c6zks4gssn-droid"],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} ${geistMono.variable} bg-[#050508] text-white antialiased`}
      >
        <noscript>
          <style>{`[style*="opacity: 0"], [style*="opacity:0"] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <I18nProvider>
          {children}
          <ChatWidget />
        </I18nProvider>
      </body>
    </html>
  );
}