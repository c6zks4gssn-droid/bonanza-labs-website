"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  Clock3,
  MessageSquareText,
  TimerReset,
  X,
} from "lucide-react";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { PRICES, formatEuro } from "@/lib/pricing";

const painPoints = [
  {
    title: "Onderhoud hangt van een lijst of geheugen af",
    text: "Wie is wanneer voor het laatst geweest? Dat staat in een Excel, een agenda of in iemands hoofd. Klanten vallen er stil tussenuit.",
  },
  {
    title: "Inplannen kost heen-en-weer bellen",
    text: "Elke afspraak betekent bellen, voicemail inspreken, terugbellen en schuiven. Dat kost kantoortijd die je liever aan het werk besteedt.",
  },
  {
    title: "Iedereen wil tegelijk in het najaar",
    text: "Als het stookseizoen begint, bellen klanten massaal. Eerder herinneren spreidt het werk beter over het jaar.",
  },
  {
    title: "Klanten bellen pas als er iets stuk is",
    text: "Zonder herinnering wordt onderhoud uitgesteld. Dan wordt een geplande klus een spoedklus, voor jou en voor de klant.",
  },
];

const exampleSteps = [
  {
    step: "Stap 1",
    title: "Herinnering op tijd",
    text: "Vier weken voor de onderhoudsdatum krijgt de klant een bericht.",
    message:
      "Hallo Peter, je cv-ketel is vorig jaar op 12 oktober onderhouden. Kies hier een moment voor de jaarlijkse beurt.",
  },
  {
    step: "Stap 2",
    title: "Klant kiest een moment",
    text: "De klant kiest uit de tijden die jij vrijgeeft. Geen bellen nodig.",
    message: "Dinsdag 14 oktober · ochtend (8:00–12:00)",
  },
  {
    step: "Stap 3",
    title: "Bevestiging en herinnering",
    text: "De klant krijgt een bevestiging en een dag vooraf nog een herinnering.",
    message: "Hallo Peter, morgenochtend komen we je cv-ketel onderhouden. Tot dan!",
  },
  {
    step: "Stap 4",
    title: "Geen reactie? Op je belijst",
    text: "Na één herinnering zonder reactie zet de flow de klant op een belijst voor je team.",
    message: "Nog in te plannen: 7 klanten · bekijk belijst",
  },
];

const deliverables = [
  "Intake van je huidige onderhoudsklanten en planning",
  "Eén overzicht met per klant de laatste onderhoudsdatum",
  "Herinnering per e-mail (sms of WhatsApp volgens afspraak)",
  "Klant kiest een moment uit de tijden die jij vrijgeeft",
  "Bevestiging en herinnering een dag vooraf",
  "Belijst van klanten die niet reageren",
  "Evaluatie na de eerste maand",
];

const exclusions = [
  "Vervanging van je planningssoftware of boekhouding",
  "Automatische prijzen, offertes of facturen",
  "Een garantie dat elke klant een afspraak maakt",
  "Klanten benaderen zonder vooraf afgesproken grondslag",
];

