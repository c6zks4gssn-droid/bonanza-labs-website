"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Clock3, MapPin, Menu, RefreshCcw, ShieldCheck, X } from "lucide-react";
import { motion } from "framer-motion";

const pilotIncludes = [
  "Intake op jullie huidige reserveringsroute",
  "Eén ingerichte reserveringsflow",
  "Bevestiging voor de gast",
  "Vriendelijke herinnering",
  "Wijzigen of annuleren via dezelfde flow",
  "Interne reserveringssamenvatting",
  "Evaluatie na veertien dagen",
];

const notIncluded = [
  "Een complete nieuwe website",
  "Meerdere locaties of onbeperkte flows",
  "AI-telefonie of uitgebreide CRM-migratie",
  "Gegarandeerde omzet of aantallen reserveringen",
  "Een gegarandeerde daling van no-shows",
];

const scope = [
  { icon: MapPin, title: "Eén locatie", text: "We starten met één horecalocatie." },
  { icon: RefreshCcw, title: "Eén flow", text: "De pilot draait om één afgesproken reserveringsroute." },
  { icon: Clock3, title: "14 dagen", text: "Na livegang meten en evalueren we veertien dagen." },
  { icon: ShieldCheck, title: "Geen abonnement", text: "De pilot wordt nooit automatisch verlengd." },
];

export default function ServeFlowPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050508] text-white">
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050508]/85 backdrop-blur-xl">
        <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <img src="/logo-256.png" alt="BonanzaLabs" className="h-8 w-8 rounded" />
            BonanzaLabs
          </Link>
          <button className="text-gray-400 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu openen">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className={`${menuOpen ? "flex" : "hidden"} absolute left-4 right-4 top-16 flex-col gap-4 rounded-2xl border border-white/10 bg-[#0D1220] p-5 text-sm text-gray-300 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}>
            <Link href="/tradeflow" className="hover:text-white">TradeFlow</Link>
            <span className="font-semibold text-white">ServeFlow</span>
            <Link href="/blog" className="hover:text-white">Kennisbank</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/pricing" className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-black hover:bg-amber-300">
              Start pilot
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative px-6 pb-20 pt-36">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-amber-600/15 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-orange-600/10 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="mx-auto inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300">
              ServeFlow 14-dagen pilot
            </div>
            <h1 className="mt-7 text-4xl font-black tracking-tight md:text-6xl">
              Eén reserveringsflow. Veertien dagen. Geen automatische verlenging.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
              Laat gasten hun reservering duidelijk bevestigen, wijzigen of annuleren. BonanzaLabs richt de flow in en evalueert na veertien dagen wat praktisch werkt.
            </p>
            <div className="mt-7 text-4xl font-black text-amber-300">€497 ex. btw</div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-bold text-black hover:bg-amber-300">
                Boek de pilot <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="rounded-xl border border-white/15 px-7 py-4 font-semibold hover:bg-white/5">
                Eerst een vraag stellen
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">Vaste scope</p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">Geen onduidelijke pilotbelofte</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {scope.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <Icon className="h-6 w-6 text-amber-300" />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-2">
        <article className="rounded-3xl border border-amber-400/25 bg-amber-400/5 p-8">
          <h2 className="text-2xl font-black">Wat je krijgt</h2>
          <ul className="mt-6 space-y-4">
            {pilotIncludes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-white/75">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                {item}
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-black">Wat de pilot niet belooft</h2>
          <ul className="mt-6 space-y-4">
            {notIncluded.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-white/35" />
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-8">
          <ShieldCheck className="h-7 w-7 text-emerald-300" />
          <h2 className="mt-4 text-2xl font-black">Duidelijke leveringsgarantie</h2>
          <p className="mt-4 leading-relaxed text-white/65">
            Kunnen wij de vooraf schriftelijk afgesproken reserveringsflow niet werkend opleveren, dan betalen wij het pilotbedrag terug. De garantie geldt niet voor omzet, reserveringsvolume of een specifiek no-showpercentage.
          </p>
          <Link href="/voorwaarden" className="mt-5 inline-flex text-sm font-semibold text-emerald-300 hover:text-emerald-200">
            Lees de volledige voorwaarden →
          </Link>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black md:text-4xl">Klaar om één flow echt te testen?</h2>
          <p className="mt-4 text-white/55">Boek de pilot via Stripe. Na betaling plannen we eerst de intake; de meetperiode start pas wanneer de afgesproken flow live staat.</p>
          <Link href="/pricing" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-8 py-4 font-bold text-black hover:bg-amber-300">
            Start ServeFlow voor €497 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-white/40 md:flex-row">
          <p>© 2026 BonanzaLabs</p>
          <div className="flex gap-5">
            <Link href="/voorwaarden" className="hover:text-white">Voorwaarden</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
