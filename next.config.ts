import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