const faq = [
  {
    q: "Werkt dit met mijn huidige planningssoftware?",
    a: "Dat bekijken we tijdens de intake. Soms is een koppeling mogelijk, soms werkt een eenvoudige export of een gedeelde agenda beter. We vervangen je software niet als eerste stap.",
  },
  {
    q: "Wat gebeurt er als een klant niet reageert?",
    a: "De klant krijgt één herinnering. Komt er daarna nog geen reactie, dan zet de flow de klant op een belijst, zodat je team zelf contact kan opnemen. We blijven niet eindeloos berichten sturen.",
  },
  {
    q: "Mag ik mijn klanten zomaar een bericht sturen?",
    a: "We spreken vooraf af welke klanten je benadert en op welke grond. Elk bericht heeft een duidelijke afmeldmogelijkheid, en na een afmelding stuurt de flow niets meer.",
  },
  {
    q: "Wat kost TradeFlow Onderhoud?",
    a: "De inrichting kost vanaf ${formatEuro(PRICES.tradeflowOnderhoud)} excl. btw. Daarna kun je kiezen voor beheer vanaf ${formatEuro(PRICES.beheerBasis)} per maand excl. btw. Sms-kosten en koppelingen spreken we per klant af. Na de intake krijg je een vaste prijs voordat we iets bouwen.",
  },
  {
    q: "Kan dit samen met TradeFlow of Bonanza Voice?",
    a: "Ja. TradeFlow Onderhoud gebruikt dezelfde basis als TradeFlow voor offertes. Met Bonanza Voice kunnen klanten ook bellen om een moment te kiezen. We beginnen wel met één flow en breiden pas uit als die goed werkt.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TradeFlow Onderhoud",
  provider: {
    "@type": "Organization",
    name: "BonanzaLabs",
    url: "https://www.bonanza-labs.com",
  },
  areaServed: {
    "@type": "Country",
    name: "Netherlands",
  },
  serviceType: "Maintenance reminders and scheduling for installation SMEs",
  url: "https://www.bonanza-labs.com/onderhoudsherinneringen",
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: "995",
      priceCurrency: "EUR",
      valueAddedTaxIncluded: false,
    },
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function OnderhoudsherinneringenPage() {
  return (
    <main id="main-content" className="light-site light-subpage min-h-screen">
      <SiteNav active="/onderhoudsherinneringen" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="relative px-6 pb-20 pt-36">
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-4 py-2 text-sm font-semibold text-violet-200">
            <Clock3 className="h-4 w-4" />
            TradeFlow Onderhoud · installatie
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Jaarlijks onderhoud plannen zonder bellen en bijhouden.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
            Voor installateurs met onderhoudsklanten voor cv-ketels, warmtepompen of airco.
            Klanten krijgen op tijd een herinnering en kiezen zelf een moment uit jouw beschikbare
            tijden. Jij ziet in één overzicht wie is ingepland en wie nog niet.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              data-cta="onderhoud-intro"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-7 py-4 font-bold text-white hover:opacity-90"
            >
              Bespreek je onderhoudsplanning <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-sm font-semibold text-white/60">Inrichting vanaf €995 excl. btw</p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Direct antwoord</p>
          <p className="mt-5 max-w-4xl text-lg leading-relaxed text-white/70">
            TradeFlow Onderhoud is een afgebakende flow rond één terugkerende taak: onderhoudsklanten
            op tijd herinneren en laten inplannen. Jij bepaalt welke tijden beschikbaar zijn en welke
            klanten een bericht krijgen. Klanten die niet reageren, komen op een belijst voor je team.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Herkenbaar?</p>
        <h2 className="mt-4 text-3xl font-black md:text-4xl">Waar onderhoudsplanning tijd verliest</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {painPoints.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Zo werkt het</p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">Van herinnering tot ingeplande afspraak</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {exampleSteps.map((item) => (
              <article key={item.step} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">{item.step}</p>
                <h3 className="mt-2 font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{item.text}</p>
                <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/70">
                  {item.message}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-white/50">
            Voorbeeld met fictieve gegevens. Er worden geen berichten verstuurd of afspraken gemaakt.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Concrete scope</p>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">Wat je krijgt</h2>
            <ul className="mt-6 grid gap-3">
              {deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/70">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Grenzen</p>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">Wat het niet doet</h2>
            <ul className="mt-6 grid gap-3">
              {exclusions.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/70">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Onze aanpak</p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">In drie stappen live</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: ClipboardCheck,
                title: "1. Intake",
                text: "We bekijken je klantenbestand, je planning en welke tijden je wilt vrijgeven.",
              },
              {
                icon: MessageSquareText,
                title: "2. Inrichten",
                text: "We zetten de klantenlijst om, schrijven de berichten met je mee en testen de flow.",
              },
              {
                icon: TimerReset,
                title: "3. Live en evalueren",
                text: "De eerste herinneringen gaan uit. Na een maand bekijken we samen wat werkt en wat beter kan.",
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <Icon className="h-6 w-6 text-violet-300" aria-hidden="true" />
                  <h3 className="mt-4 font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Prijs</p>
        <h2 className="mt-4 text-3xl font-black md:text-4xl">Inrichting vanaf €995 excl. btw</h2>
        <p className="mt-5 leading-relaxed text-white/60">
          Daarna optioneel beheer vanaf {formatEuro(PRICES.beheerBasis)} per maand excl. btw. Sms-kosten en eventuele koppelingen
          spreken we per klant af. Na de intake krijg je een vaste prijs, voordat we iets bouwen.
        </p>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">FAQ</p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">Veelgestelde vragen</h2>
          <div className="mt-9 space-y-4">
            {faq.map((item) => (
              <details key={item.q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <summary className="cursor-pointer font-semibold">{item.q}</summary>
                <p className="mt-4 text-sm leading-relaxed text-white/60">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-violet-400/25 bg-violet-400/5 p-8 text-center md:p-12">
          <h2 className="text-3xl font-black">Begin met je onderhoudsklanten.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/60">
            In een korte kennismaking kijken we hoeveel onderhoudsklanten je hebt en hoe je ze nu
            inplant. Dan weet je snel of deze flow past.
          </p>
          <Link
            href="/contact"
            data-cta="onderhoud-final"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-7 py-4 font-bold text-white hover:opacity-90"
          >
            Vraag gratis quickscan aan <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <aside className="mx-auto max-w-6xl px-6 pb-16">
        <Link href="/tradeflow" className="font-semibold underline">Ook offertes en aanvragen opvolgen? Bekijk TradeFlow</Link>
      </aside>
      <SiteFooter />
    </main>
  );
}
