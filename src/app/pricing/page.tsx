"use client";

import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
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
      "Daarna optioneel beheer vanaf €197 per maand",
    ],
    highlighted: true,
  },
  {
    id: "flow-assessment-standaard",
    name: "Flow Assessment",
    price: "€1.295",
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
      "Verrekend bij implementatie binnen 30 dagen",
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

// Doorlopend beheer. Bedragen komen uit stripe-products.ts (19700 / 29700 /
// 49700 cent per maand). De inhoud per pakket is op 15-10-2026 door de eigenaar
// goedgekeurd als prijsupdate. Voeg GEEN scope toe die hier niet staat: noem
// geen aantallen flows, locaties, uren of reactietijden zonder overeenkomst.
const managementTiers = [
  {
    id: "beheer-basis",
    name: "Basis",
    price: "€197",
    includes: [
      "Maandelijks beheer van je ingerichte oplossing",
      "Kleine aanpassingen aan afgesproken teksten, vragen en antwoorden",
    ],
  },
  {
    id: "beheer-standaard",
    name: "Standaard",
    price: "€297",
    includes: [
      "Alles uit Basis",
      "Maandelijkse evaluatie van hoe de flow loopt",
      "Verbetervoorstellen op basis van die evaluatie",
    ],
  },
  {
    id: "beheer-uitgebreid",
    name: "Uitgebreid",
    price: "€497",
    includes: [
      "Alles uit Standaard",
      "Doorvoeren van afgesproken verbeteringen",
      "Samen uitbreiding bespreken en voorbereiden",
    ],
  },
];

// CONCEPT-abonnementen (21-10-2026). Nog NIET goedgekeurd en NIET in Stripe.
// Prijzen en inhoud zijn een voorstel; zie PR-beschrijving voor onderbouwing.
// TODO: per-minuutkosten (ElevenLabs + telefonie) narekenen vóór livegang.
const subscriptionTiers = [
  {
    id: "abonnement-start",
    name: "Start",
    price: "€199",
    minutes: "300 belminuten per maand",
    extra: "Extra minuut €0,35",
    includes: [
      "Bonanza Voice óf één ServeFlow-reserveringsflow",
      "Eén locatie, één telefoonnummer",
      "Beantwoordt afgesproken vragen en noteert terugbelverzoeken",
      "Samenvatting per gesprek per e-mail",
      "Kleine tekstaanpassingen per maand",
      "Support per e-mail",
    ],
  },
  {
    id: "abonnement-groei",
    name: "Groei",
    price: "€349",
    minutes: "800 belminuten per maand",
    extra: "Extra minuut €0,30",
    highlighted: true,
    includes: [
      "Bonanza Voice én ServeFlow samen",
      "Eén locatie",
      "Afspraken of reserveringen doorzetten naar je agenda of reserveringssysteem (als koppeling mogelijk is)",
      "Doorverbinden naar jou of een collega",
      "Maandelijkse evaluatie met verbetervoorstellen (tot 1 uur)",
      "Support per e-mail en telefoon",
    ],
  },
  {
    id: "abonnement-pro",
    name: "Pro",
    price: "€499",
    minutes: "1.000 belminuten per maand",
    extra: "Extra minuut €0,25",
    includes: [
      "Alles uit Groei",
      "Tot drie locaties of telefoonnummers",
      "Koppeling met je eigen systeem, volgens afspraak",
      "Afgesproken verbeteringen doorvoeren, tot 2 uur per maand",
      "Voorrang bij support en aanpassingen",
    ],
  },
];

export default function PricingPage() {
  const [checkoutProduct, setCheckoutProduct] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const startCheckout = async (product: string) => {
    if (!termsAccepted) {
      setCheckoutError("Ga eerst akkoord met de algemene voorwaarden en bevestig dat je de privacyverklaring hebt gelezen.");
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
    <main id="main-content" className="light-site light-subpage min-h-screen">
      <SiteNav />

      <section className="border-b border-white/10 bg-gradient-to-br from-amber-950/20 via-[#050508] to-blue-950/20 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">Begin klein en meetbaar</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Een helder startpunt voor jouw automatisering.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/60">
            Vergelijk ServeFlow, TradeFlow, Bonanza Voice en het Flow Assessment. Kies een afgebakende pilot, procesonderzoek of een inrichting op maat. Alle prijzen zijn excl. btw.
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
              <p className="mt-1 text-sm text-white/60">Eenmalig, excl. btw</p>
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
            Ik ga akkoord met de <Link href="/voorwaarden" className="text-cyan-300 underline">algemene voorwaarden</Link> (<a href="/algemene-voorwaarden-bonanzalabs.pdf" download className="text-cyan-300 underline">PDF</a>) en heb de <Link href="/privacy" className="text-cyan-300 underline">privacyverklaring</Link> gelezen. Ik begrijp dat de ServeFlow-pilot geen omzet, reserveringen of een specifieke daling van no-shows garandeert.
          </span>
        </label>

        {checkoutError && (
          <div className="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm text-amber-100" role="alert">
            {checkoutError}
          </div>
        )}
        <p className="mt-4 text-center text-xs text-white/40">Veilige betaling via Stripe. Na betaling plannen we de intake.</p>
      </section>

      <section id="abonnementen" className="mx-auto max-w-6xl px-6 pb-16" aria-labelledby="abonnementen-titel">
        <p className="w-fit rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">Concept — prijzen nog niet definitief</p>
        <h2 id="abonnementen-titel" className="mt-4 mb-4 text-3xl font-black">Abonnementen voor Bonanza Voice en ServeFlow</h2>
        <p className="max-w-3xl text-white/60">
          Voor horeca, bouw en installatie. Wij richten alles in, testen het met je en houden het daarna bij. Belminuten zitten in het maandbedrag. Eenmalige inrichting €495 (Start en Groei); bij Pro volgens offerte. Minimale looptijd 3 maanden, daarna maandelijks opzegbaar. Niet gebruikte minuten vervallen aan het eind van de maand; zie de <Link href="/voorwaarden" className="underline">voorwaarden</Link>. Alle prijzen excl. btw.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {subscriptionTiers.map((tier) => (
            <article key={tier.id} className={`flex flex-col rounded-3xl border p-8 ${tier.highlighted ? "border-amber-400/50 bg-amber-500/5" : "border-white/10"}`}>
              <h3 className="text-xl font-black">{tier.name}</h3>
              <p className="mt-3 text-3xl font-black">
                {tier.price}
                <span className="text-base font-semibold text-white/60"> per maand</span>
              </p>
              <p className="mt-1 text-sm text-white/60">Excl. btw · {tier.minutes}</p>
              <p className="text-sm text-white/60">{tier.extra}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm leading-relaxed text-white/70">
                {tier.includes.map((item) => (
                  <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{item}</li>
                ))}
              </ul>
              <Link href="/contact" className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-semibold hover:bg-white/5">
                Vraag {tier.name} aan <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-white/50">
          Een gesprek duurt vaak een paar minuten; hoeveel gesprekken in een bundel passen hangt af van je bellers. Bij elk gesprek meldt de assistent dat de beller met AI spreekt. Afsluiten gaat via een afzonderlijke overeenkomst, niet via een knop op deze pagina.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16" aria-labelledby="doorlopend-beheer">
        <h2 id="doorlopend-beheer" className="mb-4 text-3xl font-black">Doorlopend beheer</h2>
        <p className="max-w-3xl text-white/60">
          Doorlopend beheer is er in drie vormen, per maand. Dit loopt via een afzonderlijke overeenkomst; de exacte afspraken staan daarin.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {managementTiers.map((tier) => (
            <article key={tier.id} className="rounded-3xl border border-white/10 p-8">
              <h3 className="text-xl font-black">Beheer en Optimalisatie — {tier.name}</h3>
              <p className="mt-3 text-3xl font-black">
                {tier.price}
                <span className="text-base font-semibold text-white/60"> per maand</span>
              </p>
              <p className="mt-1 text-sm text-white/60">Excl. btw</p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/60">
                {tier.includes.map((item) => (
                  <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{item}</li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 font-semibold underline"
              >
                Bespreek beheer <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-white/50">
          Deze vorm gaat via een afzonderlijke overeenkomst, niet via een knop op deze pagina.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16" aria-labelledby="maatwerk-prijzen">
        <h2 id="maatwerk-prijzen" className="mb-8 text-3xl font-black">Inrichting op maat</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 p-8">
            <h3 className="text-2xl font-black">TradeFlow</h3>
            <p className="mt-3 text-3xl font-black">Vanaf €1.995</p>
            <p className="mt-1 text-sm text-white/60">Implementatie, excl. btw</p>
            <p className="mt-4 text-white/60">Intake, offertevoorbereiding en opvolging voor bouw en installatie. De definitieve scope en prijs bepalen we na de intake; je team beoordeelt de offerte.</p>
            <Link href="/tradeflow" className="mt-6 inline-flex items-center gap-2 font-semibold underline">Bekijk TradeFlow <ArrowRight className="h-4 w-4" /></Link>
          </article>
          <article className="rounded-3xl border border-white/10 p-8">
            <h3 className="text-2xl font-black">Bonanza Voice</h3>
            <p className="mt-3 text-3xl font-black">Vanaf €1.495</p>
            <p className="mt-1 text-sm text-white/60">Inrichting, excl. btw</p>
            <p className="mt-4 text-white/60">Een AI-telefonist voor basisvragen en terugbel- of offerteverzoeken. Per klant ingericht en getest. Beheer vanaf €197 per maand. Gebruikskosten (belminuten) komen apart, volgens offerte.</p>
            <Link href="/bonanza-voice" className="mt-6 inline-flex items-center gap-2 font-semibold underline">Bekijk Bonanza Voice <ArrowRight className="h-4 w-4" /></Link>
          </article>
        </div>
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

      <SiteFooter />
    </main>
  );
}
