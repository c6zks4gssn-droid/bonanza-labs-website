"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, Search, Copy, Check, Menu, X } from "lucide-react";

const CATEGORIES = [
  { key: "all", label: "All Products" },
  { key: "flagship", label: "🚀 Flagship" },
  { key: "infrastructure", label: "🏗️ Infrastructure" },
  { key: "tools", label: "🛠️ Tools" },
  { key: "forks", label: "🔀 Forks & Integrations" },
];

const PRODUCTS = [
  {
    name: "Agent Wallet",
    emoji: "💰",
    tagline: "AI Payment Infrastructure",
    desc: "A spending firewall for AI agents: policy checks, risk scoring, approval queue, audit log, and Stripe test checkout after approval.",
    repo: "bonanza-labs-agent-wallet",
    status: "Live",
    category: "flagship",
    color: "from-amber-500 to-orange-500",
    features: ["Policy decisions", "Risk score", "Approval dashboard", "Audit log", "Stripe test checkout", "REST API + CLI"],
    install: "pip install bonanza-agents",
    href: "/firewall",
  },
  {
    name: "Fork Doctor",
    emoji: "🩺",
    tagline: "Repo Health Checker",
    desc: "13 automated infrastructure checks for any GitHub repo. CI/CD, security, SBOM, Dev Containers — diagnose and fix in seconds.",
    repo: "bonanza-labs-fork-doctor",
    status: "v0.3.0",
    category: "flagship",
    color: "from-emerald-500 to-teal-500",
    features: ["13 health checks", "CI/CD detection", "Security scanning", "SBOM generation", "pip install fork-doctor"],
    install: "pip install fork-doctor",
    href: null,
  },
  {
    name: "FrameForge",
    emoji: "🎬",
    tagline: "AI Video Generator",
    desc: "Script → Voiceover → Video. Type a topic, pick a style, get a polished MP4 in minutes. Powered by HyperFrames, Manim & Edge-TTS.",
    repo: "bonanza-labs-frameforge",
    status: "Beta",
    category: "flagship",
    color: "from-violet-500 to-cyan-500",
    features: ["AI script writer", "4 styles", "3 formats (16:9, 9:16, 1:1)", "Edge-TTS voiceover", "HyperFrames + Manim"],
    install: "pip install bonanza-labs[video]",
    href: "/frameforge",
  },
  {
    name: "Agents",
    emoji: "🤖",
    tagline: "AI Agent Orchestration",
    desc: "Build, deploy and orchestrate AI agents with built-in payments, video & search. One framework, every tool.",
    repo: "bonanza-labs-agents",
    status: "v0.2.1",
    category: "infrastructure",
    color: "from-pink-500 to-rose-500",
    features: ["6 built-in tools", "Multi-agent workflows", "Ollama LLM runtime", "Wallet integration", "REST API + CLI"],
    install: "pip install bonanza-agents",
    href: null,
  },
  {
    name: "Search",
    emoji: "🔍",
    tagline: "AI Web Search & Extract",
    desc: "Search the web and extract page content. DuckDuckGo-powered, cached results, clean URLs. Open source Exa/Tavily killer.",
    repo: "bonanza-labs-search",
    status: "v0.2.1",
    category: "infrastructure",
    color: "from-blue-500 to-indigo-500",
    features: ["DuckDuckGo search", "URL content extraction", "Result caching", "Clean URLs", "REST API + CLI"],
    install: "pip install bonanza-search",
    href: "/search",
  },
  {
    name: "Webhooks",
    emoji: "📡",
    tagline: "Webhook Hub for AI Agents",
    desc: "Receive webhooks → trigger agent actions. GitHub push → run Fork Doctor. Stripe payment → send video. Event-driven AI.",
    repo: "bonanza-labs-webhooks",
    status: "v0.2.1",
    category: "infrastructure",
    color: "from-green-500 to-emerald-500",
    features: ["Endpoint management", "HMAC verification", "Agent trigger rules", "Event logging", "REST API + CLI"],
    install: "pip install bonanza-webhooks",
    href: null,
  },
  {
    name: "Auth",
    emoji: "🔐",
    tagline: "AI Agent Identity & Auth",
    desc: "Give agents digital identities, API keys and JWT tokens. OAuth for AI — agents authenticate to services on your behalf.",
    repo: "bonanza-labs-auth",
    status: "v0.2.1",
    category: "infrastructure",
    color: "from-red-500 to-pink-500",
    features: ["Agent identities", "API keys (bza_ prefix)", "JWT tokens", "Scope-based permissions", "REST API + CLI"],
    install: "pip install bonanza-auth",
    href: null,
  },
  {
    name: "Pay",
    emoji: "💳",
    tagline: "AI Payment Framework",
    desc: "Stripe + stablecoin payments for AI agents. Multi-chain wallet, x402 protocol, crypto checkout, pricing calculator.",
    repo: "bonanza-labs-pay",
    status: "v0.2.1",
    category: "infrastructure",
    color: "from-purple-500 to-violet-500",
    features: ["Stripe integration", "USDC/USD1 on Base & Solana", "x402 protocol", "Pricing calculator", "REST API + CLI"],
    install: "pip install bonanza-pay",
    href: null,
  },
  {
    name: "GEO/SEO",
    emoji: "🔍",
    tagline: "AI Search Optimization",
    desc: "Optimize content for ChatGPT, Perplexity & Google. 20-point audit, JSON-LD schemas, llms.txt generator, AI search visibility.",
    repo: "bonanza-labs-geo-seo",
    status: "v0.2.1",
    category: "tools",
    color: "from-lime-500 to-green-500",
    features: ["GEO + SEO audit (0-20)", "llms.txt generator", "JSON-LD schemas", "AI search visibility", "GitHub README optimizer"],
    install: "pip install bonanza-geo-seo",
    href: null,
  },
  {
    name: "Spectrum",
    emoji: "📱",
    tagline: "Multi-Channel Agent Messaging",
    desc: "Connect AI agents to iMessage, WhatsApp, Telegram, Discord, Slack via one API. Built on Photon Spectrum (MIT).",
    repo: "spectrum-ts",
    status: "v0.2.1",
    category: "tools",
    color: "from-sky-500 to-blue-500",
    features: ["iMessage + WhatsApp", "Telegram + Discord + Slack", "One unified API", "OpenClaw integration", "Free tier available"],
    install: "bun add spectrum-ts",
    href: null,
  },
  {
    name: "Voicebox",
    emoji: "🎙️",
    tagline: "Open Source TTS Engine",
    desc: "7 TTS engines, voice cloning, 23 languages, post-processing effects. Free alternative to ElevenLabs. Runs locally.",
    repo: "voicebox",
    status: "Integrated",
    category: "tools",
    color: "from-rose-500 to-pink-500",
    features: ["7 TTS engines", "Voice cloning", "23 languages", "Post-processing effects", "MLX Apple Silicon"],
    install: "Download from voicebox.sh",
    href: null,
  },
  {
    name: "Reflexio",
    emoji: "🧠",
    tagline: "AI Agent Self-Improvement",
    desc: "Harness that enables AI agents to learn from every interaction. 81% fewer planning steps, 72% less tokens. Fork of ReflexioAI.",
    repo: "reflexio",
    status: "Fork",
    category: "forks",
    color: "from-indigo-500 to-purple-500",
    features: ["Self-improving agents", "81% fewer steps", "Transfer learning", "Playbook extraction", "PyPI package"],
    install: "pip install bonanza-labs-reflexio",
    href: null,
  },
  {
    name: "Clearwing",
    emoji: "🦅",
    tagline: "Autonomous Vuln Scanner",
    desc: "Network pentest agent + source-code vulnerability hunter. 63 bind-tools, SARIF reports, exploit validation. Fork of Lazarus AI.",
    repo: "clearwing",
    status: "Fork",
    category: "forks",
    color: "from-red-500 to-orange-500",
    features: ["63 bind-tools", "SARIF reports", "Exploit validation", "macOS/arm64 support", "Responsible disclosure"],
    install: "pip install bonanza-labs-clearwing",
    href: null,
  },
  {
    name: "RevPDF",
    emoji: "📄",
    tagline: "Offline PDF Editor",
    desc: "10x smaller than Adobe, 100% offline, no signup. Edit, sign, redact, split, merge PDFs. Works on every platform.",
    repo: "revpdf",
    status: "Tested",
    category: "forks",
    color: "from-teal-500 to-emerald-500",
    features: ["26MB vs 300MB+", "100% offline", "No signup", "All platforms", "Free"],
    install: "Download from revpdf.com",
    href: null,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs hover:bg-white/10 transition group"
    >
      <code className="text-green-400">{text}</code>
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-500 group-hover:text-gray-300" />}
    </button>
  );
}

