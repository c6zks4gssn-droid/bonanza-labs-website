import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";

const legalName = process.env.NEXT_PUBLIC_LEGAL_NAME || "BonanzaLabs";
const kvkNumber = process.env.NEXT_PUBLIC_KVK_NUMBER || "";
const businessAddress = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "";
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@bonanza-labs.com";

const sections = [
  {
    title: "1. Wie verwerkt je gegevens?",
    paragraphs: [
      `${legalName} is verantwoordelijk voor de verwerking van persoonsgegevens via bonanza-labs.com, het contactformulier, de chat, de ServeFlow-pilot en betaalprocessen.`,
      `Voor privacyvragen of verzoeken kun je contact opnemen via ${contactEmail}.`,
    ],
  },
  {
    title: "2. Welke persoonsgegevens verwerken we?",
    paragraphs: [
      "Afhankelijk van hoe je de website gebruikt, verwerken we je naam, e-mailadres, telefoonnummer, bedrijfsinformatie, berichtinhoud, bronpagina, IP-adres, browserinformatie en technische loggegevens.",
      "Voor een ServeFlow-pilot kunnen we daarnaast informatie verwerken over de locatie, reserveringsroute, openingstijden, gewenste berichtinhoud en contactpersonen die nodig zijn om de afgesproken flow in te richten.",
      "Bij een Stripe-betaling ontvangen we betaalstatus, het gekozen product, bedrag, valuta, klantidentificatie en contactgegevens. Volledige kaartgegevens worden door Stripe verwerkt en niet door BonanzaLabs opgeslagen.",
      "Wanneer je de AI-chat gebruikt, worden de berichten die je invoert verwerkt om een antwoord te genereren. Deel via de chat geen wachtwoorden, betaalgegevens, gezondheidsgegevens of andere gevoelige informatie.",
    ],
  },
  {
    title: "3. Waarom verwerken we deze gegevens?",
    paragraphs: [
      "We gebruiken persoonsgegevens om vragen te beantwoorden, pilots en Flow Assessments te plannen, betalingen af te handelen, de afgesproken dienst te leveren, misbruik te voorkomen en onze website en processen te verbeteren.",
      "De verwerking is gebaseerd op het uitvoeren van een overeenkomst of voorbereidende stappen, ons gerechtvaardigd belang om aanvragen veilig en zorgvuldig af te handelen, wettelijke administratieve verplichtingen en — waar nodig — toestemming.",
    ],
  },
  {
    title: "4. Met welke leveranciers delen we gegevens?",
    paragraphs: [
      "We gebruiken gespecialiseerde leveranciers voor hosting, betalingen, gegevensopslag, e-mailnotificaties en AI-antwoorden. Dit kunnen onder meer Vercel, Stripe, Upstash, Resend, MiniMax en OpenRouter zijn.",
      "Deze partijen ontvangen alleen gegevens die nodig zijn voor hun specifieke taak. BonanzaLabs verkoopt geen persoonsgegevens aan adverteerders of databrokers.",
    ],
  },
  {
    title: "5. Hoe lang bewaren we gegevens?",
    paragraphs: [
      "Leadaanvragen bewaren we in beginsel maximaal 24 maanden na het laatste inhoudelijke contact, tenzij de gegevens eerder niet meer nodig zijn of een langere bewaartermijn noodzakelijk is voor een lopende overeenkomst of geschil.",
      "Betaal- en administratieve gegevens bewaren we zolang dit nodig is voor de uitvoering van de overeenkomst en de toepasselijke wettelijke administratieplicht. Technische beveiligingslogs bewaren we zo kort mogelijk en alleen zolang ze nodig zijn voor veiligheid en storingsonderzoek.",
    ],
  },
  {
    title: "6. Beveiliging",
    paragraphs: [
      "We beperken toegang tot persoonsgegevens, gebruiken versleutelde verbindingen en bewaren geheime sleutels uitsluitend in beveiligde serveromgevingen. Geen enkel digitaal systeem is volledig risicovrij, maar we nemen passende technische en organisatorische maatregelen om misbruik, verlies en onbevoegde toegang te beperken.",
      "Het interne leadoverzicht en de bijbehorende API zijn beschermd met server-side authenticatie. Zonder ingestelde beheercredentials blijven deze routes gesloten.",
    ],
  },
  {
    title: "7. Jouw privacyrechten",
    paragraphs: [
      "Je kunt vragen om inzage, correctie, verwijdering, beperking, overdracht of bezwaar tegen bepaalde verwerkingen. Waar verwerking op toestemming is gebaseerd, kun je die toestemming intrekken.",
      `Stuur je verzoek naar ${contactEmail}. We kunnen aanvullende informatie vragen om je identiteit te controleren, maar vragen niet meer gegevens dan daarvoor nodig zijn. Je kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens.`,
    ],
  },
  {
    title: "8. Cookies, analytics en technische opslag",
    paragraphs: [
      "De website kan functionele opslag gebruiken die nodig is voor navigatie, beveiliging en het correct uitvoeren van formulieren en betalingen.",
      "Niet-noodzakelijke analytics- of marketingcookies worden pas toegevoegd wanneer daarvoor een passende grondslag en, indien vereist, toestemming is geregeld.",
    ],
  },
  {
    title: "9. Wijzigingen",
    paragraphs: [
      "We kunnen deze verklaring aanpassen wanneer onze diensten, pilotopzet of leveranciers veranderen. De meest recente versie staat altijd op deze pagina.",
    ],
  },
];

