"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Eye,
  Zap,
  Send,
  BarChart3,
  Shield,
  Clock,
  ArrowRight,
  Check,
  Star,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Target,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function BriefDemo() {
  const brief = `📊 What Changed
  • Competitor A dropped Pro plan from $79 → $59 (-25%)
  • Competitor B added "AI summaries" feature on /pro page

👀 New Signals
  • Competitor A is hiring Senior ML Engineer (Greenhouse)
  • Competitor C got featured on ProductHunt (342 upvotes)
  • Competitor B's CEO tweeted about "enterprise pivot"

🎯 What You Should Do
  → Consider matching or undercutting the $59 price point
  → Add AI summaries to your roadmap if not planned
  → Double down on indie positioning — they're leaving this segment

📈 Trend
  Competitor A: accelerating (hiring + price cut = aggressive)
  Competitor B: pivoting (enterprise signals = segment shift)
  Competitor C: peaking (PH launch = attention spike)`;

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 font-mono text-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-gray-500 text-xs">
          bonanza-intel • Daily Brief — 7:00 AM CET
        </span>
      </div>
      <pre className="text-green-400/90 whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
        {expanded ? brief : brief.slice(0, 280) + "..."}
      </pre>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-blue-400 hover:text-blue-300 text-xs transition-colors"
      >
        {expanded ? "← Show less" : "Read full brief →"}
      </button>
    </div>
  );
}

