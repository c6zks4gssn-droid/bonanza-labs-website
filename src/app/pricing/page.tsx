import Link from "next/link";

const plans = [
  {
    product: "FrameForge",
    emoji: "🎬",
    tiers: [
      { name: "Free", price: "$0", period: "/mo", features: ["5 videos/mo", "720p", "2 styles", "Edge-TTS voices"], cta: "Start Free", highlight: false },
      { name: "Pro", price: "$29", period: "/mo", features: ["50 videos/mo", "1080p", "All styles", "Voice cloning", "Batch render", "No watermark"], cta: "Go Pro", highlight: true },
      { name: "Enterprise", price: "$199", period: "/mo", features: ["Unlimited", "4K", "All styles", "Voice cloning", "API access", "Custom templates"], cta: "Contact Us", highlight: false },
    ],
  },
  {
    product: "Fork Doctor",
    emoji: "🩺",
    tiers: [
      { name: "Free", price: "$0", period: "/mo", features: ["5 checks/day", "JSON output", "Public repos"], cta: "Start Free", highlight: false },
      { name: "Pro", price: "$9", period: "/mo", features: ["Unlimited checks", "All formats", "Private repos", "CI/CD integration", "Auto-fix"], cta: "Go Pro", highlight: true },
    ],
  },
  {
    product: "Agent Wallet",
    emoji: "💰",
    tiers: [
      { name: "Free", price: "$0", period: "/mo", features: ["1 agent", "$50/mo limit", "Basic analytics", "Solana only"], cta: "Start Free", highlight: false },
      { name: "Pro", price: "$29", period: "/mo", features: ["10 agents", "$5K/mo limit", "Full analytics", "All chains", "Policy editor", "API access"], cta: "Go Pro", highlight: true },
      { name: "Enterprise", price: "$199", period: "/mo", features: ["Unlimited agents", "Unlimited wallet", "Custom policies", "SSO", "Priority support", "SLA"], cta: "Contact Us", highlight: false },
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#0a0a0f]/70 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Bonanza Labs
          </Link>
          <div className="flex gap-6 text-sm text-white/60">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span className="text-white font-medium">Pricing</span>
            <a href="https://github.com/c6zks4gssn-droid" target="_blank" className="hover:text-white transition">GitHub</a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Start free, upgrade when you need more. Every plan includes core features. Cancel anytime.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/40">
            <span>🪙 Also accept</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-400">USDC</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-400">USDT</span>
            <span>on Solana, Base, BSC</span>
          </div>
        </div>

        {/* Plans */}
        {plans.map((product) => (
          <div key={product.product} className="mb-20">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              {product.emoji} {product.product}
            </h2>
            <div className={`grid ${product.tiers.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl' : 'grid-cols-1 md:grid-cols-3'} gap-6`}>
              {product.tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                    tier.highlight
                      ? "border-violet-500/50 bg-violet-500/5 shadow-lg shadow-violet-500/10"
                      : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-xs font-bold">
                      POPULAR
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{tier.name}</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-4xl font-black">{tier.price}</span>
                      <span className="text-white/40">{tier.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-8">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                        <span className="text-violet-400">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                      tier.highlight
                        ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-violet-500/25"
                        : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Crypto payment note */}
        <div className="mt-12 rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
          <h3 className="text-xl font-bold mb-2">🪙 Pay with Stablecoins</h3>
          <p className="text-white/50 max-w-lg mx-auto">
            Prefer crypto? We accept USDC and USDT on Solana, Base, and BSC. 
            No Stripe needed — just connect your wallet. Powered by <span className="text-cyan-400">Bonanza Labs Pay</span>.
          </p>
          <button className="mt-4 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition">
            Pay with Crypto →
          </button>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">FAQ</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              { q: "Can I switch plans anytime?", a: "Yes. Upgrade or downgrade anytime. Changes take effect immediately." },
              { q: "Do I need a credit card for the free plan?", a: "No. Free plans require no payment method at all." },
              { q: "What chains do you support for crypto payments?", a: "Solana, Base, and BSC. We accept USDC and USDT on all three." },
              { q: "Is everything open source?", a: "Yes. All Bonanza Labs projects are Apache 2.0 licensed on GitHub." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <h4 className="font-semibold mb-1">{faq.q}</h4>
                <p className="text-sm text-white/50">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}