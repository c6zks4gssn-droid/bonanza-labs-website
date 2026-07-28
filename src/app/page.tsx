"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Menu, Check, Sparkles, ArrowRight } from "lucide-react";

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

const problems = [
  {
    icon: "📱",
    title: "WhatsApp-chaos bij offertes en opvolging",
    desc: "Berichten kwijt, geen overzicht, late antwoorden kosten klanten.",
  },
  {
    icon: "📞",
    title: "Gemiste reserveringen en telefoontjes",
    desc: "Elke gemiste oproep is een klant die ergens anders boekt.",
  },
  {
    icon: "📋",
    title: "Handmatige administratie kost uren",
    desc: "Offertes maken, bevestigen, herinneren — allemaal handwerk dat eigenlijk automatisch kan.",
  },
];

const products = [
  {
    name: "TradeFlow",
    emoji: "🔧",
    promise: "Van aanvraag naar offerte en opvolging zonder WhatsApp-chaos.",
    features: [
      "Conversiegerichte website",
      "Intake- en offerteformulieren",
      "AI-offertegenerator",
      "WhatsApp-opvolging",
      "Leadpipeline en CRM",
      "Dashboard met aanvragen",
    ],
    price: "Vanaf €2.500",
    color: "from-violet-500 to-cyan-500",
    href: "/tradeflow",
  },
  {
    name: "ServeFlow",
    emoji: "🍽️",
    promise: "Minder gemiste reserveringen, telefoontjes en no-shows.",
    features: [
      "Online reserveringen",
      "WhatsApp-bevestigingen",
      "No-showpreventie",
      "Reviewverzoeken",
      "Digitale menukaart",
      "Lokale vindbaarheid",
    ],
    price: "Vanaf €2.500",
    color: "from-amber-500 to-orange-500",
    href: "/serveflow",
  },
  {
    name: "Bonanza Voice",
    emoji: "🎙️",
    promise: "Iedere oproep professioneel beantwoorden, ook wanneer niemand beschikbaar is.",
    features: [
      "AI-telefonie",
      "Afspraken en reserveringen registreren",
      "Veelgestelde vragen beantwoorden",
      "Gesprekssamenvattingen",
      "Doorverbinden naar medewerkers",
      "WhatsApp voice en follow-up",
    ],
    price: "Vanaf €1.495",
    note: "Ook beschikbaar als add-on voor TradeFlow en ServeFlow",
    color: "from-emerald-500 to-teal-500",
    href: "/bonanza-voice",
  },
];

const assessmentSteps = [
  {
    icon: "📋",
    title: "We analyseren je processen",
    desc: "In een gesprek van 60 minuten brengen we knelpunten en kansen in kaart.",
  },
  {
    icon: "📊",
    title: "Je krijgt een rapport met prioriteiten",
    desc: "Duidelijke actielijst met verwachte besparing en ROI.",
  },
  {
    icon: "🎯",
    title: "Je weet precies wat automatisering oplevert",
    desc: "Geen vage beloftes, maar concrete cijfers.",
  },
];

const werkwijzeSteps = [
  {
    num: "1",
    icon: "🔍",
    title: "Analyse",
    desc: "We analyseren je processen en knelpunten.",
  },
  {
    num: "2",
    icon: "📐",
    title: "Ontwerp",
    desc: "We ontwerpen een systeem dat past bij jouw bedrijfsvoering.",
  },
  {
    num: "3",
    icon: "⚙️",
    title: "Implementatie",
    desc: "We bouwen en installeren alles. Live in 2-4 weken.",
  },
  {
    num: "4",
    icon: "📈",
    title: "Optimalisatie",
    desc: "Maandelijkse beheer en verbetering.",
  },
];

const portfolioItems = [
  {
    emoji: "🛍️",
    name: "SilverJStore",
    desc: "925 zilveren sieraden webshop met Stripe en Solana Pay betalingen.",
  },
  {
    emoji: "💧",
    name: "OsmoseWaters",
    desc: "Onafhankelijke waterfilter vergelijkingssite met affiliate integraties.",
  },
  {
    emoji: "🎮",
    name: "JJ Brothers",
    desc: "Roblox game met 10 werelden en AI content productiepipeline.",
  },
];

