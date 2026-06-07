import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI UGC Video — Bonanza Labs',
  description: 'AI-generated UGC videos at scale. 9 marketing modes, 20 preset avatars, virality scoring. From product showcase to unboxing — produce studio-quality content in minutes.',
  alternates: { canonical: 'https://bonanza-labs.com/ugc' },
  openGraph: {
    title: 'AI UGC Video — Bonanza Labs',
    description: 'AI-generated UGC videos at scale. Virality scoring included.',
    url: 'https://bonanza-labs.com/ugc',
    type: 'website',
  },
};

const modes = [
  { icon: '🎬', name: 'UGC Talking Head', desc: 'Authentic product endorsements with natural speech and expressions' },
  { icon: '📖', name: 'How-To', desc: 'Tutorial-style videos that educate and convert' },
  { icon: '📦', name: 'Unboxing', desc: 'Excitement-driven unboxing that drives purchase intent' },
  { icon: '✨', name: 'Product Showcase', desc: 'Hero shots that make products look irresistible' },
  { icon: '⭐', name: 'Product Review', desc: 'Trust-building reviews from realistic perspectives' },
  { icon: '📺', name: 'TV Spot', desc: 'Commercial-quality 15-30 second ads' },
  { icon: '👗', name: 'Virtual Try-On', desc: 'See it on — without the studio shoot' },
  { icon: '🎰', name: 'Wild Card', desc: 'Creative freedom for unexpected viral content' },
  { icon: '🎯', name: 'UGC How-To', desc: 'Educational content with a personal touch' },
];

