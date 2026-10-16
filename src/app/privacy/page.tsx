import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import LegalConceptNote from "@/components/legal-concept-note";
import { businessDetails, fullBusinessAddress } from "@/lib/business-details";

const sections = [
  {
    title: "1. Wie verwerkt je gegevens?",
    paragraphs: [
      `${businessDetails.tradeName}, een eenmanszaak ingeschreven bij de Kamer van Koophandel onder nummer ${businessDetails.kvkNumber}, is verantwoordelijk voor de verwerking van persoonsgegevens via bonanza-labs.com, het contactformulier, de chat, de ServeFlow-pilot en betaalprocessen.`,
      `Voor privacyvragen of verzoeken kun je contact opnemen via ${businessDetails.contactEmail}.`,
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
      "We gebruiken de volgende leveranciers (subverwerkers). Elke partij ontvangt alleen de gegevens die nodig zijn voor haar taak:",
      "Vercel Inc. (VS): hosting van de website en serverfuncties, technische logs.",
      "Stripe Payments Europe Ltd. (Ierland): betalingen en facturen.",
      "Upstash Inc. (VS): opslag van leadaanvragen en betaalstatus (Redis-database).",
      "Resend Inc. (VS): versturen van e-mailnotificaties over aanvragen.",
      "ElevenLabs Inc. (VS): Bonanza Voice, spraak- en tekstgesprekken met de AI-assistent (audio, transcript, technische gegevens).",
      "MiniMax en OpenRouter Inc. (VS): genereren van antwoorden in de AI-chat op de website.",
      "Telegram Messenger Inc.: interne storingsmeldingen aan de eigenaar over mislukte e-mails (geen volledige aanvragen). [TODO: controleren welke velden in deze melding staan.]",
      "Doorgifte naar landen buiten de EER gebeurt alleen met een passende waarborg, zoals het EU-VS Data Privacy Framework of standaardcontractbepalingen van de Europese Commissie.",
      "Deze partijen ontvangen alleen gegevens die nodig zijn voor hun specifieke taak. BonanzaLabs verkoopt geen persoonsgegevens aan adverteerders of databrokers.",
    ],
  },
  {
    title: "4a. Bonanza Voice en AI (EU AI Act art. 50)",
    paragraphs: [
      "Bonanza Voice is een AI-assistent, geen mens. Aan het begin van elk gesprek, op de website en bij telefoonlijnen die we voor klanten inrichten, wordt gemeld dat je met AI spreekt.",
      "Bij een gesprek worden je stem, het transcript en technische gegevens verwerkt door ElevenLabs. Bij een telefoonlijn van een klant kan ook je telefoonnummer worden verwerkt. Of een gesprek wordt opgenomen, hoor je aan het begin van het gesprek. [TODO: bevestigen of opname/transcriptbewaring in ElevenLabs aan staat en hoe lang.]",
      "Bij telefoonlijnen die we voor een zakelijke klant inrichten, is die klant de verwerkingsverantwoordelijke en BonanzaLabs de verwerker. Daarvoor sluiten we een verwerkersovereenkomst (zie bonanza-labs.com/verwerkersovereenkomst).",
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
      `Stuur je verzoek naar ${businessDetails.contactEmail}. We kunnen aanvullende informatie vragen om je identiteit te controleren, maar vragen niet meer gegevens dan daarvoor nodig zijn. Je kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens.`,
    ],
  },
  {
    title: "8. Cookies, analytics en technische opslag",
    paragraphs: [
      "De website kan functionele opslag gebruiken die nodig is voor navigatie, beveiliging en het correct uitvoeren van formulieren en betalingen.",
      "We gebruiken geen analytics- of marketingcookies. Een overzicht van de functionele opslag staat op bonanza-labs.com/cookies.",
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
  return (
    <main id="main-content" className="light-site light-subpage min-h-screen">
      <SiteNav />

      <section className="border-b border-white/10 bg-gradient-to-br from-blue-950/30 via-[#070A12] to-cyan-950/20 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Terug naar home</Link>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200"><ShieldCheck className="h-4 w-4" /> Privacy en gegevensbescherming</div>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">Privacyverklaring</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">Duidelijke informatie over welke gegevens we verwerken, waarom we dat doen en welke keuzes en rechten je hebt.</p>
          <p className="mt-5 text-sm text-slate-500">Laatst bijgewerkt: 16 oktober 2026</p>
          <LegalConceptNote />
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <section className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-6 text-sm leading-7 text-slate-300">
          <p><strong>Verwerkingsverantwoordelijke:</strong> {businessDetails.tradeName}</p>
          <p><strong>Rechtsvorm:</strong> {businessDetails.legalForm}</p>
          <p><strong>KvK-nummer:</strong> {businessDetails.kvkNumber}</p>
          <p><strong>Vestigingsnummer:</strong> {businessDetails.branchNumber}</p>
          <p><strong>Hoofdvestiging:</strong> {fullBusinessAddress}</p>
          <p><strong>Contact:</strong> {businessDetails.contactEmail}</p>
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
          <a href={`mailto:${businessDetails.contactEmail}`} className="mt-6 inline-flex rounded-xl bg-[#2563EB] px-5 py-3 font-semibold hover:bg-[#1D4ED8]">{businessDetails.contactEmail}</a>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
