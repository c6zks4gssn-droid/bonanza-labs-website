"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Menu, Check, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

const assessments = [
  {
    id: "flow-assessment-intro",
    name: "Introductie",
    price: "€497",
    desc: "Voor kleinere bedrijven die snel willen zien waar automatisering de meeste winst oplevert.",
    features: [
      "60 minuten strategiesessie",
      "Analyse van één kernproces",
      "Knelpunten en quick wins",
      "Korte actielijst met prioriteiten",
      "20 minuten bespreking van de uitkomst",
    ],
    highlight: false,
  },
  {
    id: "flow-assessment-standaard",
    name: "Standaard",
    price: "€999",
    desc: "Voor bedrijven met meerdere processen, teams of locaties die een volledig implementatieplan nodig hebben.",
    features: [
      "Uitgebreid procesonderzoek",
      "Tijd-lek- en omzet-lekkaart",
      "Rapport met prioriteiten en ROI-schatting",
      "Aanbevolen implementatievolgorde",
      "Reviewcall met concrete vervolgstappen",
    ],
    highlight: true,
  },
];

const implementations = [
  {
    name: "TradeFlow",
    emoji: "🔧",
    price: "vanaf €2.500",
    desc: "Van aanvraag naar offerte en opvolging zonder WhatsApp-chaos.",
    features: [
      "Conversiegerichte website",
      "Intake- en offerteformulieren",
      "AI-offertegenerator",
      "WhatsApp-opvolging",
      "Leadpipeline en CRM",
      "Dashboard met aanvragen",
    ],
    href: "/tradeflow",
  },
  {
    name: "ServeFlow",
    emoji: "🍽️",
    price: "vanaf €2.500",
    desc: "Minder gemiste reserveringen, telefoontjes en no-shows.",
    features: [
      "Online reserveringen",
      "WhatsApp-bevestigingen",
      "No-showpreventie",
      "Reviewverzoeken",
      "Digitale menukaart",
      "Lokale vindbaarheid",
    ],
    href: "/serveflow",
  },
  {
    name: "Bonanza Voice",
    emoji: "🎙️",
    price: "vanaf €1.495",
    desc: "Iedere oproep professioneel beantwoorden, ook wanneer niemand beschikbaar is.",
    features: [
      "AI-telefonie",
      "Afspraken registreren",
      "Veelgestelde vragen",
      "Gesprekssamenvattingen",
      "Doorverbinden",
      "WhatsApp follow-up",
    ],
    href: "/bonanza-voice",
  },
];

export default function PricingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  const startCheckout = async (product: string) => {
    setCheckoutProduct(product);
    setCheckoutError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout kon niet worden gestart");
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError(
        "Betalen is nu niet beschikbaar. Boek via het contactformulier of mail hello@bonanzalabs.com.",
      );
      setCheckoutProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050508]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="font-semibold tracking-tight">BonanzaLabs</Link>
          <nav className="hidden items-center gap-6 text-sm text-white/60 md:flex">
            <Link href="/tradeflow" className="transition hover:text-white">TradeFlow</Link>
            <Link href="/serveflow" className="transition hover:text-white">ServeFlow</Link>
            <Link href="/bonanza-voice" className="transition hover:text-white">Bonanza Voice</Link>
            <Link href="/portfolio" className="transition hover:text-white">Portfolio</Link>
            <Link href="/blog" className="transition hover:text-white">Kennisbank</Link>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
          </nav>
          <Link href="/contact" className="hidden rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold transition hover:bg-[#1D4ED8] md:inline-flex">
            Plan een gesprek
          </Link>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu openen">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="space-y-3 border-t border-white/10 px-6 py-4 text-sm md:hidden">
            {["tradeflow", "serveflow", "bonanza-voice", "portfolio", "blog", "over-ons", "contact"].map((route) => (
              <Link key={route} href={`/${route}`} className="block text-white/60 hover:text-white">
                {route === "bonanza-voice" ? "Bonanza Voice" : route === "over-ons" ? "Over ons" : route === "blog" ? "Kennisbank" : route.charAt(0).toUpperCase() + route.slice(1)}
              </Link>
            ))}
          </div>
        )}
      </header>

      <section className="border-b border-white/10 px-6">
        <div className="mx-auto max-w-6xl py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Begin met duidelijkheid</p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">Eerst begrijpen wat er lekt. Daarna pas bouwen.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/60">
              Het Flow Assessment brengt tijdverlies, gemiste omzet en onnodig handwerk in kaart. Je krijgt een concreet plan, ook wanneer je daarna niets laat bouwen.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {assessments.map((assessment, index) => (
              <motion.article
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative overflow-hidden rounded-3xl border p-8 ${assessment.highlight ? "border-cyan-400/60 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-violet-500/10" : "border-white/10 bg-white/[0.04]"}`}
              >
                {assessment.highlight && (
                  <span className="mb-5 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">Meest compleet</span>
                )}
                <h2 className="text-2xl font-bold">{assessment.name}</h2>
                <p className="mt-2 text-4xl font-black text-cyan-300">{assessment.price}</p>
                <p className="mt-4 min-h-14 text-sm leading-relaxed text-white/60">{assessment.desc}</p>
                <ul className="mt-6 space-y-3">
                  {assessment.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-white/75">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => startCheckout(assessment.id)}
                  disabled={checkoutProduct !== null}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 font-semibold transition hover:bg-[#1D4ED8] disabled:cursor-wait disabled:opacity-60"
                >
                  {checkoutProduct === assessment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {checkoutProduct === assessment.id ? "Stripe wordt geopend…" : `Boek en betaal ${assessment.price}`}
                </button>
              </motion.article>
            ))}
          </div>

          {checkoutError && (
            <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm text-amber-100" role="alert">
              {checkoutError}
            </div>
          )}
          <p className="mt-5 text-center text-xs text-white/40">Veilige betaling via Stripe. Je ontvangt na betaling instructies voor het plannen van de sessie.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Na het assessment</p>
        <h2 className="mt-4 text-3xl font-black md:text-4xl">Implementaties op basis van echte prioriteiten</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {implementations.map((product, index) => (
            <motion.article
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            >
              <span className="text-3xl">{product.emoji}</span>
              <h3 className="mt-4 text-xl font-bold">{product.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{product.desc}</p>
              <p className="mt-4 text-2xl font-black text-violet-300">{product.price}</p>
              <ul className="mt-6 flex-1 space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-white/60">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-300" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={product.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                Bekijk oplossing <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-gradient-to-r from-blue-950/30 via-violet-950/20 to-cyan-950/30 px-6">
        <div className="mx-auto max-w-3xl py-14 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Beheer en optimalisatie</h2>
          <p className="mt-4 text-3xl font-black">vanaf €197 per maand</p>
          <p className="mt-4 text-sm leading-relaxed text-white/60">Updates, hosting, support en continue verbetering. Telefonie- en AI-verbruik worden transparant apart berekend.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-black">Nog niet klaar om online te betalen?</h2>
        <p className="mt-4 text-lg text-white/60">Bespreek eerst je situatie. We vertellen eerlijk of een Flow Assessment zinvol is.</p>
        <Link href="/contact" className="mt-8 inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-semibold transition hover:border-cyan-300/40 hover:bg-cyan-300/5">
          Plan een kennismaking <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-white/40 md:flex-row">
          <p>© 2026 BonanzaLabs</p>
          <div className="flex gap-5">
            <Link href="/blog" className="hover:text-white">Kennisbank</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
