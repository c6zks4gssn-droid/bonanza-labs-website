"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Check,
  Headphones,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";

const useCases = [
  {
    icon: PhoneCall,
    title: "Gemiste oproepen opvangen",
    text: "Een voice-agent kan afgesproken soorten inkomende gesprekken aannemen wanneer je team niet beschikbaar is.",
  },
  {
    icon: MessageSquareText,
    title: "Basisvragen beantwoorden",
    text: "Openingstijden, locatie, eenvoudige dienstinformatie en andere gecontroleerde antwoorden kunnen consistent worden afgehandeld.",
  },
  {
    icon: Headphones,
    title: "Terugbelverzoeken registreren",
    text: "Wanneer een medewerker nodig is, verzamelt de flow de relevante gegevens en zet het gesprek door naar een menselijke vervolgactie.",
  },
  {
    icon: Bot,
    title: "Gesprekken structureren",
    text: "Samenvattingen en afgesproken velden kunnen na het gesprek worden vastgelegd voor opvolging.",
  },
];

const guardrails = [
  "De agent maakt geen prijsafspraken buiten vooraf gedefinieerde regels.",
  "Onzekerheid en uitzonderingen gaan naar een medewerker.",
  "Geen belofte van omzet, bereikbaarheid of foutloze afhandeling.",
  "Gespreksdata en bewaartermijnen worden per implementatie afgesproken.",
  "We starten met een beperkte gespreksscope voordat meer functies worden toegevoegd.",
];

const faq = [
  {
    q: "Is Bonanza Voice al een standaardpakket?",
    a: "Bonanza Voice wordt momenteel als maatwerk of add-on ingezet. We starten met één duidelijke gespreksscope en breiden alleen uit wanneer de praktijk daar aanleiding toe geeft.",
  },
  {
    q: "Kan de voice-agent mijn bestaande telefoonnummer gebruiken?",
    a: "Dat hangt af van de huidige telefonieprovider en gewenste routering. Tijdens de intake bepalen we of doorschakeling, SIP of een aparte lijn de meest eenvoudige route is.",
  },
  {
    q: "Kan de agent afspraken of reserveringen boeken?",
    a: "Dat kan technisch mogelijk zijn wanneer de agenda- of reserveringssoftware een geschikte koppeling heeft. We nemen dit alleen op in scope wanneer de integratie betrouwbaar genoeg is.",
  },
  {
    q: "Wat gebeurt er als de agent iets niet weet?",
    a: "Dan moet de flow kunnen stoppen, verduidelijking vragen of doorzetten naar een medewerker. Onzekerheid hoort bij het ontwerp en wordt niet verborgen.",
  },
  {
    q: "Kan ik eerst een demo krijgen?",
    a: "Ja. Voor een concrete businesscase kan BonanzaLabs een afgebakende demonstratie laten zien voordat je beslist over implementatie.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Bonanza Voice",
  provider: {
    "@type": "Organization",
    name: "BonanzaLabs",
    url: "https://www.bonanza-labs.com",
  },
  areaServed: {
    "@type": "Country",
    name: "Netherlands",
  },
  serviceType: "AI voice automation for SMEs",
  url: "https://www.bonanza-labs.com/bonanza-voice",
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

export default function BonanzaVoicePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050508] text-white">
      <SiteNav active="/bonanza-voice" />

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
          <div className="absolute left-1/3 top-1/4 h-[520px] w-[520px] rounded-full bg-emerald-600/13 blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 h-[420px] w-[420px] rounded-full bg-cyan-600/10 blur-[110px]" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
            <PhoneCall className="h-4 w-4" />
            Bonanza Voice · maatwerk / add-on
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Laat een drukke telefoon niet automatisch een gemiste klantvraag worden.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
            Bonanza Voice is een afgebakende voice-automation voor terugkerende telefoontaken.
            De agent kan gecontroleerde vragen afhandelen, gegevens verzamelen en een menselijke
            vervolgactie klaarzetten wanneer het gesprek buiten scope valt.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              data-cta="voice-demo"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-7 py-4 font-bold text-black hover:bg-emerald-300"
            >
              Vraag een demo aan <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/oplossingen"
              className="rounded-xl border border-white/15 px-7 py-4 font-semibold hover:bg-white/5"
            >
              Bekijk alle oplossingen
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Direct antwoord</p>
          <p className="mt-5 max-w-4xl text-lg leading-relaxed text-white/70">
            Bonanza Voice vervangt niet automatisch je volledige telefoonproces. We kiezen eerst één
            gesprekstype dat vaak terugkomt en duidelijke grenzen heeft. Denk aan basisvragen,
            terugbelverzoeken of eenvoudige intake. Wanneer het gesprek afwijkt of onzeker wordt,
            gaat de vervolgstap naar een medewerker.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Mogelijke use-cases</p>
        <h2 className="mt-4 text-3xl font-black md:text-4xl">Begin met gesprekken die vaak hetzelfde patroon hebben</h2>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {useCases.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <Icon className="h-6 w-6 text-emerald-300" />
                <h3 className="mt-4 font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Guardrails</p>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">Een voice-agent moet weten wanneer hij moet stoppen.</h2>
            <p className="mt-5 leading-relaxed text-white/60">
              De eerste versie hoeft niet alles te kunnen. Een goede implementatie is juist sterk
              doordat uitzonderingen zichtbaar zijn en een medewerker kan overnemen.
            </p>
          </div>

          <div className="space-y-3">
            {guardrails.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                <span className="text-sm leading-relaxed text-white/70">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">FAQ</p>
        <h2 className="mt-4 text-3xl font-black md:text-4xl">Vragen vóór een voice-implementatie</h2>
        <div className="mt-9 space-y-4">
          {faq.map((item) => (
            <details key={item.q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <summary className="cursor-pointer font-semibold">{item.q}</summary>
              <p className="mt-4 text-sm leading-relaxed text-white/60">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-400/25 bg-emerald-400/5 p-8 text-center md:p-12">
          <Check className="mx-auto h-8 w-8 text-emerald-300" />
          <h2 className="mt-5 text-3xl font-black">Eerst horen hoe het werkt?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/60">
            Beschrijf het type gesprekken dat je nu mist of handmatig afhandelt.
            Dan bepalen we of een beperkte voice-demo zinvol is.
          </p>
          <Link
            href="/contact"
            data-cta="voice-final"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-7 py-4 font-bold text-black hover:bg-emerald-300"
          >
            Vraag demo aan <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
