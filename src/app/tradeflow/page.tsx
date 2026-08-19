"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  FileText,
  MessageSquareText,
  TimerReset,
} from "lucide-react";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";

const painPoints = [
  {
    title: "Aanvragen zijn niet compleet",
    text: "Essentiële informatie ontbreekt, waardoor iemand eerst moet terugbellen of appen voordat een offerte kan worden voorbereid.",
  },
  {
    title: "Offertes blijven te lang liggen",
    text: "Wanneer aanvragen verspreid binnenkomen, ontstaat vertraging tussen intake, calculatie, offerte en opvolging.",
  },
  {
    title: "WhatsApp wordt het CRM",
    text: "Foto’s, adressen, afspraken en wijzigingen staan in losse gesprekken in plaats van in één overzichtelijke flow.",
  },
  {
    title: "Opvolging hangt van geheugen af",
    text: "Een offerte is verstuurd, maar niemand ziet direct wanneer er voor het laatst contact was of wat de volgende stap is.",
  },
];

const deliverables = [
  "Intake van het huidige aanvraag- en offerteproces",
  "Voorstel voor één afgebakende workflow",
  "Structuur voor complete aanvraaggegevens",
  "Automatische bevestiging en statusupdates waar passend",
  "Duidelijke menselijke controle vóór prijs of offerte wordt verstuurd",
  "Overzicht van opvolgmomenten en uitzonderingen",
];

const faq = [
  {
    q: "Maakt TradeFlow automatisch offertes zonder controle?",
    a: "Niet standaard. Prijzen, uitzonderingen en commerciële keuzes blijven onder menselijke controle. Automatisering ondersteunt vooral intake, structurering, conceptvorming en opvolging.",
  },
  {
    q: "Moet ik mijn huidige software vervangen?",
    a: "Niet per definitie. We bekijken eerst welke tools al worden gebruikt en of een lichte koppeling voldoende is. Vervangen is alleen logisch als dat aantoonbaar eenvoudiger of betrouwbaarder is.",
  },
  {
    q: "Is TradeFlow alleen voor grote bouwbedrijven?",
    a: "Nee. De eerste doelgroep is juist het kleinere en middelgrote bouw- en installatiebedrijf waar aanvragen, offertes en WhatsApp-opvolging nog veel handwerk vragen.",
  },
  {
    q: "Wat kost de implementatie?",
    a: "Dat hangt af van scope, integraties en het aantal stappen. We bepalen eerst één concreet proces; daarna krijg je een duidelijke implementatiescope en prijs voordat er gebouwd wordt.",
  },
  {
    q: "Wat is een goede eerste TradeFlow-case?",
    a: "Een terugkerend offertetraject met voldoende volume, vaste informatievelden en duidelijke opvolgstappen. Hoe afgebakender het eerste proces, hoe beter het resultaat te beoordelen is.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TradeFlow",
  provider: {
    "@type": "Organization",
    name: "BonanzaLabs",
    url: "https://www.bonanza-labs.com",
  },
  areaServed: {
    "@type": "Country",
    name: "Netherlands",
  },
  serviceType: "Workflow automation for construction and installation SMEs",
  url: "https://www.bonanza-labs.com/tradeflow",
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

export default function TradeFlowPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050508] text-white">
      <SiteNav active="/tradeflow" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="relative px-6 pb-20 pt-36">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/3 top-1/4 h-[520px] w-[520px] rounded-full bg-violet-600/14 blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 h-[420px] w-[420px] rounded-full bg-cyan-600/10 blur-[110px]" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-4 py-2 text-sm font-semibold text-violet-200">
            <FileText className="h-4 w-4" />
            TradeFlow · bouw & installatie
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Sneller van aanvraag naar complete offerte en duidelijke opvolging.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
            TradeFlow helpt bouw- en installatiebedrijven om één offertestroom overzichtelijker
            in te richten: informatie compleet verzamelen, status terugkoppelen en opvolging
            zichtbaar maken zonder prijzen of uitzonderingen blind te automatiseren.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              data-cta="tradeflow-intro"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-7 py-4 font-bold text-white hover:opacity-90"
            >
              Bespreek je offerteproces <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/portfolio"
              className="rounded-xl border border-white/15 px-7 py-4 font-semibold hover:bg-white/5"
            >
              Bekijk portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Direct antwoord</p>
          <p className="mt-5 max-w-4xl text-lg leading-relaxed text-white/70">
            TradeFlow is geen generieke AI-offertegenerator. Het is een afgebakende workflow rond
            aanvraag, informatie, conceptvoorbereiding en opvolging. BonanzaLabs automatiseert alleen
            stappen die stabiel genoeg zijn; prijzen, uitzonderingen en commerciële beslissingen
            blijven controleerbaar door een medewerker.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">De uitdaging</p>
        <h2 className="mt-4 text-3xl font-black md:text-4xl">Waar offertetrajecten tijd verliezen</h2>
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
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Onze aanpak</p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">Eerst de flow, dan de techniek</h2>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              {
                icon: ClipboardCheck,
                title: "1. Intake",
                text: "We brengen in kaart waar aanvraaginformatie binnenkomt en waar vertraging ontstaat.",
              },
              {
                icon: MessageSquareText,
                title: "2. Structuur",
                text: "We bepalen welke informatie verplicht is voordat een offerteproces verdergaat.",
              },
              {
                icon: TimerReset,
                title: "3. Opvolging",
                text: "We maken status en terugkoppeling zichtbaar, met reminders waar die werkelijk helpen.",
              },
              {
                icon: Check,
                title: "4. Menselijke gate",
                text: "Prijs, uitzonderingen en definitieve verzending blijven onder menselijke controle.",
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <Icon className="h-6 w-6 text-violet-300" />
                  <h3 className="mt-4 font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Concrete scope</p>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">Wat je van een eerste TradeFlow-traject krijgt</h2>
            <p className="mt-5 leading-relaxed text-white/60">
              De exacte implementatie hangt af van je huidige tools. We starten bewust met één stroom
              in plaats van je volledige operatie tegelijk te vervangen.
            </p>
          </div>

          <ul className="grid gap-3">
            {deliverables.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                <span className="text-sm leading-relaxed text-white/70">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">FAQ</p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">Vragen vóór we iets bouwen</h2>
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
          <h2 className="text-3xl font-black">Begin met één offertestroom.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/60">
            In een korte kennismaking bepalen we of het probleem klein genoeg is om gericht te testen.
            Geen softwarevervanging als eerste reflex.
          </p>
          <Link
            href="/contact"
            data-cta="tradeflow-final"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-7 py-4 font-bold text-white hover:opacity-90"
          >
            Plan kennismaking <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
