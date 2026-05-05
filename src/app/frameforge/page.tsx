"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Film, Mic, Play, RefreshCw, Sparkles, Terminal, Wand2, Menu, X, Zap, Shield, DollarSign } from "lucide-react";

const features = [
  "Script → scene outline → voiceover → MP4 workflow",
  "Formats for YouTube, TikTok/Reels and square posts",
  "Viral, product, corporate and explainer styles",
  "Edge-TTS voiceover support",
  "Designed for launch videos, demos and social clips",
];

const ugcFeatures = [
  "Enter a product URL → AI generates UGC scripts",
  "TikTok-native 9:16 format with kinetic text overlays",
  "Multiple scripts per product — test what converts",
  "Agent Wallet budget guard before API spend",
  "Open source — plug your own avatar models",
  "No vendor lock-in, no black box, no VC data harvesting",
];

const ugcSteps = [
  { step: "1", title: "Enter product URL", desc: "FrameForge scrapes features, pricing, screenshots automatically" },
  { step: "2", title: "AI writes UGC scripts", desc: "Hook + body + CTA in authentic influencer voice" },
  { step: "3", title: "Generate videos", desc: "Kinetic text + voiceover → MP4 in seconds" },
  { step: "4", title: "Wallet guard", desc: "Every API call goes through the spending firewall first" },
];

const ugcDemo = `$ bonanza video ugc https://yourproduct.com --count 5

🔍 Scraping yourproduct.com...
  ✅ ProductX: 5 features extracted

📝 Generating 5 UGC scripts...
  Script 1: "Okay so I just found this tool called ProductX..."
  Script 2: "You guys NEED to see this — ProductX..."
  Script 3: "Stop scrolling. ProductX is actually..."

🛡️  Wallet: 5 × $0.11 = $0.55 — APPROVED

🎬 Rendering 5 videos (9:16)...
  ✅ ugc_productx_1.mp4
  ✅ ugc_productx_2.mp4
  ✅ ugc_productx_3.mp4
  ✅ ugc_productx_4.mp4
  ✅ ugc_productx_5.mp4

Done! 5 UGC videos ready to post.`;