const pricing = [
  {
    name: 'Starter',
    price: '€299',
    period: '/month',
    desc: 'For brands testing AI UGC',
    features: ['4 videos/month', '1 avatar', '3 marketing modes', '720p resolution', 'Virality scoring', 'Email support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '€799',
    period: '/month',
    desc: 'For brands scaling content',
    features: ['12 videos/month', '5 avatars', 'All 9 marketing modes', '1080p resolution', 'Virality scoring + recommendations', 'Priority support', 'Custom brand voice', 'Product import'],
    cta: 'Most Popular',
    highlight: true,
  },
  {
    name: 'Agency',
    price: '€1.499',
    period: '/month',
    desc: 'For agencies managing multiple brands',
    features: ['40 videos/month', 'All 20 avatars', 'All 9 marketing modes', '1080p + 4K', 'Virality scoring + A/B testing', 'Dedicated account manager', 'White-label option', 'API access', 'Multi-brand management'],
    cta: 'Contact Sales',
    highlight: false,
  },
];

const steps = [
  { num: '1', title: 'Brief', desc: 'Tell us your product, brand voice, and target audience. Or import from a URL.' },
  { num: '2', title: 'Generate', desc: 'AI creates the script, selects the avatar, and produces the video in minutes.' },
  { num: '3', title: 'Score', desc: 'Brain Activity virality scoring tells you the hook strength and engagement potential.' },
  { num: '4', title: 'Ship', desc: 'Download, post, and scale. One video becomes many variations.' },
];

export default function UGCPage() {
  return (
    <>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-lg">Bonanza Labs</a>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="/ai-ops" className="hover:text-white transition">AI Ops</a>
            <a href="/firewall" className="hover:text-white transition">Firewall</a>
            <a href="/products" className="hover:text-white transition">Products</a>
            <a href="/pricing" className="hover:text-white transition">Pricing</a>
            <a href="https://github.com/c6zks4gssn-droid" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">🐙 GitHub</a>
          </div>
        </div>
      </nav>
      <main className="min-h-screen bg-black text-white">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-purple-500/10" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
            <div className="text-center">
              <p className="text-orange-400 text-sm font-mono tracking-wider uppercase mb-4">AI UGC Video Generation</p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Studio-quality UGC<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
                  without the studio
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                9 marketing modes. 20 preset avatars. Virality scoring included.
                Produce content in minutes that used to take weeks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#pricing" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                  Start Creating →
                </a>
                <a href="#how-it-works" className="border border-gray-600 hover:border-gray-400 text-gray-300 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                  See How It Works
                </a>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                <span>✦ Higgsfield Pro</span>
                <span>✦ Brain Activity Scoring</span>
                <span>✦ 95%+ margin</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 border-t border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              From brief to viral in <span className="text-orange-400">4 steps</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div key={step.num} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xl flex items-center justify-center mx-auto mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Marketing Modes */}
        <section className="py-20 bg-gray-950 border-t border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              9 marketing modes
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
              One product, nine angles. Each mode is optimized for a specific stage of the customer journey.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {modes.map((mode) => (
                <div key={mode.name} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-orange-500/50 transition-colors">
                  <div className="text-3xl mb-3">{mode.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{mode.name}</h3>
                  <p className="text-gray-400 text-sm">{mode.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Virality Scoring */}
        <section className="py-20 border-t border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-orange-400 text-sm font-mono tracking-wider uppercase mb-4">Brain Activity™</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Know your virality score <span className="text-orange-400">before</span> you post
                </h2>
                <p className="text-gray-400 mb-6">
                  Every video gets scored across 5 dimensions: hook strength, viral potential, brain engagement, sustain, and peak moment. Know if your first 3 seconds will stop the scroll.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-right text-sm text-gray-400">Hook</div>
                    <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-red-500 to-orange-400 h-full rounded-full" style={{ width: '34%' }} />
                    </div>
                    <div className="text-sm font-mono text-orange-400">34</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-right text-sm text-gray-400">Viral</div>
                    <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-400 h-full rounded-full" style={{ width: '55%' }} />
                    </div>
                    <div className="text-sm font-mono text-orange-400">55</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-right text-sm text-gray-400">Engagement</div>
                    <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-400 to-yellow-400 h-full rounded-full" style={{ width: '46%' }} />
                    </div>
                    <div className="text-sm font-mono text-orange-400">46</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-right text-sm text-gray-400">Sustain</div>
                    <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                    <div className="text-sm font-mono text-green-400">100</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-orange-400">52</div>
                  <div className="text-gray-400 text-sm">Overall Virality Score</div>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hook (0-3s)</span>
                    <span className="text-red-400">⚠ Weak — show product in first second</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Peak moment</span>
                    <span className="text-green-400">✓ sec 15 — climax timing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sustain</span>
                    <span className="text-green-400">✓ 100/100 — viewers stay</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recommendation</span>
                    <span className="text-orange-400">→ Start with product visible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 bg-gray-950 border-t border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Simple pricing, <span className="text-orange-400">95%+ margin</span>
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
              Sell a €299/month plan that costs you ~€15 in AI credits. That's the UGC arbitrage.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricing.map((plan) => (
                <div key={plan.name} className={`rounded-2xl p-8 ${plan.highlight ? 'bg-gradient-to-b from-orange-500/20 to-gray-900 border-2 border-orange-500' : 'bg-gray-900 border border-gray-800'}`}>
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">{plan.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <span className="text-orange-400 mt-0.5">✓</span>
                        <span className="text-gray-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.highlight ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API / CLI */}
        <section className="py-20 border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-orange-400 text-sm font-mono tracking-wider uppercase mb-4">For Developers</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              pip install bonanza-ugc
            </h2>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-left font-mono text-sm mb-8 overflow-x-auto">
              <div className="text-gray-500"># Generate a UGC video</div>
              <div className="text-green-400">$ ugc generate --template silverjstore --product "Venetian Chain" --avatar mei</div>
              <div className="text-gray-500 mt-4"># Score virality</div>
              <div className="text-green-400">$ ugc score video.mp4</div>
              <div className="text-gray-500 mt-4"># Batch generate for all products</div>
              <div className="text-green-400">$ ugc batch --leads products.json --mode ugc</div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <a href="https://pypi.org/project/bonanza-ugc/" className="hover:text-orange-400 transition-colors">→ PyPI</a>
              <a href="https://github.com/c6zks4gssn-droid/bonanza-labs-website" className="hover:text-orange-400 transition-colors">→ GitHub</a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-gray-950 to-black border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Stop shooting. Start generating.
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              AI UGC video production at scale. Virality scoring included. 
              From €299/month.
            </p>
            <a href="mailto:hello@bonanza-labs.com?subject=AI%20UGC%20Video%20Inquiry" className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors inline-block">
              Get Started →
            </a>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Bonanza Labs. All rights reserved.</p>
          <p className="mt-2">KvK: 88564517 | BTW: NL004627152B36</p>
        </div>
      </footer>
    </>
  );
}