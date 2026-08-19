import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  PhoneCall,
  UtensilsCrossed,
  Workflow,
} from "lucide-react";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";

const solutions = [
  {
    name: "ServeFlow",
    audience: "Horeca",
    description:
      "Voor reserveringshandwerk, bevestigingen, wijzigingen en terugkerende communicatie die nu verspreid loopt.",
    href: "/serveflow",
    accent: "border-amber-400/25 bg-amber-400/5",
    icon: UtensilsCrossed,
  },
  {
    name: "TradeFlow",
    audience: "Bouw & installatie",
    description:
      "Voor trage offerte-opvolging, incomplete aanvragen en handwerk tussen aanvraag, calculatie en terugkoppeling.",
    href: "/tradeflow",
    accent: "border-violet-400/25 bg-violet-400/5",
    icon: Building2,
  },
  {
    name: "Bonanza Voice",
    audience: "Telefonie",
    description:
      "Voor bedrijven die oproepen missen of terugbelverzoeken en basisvragen consistenter willen afhandelen.",
    href: "/bonanza-voice",
    accent: "border-emerald-400/25 bg-emerald-400/5",
    icon: PhoneCall,
  },
];

const problems = [
  "Te veel handwerk tussen verschillende kanalen",
  "Klanten moeten wachten op bevestiging of terugkoppeling",
  "Informatie staat verspreid over WhatsApp, mail, telefoon en losse notities",
  "Medewerkers herhalen dagelijks dezelfde administratieve stappen",
];

export default function OplossingenPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050508] text-white">
      <SiteNav active="/oplossingen" />

      <section className="relative px-6 pb-20 pt-36">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/3 top-1/4 h-[520px] w-[520px] rounded-full bg-violet-600/12 blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 h-[420px] w-[420px] rounded-full bg-amber-600/10 blur-[110px]" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm font-semibold text-cyan-200">
            <Workflow className="h-4 w-4" />
            Eén proces tegelijk
          </div>
          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Automatisering die begint bij een concreet bedrijfsprobleem.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
            BonanzaLabs helpt MKB-bedrijven om terugkerend handwerk kleiner, overzichtelijker
            en beter meetbaar te maken. Geen breed AI-traject vooraf: we kiezen één proces,
            bepalen de grenzen en bouwen alleen wat aantoonbaar nodig is.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-bold text-black hover:bg-amber-300"
            >
              Bespreek je proces <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/portfolio"
              className="rounded-xl border border-white/15 px-7 py-4 font-semibold hover:bg-white/5"
            >
              Bekijk wat we bouwen
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Oplossingen</p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">
            Drie routes, ieder rond één herkenbaar probleem
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {solutions.map((solution) => {
              const Icon = solution.icon;
              return (
                <article key={solution.name} className={`rounded-3xl border p-7 ${solution.accent}`}>
                  <Icon className="h-7 w-7 text-white/85" />
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                    {solution.audience}
                  </p>
                  <h3 className="mt-2 text-2xl font-black">{solution.name}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">{solution.description}</p>
                  <Link
                    href={solution.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white"
                  >
                    Bekijk oplossing <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Herkenbaar?</p>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">
              De beste eerste automatisering is meestal niet de grootste.
            </h2>
            <p className="mt-5 leading-relaxed text-white/60">
              We zoeken eerst naar een terugkerende taak met duidelijke input, een vaste uitkomst
              en voldoende volume om verbetering te kunnen meten.
            </p>
          </div>

          <div className="space-y-3">
            {problems.map((problem) => (
              <div
                key={problem}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <span className="text-sm leading-relaxed text-white/70">{problem}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0A0E18] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">Zo werken we</p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">Van gesprek naar werkende flow</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              ["01", "Kort gesprek", "We bepalen waar het meeste handwerk, vertraging of onduidelijkheid zit."],
              ["02", "Eén proces", "We kiezen één afgebakende flow en spreken expliciet af wat buiten scope blijft."],
              ["03", "Bouwen & testen", "We richten de flow in, testen uitzonderingen en houden menselijke controle waar nodig."],
              ["04", "Meten & beslissen", "We bekijken wat er veranderde en besluiten daarna pas of uitbreiding zinvol is."],
            ].map(([number, title, text]) => (
              <article key={number} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm font-black text-amber-300">{number}</p>
                <h3 className="mt-3 font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-amber-400/20 bg-amber-400/5 p-8 text-center md:p-12">
          <Clock3 className="mx-auto h-8 w-8 text-amber-300" />
          <h2 className="mt-5 text-3xl font-black">Twijfel je waar je moet beginnen?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/60">
            In een korte kennismaking brengen we het proces terug tot één concrete vraag.
            Als BonanzaLabs niet de juiste route is, zeggen we dat ook.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-bold text-black hover:bg-amber-300"
          >
            Plan een kennismaking <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
