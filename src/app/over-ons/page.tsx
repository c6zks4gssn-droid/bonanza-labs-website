"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, Check, MapPin, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { businessDetails, fullBusinessAddress } from "@/lib/business-details";

const approach = [
  {
    title: "Eerst één probleem",
    text: "We starten niet met een groot platform, maar met één afgebakend proces dat aantoonbaar tijd of overzicht kost.",
  },
  {
    title: "Menselijke controle",
    text: "Belangrijke beslissingen, prijzen en uitzonderingen blijven onder controle van de ondernemer.",
  },
  {
    title: "Kleine pilot",
    text: "ServeFlow begint met één locatie en één reserveringsflow gedurende veertien dagen.",
  },
  {
    title: "Pas uitbreiden na bewijs",
    text: "We bouwen alleen verder wanneer de pilot of klantfeedback daar een concrete reden voor geeft.",
  },
];

export default function OverOnsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#050508] text-white">
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050508]/85 backdrop-blur-xl">
        <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <img src="/logo-256.png" alt="BonanzaLabs" className="h-8 w-8 rounded" />
            BonanzaLabs
          </Link>
          <button className="text-white/60 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu openen">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className={`${menuOpen ? "flex" : "hidden"} absolute left-4 right-4 top-16 flex-col gap-4 rounded-2xl border border-white/10 bg-[#0D1220] p-5 text-sm text-white/65 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}>
            <Link href="/serveflow" className="hover:text-white">ServeFlow</Link>
            <Link href="/tradeflow" className="hover:text-white">TradeFlow</Link>
            <Link href="/blog" className="hover:text-white">Kennisbank</Link>
            <span className="font-semibold text-white">Over ons</span>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/pricing" className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-black hover:bg-amber-300">Start pilot</Link>
          </div>
        </div>
      </nav>

      <section className="relative px-6 pb-20 pt-36">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[100px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Over BonanzaLabs</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Praktische automatisering vanuit Groningen.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            BonanzaLabs is een Nederlandse eenmanszaak die kleine en middelgrote bedrijven helpt om één concreet proces slimmer en overzichtelijker in te richten. Geen groot softwareverhaal vooraf, maar klein beginnen en eerst bewijzen wat werkt.
          </p>
        </motion.div>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-8">
            <Building2 className="h-7 w-7 text-emerald-300" />
            <h2 className="mt-4 text-2xl font-black">Officiële bedrijfsgegevens</h2>
            <div className="mt-5 space-y-2 text-sm leading-relaxed text-white/65">
              <p><strong className="text-white">Handelsnaam:</strong> {businessDetails.tradeName}</p>
              <p><strong className="text-white">Rechtsvorm:</strong> {businessDetails.legalForm}</p>
              <p><strong className="text-white">KvK:</strong> {businessDetails.kvkNumber}</p>
              <p><strong className="text-white">Vestigingsnummer:</strong> {businessDetails.branchNumber}</p>
            </div>
          </article>
          <article className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-8">
            <MapPin className="h-7 w-7 text-cyan-300" />
            <h2 className="mt-4 text-2xl font-black">Hoofdvestiging</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/65">{fullBusinessAddress}</p>
            <a href={`mailto:${businessDetails.contactEmail}`} className="mt-5 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200">{businessDetails.contactEmail}</a>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Werkwijze</p>
        <h2 className="mt-4 text-3xl font-black md:text-4xl">Eerst verkopen en bewijzen, daarna pas uitbreiden</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {approach.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{item.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 text-center">
        <div className="mx-auto max-w-3xl rounded-3xl border border-amber-400/20 bg-amber-400/5 p-10">
          <h2 className="text-3xl font-black">Start met één ServeFlow-pilot</h2>
          <p className="mt-4 text-white/60">Eén locatie, één reserveringsflow, veertien dagen en geen automatische verlenging.</p>
          <Link href="/pricing" className="mt-7 inline-flex rounded-xl bg-amber-400 px-7 py-4 font-bold text-black hover:bg-amber-300">Bekijk de pilot van €497</Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-white/40 md:flex-row">
          <p>© 2026 BonanzaLabs · KvK {businessDetails.kvkNumber}</p>
          <div className="flex gap-5"><Link href="/voorwaarden" className="hover:text-white">Voorwaarden</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/contact" className="hover:text-white">Contact</Link></div>
        </div>
      </footer>
    </main>
  );
}