export default function FrameForgePage() {
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<"studio" | "ugc">("ugc");

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "frameforge", tier: "pro" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Checkout unavailable");
    } catch {
      alert("Checkout unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#050508]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between relative">
          <Link href="/" className="flex items-center gap-2 font-bold"><img src="/logo-256.png" alt="Bonanza Labs" className="h-8 w-8 rounded" /> Bonanza Labs</Link>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''} md:flex items-center gap-6 text-sm text-gray-400`}>
            <Link href="/products" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>Products</Link>
            <Link href="/frameforge" className="text-white font-medium" onClick={() => setMenuOpen(false)}>FrameForge</Link>
            <Link href="/pricing" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>Pricing</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto">
          {/* Tab switcher */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setTab("ugc")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === "ugc" ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"}`}
            >
              <Zap className="w-4 h-4 inline mr-1.5" />UGC Mode
            </button>
            <button
              onClick={() => setTab("studio")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === "studio" ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"}`}
            >
              <Film className="w-4 h-4 inline mr-1.5" />Studio Mode
            </button>
          </div>

          {tab === "ugc" ? (
            /* ─── UGC Mode ─── */
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300 mb-6">
                  <Zap className="w-4 h-4" /> NEW — UGC Video Army
                </div>
                <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
                  Deploy your own AI UGC army
                </h1>
                <p className="text-xl text-gray-400 mb-6">
                  Enter a product URL. FrameForge scrapes features, writes influencer-style scripts, and generates TikTok-ready videos in seconds. Open source. No vendor lock-in.
                </p>
                <div className="flex items-center gap-2 text-sm text-amber-300 mb-6">
                  <Shield className="w-4 h-4" />
                  <span>Every API call passes through the Agent Wallet spending firewall</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button onClick={checkout} disabled={loading} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {loading ? "Redirecting..." : "Go Pro — $29/mo"}
                  </button>
                  <a href="https://github.com/c6zks4gssn-droid/bonanza-labs-frameforge" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-white/10 px-6 py-3 rounded-xl font-semibold hover:bg-white/5 transition">
                    View GitHub
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0d0d12] overflow-hidden shadow-2xl shadow-amber-500/10">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-2 text-xs text-gray-500 font-mono">bash — ugc pipeline</span>
                </div>
                <div className="p-4 font-mono text-xs leading-relaxed whitespace-pre text-gray-300 max-h-[400px] overflow-y-auto">
                  {ugcDemo}
                </div>
              </div>
            </div>
          ) : (
            /* ─── Studio Mode (original) ─── */
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 mb-6">
                  <Film className="w-4 h-4" /> Flagship product
                </div>
                <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">FrameForge</h1>
                <p className="text-xl text-gray-400 mb-8">Turn a product idea, repo launch or tutorial into a polished AI-generated video workflow.</p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={checkout} disabled={loading} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {loading ? "Redirecting..." : "Go Pro — $29/mo"}
                  </button>
                  <a href="https://github.com/c6zks4gssn-droid/bonanza-labs-frameforge" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-white/10 px-6 py-3 rounded-xl font-semibold hover:bg-white/5 transition">View GitHub</a>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0d0d12] overflow-hidden shadow-2xl shadow-violet-500/10">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]"><div className="w-3 h-3 rounded-full bg-[#ff5f57]"/><div className="w-3 h-3 rounded-full bg-[#febc2e]"/><div className="w-3 h-3 rounded-full bg-[#28c840]"/><span className="ml-2 text-xs text-gray-500 font-mono">frameforge-demo.mp4</span></div>
                <video
                  src="/frameforge-demo.mp4"
                  className="w-full aspect-video object-cover bg-black"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                />
                <div className="p-4 font-mono text-xs text-gray-400 border-t border-white/5">
                  Real generated demo asset · 14s MP4 · terminal audit animation
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* UGC How It Works */}
      {tab === "ugc" && (
        <section className="py-20 px-6 border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <p className="text-amber-400 font-semibold tracking-[3px] uppercase text-sm mb-4 text-center">How it works</p>
            <h2 className="text-4xl font-black mb-12 text-center">Product URL to UGC video in 4 steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {ugcSteps.map((s) => (
                <div key={s.step} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 relative">
                  <div className="text-4xl font-black text-amber-500/30 mb-3">{s.step}</div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* UGC vs Fastlane comparison */}
      {tab === "ugc" && (
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-amber-400 font-semibold tracking-[3px] uppercase text-sm mb-4 text-center">Why open source wins</p>
            <h2 className="text-4xl font-black mb-12 text-center">FrameForge UGC vs closed-source alternatives</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                <h3 className="text-xl font-bold mb-4 text-amber-300">🦞 FrameForge UGC</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Open source (Apache 2.0)</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Self-host or cloud — your choice</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Agent Wallet spending firewall</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Plug your own avatar models</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> No data harvesting</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Run locally with Ollama</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-400">🔒 Closed-source SaaS</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Your content on their servers</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">✗</span> No spending controls</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Locked to their avatar models</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Cannot audit or customize</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">✗</span> VC-funded = you are the product</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Cloud-only, no local option</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features (Studio mode) */}
      {tab === "studio" && (
        <section className="py-20 px-6 border-y border-white/5">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-violet-400 font-semibold tracking-[3px] uppercase text-sm mb-4">What it does</p>
              <h2 className="text-4xl font-black mb-6">Video creation for builders who need assets fast.</h2>
              <p className="text-gray-400">FrameForge is for launch videos, product demos, explainer clips and social posts — without opening a video editor first.</p>
            </div>
            <div className="space-y-3">
              {features.map((f) => <div key={f} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> {f}</div>)}
            </div>
          </div>
        </section>
      )}

      {/* UGC Features */}
      {tab === "ugc" && (
        <section className="py-20 px-6 border-y border-white/5">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-amber-400 font-semibold tracking-[3px] uppercase text-sm mb-4">UG C video features</p>
              <h2 className="text-4xl font-black mb-6">Open source UGC. No black box.</h2>
              <p className="text-gray-400">Deploy UGC videos from the CLI. Budget-guarded by the Agent Wallet. Plug any model you want — or run locally.</p>
            </div>
            <div className="space-y-3">
              {ugcFeatures.map((f) => <div key={f} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> {f}</div>)}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          {tab === "ugc" ? (
            <>
              <Zap className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h2 className="text-4xl font-black mb-4">Deploy your AI UGC army today.</h2>
              <p className="text-gray-400 mb-4">Open source. Budget-guarded. No vendor lock-in.</p>
              <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-8">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>Est. $0.11 per video · Agent Wallet approved</span>
              </div>
            </>
          ) : (
            <>
              <Terminal className="w-10 h-10 text-violet-400 mx-auto mb-4" />
              <h2 className="text-4xl font-black mb-4">Start free. Upgrade when launches need polish.</h2>
              <p className="text-gray-400 mb-8">Free tier for experiments. Pro unlocks more videos, 1080p, all styles, voice cloning and no watermark.</p>
            </>
          )}
          <button onClick={checkout} disabled={loading} className={`inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition disabled:opacity-50 ${tab === "ugc" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:opacity-90" : "bg-white text-black hover:bg-gray-100"}`}>
            {loading ? "Redirecting..." : tab === "ugc" ? "Start FrameForge UGC Pro" : "Start FrameForge Pro"}
          </button>
        </div>
      </section>
    </main>
  );
}