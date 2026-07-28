"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Menu, ShieldCheck, Sparkles, X } from "lucide-react";

const problems = [
  {
    title: "Reserveringen komen verspreid binnen",
    text: "Telefoon, WhatsApp en DM lopen door elkaar, waardoor bevestigingen en wijzigingen onduidelijk worden.",
  },
  {
    title: "Gasten kunnen niet eenvoudig annuleren",
    text: "Een gast die niet kan komen laat soms niets horen wanneer wijzigen of annuleren te veel moeite kost.",
  },
  {
    title: "Het team doet steeds hetzelfde handwerk",
    text: "Bevestigen, herinneren en informatie opnieuw noteren kost tijd tijdens drukke momenten.",
  },
];

const pilotFeatures = [
  "Eén horecalocatie",
  "Eén reserveringsflow",
  "Intake en inrichting door BonanzaLabs",
  "Bevestiging, herinnering en annuleren/wijzigen",
  "Interne reserveringssamenvatting",
  "Evaluatie na 14 dagen",
  "Geen automatische verlenging",
];

const solutions = [
  {
    name: "ServeFlow",
    label: "Nu beschikbaar als pilot",
    text: "Een afgebakende reserveringsflow voor lokale horecazaken.",
    price: "14 dagen — €497 ex. btw",
    href: "/serveflow",
    accent: "border-amber-400/30 bg-amber-400/5 text-amber-300",
  },
  {
    name: "TradeFlow",
    label: "Bouw & installatie",
    text: "Aanvragen bevestigen, informatie compleet maken en opvolging overzichtelijk houden.",
    price: "Implementatie na intake",
    href: "/tradeflow",
    accent: "border-violet-400/30 bg-violet-400/5 text-violet-300",
  },
  {
    name: "Bonanza Voice",
    label: "AI-telefonie",
    text: "Oproepen opvangen, basisvragen beantwoorden en terugbelverzoeken registreren.",
    price: "Vanaf €1.495",
    href: "/bonanza-voice",
    accent: "border-emerald-400/30 bg-emerald-400/5 text-emerald-300",
  },
];