export default function PrivacyPage() {
  const legalDetailsComplete = Boolean(kvkNumber && businessAddress);

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="font-bold tracking-tight">BonanzaLabs</Link>
          <Link href="/contact" className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold hover:bg-[#1D4ED8]">Contact</Link>
        </div>
      </header>

      <section className="border-b border-white/10 bg-gradient-to-br from-blue-950/30 via-[#070A12] to-cyan-950/20 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Terug naar home</Link>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200"><ShieldCheck className="h-4 w-4" /> Privacy en gegevensbescherming</div>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">Privacyverklaring</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">Duidelijke informatie over welke gegevens we verwerken, waarom we dat doen en welke keuzes en rechten je hebt.</p>
          <p className="mt-5 text-sm text-slate-500">Laatst bijgewerkt: 28 juli 2026</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <section className={`rounded-2xl border p-6 text-sm leading-7 ${legalDetailsComplete ? "border-emerald-300/20 bg-emerald-300/5 text-slate-300" : "border-amber-300/25 bg-amber-300/5 text-amber-100"}`}>
          <p><strong>Verwerkingsverantwoordelijke:</strong> {legalName}</p>
          <p><strong>KvK:</strong> {kvkNumber || "nog niet ingesteld"}</p>
          <p><strong>Vestigingsadres:</strong> {businessAddress || "nog niet ingesteld"}</p>
          <p><strong>Contact:</strong> {contactEmail}</p>
          {!legalDetailsComplete && <p className="mt-3 font-semibold">Merge naar productie pas nadat KvK-nummer en vestigingsadres zijn ingesteld.</p>}
        </section>

        <div className="mt-12 space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-black">{section.title}</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-300">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-[#0D1220] p-8">
          <Mail className="h-6 w-6 text-cyan-300" />
          <h2 className="mt-4 text-2xl font-black">Privacyverzoek indienen</h2>
          <p className="mt-3 text-slate-400">Vermeld duidelijk wat je wilt inzien, wijzigen of verwijderen. Stuur geen volledige kopie van je identiteitsbewijs mee.</p>
          <a href={`mailto:${contactEmail}`} className="mt-6 inline-flex rounded-xl bg-[#2563EB] px-5 py-3 font-semibold hover:bg-[#1D4ED8]">{contactEmail}</a>
        </div>
      </div>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 text-sm text-slate-500 md:flex-row"><p>© 2026 BonanzaLabs</p><div className="flex gap-5"><Link href="/voorwaarden" className="hover:text-white">Voorwaarden</Link><Link href="/pricing" className="hover:text-white">Prijzen</Link><Link href="/contact" className="hover:text-white">Contact</Link></div></div>
      </footer>
    </main>
  );
}
