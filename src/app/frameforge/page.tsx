"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Film, Mic, Play, RefreshCw, Sparkles, Terminal, Wand2, Menu, X } from "lucide-react";

const features = [
  "Script → scene outline → voiceover → MP4 workflow",
  "Formats for YouTube, TikTok/Reels and square posts",
  "Viral, product, corporate and explainer styles",
  "Edge-TTS voiceover support",
  "Designed for launch videos, demos and social clips",
];

export default function FrameForgePage() {
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
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
      </section>

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

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Terminal className="w-10 h-10 text-violet-400 mx-auto mb-4" />
          <h2 className="text-4xl font-black mb-4">Start free. Upgrade when launches need polish.</h2>
          <p className="text-gray-400 mb-8">Free tier for experiments. Pro unlocks more videos, 1080p, all styles, voice cloning and no watermark.</p>
          <button onClick={checkout} disabled={loading} className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition disabled:opacity-50">
            {loading ? "Redirecting..." : "Start FrameForge Pro"}
          </button>
        </div>
      </section>
    </main>
  );
}