const faq = [
  {
    question: "Vervangt ServeFlow mijn personeel?",
    answer:
      "Nee. ServeFlow automatiseert één afgesproken reserveringsflow. Persoonlijke service, uitzonderingen en belangrijke beslissingen blijven bij je team.",
  },
  {
    question: "Zit ik na de pilot vast aan een contract?",
    answer:
      "Nee. De pilot duurt veertien dagen en wordt niet automatisch verlengd. Een vervolg gebeurt alleen na een afzonderlijke afspraak.",
  },
  {
    question: "Garanderen jullie minder no-shows of extra omzet?",
    answer:
      "Nee. We garanderen geen omzet, reserveringsvolume of specifiek no-showpercentage. We spreken wel vooraf exact af welke flow we werkend opleveren.",
  },
  {
    question: "Wanneer krijg ik mijn geld terug?",
    answer:
      "Kunnen wij de vooraf schriftelijk afgesproken reserveringsflow niet werkend opleveren, dan betalen we het pilotbedrag terug. De volledige voorwaarden staan op de voorwaardenpagina.",
  },
  {
    question: "Wanneer is het Flow Assessment geschikter?",
    answer:
      "Bij meerdere locaties, meerdere processen, complexe koppelingen of een bredere automatiseringsvraag adviseren we eerst het Flow Assessment van €999.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050508] text-white">
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
            <Link href="/over-ons" className="hover:text-white">Over ons</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/pricing" className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-black hover:bg-amber-300">
              Start pilot
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative px-6 pb-24 pt-36">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/3 top-1/4 h-[520px] w-[520px] rounded-full bg-amber-600/12 blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[110px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-5xl text-center"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300">
            <Sparkles className="h-4 w-4" /> ServeFlow-pilot voor lokale horeca
          </div>
          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black tracking-tight md:text-7xl">
            Minder reserveringshandwerk. Eén flow. Veertien dagen testen.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/60 md:text-xl">
            BonanzaLabs richt één reserveringsflow in voor één horecalocatie. Geen automatische verlenging en geen onbewezen omzetbelofte.
          </p>
          <div className="mt-7 text-4xl font-black text-amber-300">€497 ex. btw</div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-bold text-black hover:bg-amber-300">
              Boek de 14-dagen pilot <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/serveflow" className="rounded-xl border border-white/15 px-7 py-4 font-semibold hover:bg-white/5">
              Bekijk de pilotscope
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">Herkenbaar?</p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">Een klein proces dat dagelijks tijd kost</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {problems.map((problem) => (
              <article key={problem.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="font-bold">{problem.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{problem.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-[1.15fr_.85fr]">
          <article className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-400/10 to-[#0D1220] p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Primaire aanbieding</p>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">ServeFlow 14-dagen pilot</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-white/60">
              We richten één reserveringsflow in, zetten die live en evalueren na veertien dagen wat praktisch werkt voor jouw zaak.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {pilotFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-white/75">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/pricing" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-bold text-black hover:bg-amber-300">
              Start voor €497 <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Complexere aanvraag</p>
            <h2 className="mt-4 text-3xl font-black">Flow Assessment</h2>
            <p className="mt-4 leading-relaxed text-white/60">
              Voor meerdere processen, locaties, teams of integraties brengen we eerst risico’s, prioriteiten en implementatievolgorde in kaart.
            </p>
            <div className="mt-7 text-3xl font-black text-cyan-300">€999 ex. btw</div>
            <Link href="/pricing" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 px-6 py-3 font-semibold text-cyan-200 hover:bg-cyan-300/10">
              Bekijk het assessment <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">BonanzaLabs oplossingen</p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">Eerst bewijzen, daarna uitbreiden</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {solutions.map((solution) => (
              <article key={solution.name} className={`rounded-2xl border p-6 ${solution.accent}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">{solution.label}</p>
                <h3 className="mt-3 text-2xl font-black text-white">{solution.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{solution.text}</p>
                <p className="mt-5 text-sm font-bold">{solution.price}</p>
                <Link href={solution.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                  Bekijk details <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">Veelgestelde vragen</p>
        <h2 className="mt-4 text-3xl font-black md:text-4xl">Duidelijkheid vóór de pilot</h2>
        <div className="mt-9 space-y-4">
          {faq.map((item) => (
            <details key={item.question} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <summary className="cursor-pointer font-semibold">{item.question}</summary>
              <p className="mt-4 text-sm leading-relaxed text-white/60">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-8 text-center md:p-12">
          <ShieldCheck className="mx-auto h-8 w-8 text-emerald-300" />
          <h2 className="mt-5 text-3xl font-black">Een garantie op levering, niet op omzet</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/60">
            Kunnen wij de vooraf schriftelijk afgesproken reserveringsflow niet werkend opleveren, dan betalen wij het pilotbedrag terug. De pilot garandeert geen omzet, reserveringsvolume of specifiek no-showpercentage.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/pricing" className="rounded-xl bg-emerald-400 px-7 py-4 font-bold text-black hover:bg-emerald-300">
              Boek de pilot
            </Link>
            <Link href="/voorwaarden" className="rounded-xl border border-white/15 px-7 py-4 font-semibold hover:bg-white/5">
              Lees de voorwaarden
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          <div>
            <p className="font-bold">BonanzaLabs</p>
            <p className="mt-3 text-sm leading-relaxed text-white/40">Praktische automatisering voor horeca, bouw en installatie.</p>
          </div>
          <div className="text-sm text-white/45">
            <p className="font-semibold text-white/70">Pagina’s</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/serveflow" className="hover:text-white">ServeFlow</Link>
              <Link href="/tradeflow" className="hover:text-white">TradeFlow</Link>
              <Link href="/blog" className="hover:text-white">Kennisbank</Link>
            </div>
          </div>
          <div className="text-sm text-white/45">
            <p className="font-semibold text-white/70">Contact en juridisch</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="mailto:hello@bonanza-labs.com" className="hover:text-white">hello@bonanza-labs.com</a>
              <Link href="/voorwaarden" className="hover:text-white">Voorwaarden</Link>
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/30">© 2026 BonanzaLabs — Groningen</p>
      </footer>
    </main>
  );
}
