import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock3, MapPin, RefreshCcw, ShieldCheck, X, Phone, MessageCircle, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "ServeFlow — AI reserveringsflow voor horeca",
  description:
    "ServeFlow richt één reserveringsflow in voor uw restaurant met automatische bevestiging, herinnering en annulering via WhatsApp. 14-dagen pilot, €497 ex. btw, geen abonnement.",
  alternates: { canonical: "https://www.bonanza-labs.com/serveflow" },
  openGraph: {
    title: "ServeFlow — AI reserveringsflow voor horeca",
    description:
      "Eén reserveringsflow. Veertien dagen. Geen automatische verlenging. €497 ex. btw.",
    url: "https://www.bonanza-labs.com/serveflow",
    type: "website",
  },
};

const pilotIncludes = [
  "Intake op jullie huidige reserveringsroute",
  "Eén ingerichte reserveringsflow",
  "Bevestiging voor de gast",
  "Vriendelijke herinnering 24 uur van tevoren",
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

const painPoints = [
  {
    icon: Phone,
    title: "Telefoon rinkelt tijdens bediening",
    text: "Personeel kan niet tegelijk serveren en reserveren aannemen. Gemiste oproepen kosten €20–€40 per boeking.",
  },
  {
    icon: Clock3,
    title: "Na sluitingstijd onbereikbaar",
    text: "Gasten die 's avonds willen reserveren krijgen een voicemail. Velen bellen gewoon ergens anders.",
  },
  {
    icon: X,
    title: "No-shows zonder overzicht",
    text: "Wie komt niet opdagen? Hoe vaak? U weet het niet tot de tafel leeg blijft.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp als black hole",
    text: "Reserveringen, vragen en wijzigingen verspreid over losse chatgesprekken. Geen centraal overzicht.",
  },
];

const faqs = [
  {
    question: "Wat kost de ServeFlow pilot precies?",
    answer:
      "De pilot kost €497 ex. btw, eenmalig. Er is geen abonnement en geen automatische verlenging. Na de 14 dagen kiest u: stoppen, of door met een service-abonnement vanaf €197/maand.",
  },
  {
    question: "Wat gebeurt er na de 14 dagen?",
    answer:
      "We evalueren samen wat de flow heeft opgeleverd: hoeveel reserveringen automatisch zijn verwerkt, hoeveel herinneringen zijn verstuurd, en of de flow past bij uw werkwijze. Bij positief resultaat kunt u door met een maandelijkse service-overeenkomst.",
  },
  {
    question: "Werkt ServeFlow met WhatsApp?",
    answer:
      "Ja. ServeFlow kan reserveringen via WhatsApp afhandelen, maar werkt ook met telefoon en e-mail. We kiezen tijdens de intake welk kanaal het beste past bij uw gasten en personeel.",
  },
  {
    question: "Wat als de flow niet werkt?",
    answer:
      "Kunnen wij de vooraf schriftelijk afgesproken reserveringsflow niet werkend opleveren, dan betalen wij het pilotbedrag terug. De garantie geldt niet voor omzet, reserveringsvolume of een specifiek no-showpercentage.",
  },
  {
    question: "Kan ik meerdere vestigingen testen?",
    answer:
      "De pilot dekt één locatie en één flow. Voor meerdere vestigingen kunnen we na de pilot een service-abonnement op maat aanbieden.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "ServeFlow",
  serviceType: "Reserveringsautomatisering voor horeca",
  description:
    "ServeFlow richt één reserveringsflow in voor uw restaurant met automatische bevestiging, herinnering en annulering via WhatsApp. 14-dagen pilot, €497 ex. btw.",
  provider: {
    "@type": "LocalBusiness",
    name: "BonanzaLabs",
    url: "https://www.bonanza-labs.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bloedkoraalstraat 49",
      postalCode: "9743 KB",
      addressLocality: "Groningen",
      addressCountry: "NL",
    },
    areaServed: { "@type": "Country", name: "Nederland" },
  },
  areaServed: { "@type": "Country", name: "Nederland" },
  offers: {
    "@type": "Offer",
    price: "497.00",
    priceCurrency: "EUR",
    description: "14-dagen pilot, eenmalig, geen abonnement",
    availability: "https://schema.org/InStock",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function ServeFlowPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050508] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050508]/85 backdrop-blur-xl">
        <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <img src="/logo-256.png" alt="BonanzaLabs" className="h-8 w-8 rounded" />
            BonanzaLabs
          </Link>
          <div className="hidden items-center gap-5 text-sm text-gray-300 md:flex">
            <Link href="/tradeflow" className="hover:text-white">TradeFlow</Link>
            <span className="font-semibold text-white">ServeFlow</span>
            <Link href="/bonanza-voice" className="hover:text-white">Bonanza Voice</Link>
            <Link href="/blog" className="hover:text-white">Kennisbank</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/pricing" className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-black hover:bg-amber-300">
              Start pilot
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. Hero met één concrete uitkomst */}
      <section className="relative px-6 pb-20 pt-36">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-amber-600/15 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-orange-600/10 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
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
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-bold text-black hover:bg-amber-300"
              data-cta="serveflow-pilot-book"
            >
              Boek de pilot <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-white/15 px-7 py-4 font-semibold hover:bg-white/5"
              data-cta="serveflow-question"
            >
              Eerst een vraag stellen
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Direct-answer block */}
      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="sr-only">Wat is ServeFlow?</h2>
          <p className="text-lg leading-relaxed text-gray-200">
            <strong className="text-white">ServeFlow</strong> is een 14-dagen pilot voor horecaondernemers die één reserveringsflow inricht met automatische bevestiging, herinnering en annulering via WhatsApp. BonanzaLabs neemt de setup uit handen, meet 14 dagen wat het oplevert, en deelt resultaten zonder verplichtingen daarna. De pilot kost <strong className="text-amber-300">€497 ex. btw</strong> — geen abonnement, geen automatische verlenging.
          </p>
        </div>
      </section>

      {/* 3. Herkenbare pijnpunten (horeca-specifiek) */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">Herkenbaar?</p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">Vier pijnpunten die elke restauranthouder kent</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {painPoints.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <Icon className="h-6 w-6 text-amber-300" />
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Wat ServeFlow daadwerkelijk doet */}
      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">Wat ServeFlow doet</p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">Eén flow, van aanvraag tot herinnering</h2>
          <p className="mt-4 max-w-2xl text-gray-400">
            ServeFlow vervangt niet uw hele website of reserveringssysteem. Het richt één specifieke flow in — van eerste aanvraag tot bevestiging, herinnering en eventuele annulering — zodat uw personeel niet meer zelf hoeft te bellen, typen of herinneren.
          </p>
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

      {/* 5. Concrete deliverables + 7. Wat niet beloofd wordt */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-2">
        <article className="rounded-3xl border border-amber-400/25 bg-amber-400/5 p-8">
          <h2 className="text-2xl font-black">Wat u krijgt</h2>
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

      {/* 10. Vertrouwen / portfolio */}
      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-amber-300" />
            <h2 className="text-2xl font-black">Waarom BonanzaLabs</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-bold">Lokale aanwezigheid</h3>
              <p className="mt-2 text-sm text-white/55">BonanzaLabs is gevestigd in Groningen. Geen anonieme online marketeer, maar een lokale partner die langskomt.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-bold">Vaste pilot-scope</h3>
              <p className="mt-2 text-sm text-white/55">Eén locatie, één flow, 14 dagen. Geen vage beloftes, geen verrassingen achteraf.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-bold">Terugbetaling-garantie</h3>
              <p className="mt-2 text-sm text-white/55">Werkt de afgesproken flow niet? Dan krijgt u het pilotbedrag terug.</p>
            </article>
          </div>
          <div className="mt-8">
            <Link href="/portfolio" className="text-sm font-semibold text-amber-300 hover:text-amber-200" data-cta="serveflow-portfolio">
              Bekijk ons portfolio →
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Leveringsgarantie */}
      <section className="px-6 py-16">
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

      {/* 9. Contact secondary CTA */}
      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-black md:text-3xl">Liever eerst persoonlijk contact?</h2>
          <p className="mt-4 text-white/55">Stuur een bericht. We reageren doorgaans binnen één werkdag.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-4 font-semibold hover:bg-white/5"
              data-cta="serveflow-contact-form"
            >
              <MessageCircle className="h-4 w-4" /> Stuur een bericht
            </Link>
          </div>
        </div>
      </section>

      {/* 12. FAQ section */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-3xl font-black md:text-4xl text-center">Veelgestelde vragen</h2>
        <div className="mt-12 space-y-6">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <summary className="cursor-pointer text-lg font-bold text-white list-none flex items-center justify-between">
                {faq.question}
                <span className="text-amber-300 transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-white/65">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 13. Afsluitende CTA */}
      <section className="border-t border-white/10 px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black md:text-4xl">Klaar om één flow echt te testen?</h2>
          <p className="mt-4 text-white/55">Boek de pilot via Stripe. Na betaling plannen we eerst de intake; de meetperiode start pas wanneer de afgesproken flow live staat.</p>
          <Link
            href="/pricing"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-8 py-4 font-bold text-black hover:bg-amber-300"
            data-cta="serveflow-final-cta"
          >
            Start ServeFlow voor €497 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 14. Footer */}
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