const pricingRows = [
  { label: "Flow Assessment", value: "€497 / €999" },
  { label: "TradeFlow implementatie", value: "vanaf €2.500" },
  { label: "ServeFlow implementatie", value: "vanaf €2.500" },
  { label: "Bonanza Voice implementatie", value: "vanaf €1.495" },
  { label: "Beheer en optimalisatie", value: "vanaf €197 per maand" },
  { label: "Telefonie en AI-verbruik", value: "apart op basis van gebruik" },
];

const faqItems = [
  {
    q: "Voor welke bedrijven is BonanzaLabs?",
    a: "Voor Nederlandse MKB-bedrijven in bouw, installatie, horeca en zakelijke dienstverlening met 2-50 medewerkers.",
  },
  {
    q: "Hoe lang duurt een implementatie?",
    a: "Na de Flow Assessment zijn we meestal binnen 2-4 weken live.",
  },
  {
    q: "Moet ik alles in één keer doen?",
    a: "Nee. Je kunt starten met één product en later uitbreiden.",
  },
  {
    q: "Wat als het niet werkt?",
    a: "Tijdens de Flow Assessment benoemen we expliciet wat we kunnen oplossen. Doen we het niet, dan zeggen we het.",
  },
  {
    q: "Werken jullie ook met bestaande systemen?",
    a: "Ja. We integreren met je huidige website, agenda, WhatsApp en boekhouding.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#050508]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between relative">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-256.png" alt="BonanzaLabs" className="h-8 w-8 rounded" />
            <span className="font-bold tracking-tight">BonanzaLabs</span>
          </Link>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div
            className={`nav-links ${menuOpen ? "open" : ""} md:flex items-center gap-6 text-sm text-gray-400`}
          >
            <a href="#problemen" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>
              Problemen
            </a>
            <a href="#oplossingen" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>
              Oplossingen
            </a>
            <a href="#werkwijze" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>
              Werkwijze
            </a>
            <a href="#portfolio" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>
              Portfolio
            </a>
            <a href="#faq" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>
              FAQ
            </a>
            <Link
              href="/pricing"
              className="bg-[#2563EB] px-4 py-1.5 rounded-lg font-semibold text-white hover:bg-[#1D4ED8] transition"
              onClick={() => setMenuOpen(false)}
            >
              Flow Assessment
            </Link>
          </div>
        </div>
      </nav>

      {/* Sectie 1 — Hero */}
      <section className="relative pt-36 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center">
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300"
            >
              <Sparkles className="w-3.5 h-3.5" /> Praktische automatisering voor het MKB
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05]"
            >
              Minder handwerk. Snellere opvolging. Meer omzet.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl"
            >
              BonanzaLabs bouwt praktische automatiseringssystemen voor horeca, bouw, installatie en zakelijke dienstverlening.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-8 flex gap-3 md:gap-4 flex-wrap justify-center"
            >
              <Link
                href="/pricing"
                className="flex items-center gap-2 bg-[#2563EB] px-6 py-3 rounded-xl font-semibold hover:bg-[#1D4ED8] transition"
              >
                Boek een Flow Assessment <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#oplossingen"
                className="flex items-center gap-2 border border-white/10 px-6 py-3 rounded-xl font-semibold hover:bg-white/5 transition"
              >
                Bekijk onze oplossingen
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sectie 2 — Herkenbare problemen */}
      <section id="problemen" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="text-blue-400 font-semibold tracking-[3px] uppercase text-sm mb-4">
              Herkenbaar?
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black">
              Drie problemen die omzet kosten
            </motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition"
              >
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectie 3 — Oplossingen */}
      <section id="oplossingen" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="text-blue-400 font-semibold tracking-[3px] uppercase text-sm mb-4">
              Onze oplossingen
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black">
              Drie systemen, één partner
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-center max-w-2xl mx-auto mt-4">
              TradeFlow voor bouw & installatie. ServeFlow voor horeca. Bonanza Voice voor AI-telefonie. Wij bouwen, jij groeit.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition group flex flex-col"
              >
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className={`text-xl font-bold mb-1 bg-gradient-to-r ${p.color} bg-clip-text text-transparent`}>
                  {p.name}
                </h3>
                <p className="text-sm font-medium text-blue-400 mb-4">{p.promise}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                      <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-bold bg-gradient-to-r ${p.color} bg-clip-text text-transparent`}>
                    {p.price}
                  </span>
                </div>
                {p.note && (
                  <p className="text-xs text-gray-500 mb-3 italic">{p.note}</p>
                )}
                <Link
                  href={p.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition mt-auto"
                >
                  Bekijk details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectie 4 — Flow Assessment */}
      <section id="assessment" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent" />
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="text-blue-400 font-semibold tracking-[3px] uppercase text-sm mb-4">
              Flow Assessment
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black">
              Eerst begrijpen we wat er echt mis gaat.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {assessmentSteps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-lg font-semibold text-white mb-2">
              Flow Assessment — €497 introductie / €999 standaard
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-[#2563EB] px-8 py-4 rounded-xl font-semibold hover:bg-[#1D4ED8] transition mt-4"
            >
              Boek een Flow Assessment <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sectie 5 — Werkwijze */}
      <section id="werkwijze" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="text-blue-400 font-semibold tracking-[3px] uppercase text-sm mb-4">
              Werkwijze
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black">
              Hoe wij werken
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {werkwijzeSteps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center font-black">
                    {s.num}
                  </div>
                  <div className="text-2xl">{s.icon}</div>
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectie 6 — Portfolio */}
      <section id="portfolio" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="text-blue-400 font-semibold tracking-[3px] uppercase text-sm mb-4">
              Portfolio
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black">
              Zelf gebouwd, zelf gelanceerd.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioItems.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition"
              >
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className="text-lg font-bold mb-2">{p.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectie 7 — Prijsindicaties */}
      <section id="prijzen" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="text-blue-400 font-semibold tracking-[3px] uppercase text-sm mb-4">
              Prijzen
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black">
              Prijsindicaties
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
          >
            <table className="w-full text-left">
              <tbody>
                {pricingRows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 0 ? "bg-white/[0.02]" : ""}
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">{row.label}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white text-right">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Exacte prijs na Flow Assessment. Geen verrassingen.
          </p>
        </div>
      </section>

      {/* Sectie 8 — FAQ */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="text-blue-400 font-semibold tracking-[3px] uppercase text-sm mb-4">
              Veelgestelde vragen
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black">
              FAQ
            </motion.h2>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 group"
              >
                <summary className="cursor-pointer font-semibold text-white flex items-center justify-between list-none">
                  {item.q}
                  <span className="text-blue-400 group-open:rotate-180 transition-transform">⌄</span>
                </summary>
                <p className="mt-4 text-sm text-gray-400 leading-relaxed">{item.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Sectie 9 — Afsluitende CTA */}
      <section id="cta" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-black mb-4">
              Klaar voor minder handwerk?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-gray-400 mb-8 text-lg">
              Boek een Flow Assessment. In 60 minuten weet je wat automatisering jou oplevert.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-[#2563EB] px-8 py-4 rounded-xl font-semibold hover:bg-[#1D4ED8] transition"
              >
                Boek een Flow Assessment <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <img src="/logo-256.png" alt="BonanzaLabs" className="h-8 w-8 rounded mb-4" />
              <p className="text-sm text-gray-500 leading-relaxed">
                Praktische automatiseringssystemen voor horeca, bouw, installatie en zakelijke dienstverlening.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Oplossingen</h4>
              <ul className="space-y-2.5">
                <li><Link href="/tradeflow" className="text-sm text-gray-500 hover:text-white transition">🔧 TradeFlow</Link></li>
                <li><Link href="/serveflow" className="text-sm text-gray-500 hover:text-white transition">🍽️ ServeFlow</Link></li>
                <li><Link href="/bonanza-voice" className="text-sm text-gray-500 hover:text-white transition">🎙️ Bonanza Voice</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-white transition">Prijzen</Link></li>
                <li><Link href="/portfolio" className="text-sm text-gray-500 hover:text-white transition">Portfolio</Link></li>
                <li><Link href="/over-ons" className="text-sm text-gray-500 hover:text-white transition">Over ons</Link></li>
                <li><a href="#faq" className="text-sm text-gray-500 hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Contact</h4>
              <ul className="space-y-2.5">
                <li><a href="mailto:hello@bonanzalabs.com" className="text-sm text-gray-500 hover:text-white transition">📧 hello@bonanzalabs.com</a></li>
                <li><Link href="/contact" className="text-sm text-gray-500 hover:text-white transition">Contactformulier</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">© 2026 BonanzaLabs — Automatisering voor het MKB</p>
          </div>
        </div>
      </footer>
    </main>
  );
}