const plans = [
  {
    name: "Scout",
    price: "€29",
    period: "/mo",
    competitors: "3",
    features: [
      "Daily brief via Telegram",
      "Price change alerts",
      "New page/feature detection",
      "Job posting monitoring",
      "3-day free trial",
    ],
    cta: "Join Early Access",
    popular: false,
  },
  {
    name: "Pro",
    price: "€79",
    period: "/mo",
    competitors: "10",
    features: [
      "Everything in Scout",
      "Deep dive analysis (/deep)",
      "Trend analysis & forecasts",
      "Social media monitoring",
      "Review tracking",
      "Priority alerts",
    ],
    cta: "Join Early Access",
    popular: true,
  },
  {
    name: "Agency",
    price: "€199",
    period: "/mo",
    competitors: "50",
    features: [
      "Everything in Pro",
      "White-label briefs",
      "API access",
      "Custom data sources",
      "Dedicated support",
      "Team accounts (5 seats)",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

const sources = [
  { icon: BarChart3, label: "Pricing pages", desc: "Track every price change" },
  { icon: Eye, label: "Website pages", desc: "New, removed, or changed pages" },
  { icon: Target, label: "Job postings", desc: "Hiring signals = growth intent" },
  { icon: MessageSquare, label: "Social media", desc: "Tweets, Reddit, PH launches" },
  { icon: Star, label: "Reviews", desc: "G2, Capterra, Trustpilot shifts" },
  { icon: TrendingUp, label: "SEO & Ads", desc: "Ranking changes, ad spend" },
];

export default function IntelPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-lg font-bold tracking-tight">
            BONANZA<span className="text-blue-500">.</span>LABS
          </a>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a
              href="/#products"
              className="hover:text-white transition-colors"
            >
              Products
            </a>
            <a href="/intel" className="text-white font-medium">
              Intel
            </a>
            <a
              href="/pricing"
              className="hover:text-white transition-colors"
            >
              Pricing
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mb-6"
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                <Zap className="w-3 h-3" />
                NEW — Competitive Intelligence for Indie Founders
              </span>
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Your competitors don&apos;t sleep.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Neither do we.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Daily competitive intelligence briefs delivered to your Telegram.
            No dashboards. No enterprise pricing. Just the signals that matter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="https://t.me/BonanzaIntel_bot"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
            >
              <Send className="w-4 h-4" />
              Join Early Access
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg font-medium transition-colors text-gray-300"
            >
              See How It Works
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-xs text-gray-600"
          >
            Early access · No credit card · Cancel anytime
          </motion.p>
        </div>
      </section>

      {/* Brief Preview */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <BriefDemo />
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 px-6 bg-gray-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Intelligence on autopilot
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Set it up once. Get actionable intelligence every morning. No
              dashboards to check, no reports to dig through.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Add your competitors",
                desc: "Drop up to 5 URLs. For example: /add https://crayon.com Crayon",
                icon: Target,
              },
              {
                step: "2",
                title: "We watch while you build",
                desc: "Daily scans of pricing, pages, jobs, social posts, reviews, and SEO changes.",
                icon: Eye,
              },
              {
                step: "3",
                title: "Brief at 7am",
                desc: "Action-ready intelligence in your Telegram. What changed, what it means, what to do.",
                icon: Clock,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="relative p-8 rounded-2xl bg-gray-900/50 border border-gray-800/50 hover:border-gray-700/50 transition-colors"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <item.icon className="w-6 h-6 text-blue-400 mb-4 mt-2" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Six intelligence layers
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              We monitor what matters so you don&apos;t have to open six tabs
              every morning.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sources.map((s, i) => (
              <motion.div
                key={s.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="p-6 rounded-xl bg-gray-900/30 border border-gray-800/30 hover:border-gray-700/50 transition-colors group"
              >
                <s.icon className="w-5 h-5 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">{s.label}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-24 px-6 bg-gray-950/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Not another dashboard
            </h2>
            <p className="text-gray-400">
              Competitive intel tools are built for enterprise teams with
              enterprise budgets. We built for you.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">
                    Feature
                  </th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">
                    Crayon / Klue
                  </th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">
                    Browse AI
                  </th>
                  <th className="text-center py-3 px-4 text-blue-400 font-bold">
                    Bonanza Intel
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Price", "$149-500+/mo", "$49+/mo", "€29/mo"],
                  ["Setup time", "Weeks", "Minutes", "5 minutes"],
                  ["Delivery", "Dashboard", "Email", "Telegram"],
                  ["Action recs", "❌", "❌", "✅"],
                  ["Indie-friendly", "❌", "Sorta", "✅"],
                  ["EU-first", "❌", "❌", "✅"],
                ].map(([feature, crayon, browse, us]) => (
                  <tr
                    key={feature}
                    className="border-b border-gray-800/50 hover:bg-gray-900/30"
                  >
                    <td className="py-3 px-4 font-medium">{feature}</td>
                    <td className="py-3 px-4 text-center text-gray-500">
                      {crayon}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-500">
                      {browse}
                    </td>
                    <td className="py-3 px-4 text-center text-blue-400 font-medium">
                      {us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Indie pricing, not enterprise pricing
            </h2>
            <p className="text-gray-400">
              Early access now · Founding pricing · Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className={`relative p-8 rounded-2xl border ${
                  plan.popular
                    ? "bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/20"
                    : "bg-gray-900/50 border-gray-800/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 rounded-full text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Up to {plan.competitors} competitors
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-gray-300"
                    >
                      <Check className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://t.me/BonanzaIntel_bot"
                  className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-gray-950/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Questions?
          </h2>
          {[
            {
              q: "When can I start using Bonanza Intel?",
              a: "We're onboarding early access users now. Join via our Telegram bot and you'll get access within days — plus founding pricing when we launch publicly.",
            },
            {
              q: "How does the free trial work?",
              a: "Early access users get a free trial with 1 competitor. After the trial, Scout plan starts at €29/mo for 3 competitors.",
            },
            {
              q: "What if my competitor's site blocks scrapers?",
              a: "We use stealth browser technology (not simple HTTP requests) that handles Cloudflare, CAPTCHAs, and most anti-bot protections. If we can't monitor a site, we'll let you know.",
            },
            {
              q: "Can I customize what gets monitored?",
              a: "Yes. You can set alert thresholds (e.g., price drops >10%), focus areas, and how frequently you want updates. Pro and Agency plans get full customization.",
            },
            {
              q: "Is my data safe?",
              a: "We're EU-first: GDPR compliant, data stored in the EU, and we never share your competitor list or briefs with anyone. Your intelligence is yours.",
            },
            {
              q: "Do you support Slack or email delivery?",
              a: "Currently Telegram only — it's where indie builders live. Slack is on the roadmap. Email digests are available on Agency plans.",
            },
          ].map((faq) => (
            <details
              key={faq.q}
              className="group border-b border-gray-800/50 py-4"
            >
              <summary className="flex items-center justify-between cursor-pointer text-sm font-medium hover:text-blue-400 transition-colors list-none">
                {faq.q}
                <span className="text-gray-600 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stop guessing. Start knowing.
            </h2>
            <p className="text-gray-400 mb-8">
              Your competitors are shipping, hiring, and pricing. Get the
              signals — every morning, in your Telegram.
            </p>
            <a
              href="https://t.me/BonanzaIntel_bot"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium text-lg transition-colors"
            >
              <Send className="w-5 h-5" />
              Join Early Access
            </a>
            <p className="mt-4 text-xs text-gray-600">
              Early access · €29/mo after trial · Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800/50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <span>
            © {new Date().getFullYear()} Bonanza Labs
          </span>
          <div className="flex items-center gap-6">
            <a
              href="https://bonanza-labs.com"
              className="hover:text-gray-400 transition-colors"
            >
              Home
            </a>
            <a
              href="/intel"
              className="hover:text-gray-400 transition-colors"
            >
              Intel
            </a>
            <a
              href="https://github.com/c6zks4gssn-droid"
              className="hover:text-gray-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://x.com/bonanzalabs"
              className="hover:text-gray-400 transition-colors"
            >
              X
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}