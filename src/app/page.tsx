"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Wallet, Terminal, Sparkles, ExternalLink, Check, Copy, BookOpen, X, Menu } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function TerminalDemo() {
  const [line, setLine] = useState(0);
  const [char, setChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const commands = [
    { cmd: "$ bonanza-agents wallet request --amount 900 --budget 25", outputs: ["\n✅ Budget check passed", "\n⏳ Human approval required", "\n✅ Stripe Checkout test session created", "\n\nLive keys blocked by default 🔒"] },
    { cmd: "$ bonanza doctor openclaw/openclaw", outputs: ["\n✅ CI/CD detected (GitHub Actions)", "\n✅ Security scanning enabled", "\n✅ 13/13 checks passed", "\n\nRepo health: 100% 🎉"] },
    { cmd: "$ bonanza video \"AI Agents\" --style viral", outputs: ["\n✅ Script generated (4 scenes)", "\n✅ Voiceover created (en-US-AriaNeural)", "\n✅ Video rendered → output.mp4 (9:16)"] },
  ];

  const command = commands[line];
  const fullCmd = command.cmd;
  const currentCmdText = fullCmd.slice(0, char);
  const isTyping = char < fullCmd.length;
  const showOutputs = !isTyping && char === fullCmd.length;
  const outputsToShow = showOutputs ? command.outputs : [];

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(c => !c), 530);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (isTyping) {
      const speed = fullCmd[char] === ' ' ? 40 : Math.random() * 40 + 30;
      const t = setTimeout(() => setChar(c => c + 1), speed);
      return () => clearTimeout(t);
    }
    if (showOutputs) {
      const t = setTimeout(() => {
        if (line < commands.length - 1) {
          setLine(l => l + 1);
          setChar(0);
        } else {
          setTimeout(() => { setLine(0); setChar(0); }, 3000);
        }
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [isTyping, showOutputs, line, char, fullCmd, commands.length]);

  return (
    <div className="p-4 font-mono text-sm leading-relaxed h-[280px] overflow-hidden">
      <div className="text-violet-400">
        <span>{currentCmdText}</span>
        {isTyping && <span className={showCursor ? "opacity-100" : "opacity-0"}>\u258b</span>}
      </div>
      {outputsToShow.map((out, i) => (
        <div key={i} className="text-green-400/80 ml-2">{out}</div>
      ))}
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm hover:bg-white/10 transition group"
    >
      <code className="text-green-400">{label}</code>
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300" />}
    </button>
  );
}

const PROJECTS = [
  {
    name: "FrameForge",
    emoji: "🎬",
    tagline: "AI Video Generator",
    desc: "Script → Voiceover → Video. Type a topic, pick a style, get a polished MP4 in minutes. Powered by HyperFrames, Manim & Edge-TTS.",
    repo: "bonanza-labs-frameforge",
    status: "Beta",
    color: "from-violet-500 to-cyan-500",
    features: ["AI script writer", "4 styles", "3 formats (16:9, 9:16, 1:1)", "Edge-TTS voiceover", "HyperFrames + Manim"],
    install: "pip install bonanza-labs[video]",
    demo: true,
  },
  {
    name: "Fork Doctor",
    emoji: "🩺",
    tagline: "Repo Health Checker",
    desc: "13 automated infrastructure checks for any GitHub repo. CI/CD, security, SBOM, Dev Containers — diagnose and fix in seconds.",
    repo: "bonanza-labs-fork-doctor",
    status: "v0.3.0",
    color: "from-emerald-500 to-teal-500",
    features: ["13 health checks", "CI/CD detection", "Security scanning", "SBOM generation", "pip install fork-doctor"],
    install: "pip install fork-doctor",
    demo: false,
  },
  {
    name: "Agent Wallet",
    emoji: "💰",
    tagline: "AI Payment Infrastructure",
    desc: "A spending firewall for AI agents: policy checks, risk scoring, approval queue, audit log, and Stripe checkout after approval.",
    repo: "bonanza-labs-agent-wallet",
    status: "Live v1.0",
    color: "from-amber-500 to-orange-500",
    features: ["Policy decisions", "Risk score", "Approval dashboard", "Audit log", "Stripe checkout", "REST API + CLI"],
    install: "pip install bonanza-agents",
    demo: false,
  },
  {
    name: "Agents",
    emoji: "🤖",
    tagline: "AI Agent Orchestration",
    desc: "Build, deploy and orchestrate AI agents with built-in payments, video & search. One framework, every tool.",
    repo: "bonanza-labs-agents",
    status: "v0.2.1",
    color: "from-pink-500 to-rose-500",
    features: ["6 built-in tools", "Multi-agent workflows", "Ollama LLM runtime", "Wallet integration", "REST API + CLI"],
    install: "pip install bonanza-agents",
    demo: false,
  },
  {
    name: "Search",
    emoji: "🔍",
    tagline: "AI Web Search & Extract",
    desc: "Search the web and extract page content. DuckDuckGo-powered, cached results, clean URLs. Open source Exa/Tavily killer.",
    repo: "bonanza-labs-search",
    status: "v0.2.1",
    color: "from-blue-500 to-indigo-500",
    features: ["DuckDuckGo search", "URL content extraction", "Result caching", "Clean URLs", "REST API + CLI"],
    install: "pip install bonanza-search",
    demo: false,
  },
  {
    name: "Webhooks",
    emoji: "📡",
    tagline: "Webhook Hub for AI Agents",
    desc: "Receive webhooks → trigger agent actions. GitHub push → run Fork Doctor. Stripe payment → send video. Event-driven AI.",
    repo: "bonanza-labs-webhooks",
    status: "v0.2.1",
    color: "from-green-500 to-emerald-500",
    features: ["Endpoint management", "HMAC verification", "Agent trigger rules", "Event logging", "REST API + CLI"],
    install: "pip install bonanza-webhooks",
    demo: false,
  },
  {
    name: "Auth",
    emoji: "🔐",
    tagline: "AI Agent Identity & Auth",
    desc: "Give agents digital identities, API keys and JWT tokens. OAuth for AI — agents authenticate to services on your behalf.",
    repo: "bonanza-labs-auth",
    status: "v0.2.1",
    color: "from-red-500 to-pink-500",
    features: ["Agent identities", "API keys (bza_ prefix)", "JWT tokens", "Scope-based permissions", "REST API + CLI"],
    install: "pip install bonanza-auth",
    demo: false,
  },
  {
    name: "Pay",
    emoji: "💳",
    tagline: "AI Payment Framework",
    desc: "Stripe + stablecoin payments for AI agents. Multi-chain wallet, x402 protocol, crypto checkout, pricing calculator.",
    repo: "bonanza-labs-pay",
    status: "v0.2.1",
    color: "from-purple-500 to-violet-500",
    features: ["Stripe integration", "USDC/USD1 on Base & Solana", "x402 protocol", "Pricing calculator", "REST API + CLI"],
    install: "pip install bonanza-pay",
    demo: false,
  },
  {
    name: "GEO/SEO",
    emoji: "🔍",
    tagline: "AI Search Optimization",
    desc: "Optimize content for ChatGPT, Perplexity & Google. 20-point audit, JSON-LD schemas, llms.txt generator, AI search visibility.",
    repo: "https://github.com/c6zks4gssn-droid",
    status: "v0.2.1",
    color: "from-lime-500 to-green-500",
    features: ["GEO + SEO audit (0-20)", "llms.txt generator", "JSON-LD schemas", "AI search visibility", "GitHub README optimizer"],
    install: "python3 skills/geo-seo/scripts/audit.py",
    demo: false,
  },
  {
    name: "Spectrum",
    emoji: "📱",
    tagline: "Multi-Channel Agent Messaging",
    desc: "Connect AI agents to iMessage, WhatsApp, Telegram, Discord, Slack via one API. Built on Photon Spectrum (MIT).",
    repo: "https://github.com/c6zks4gssn-droid/spectrum-ts",
    status: "v0.2.1",
    color: "from-sky-500 to-blue-500",
    features: ["iMessage + WhatsApp", "Telegram + Discord + Slack", "One unified API", "OpenClaw integration", "Free tier available"],
    install: "bun add spectrum-ts",
    demo: false,
  },
  {
    name: "Voicebox",
    emoji: "🎙️",
    tagline: "Open Source TTS Engine",
    desc: "7 TTS engines, voice cloning, 23 languages, post-processing effects. Free alternative to ElevenLabs. Runs locally.",
    repo: "https://github.com/c6zks4gssn-droid/voicebox",
    status: "Integrated",
    color: "from-rose-500 to-pink-500",
    features: ["7 TTS engines", "Voice cloning", "23 languages", "Post-processing effects", "MLX Apple Silicon"],
    install: "Download from voicebox.sh",
    demo: false,
  },
  {
    name: "Reflexio",
    emoji: "🧠",
    tagline: "AI Agent Self-Improvement",
    desc: "Harness that enables AI agents to learn from every interaction. 81% fewer planning steps, 72% less tokens. Fork of ReflexioAI.",
    repo: "https://github.com/c6zks4gssn-droid/reflexio",
    status: "Fork",
    color: "from-indigo-500 to-purple-500",
    features: ["Self-improving agents", "81% fewer steps", "Transfer learning", "Playbook extraction", "PyPI package"],
    install: "pip install bonanza-labs-reflexio",
    demo: false,
  },
  {
    name: "Clearwing",
    emoji: "🦅",
    tagline: "Autonomous Vuln Scanner",
    desc: "Network pentest agent + source-code vulnerability hunter. 63 bind-tools, SARIF reports, exploit validation. Fork of Lazarus AI.",
    repo: "https://github.com/c6zks4gssn-droid/clearwing",
    status: "Fork",
    color: "from-red-500 to-orange-500",
    features: ["63 bind-tools", "SARIF reports", "Exploit validation", "macOS/arm64 support", "Responsible disclosure"],
    install: "pip install bonanza-labs-clearwing",
    demo: false,
  },
  {
    name: "RevPDF",
    emoji: "📄",
    tagline: "Offline PDF Editor",
    desc: "10x smaller than Adobe, 100% offline, no signup. Edit, sign, redact, split, merge PDFs. Works on every platform.",
    repo: "https://revpdf.com",
    status: "Tested",
    color: "from-teal-500 to-emerald-500",
    features: ["26MB vs 300MB+", "100% offline", "No signup", "All platforms", "Free"],
    install: "Download from revpdf.com",
    demo: false,
  },
];

const DOCS = [
  {
    project: "Fork Doctor",
    emoji: "🩺",
    sections: [
      { title: "Install", content: "pip install fork-doctor" },
      { title: "Run", content: "fork-doctor owner/repo --format markdown" },
      { title: "Use case", content: "Turn a messy repo into a trusted, shippable open source project." },
    ],
  },
  {
    project: "FrameForge",
    emoji: "🎬",
    sections: [
      { title: "Install", content: "pip install bonanza-labs[video]" },
      { title: "Create", content: "bonanza video 'My Topic' --style viral --format 9:16" },
      { title: "Output", content: "Script, voiceover, scenes and MP4 generation in one workflow." },
    ],
  },
  {
    project: "Agent Wallet",
    emoji: "💰",
    sections: [
      { title: "Request", content: "bonanza-agents wallet request --amount 900 --budget 25" },
      { title: "Approve", content: "bonanza-agents wallet approve lsrq_xxx" },
      { title: "Checkout", content: "bonanza-agents wallet checkout-test lsrq_xxx" },
    ],
  },
  {
    project: "Search",
    emoji: "🔍",
    sections: [
      { title: "Search", content: "bonanza-search search 'AI agents 2026' --max 5" },
      { title: "Extract", content: "bonanza-search extract https://example.com --max-chars 5000" },
      { title: "Why", content: "A simple open source search/extract layer for agents." },
    ],
  },
  {
    project: "Webhooks",
    emoji: "📡",
    sections: [
      { title: "Register", content: "bonanza-webhooks register --path /webhooks/github --agent my_agent" },
      { title: "Automate", content: "GitHub, Stripe or custom events can trigger agent actions." },
      { title: "Security", content: "HMAC verification and event logging included." },
    ],
  },
  {
    project: "Auth",
    emoji: "🔐",
    sections: [
      { title: "Identity", content: "bonanza-auth identity --name MyAgent --scopes read,write,pay" },
      { title: "Keys", content: "Issue scoped API keys and JWTs for agent-to-agent workflows." },
      { title: "Control", content: "Keep agent permissions explicit and revocable." },
    ],
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState("");
  const [checkoutTier, setCheckoutTier] = useState("");
  const [cryptoMode, setCryptoMode] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const TIER_MAP: Record<string, string> = {
    "Go Pro": "pro",
    "$29/mo": "pro",
    "$9/mo": "pro",
    "$19/mo": "pro",
    "$15/mo": "pro",
    "$12/mo": "pro",
    "$79": "lifetime",
    "$199/mo": "enterprise",
    "Enterprise": "enterprise",
    "Pro": "pro",
  };

  const PLAN_AMOUNTS: Record<string, Record<string, string>> = {
    "FrameForge": { pro: "$29/mo", enterprise: "$199/mo" },
    "Fork Doctor": { pro: "$9/mo", lifetime: "$79" },
    "Agent Wallet": { pro: "$29/mo", enterprise: "$199/mo" },
    "Agents": { pro: "$29/mo", enterprise: "$199/mo" },
    "Search": { pro: "$19/mo" },
    "Webhooks": { pro: "$15/mo" },
    "Auth + 📊 Analytics": { pro: "$12/mo" },
  };

  const selectedAmount = PLAN_AMOUNTS[checkoutProduct]?.[checkoutTier] || "Select a paid plan";

  const handleCTA = (product: string, tier: string) => {
    if (tier === "Contact Us" || tier === "Request Setup") {
      window.open("mailto:passiveassets@proton.me?subject=Agent%20Wallet%20Setup%20-%20" + product, "_blank");
    } else if (tier === "Start Free") {
      window.open("https://github.com/c6zks4gssn-droid", "_blank");
    } else {
      setCheckoutProduct(product);
      setCheckoutTier(TIER_MAP[tier] || tier.toLowerCase());
      setCryptoMode(false);
      setShowCheckout(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#050508]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <img src="/logo-256.png" alt="Bonanza Labs" className="h-8 w-8 rounded" />
            <span className="font-bold tracking-tight">Bonanza Labs</span>
          </div>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''} md:flex items-center gap-6 text-sm text-gray-400`}>
            <a href="/firewall" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>Firewall</a>
            <a href="/products" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>Products</a>
            <a href="/gasvrij" className="hover:text-white transition text-emerald-400" onClick={() => setMenuOpen(false)}>🌱 GasVrij</a>
            <a href="/pricing" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="https://github.com/c6zks4gssn-droid" className="hover:text-white transition flex items-center gap-1" onClick={() => setMenuOpen(false)}>🐙 GitHub <span className="text-xs text-gray-600">Apache 2.0</span></a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center">
            <motion.div variants={fadeUp} custom={0} className="mb-6">
              <img src="/logo.png" alt="Bonanza Labs" className="w-32 h-32 mx-auto rounded-2xl" />
            </motion.div>
            <motion.div variants={fadeUp} custom={0.5} className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300">
              <Wallet className="w-3.5 h-3.5" /> Spending Firewall is the flagship
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="hero-title text-5xl md:text-7xl font-black tracking-tight leading-[0.95]">
              The spending firewall for AI agents
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="hero-sub mt-6 text-lg md:text-xl text-gray-400 max-w-2xl">
              Set rules, approve risky payments, block bad vendors, and audit every agent transaction before money moves.
            </motion.p>
            {/* Animated Terminal Demo */}
            <motion.div variants={fadeUp} custom={2.5} className="mt-8 w-full max-w-2xl mx-auto overflow-hidden">
              <div className="rounded-xl border border-white/10 bg-[#0d0d12] overflow-hidden shadow-2xl shadow-violet-500/5">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-2 text-xs text-gray-500 font-mono">bash</span>
                </div>
                <TerminalDemo />
              </div>
            </motion.div>
            <div className="flex items-center justify-center gap-2 md:gap-3 mt-6 text-xs text-gray-500 flex-wrap px-2">
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">🔒 Live-key safety block</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">✅ Open source</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">💳 Stripe checkout</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">🤖 Agent approval flow</span>
            </div>
            <motion.div variants={fadeUp} custom={3} className="mt-6 flex gap-3 md:gap-4 flex-wrap justify-center">
              <a href="/firewall" className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
                <Wallet className="w-4 h-4" /> See Firewall Demo
              </a>
              <a href="/firewall" className="flex items-center gap-2 border border-white/10 px-6 py-3 rounded-xl font-semibold hover:bg-white/5 transition">
                <Sparkles className="w-4 h-4" /> Open Dashboard
              </a>
              <a href="https://github.com/c6zks4gssn-droid" className="flex items-center gap-2 border border-white/10 px-6 py-3 rounded-xl font-semibold hover:bg-white/5 transition">
                🐙 GitHub
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} custom={0} className="text-violet-400 font-semibold tracking-[3px] uppercase text-sm text-center mb-4">Core products</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl font-black text-center mb-4">
              One flagship, two proof engines
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
              The Spending Firewall leads the story. Fork Doctor and FrameForge prove Bonanza can ship real tools, not mock demos.
            </motion.p>
          </motion.div>

          <div className="space-y-6">
            {PROJECTS.filter((p) => ["Agent Wallet", "Fork Doctor", "FrameForge"].includes(p.name)).sort((a, b) => ["Agent Wallet", "Fork Doctor", "FrameForge"].indexOf(a.name) - ["Agent Wallet", "Fork Doctor", "FrameForge"].indexOf(b.name)).map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 md:p-8 hover:border-white/10 transition group"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="text-5xl">{p.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl md:text-2xl font-bold">Bonanza Labs ✦ {p.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${p.color} bg-clip-text text-transparent border border-white/10`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-violet-400 font-medium text-sm mb-3">{p.tagline}</p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{p.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.features.map((f) => (
                        <span key={f} className="text-xs bg-white/5 border border-white/5 rounded-full px-3 py-1 text-gray-400">{f}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <CopyButton text={p.install} label={p.install} />
                      <a
                        href={p.repo.startsWith("http") ? p.repo : `https://github.com/c6zks4gssn-droid/${p.repo}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition"
                      >
                        🐙 View on GitHub <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Docs */}
      <section id="docs" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent" />
        <div className="relative max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300 mb-6">
              <BookOpen className="w-3.5 h-3.5" /> Documentation
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black">Get started fast</motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DOCS.map((doc, i) => (
              <motion.div
                key={doc.project}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              >
                <div className="text-3xl mb-3">{doc.emoji}</div>
                <h3 className="text-lg font-bold mb-4">{doc.project}</h3>
                <div className="space-y-4">
                  {doc.sections.map((s) => (
                    <div key={s.title}>
                      <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">{s.title}</div>
                      <p className="text-sm text-gray-400 leading-relaxed">{s.content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Wallet Demo */}
      <section id="wallet-demo" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent" />
        <div className="relative max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300 mb-6">
              <Wallet className="w-3.5 h-3.5" /> Spending Firewall demo
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black mb-4">Policy, risk, approval, and audit before payment.</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-400 max-w-2xl mx-auto">
              Agents can request money, but Bonanza evaluates policy first: allow, deny, or require approval. Live keys stay blocked until explicitly enabled.
            </motion.p>
          </motion.div>

          <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-white/[0.03] to-orange-500/10 p-6 md:p-8 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-stretch">
              {[
                ["🤖", "Agent asks", "I need to spend $9 for this task."],
                ["🧮", "Budget check", "Bonanza checks vendor, limits, and risk."],
                ["👤", "Human approval", "You approve or deny from the dashboard."],
                ["💳", "Test checkout", "Stripe Checkout is created in test mode."],
              ].map(([icon, title, body], i) => (
                <div key={title} className="relative rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="font-bold mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
                  {i < 3 && <div className="hidden md:block absolute top-1/2 -right-3 text-amber-300">→</div>}
              {i < 3 && i % 2 === 0 && <div className="md:hidden absolute -bottom-2 left-1/2 text-amber-300 text-xs">↓</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              ["1", "Budget request", "The agent asks to spend, and Bonanza checks the request against a local budget cap before anything payment-related happens."],
              ["2", "Manual approval", "A human approves or denies the request. No hidden auto-spend, no background purchase."],
              ["3", "Test checkout", "After approval, Bonanza creates a Stripe Checkout test session. Real live keys are blocked by a safety guard."],
            ].map(([step, title, body]) => (
              <div key={step} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center font-black mb-4">{step}</div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0a0a12] p-6 font-mono text-sm overflow-x-auto">
            <div className="text-gray-500 mb-2"># 1. Agent creates a budget-checked request</div>
            <div className="text-green-400">{'$ bonanza-agents wallet request --agent-id agent_demo --merchant-name "Demo" --amount 900 --budget 25'}</div>
            <div className="mt-4 text-gray-500"># 2. Human approves</div>
            <div className="text-green-400">$ bonanza-agents wallet approve lsrq_xxx</div>
            <div className="mt-4 text-gray-500"># 3. Stripe Checkout test session</div>
            <div className="text-green-400">$ bonanza-agents wallet checkout-test lsrq_xxx</div>
            <div className="mt-4 text-amber-300">✅ Policy engine verified · Stripe checkout integrated · every decision audited</div>
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              ["No silent spend", "Every paid action starts as a visible request."],
              ["Test mode first", "Stripe Checkout demo runs without moving real money."],
              ["Live key blocked", "The code refuses live Stripe keys unless explicitly enabled."],
              ["Human in loop", "Approvals are designed in, not bolted on later."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <div className="text-sm font-bold text-amber-300 mb-2">{title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLI */}
      <section id="cli" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 mb-6">
              <Terminal className="w-3.5 h-3.5" /> Install now
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black mb-4">One toolbox. Every launch.</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-400 mb-10 text-lg">
              <code className="text-violet-400">bonanza</code> — the single command for all Bonanza Labs tools.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/5 bg-[#0a0a12] p-6 font-mono text-sm"
          >
            <div className="text-gray-500 mb-2"># Install</div>
            <div className="flex items-center gap-2"><span className="text-green-400">$ pip install bonanza-labs</span><CopyButton text="pip install bonanza-labs" label="" /></div>
            <div className="mt-4 text-gray-500"># Generate a video</div>
            <div className="text-green-400">{'$ bonanza video "AI Agents Are the Future" --style viral --format 9:16'}</div>
            <div className="mt-4 text-gray-500"># Check repo health</div>
            <div className="text-green-400">$ bonanza doctor openclaw/openclaw</div>
            <div className="mt-4 text-gray-500"># Agent wallet</div>
            <div className="text-green-400">$ bonanza wallet create --chain solana --budget 100</div>
            <div className="mt-4 text-gray-500"># Check spending</div>
            <div className="text-green-400">$ bonanza wallet analytics</div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-center">Simple pricing</h2>
          <p className="text-gray-500 text-center mb-12">Start with a safe test-mode setup. Move live only after approval.</p>

          {/* Agent Wallet */}
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">💰 Agent Wallet</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {["Free|$0|1 agent · manual approval · Stripe checkout · live-key safety block|Start Free", "Go Pro|$29/mo|10 agents · approval queue · policy editor · Stripe integration · setup support|Go Pro", "Enterprise|$199/mo|Unlimited agents · custom policies · rollout support · SSO · SLA|Contact Us"].map((p, i) => {
              const [price, name, feats, cta] = p.split("|");
              const hl = i === 1;
              return (
                <div key={i} className={`rounded-2xl p-5 border ${hl ? "border-amber-500/60 bg-amber-500/5" : "border-white/5 bg-white/[0.02]"}`}>
                  {hl && <div className="text-xs font-bold text-center mb-2 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">BEST START</div>}
                  <div className="text-xl font-black">{price}</div>
                  <div className="text-sm text-gray-500 mb-3">{name}</div>
                  <div className="text-xs text-gray-600 mb-4">{feats.split("·").map(f => f.trim()).join(" • ")}</div>
                  <button onClick={() => handleCTA("Agent Wallet", cta)} className={`w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${hl ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}>{cta}</button>
                </div>
              );
            })}
          </div>

          {/* FrameForge */}
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">🎬 FrameForge</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {["Free|$0|5 videos/mo · 720p · 2 styles|Start Free", "$29/mo|Pro|50 videos · 1080p · All styles · Voice cloning · No watermark|Go Pro", "$199/mo|Enterprise|Unlimited · 4K · API · Custom templates|Contact Us"].map((p, i) => {
              const [price, name, feats, cta] = p.split("|");
              const hl = i === 1;
              return (
                <div key={i} className={`rounded-2xl p-5 border ${hl ? "border-violet-500/50 bg-violet-500/5" : "border-white/5 bg-white/[0.02]"}`}>
                  {hl && <div className="text-xs font-bold text-center mb-2 bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">POPULAR</div>}
                  <div className="text-xl font-black">{price}</div>
                  <div className="text-sm text-gray-500 mb-3">{name}</div>
                  <div className="text-xs text-gray-600 mb-4">{feats.split("·").map(f => f.trim()).join(" • ")}</div>
                  <button onClick={() => handleCTA("FrameForge", cta)} className={`w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${hl ? "bg-gradient-to-r from-violet-500 to-cyan-500" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}>{cta}</button>
                </div>
              );
            })}
          </div>

          {/* Fork Doctor */}
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">🩺 Fork Doctor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-12">
            {["Free|$0|5 checks/day · JSON · Public repos|Start Free", "$9/mo|Pro|Unlimited · All formats · Private repos · Auto-fix|Go Pro"].map((p, i) => {
              const [price, name, feats, cta] = p.split("|");
              const hl = i === 1;
              return (
                <div key={i} className={`rounded-2xl p-5 border ${hl ? "border-violet-500/50 bg-violet-500/5" : "border-white/5 bg-white/[0.02]"}`}>
                  {hl && <div className="text-xs font-bold text-center mb-2 bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">POPULAR</div>}
                  <div className="text-xl font-black">{price}</div>
                  <div className="text-sm text-gray-500 mb-3">{name}</div>
                  <div className="text-xs text-gray-600 mb-4">{feats.split("·").map(f => f.trim()).join(" • ")}</div>
                  <button onClick={() => handleCTA("Fork Doctor", cta)} className={`w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${hl ? "bg-gradient-to-r from-violet-500 to-cyan-500" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}>{cta}</button>
                </div>
              );
            })}
          </div>

          {/* Agents */}
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">🤖 Agents</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {["Free|$0|1 agent · Basic tools · 10 tasks/day|Start Free", "$29/mo|Pro|10 agents · All tools · Workflows · API|Go Pro", "$199/mo|Enterprise|Unlimited · Custom models · SSO · SLA|Contact Us"].map((p, i) => {
              const [price, name, feats, cta] = p.split("|");
              const hl = i === 1;
              return (
                <div key={i} className={`rounded-2xl p-5 border ${hl ? "border-violet-500/50 bg-violet-500/5" : "border-white/5 bg-white/[0.02]"}`}>
                  {hl && <div className="text-xs font-bold text-center mb-2 bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">POPULAR</div>}
                  <div className="text-xl font-black">{price}</div>
                  <div className="text-sm text-gray-500 mb-3">{name}</div>
                  <div className="text-xs text-gray-600 mb-4">{feats.split("·").map(f => f.trim()).join(" • ")}</div>
                  <button onClick={() => handleCTA("Agents", cta)} className={`w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${hl ? "bg-gradient-to-r from-violet-500 to-cyan-500" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}>{cta}</button>
                </div>
              );
            })}
          </div>

          {/* Search */}
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">🔍 Search</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-12">
            {["Free|$0|100 searches/day · DuckDuckGo · Caching|Start Free", "$9/mo|Pro|Unlimited · All providers · Extract · API|Go Pro"].map((p, i) => {
              const [price, name, feats, cta] = p.split("|");
              const hl = i === 1;
              return (
                <div key={i} className={`rounded-2xl p-5 border ${hl ? "border-violet-500/50 bg-violet-500/5" : "border-white/5 bg-white/[0.02]"}`}>
                  {hl && <div className="text-xs font-bold text-center mb-2 bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">POPULAR</div>}
                  <div className="text-xl font-black">{price}</div>
                  <div className="text-sm text-gray-500 mb-3">{name}</div>
                  <div className="text-xs text-gray-600 mb-4">{feats.split("·").map(f => f.trim()).join(" • ")}</div>
                  <button onClick={() => handleCTA("Search", cta)} className={`w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${hl ? "bg-gradient-to-r from-violet-500 to-cyan-500" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}>{cta}</button>
                </div>
              );
            })}
          </div>

          {/* Webhooks */}
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">📡 Webhooks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-12">
            {["Free|$0|3 endpoints · Basic events|Start Free", "$15/mo|Pro|Unlimited · HMAC · Rules · Agent triggers|Go Pro"].map((p, i) => {
              const [price, name, feats, cta] = p.split("|");
              const hl = i === 1;
              return (
                <div key={i} className={`rounded-2xl p-5 border ${hl ? "border-violet-500/50 bg-violet-500/5" : "border-white/5 bg-white/[0.02]"}`}>
                  {hl && <div className="text-xs font-bold text-center mb-2 bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">POPULAR</div>}
                  <div className="text-xl font-black">{price}</div>
                  <div className="text-sm text-gray-500 mb-3">{name}</div>
                  <div className="text-xs text-gray-600 mb-4">{feats.split("·").map(f => f.trim()).join(" • ")}</div>
                  <button onClick={() => handleCTA("Webhooks", cta)} className={`w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${hl ? "bg-gradient-to-r from-violet-500 to-cyan-500" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}>{cta}</button>
                </div>
              );
            })}
          </div>

          {/* Auth + Analytics */}
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">🔐 Auth + 📊 Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-12">
            {["Free|$0|1 agent identity · Basic analytics|Start Free", "$12/mo|Pro|Unlimited · JWT · API keys · AI insights|Go Pro"].map((p, i) => {
              const [price, name, feats, cta] = p.split("|");
              const hl = i === 1;
              return (
                <div key={i} className={`rounded-2xl p-5 border ${hl ? "border-violet-500/50 bg-violet-500/5" : "border-white/5 bg-white/[0.02]"}`}>
                  {hl && <div className="text-xs font-bold text-center mb-2 bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">POPULAR</div>}
                  <div className="text-xl font-black">{price}</div>
                  <div className="text-sm text-gray-500 mb-3">{name}</div>
                  <div className="text-xs text-gray-600 mb-4">{feats.split("·").map(f => f.trim()).join(" • ")}</div>
                  <button onClick={() => handleCTA("Auth + Analytics", cta)} className={`w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${hl ? "bg-gradient-to-r from-violet-500 to-cyan-500" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}>{cta}</button>
                </div>
              );
            })}
          </div>

          {/* Crypto */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 md:p-8 text-center">
            <h3 className="text-xl font-bold mb-2">🪙 Pay with Stablecoins</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">USDC & USDT on Solana & Base. Choose crypto inside checkout to see the exact plan amount and wallet addresses.</p>
            <button className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-sm font-medium hover:opacity-90 transition" onClick={() => { setCheckoutProduct("Stablecoins"); setCheckoutTier("Crypto"); setCryptoMode(true); setShowCheckout(true); }}>Pay with Crypto →</button>
          </div>
        </div>
      </section>

      {/* About */}
      {/* Social Proof */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <div className="text-2xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Live</div>
              <div className="text-xs text-gray-500 mt-1">Stripe Checkout</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <div className="text-2xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">12</div>
              <div className="text-xs text-gray-500 mt-1">CLI Tools</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <div className="text-2xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">20+</div>
              <div className="text-xs text-gray-500 mt-1">GitHub Repos</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <div className="text-2xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">0</div>
              <div className="text-xs text-gray-500 mt-1">Vendor Lock-in</div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/5 to-cyan-500/5 p-5 md:p-8 mb-8">
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              Bonanza Labs is being built in the open: repo health checks, video tooling, agent payments and web automation packaged into simple developer-first tools.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center font-bold">B</div>
              <div>
                <div className="font-semibold text-sm">Bonanza Labs Team</div>
                <div className="text-xs text-gray-500">Built in public</div>
              </div>
            </div>
          </div>

          {/* Real Outputs */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-center">Verified build signals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="text-xs text-gray-500 mb-2">fork-doctor</div>
                <div className="font-mono text-sm text-green-400">13/13 checks passed</div>
                <div className="text-xs text-gray-500 mt-1">→ PR #51 on Vibe-Trading</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="text-xs text-gray-500 mb-2">bonanza video</div>
                <div className="font-mono text-sm text-green-400">51.7s animation rendered</div>
                <div className="text-xs text-gray-500 mt-1">→ Bonanza Labs promo video</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="text-xs text-gray-500 mb-2">bonanza wallet</div>
                <div className="font-mono text-sm text-green-400">Solana + Base addresses live</div>
                <div className="text-xs text-gray-500 mt-1">→ Manual stablecoin payment path</div>
              </div>
            </div>
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

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowCheckout(false)}>
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 md:p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{cryptoMode ? "🪙 Pay with Crypto" : `💳 ${checkoutProduct} ${checkoutTier}`}</h3>
              <button onClick={() => setShowCheckout(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {cryptoMode ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 p-4">
                  <div className="text-sm text-gray-500 mb-2">Solana — USDC/USDT</div>
                  <div className="text-xs font-mono text-cyan-400 break-all bg-white/5 rounded-lg p-3">EAvw5tJEVjLn9TYLdHrY1J5F7RgJwdnvEiVE8wMXCUz4</div>
                </div>
                <div className="rounded-xl border border-white/10 p-4">
                  <div className="text-sm text-gray-500 mb-2">Base — USDC/USDT</div>
                  <div className="text-xs font-mono text-cyan-400 break-all bg-white/5 rounded-lg p-3">0x9398F142eB443C8e976c6ec9A27dEa3bA16Eab26</div>
                </div>
                <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
                  <div className="text-sm text-gray-400 mb-1">Selected plan</div>
                  <div className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">{checkoutProduct} · {checkoutTier} · {selectedAmount}</div>
                </div>
                <p className="text-xs text-gray-600">Send exactly {selectedAmount} in USDC/USDT and email your transaction hash to passiveassets@proton.me so access can be activated.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
                  <div className="text-sm text-gray-400 mb-1">{checkoutProduct} · {checkoutTier}</div>
                  <div className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">{checkoutLoading ? 'Creating checkout...' : 'Secure checkout with Stripe'}</div>
                </div>
                <button
                  onClick={async () => {
                    setCheckoutLoading(true);
                    try {
                      const productSlug = checkoutProduct.toLowerCase().replace(/ /g, '-');
                      const tierSlug = checkoutTier.toLowerCase();
                      const res = await fetch('/api/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ product: productSlug, tier: tierSlug }),
                      });
                      const data = await res.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        alert(data.error || 'Checkout failed');
                      }
                    } catch (e) {
                      alert('Something went wrong. Please try again.');
                    } finally {
                      setCheckoutLoading(false);
                    }
                  }}
                  disabled={checkoutLoading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {checkoutLoading ? '⏳ Redirecting...' : '💳 Pay with Stripe'}
                </button>
                <button onClick={() => setCryptoMode(true)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition">
                  🪙 Pay with Crypto
                </button>
                <div className="text-center">
                  <a href="https://github.com/c6zks4gssn-droid" target="_blank" className="text-xs text-gray-600 hover:text-white transition">Or start free on GitHub →</a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}