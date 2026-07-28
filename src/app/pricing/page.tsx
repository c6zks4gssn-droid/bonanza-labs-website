"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Menu, Check, ArrowRight } from "lucide-react";

const assessments = [
  {
    name: "Introductie",
    price: "€497",
    desc: "Geschikt voor kleine bedrijven die willen weten waar automatisering de meeste winst oplevert.",
    features: ["60 minuten gesprek", "Inzicht in knelpunten en kansen", "Korte actielijst", "Geschikt voor 1 locatie"],
    highlight: false,
  },
  {
    name: "Standaard",
    price: "€999",
    desc: "Voor bedrijven met meerdere locaties of complexere processen.",
    features: ["Uitgebreid procesonderzoek", "Rapport met prioriteiten en ROI-schatting", "Aanbevolen implementatievolgorde", "Geschikt voor meerdere locaties"],
    highlight: true,
  },
];

const implementations = [
  {
    name: "TradeFlow",
    emoji: "🔧",
    price: "vanaf €2.500",
    desc: "Van aanvraag naar offerte en opvolging zonder WhatsApp-chaos.",
    features: ["Conversiegerichte website", "Intake- en offerteformulieren", "AI-offertegenerator", "WhatsApp-opvolging", "Leadpipeline en CRM", "Automatische herinneringen", "Dashboard met aanvragen"],
  },
  {
    name: "ServeFlow",
    emoji: "🍽️",
    price: "vanaf €2.500",
    desc: "Minder gemiste reserveringen, telefoontjes en no-shows.",
    features: ["Online reserveringen", "WhatsApp-bevestigingen", "No-showpreventie", "Reviewverzoeken", "Digitale menukaart", "Website en lokale vindbaarheid", "Bonanza Voice als uitbreiding"],
  },
  {
    name: "Bonanza Voice",
    emoji: "🎙️",
    price: "vanaf €1.495",
    desc: "Iedere oproep professioneel beantwoorden, ook wanneer niemand beschikbaar is.",
    features: ["AI-telefonie", "Afspraken en reserveringen registreren", "Veelgestelde vragen beantwoorden", "Gesprekssamenvattingen", "Doorverbinden naar medewerkers", "WhatsApp voice en follow-up", "Ook beschikbaar als add-on"],
  },
];

export default function PricingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050508]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="font-semibold tracking-tight">BonanzaLabs</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/60">
            <Link href="/tradeflow" className="hover:text-white transition">TradeFlow</Link>
            <Link href="/serveflow" className="hover:text-white transition">ServeFlow</Link>
            <Link href="/bonanza-voice" className="hover:text-white transition">Bonanza Voice</Link>
            <Link href="/portfolio" className="hover:text-white transition">Portfolio</Link>
            <Link href="/over-ons" className="hover:text-white transition">Over ons</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </nav>
          <Link href="/pricing" className="hidden md:inline-flex items-center rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8]">Flow Assessment</Link>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 px-6 py-4 space-y-3 text-sm">
            <Link href="/tradeflow" className="block text-white/60 hover:text-white">TradeFlow</Link>
            <Link href="/serveflow" className="block text-white/60 hover:text-white">ServeFlow</Link>
            <Link href="/bonanza-voice" className="block text-white/60 hover:text-white">Bonanza Voice</Link>
            <Link href="/portfolio" className="block text-white/60 hover:text-white">Portfolio</Link>
            <Link href="/over-ons" className="block text-white/60 hover:text-white">Over ons</Link>
            <Link href="/contact" className="block text-white/60 hover:text-white">Contact</Link>
          </div>
        )}
      </header>

      {/* Flow Assessment */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-semibold tracking-tight">Prijzen</h1>
            <p className="mt-4 text-lg text-white/60">Eerst begrijpen wat er mis gaat. Daarna pas bouwen.</p>
          </motion.div>

          <h2 className="mt-16 text-sm font-medium uppercase tracking-widest text-white/40">Flow Assessment</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {assessments.map((a, i) => (
              <motion.div key={a.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`rounded-2xl border p-8 ${a.highlight ? "border-[#2563EB] bg-[#2563EB]/5" : "border-white/10 bg-white/5"}`}>
                {a.highlight && <span className="inline-block rounded-full bg-[#2563EB] px-3 py-1 text-xs font-semibold text-white mb-4">Aanbevolen</span>}
                <h3 className="text-2xl font-semibold">{a.name}</h3>
                <p className="mt-2 text-3xl font-bold text-[#2563EB]">{a.price}</p>
                <p className="mt-4 text-sm text-white/60">{a.desc}</p>
                <ul className="mt-6 space-y-3">
                  {a.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/70"><Check className="h-4 w-4 text-[#2563EB]" />{f}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementaties */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-sm font-medium uppercase tracking-widest text-white/40">Implementaties</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {implementations.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="text-3xl">{p.emoji}</span>
              <h3 className="mt-4 text-xl font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-white/50">{p.desc}</p>
              <p className="mt-4 text-2xl font-bold text-[#2563EB]">{p.price}</p>
              <ul className="mt-6 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-white/60"><Check className="h-3.5 w-3.5 text-[#2563EB] mt-0.5 shrink-0" />{f}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Beheer */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-3xl px-6 py-12 text-center">
          <h2 className="text-sm font-medium uppercase tracking-widest text-white/40">Beheer en optimalisatie</h2>
          <p className="mt-4 text-3xl font-bold text-[#2563EB]">vanaf €197 per maand</p>
          <p className="mt-4 text-sm text-white/60">Updates, hosting, support. Maandelijks opzegbaar. Telefonie en AI-verbruik apart op basis van gebruik.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Klaar voor minder handwerk?</h2>
        <p className="mt-4 text-lg text-white/60">Boek een Flow Assessment. In 60 minuten weet je wat automatisering jou oplevert.</p>
        <Link href="/contact" className="mt-8 inline-flex items-center rounded-xl bg-[#2563EB] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#1D4ED8]">
          Boek een Flow Assessment <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <p className="mt-6 text-sm text-white/40">Exacte prijs na Flow Assessment. Geen verrassingen.</p>
      </section>
    </div>
  );
}