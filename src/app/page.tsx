"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Zap, Video, Wallet, Stethoscope, Terminal, ArrowRight, Sparkles, ExternalLink, Check, Copy, BookOpen } from "lucide-react";
import Link from "next/link";

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
    status: "v0.1.0",
    color: "from-emerald-500 to-teal-500",
    features: ["13 health checks", "CI/CD detection", "Security scanning", "SBOM generation", "pip install fork-doctor"],
    install: "pip install fork-doctor",
    demo: false,
  },
  {
    name: "Agent Wallet",
    emoji: "💰",
    tagline: "AI Payment Infrastructure",
    desc: "Policy-based wallets for AI agents. Auto-approve under $X, human approval above. Multi-chain, dashboard, spending analytics.",
    repo: "bonanza-labs-agent-wallet",
    status: "v0.1.0",
    color: "from-amber-500 to-orange-500",
    features: ["Policy engine", "Spending caps", "Human approval flow", "Multi-chain (Solana, BSC)", "REST API + CLI"],
    install: "pip install agent-wallet",
    demo: false,
  },
];

const DOCS = [
  {
    project: "FrameForge",
    emoji: "🎬",
    sections: [
      { title: "Quick Start", content: "pip install bonanza-labs[video] && bonanza video 'My Topic' --style viral --format 9:16" },
      { title: "Styles", content: "corporate, product, viral, explainer — each with unique colors, pacing and voice" },
      { title: "Formats", content: "16:9 (YouTube), 9:16 (TikTok/Reels), 1:1 (LinkedIn)" },
      { title: "Voice", content: "Edge-TTS with 100+ voices. Default: en-US-AriaNeural" },
    ],
  },
  {
    project: "Fork Doctor",
    emoji: "🩺",
    sections: [
      { title: "Install", content: "pip install fork-doctor && fork-doctor openclaw/openclaw" },
      { title: "13 Checks", content: "CI/CD, Security, SBOM, Dev Container, License, Readme, Contributing, Changelog, Tests, Linting, Type hints, Dependencies, API docs" },
      { title: "Output", content: "JSON, Markdown or terminal table with pass/fail per check" },
    ],
  },
  {
    project: "Agent Wallet",
    emoji: "💰",
    sections: [
      { title: "Install", content: "pip install agent-wallet && agent-wallet create --name MyAgent --chain solana" },
      { title: "Policy Engine", content: "YAML-based rules: auto-approve under $X, human approval above, daily/monthly limits, cooldowns" },
      { title: "REST API", content: "FastAPI with 6 endpoints: create wallet, list, pay, approve, settle, analytics" },
      { title: "Chains", content: "Solana, BSC, Base — USDC/USD1 settlements" },
    ],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#050508]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧨</span>
            <span className="font-bold tracking-tight">Bonanza Labs</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#projects" className="hover:text-white transition">Projects</a>
            <a href="#docs" className="hover:text-white transition">Docs</a>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="https://github.com/c6zks4gssn-droid" className="hover:text-white transition flex items-center gap-1">🐙 GitHub</a>
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
            <motion.div variants={fadeUp} custom={0} className="text-6xl mb-6">🧨</motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]">
              Bonanza Labs
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-6 text-xl text-gray-400 max-w-xl">
              Open source AI tools for builders. Video generation, repo health, agent payments — all open, all free.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex gap-4 flex-wrap justify-center">
              <a href="#projects" className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
                <Sparkles className="w-4 h-4" /> View Projects
              </a>
              <a href="#docs" className="flex items-center gap-2 border border-white/10 px-6 py-3 rounded-xl font-semibold hover:bg-white/5 transition">
                <BookOpen className="w-4 h-4" /> Docs
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
            <motion.p variants={fadeUp} custom={0} className="text-violet-400 font-semibold tracking-[3px] uppercase text-sm text-center mb-4">Projects</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl font-black text-center mb-16">
              Built in the open
            </motion.h2>
          </motion.div>

          <div className="space-y-6">
            {PROJECTS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 hover:border-white/10 transition group"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="text-5xl">{p.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-2xl font-bold">Bonanza Labs ✦ {p.name}</h3>
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
                        href={`https://github.com/c6zks4gssn-droid/${p.repo}`}
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
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl font-black">Get started fast</motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
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

      {/* CLI */}
      <section id="cli" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 mb-6">
              <Terminal className="w-3.5 h-3.5" /> Coming Soon
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl font-black mb-4">One CLI. Every tool.</motion.h2>
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
            <div className="text-green-400">$ bonanza video "AI Agents Are the Future" --style viral --format 9:16</div>
            <div className="mt-4 text-gray-500"># Check repo health</div>
            <div className="text-green-400">$ bonanza doctor openclaw/openclaw</div>
            <div className="mt-4 text-gray-500"># Agent wallet</div>
            <div className="text-green-400">$ bonanza wallet create --chain solana --budget 100</div>
            <div className="mt-4 text-gray-500"># Check spending</div>
            <div className="text-green-400">$ bonanza wallet analytics</div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">Why Bonanza Labs?</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            We believe AI tools should be open, accessible, and composable. Every project is open source under Apache 2.0. No vendor lock-in. No hidden costs. Just code that works.
          </p>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">5</div>
              <div className="text-sm text-gray-500 mt-1">Projects</div>
            </div>
            <div>
              <div className="text-3xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">3</div>
              <div className="text-sm text-gray-500 mt-1">Active</div>
            </div>
            <div>
              <div className="text-3xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">∞</div>
              <div className="text-sm text-gray-500 mt-1">Open Source</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧨</span>
            <span className="font-bold">Bonanza Labs</span>
          </div>
          <p className="text-sm text-gray-600">© 2026 Bonanza Labs — Open source AI tools for builders</p>
          <a href="https://github.com/c6zks4gssn-droid" className="text-sm text-gray-600 hover:text-white transition flex items-center gap-1">🐙 GitHub</a>
        </div>
      </footer>
    </main>
  );
}