export default function ProductsPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tagline.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const flagshipCount = PRODUCTS.filter((p) => p.category === "flagship").length;
  const infraCount = PRODUCTS.filter((p) => p.category === "infrastructure").length;
  const toolsCount = PRODUCTS.filter((p) => p.category === "tools").length;
  const forksCount = PRODUCTS.filter((p) => p.category === "forks").length;

  return (
    <main className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#050508]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between relative">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-256.png" alt="Bonanza Labs" className="h-8 w-8 rounded" />
            <span className="font-bold tracking-tight">Bonanza Labs</span>
          </Link>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''} md:flex items-center gap-6 text-sm text-gray-400`}>
            <a href="/" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>Home</a>
            <span className="text-white font-medium">Products</span>
            <a href="/pricing" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="/firewall" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>Dashboard</a>
            <a href="https://github.com/c6zks4gssn-droid" className="hover:text-white transition flex items-center gap-1" onClick={() => setMenuOpen(false)}>🐙 GitHub</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-cyan-600/8 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-violet-400 font-semibold tracking-[3px] uppercase text-sm mb-4">14 Open Source Products</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">
            Every tool an AI builder needs
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            From spending firewalls to video generators, repo health checks to agent messaging — all Apache 2.0, all installable in one command.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  category === cat.key
                    ? "bg-violet-500/20 border border-violet-500/50 text-violet-300"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat.label}
                {cat.key === "flagship" && <span className="ml-1.5 text-xs opacity-60">({flagshipCount})</span>}
                {cat.key === "infrastructure" && <span className="ml-1.5 text-xs opacity-60">({infraCount})</span>}
                {cat.key === "tools" && <span className="ml-1.5 text-xs opacity-60">({toolsCount})</span>}
                {cat.key === "forks" && <span className="ml-1.5 text-xs opacity-60">({forksCount})</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products match your search.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border bg-white/[0.02] p-6 hover:border-white/10 transition group ${
                  p.category === "flagship"
                    ? "border-amber-500/20 hover:border-amber-500/40"
                    : "border-white/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{p.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-lg font-bold">{p.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${p.color} bg-clip-text text-transparent border border-white/10`}>
                        {p.status}
                      </span>
                      {p.category === "flagship" && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                          Flagship
                        </span>
                      )}
                    </div>
                    <p className="text-violet-400 text-sm font-medium mb-2">{p.tagline}</p>
                    <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {p.features.slice(0, 4).map((f) => (
                        <span key={f} className="text-xs bg-white/5 border border-white/5 rounded-full px-2.5 py-0.5 text-gray-500">{f}</span>
                      ))}
                      {p.features.length > 4 && (
                        <span className="text-xs bg-white/5 border border-white/5 rounded-full px-2.5 py-0.5 text-gray-500">+{p.features.length - 4}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CopyButton text={p.install} />
                      <a
                        href={`https://github.com/c6zks4gssn-droid/${p.repo}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300 transition"
                      >
                        🐙 GitHub <ExternalLink className="w-3 h-3" />
                      </a>
                      {p.href && (
                        <a
                          href={p.href}
                          className="inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition"
                        >
                          Live Demo →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["3", "Flagship Products"],
            ["5", "Infrastructure Tools"],
            ["4", "Developer Tools"],
            ["3", "Forks & Integrations"],
          ].map(([num, label]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">{num}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Start building today</h2>
          <p className="text-gray-400 mb-8">Every product is open source. Install what you need, upgrade when you're ready.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/pricing" className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
              💳 View Pricing
            </Link>
            <a href="https://github.com/c6zks4gssn-droid" target="_blank" className="flex items-center gap-2 border border-white/10 px-6 py-3 rounded-xl font-semibold hover:bg-white/5 transition">
              🐂 GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo-256.png" alt="Bonanza Labs" className="h-6 w-6 rounded" />
            <span className="font-bold">Bonanza Labs</span>
          </div>
          <p className="text-sm text-gray-600">© 2026 Bonanza Labs — Open source AI tools for builders</p>
          <a href="https://github.com/c6zks4gssn-droid" className="text-sm text-gray-600 hover:text-white transition flex items-center gap-1">🐙 GitHub</a>
        </div>
      </footer>
    </main>
  );
}