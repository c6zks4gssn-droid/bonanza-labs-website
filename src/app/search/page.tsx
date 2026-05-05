"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Search, Terminal, RefreshCw, ExternalLink, Download } from "lucide-react";

const features = [
  "DuckDuckGo search with cached results",
  "URL content extraction (articles, docs, product pages)",
  "Clean URLs + result deduplication",
  "CLI + REST API + Python SDK",
  "Open source (Apache 2.0) — no API key required",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{ title: string; url: string; snippet: string }>>([]);
  const [checked, setChecked] = useState(false);

  const runDemo = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&max=3`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch {
      // silent — demo results already shown via CLI
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#050508]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <img src="/logo-256.png" alt="Bonanza Labs" className="h-8 w-8 rounded" /> Bonanza Labs
          </Link>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/products" className="hover:text-white transition">Products</Link>
            <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300 mb-6">
              <Search className="w-4 h-4" /> v0.2.1
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6">Bonanza Labs ✦ Search</h1>
            <p className="text-xl text-gray-400 mb-8">AI web search & extract. DuckDuckGo-powered, cached results, clean URLs. Open source Tavily/Exa killer — no API key needed.</p>
            <div className="flex flex-wrap gap-4">
              <a href="https://github.com/c6zks4gssn-droid/bonanza-labs-search" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
                <Download className="w-4 h-4" /> pip install bonanza-search
              </a>
              <a href="https://github.com/c6zks4gssn-droid/bonanza-labs-search" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-white/10 px-6 py-3 rounded-xl font-semibold hover:bg-white/5 transition">
                <ExternalLink className="w-4 h-4" /> GitHub
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0d12] overflow-hidden shadow-2xl shadow-blue-500/10">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-xs text-gray-500 font-mono">bash</span>
            </div>
            <div className="p-4 font-mono text-sm space-y-1">
              <div className="text-gray-400">$ bonanza-search search "AI agents 2026" --max 3</div>
              <div className="flex items-center gap-2 text-green-400 mt-2">
                <span className="text-emerald-400">✅</span>
                <span className="text-white">How enterprises are building AI agents in 2026 | Claude</span>
              </div>
              <div className="text-gray-600 ml-4">claude.com/blog/how-enterprises-are...</div>
              <div className="flex items-center gap-2 text-green-400 mt-2">
                <span className="text-emerald-400">✅</span>
                <span className="text-white">8 Ways AI Agents Are Evolving in 2026 - Salesforce</span>
              </div>
              <div className="text-gray-600 ml-4">salesforce.com/blog/ai-agent-trends-2026</div>
              <div className="flex items-center gap-2 text-green-400 mt-2">
                <span className="text-emerald-400">✅</span>
                <span className="text-white">The 8 AI Agent Trends For 2026 - Forbes</span>
              </div>
              <div className="text-gray-600 ml-4">forbes.com/sites/bernardmarr/...</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-blue-400 font-semibold tracking-[3px] uppercase text-sm mb-4">What it does</p>
            <h2 className="text-4xl font-black mb-6">Search the web from your CLI or API.</h2>
            <p className="text-gray-400">Bonanza Search gives AI agents and developers a fast, free web search and extraction tool — no API key, no rate limits, no cost.</p>
          </div>
          <div className="space-y-3">
            {features.map((f) => <div key={f} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> {f}</div>)}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Terminal className="w-10 h-10 text-blue-400 mx-auto mb-4" />
          <h2 className="text-4xl font-black mb-4">Free to start. Scales with you.</h2>
          <p className="text-gray-400 mb-8">Free tier: 100 searches/day. Pro unlocks unlimited, private endpoints, and team seats.</p>
          <Link href="/pricing" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition">
            View pricing →
          </Link>
        </div>
      </section>
    </main>
  );
}
