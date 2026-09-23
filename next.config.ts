import type { NextConfig } from "next";

// Beveiligingsheaders voor elke route.
//
// Waarom deze drie: de site heeft een chatwidget, een betaalflow en een
// adminomgeving. Zonder X-Frame-Options kan de site in een verborgen iframe
// worden geladen (clickjacking op de betaalknop). Zonder CSP mag elke
// geïnjecteerde scriptbron draaien. HSTS, nosniff en een referrer-policy zet
// Vercel al zelf; die staan hier niet dubbel.
//
// De CSP is bewust niet maximaal streng: Next.js injecteert inline scripts voor
// hydratatie en de site gebruikt inline styles. Daarom 'unsafe-inline' voor
// script en style, en géén frame-ancestors in de CSP zelf (dat doet
// X-Frame-Options hieronder al).
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js hydratatie en Tailwind gebruiken inline script/style.
      // unpkg.com is nodig omdat de Bonanza Voice-widget (@elevenlabs/convai-widget-embed)
      // runtime van daar wordt geladen — zie src/components/BonanzaVoice.tsx.
      "script-src 'self' 'unsafe-inline' https://unpkg.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      // Chatwidget en voice-agent praten met hun eigen backend; Vercel analytics
      // en de ElevenLabs-agent staan hier expliciet.
      "connect-src 'self' https://api.elevenlabs.io wss://api.elevenlabs.io https://vitals.vercel-insights.com",
      "media-src 'self' blob: https://api.elevenlabs.io",
      // Stripe Checkout is een redirect via window.location.assign, geen iframe
      // en geen formulier. frame-src is voor het geval Stripe later wel een
      // element insluit; form-action blijft 'self' omdat de contact- en
      // voice-formulieren op deze site zelf posten.
      "frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // The managed local preview cannot run native Sharp; Vercel production keeps optimization.
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
  async redirects() {
    return [
      // Oude productpagina's → portfolio
      { source: "/frameforge", destination: "/portfolio", permanent: true },
      { source: "/frameforge/:path*", destination: "/portfolio", permanent: true },
      { source: "/ugc", destination: "/portfolio", permanent: true },
      { source: "/firewall", destination: "/portfolio", permanent: true },
      { source: "/firewall/:path*", destination: "/portfolio", permanent: true },
      { source: "/mcp-guard", destination: "/portfolio", permanent: true },
      { source: "/mcp-guard/:path*", destination: "/portfolio", permanent: true },
      { source: "/gasvrij", destination: "/portfolio", permanent: true },
      { source: "/gasvrij/:path*", destination: "/portfolio", permanent: true },

      // Oude toolpagina's → home
      { source: "/quiz", destination: "/", permanent: true },
      { source: "/quiz/:path*", destination: "/", permanent: true },
      { source: "/intel", destination: "/", permanent: true },
      { source: "/intel/:path*", destination: "/", permanent: true },
      { source: "/prompts", destination: "/", permanent: true },
      { source: "/prompts/:path*", destination: "/", permanent: true },
      { source: "/byo", destination: "/", permanent: true },
      { source: "/byo/:path*", destination: "/", permanent: true },
      { source: "/search", destination: "/", permanent: true },
      { source: "/ai-ops", destination: "/", permanent: true },
      { source: "/compliance", destination: "/", permanent: true },

      // Oude namen en navigatieroutes
      { source: "/voiceflow", destination: "/bonanza-voice", permanent: true },
      { source: "/tenderai", destination: "/tradeflow", permanent: true },
      { source: "/tenderai/:path*", destination: "/tradeflow", permanent: true },
      { source: "/products", destination: "/pricing", permanent: true },
      { source: "/about", destination: "/over-ons", permanent: true },

      // Oude Engelstalige AI-videoartikelen → nieuwe MKB-kennisbank
      {
        source: "/blog/runway-vs-kling-vs-luma-vs-veo-3-2025",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/best-ai-video-generator-right-now-july-2025",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/text-to-video-ai-7-best-tools-compared",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
