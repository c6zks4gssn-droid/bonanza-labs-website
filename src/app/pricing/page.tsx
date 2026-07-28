"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock3,
  Loader2,
  MapPin,
  Menu,
  RefreshCcw,
  ShieldCheck,
  X,
} from "lucide-react";

const offers = [
  {
    id: "serveflow-pilot-14-days",
    name: "ServeFlow 14-dagen pilot",
    price: "€497",
    label: "Primaire pilot voor horeca",
    description:
      "Test één duidelijke reserveringsflow in je eigen zaak, zonder abonnement of automatische verlenging.",
    features: [
      "Eén horecalocatie",
      "Eén reserveringsflow",
      "Intake en inrichting door BonanzaLabs",
      "Bevestiging, herinnering en annuleren/wijzigen",
      "Interne reserveringssamenvatting",
      "Evaluatie na 14 dagen",
    ],
    highlighted: true,
  },
  {
    id: "flow-assessment-standaard",
    name: "Flow Assessment",
    price: "€999",
    label: "Voor complexere aanvragen",
    description:
      "Voor bedrijven met meerdere processen, teams, locaties of integraties die eerst een gedegen implementatieplan nodig hebben.",
    features: [
      "Uitgebreid procesonderzoek",
      "Tijd-lek- en omzet-lekkaart",
      "Risico- en haalbaarheidsanalyse",
      "Prioriteiten en implementatievolgorde",
      "Rapport met concrete vervolgstappen",
      "Reviewcall met besluitadvies",
    ],
    highlighted: false,
  },
];

const pilotScope = [
  { icon: MapPin, title: "Eén locatie", text: "De pilot geldt voor één horecalocatie." },
  { icon: RefreshCcw, title: "Eén flow", text: "We richten één afgesproken reserveringsflow in." },
  { icon: Clock3, title: "14 dagen", text: "De meetperiode duurt veertien dagen na livegang." },
  { icon: ShieldCheck, title: "Geen verlenging", text: "Er start nooit automatisch een abonnement." },
];

export default function PricingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const startCheckout = async (product: string) => {
    if (!termsAccepted) {
      setCheckoutError("Bevestig eerst dat je de pilotvoorwaarden en privacyverklaring hebt gelezen.");
      return;
    }

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
        "Betalen is nu niet beschikbaar. Gebruik het contactformulier, dan controleren we de configuratie.",
      );
      setCheckoutProduct(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#050508] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050508]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="font-bold tracking-tight">BonanzaLabs</Link>
          <nav className="hidden items-center gap-6 text-sm text-white/60 md:flex">
            <Link href="/serveflow" className="hover:text-white">ServeFlow</Link>
            <Link href="/tradeflow" className="hover:text-white">TradeFlow</Link>
            <Link href="/blog" className="hover:text-white">Kennisbank</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </nav>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu openen">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="space-y-3 border-t border-white/10 px-6 py-4 text-sm md:hidden">
            <Link href="/serveflow" className="block text-white/70">ServeFlow</Link>
            <Link href="/tradeflow" className="block text-white/70">TradeFlow</Link>
            <Link href="/blog" className="block text-white/70">Kennisbank</Link>
            <Link href="/contact" className="block text-white/70">Contact</Link>
          </div>
        )}
      </header>

      <section className="border-b border-white/10 bg-gradient-to-br from-amber-950/20 via-[#050508] to-blue-950/20 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">Begin klein en meetbaar</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Test ServeFlow 14 dagen voor €497.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/60">
            Eén locatie, één reserveringsflow en geen automatische verlenging. Voor complexere processen blijft het Flow Assessment beschikbaar.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {offers.map((offer, index) => (
            <motion.article
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                offer.highlighted
                  ? "border-amber-400/50 bg-gradient-to-br from-amber-500/15 via-orange-500/8 to-[#0D1220]"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${offer.highlighted ? "bg-amber-300/10 text-amber-200" : "bg-cyan-300/10 text-cyan-200"}`}>
                {offer.label}
              </span>
              <h2 className="mt-5 text-2xl font-black">{offer.name}</h2>
              <p className={`mt-2 text-4xl font-black ${offer.highlighted ? "text-amber-300" : "text-cyan-300"}`}>{offer.price}</p>
              <p className="mt-4 text-sm leading-relaxed text-white/60">{offer.description}</p>
              <ul className="mt-7 flex-1 space-y-3">
                {offer.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-white/75">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${offer.highlighted ? "text-amber-300" : "text-cyan-300"}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => startCheckout(offer.id)}
                disabled={checkoutProduct !== null}
                className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold transition disabled:cursor-wait disabled:opacity-60 ${
                  offer.highlighted ? "bg-amber-400 text-black hover:bg-amber-300" : "bg-[#2563EB] hover:bg-[#1D4ED8]"
                }`}
              >
                {checkoutProduct === offer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {checkoutProduct === offer.id ? "Stripe wordt geopend…" : `Boek en betaal ${offer.price}`}
              </button>
            </motion.article>
          ))}
        </div>

        <label className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/70">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            className="mt-1 h-4 w-4 accent-amber-400"
          />
          <span>
            Ik heb de <Link href="/voorwaarden" className="text-cyan-300 underline">voorwaarden</Link> en de <Link href="/privacy" className="text-cyan-300 underline">privacyverklaring</Link> gelezen. Ik begrijp dat de ServeFlow-pilot geen omzet, reserveringen of een specifieke daling van no-shows garandeert.
          </span>
        </label>

        {checkoutError && (
          <div className="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm text-amber-100" role="alert">
            {checkoutError}
          </div>
        )}
        <p className="mt-4 text-center text-xs text-white/40">Veilige betaling via Stripe. Na betaling plannen we de intake.</p>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">Vaste pilotscope</p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">Duidelijk vóór je betaalt</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {pilotScope.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <Icon className="h-6 w-6 text-amber-300" />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 text-sm leading-relaxed text-white/70">
            <strong className="text-emerald-300">Leveringsgarantie:</strong> kunnen wij de vooraf schriftelijk afgesproken reserveringsflow niet werkend opleveren, dan betalen wij het pilotbedrag terug. De garantie geldt niet voor omzetresultaten, aantallen reserveringen of een specifiek no-showpercentage.
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-3xl font-black">Twijfel je welke route past?</h2>
        <p className="mt-4 text-white/60">De pilot is voor één concrete horeca-flow. Voor meerdere processen, locaties of complexe koppelingen kies je het Flow Assessment.</p>
        <Link href="/contact" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-semibold hover:bg-white/5">
          Bespreek je situatie <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-white/40 md:flex-row">
          <p>© 2026 BonanzaLabs</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/voorwaarden" className="hover:text-white">Voorwaarden</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
