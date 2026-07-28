import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
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
      { source: "/ugc", destination: "/portfolio", permanent: true },
      { source: "/firewall", destination: "/portfolio", permanent: true },
      { source: "/mcp-guard", destination: "/portfolio", permanent: true },
      { source: "/gasvrij", destination: "/portfolio", permanent: true },
      // Oude tool pagina's → home
      { source: "/quiz", destination: "/", permanent: true },
      { source: "/intel", destination: "/", permanent: true },
      { source: "/prompts", destination: "/", permanent: true },
      { source: "/byo", destination: "/", permanent: true },
      { source: "/search", destination: "/", permanent: true },
      { source: "/ai-ops", destination: "/", permanent: true },
      { source: "/compliance", destination: "/", permanent: true },
      // Oude productnaam redirects
      { source: "/voiceflow", destination: "/bonanza-voice", permanent: true },
      { source: "/tenderai", destination: "/tradeflow", permanent: true },
      // Ode producten pagina → pricing
      { source: "/products", destination: "/pricing", permanent: true },
    ];
  },
};

export default nextConfig;