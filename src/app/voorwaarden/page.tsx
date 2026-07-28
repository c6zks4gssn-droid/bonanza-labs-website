import Link from "next/link";
import { ArrowLeft, FileCheck2, Mail } from "lucide-react";

const legalName = process.env.NEXT_PUBLIC_LEGAL_NAME || "BonanzaLabs";
const kvkNumber = process.env.NEXT_PUBLIC_KVK_NUMBER || "";
const businessAddress = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "";
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@bonanza-labs.com";

const terms = [
  {
    title: "1. Toepasselijkheid",
    paragraphs: [
      "Deze voorwaarden gelden voor de ServeFlow 14-dagen pilot, Flow Assessments en andere diensten die BonanzaLabs schriftelijk aanbiedt. Afwijkingen gelden alleen wanneer ze schriftelijk zijn bevestigd.",
      "Bij tegenstrijdigheid gaat de individuele offerte of schriftelijk bevestigde pilotscope vóór op deze algemene voorwaarden.",
    ],
  },
  {
    title: "2. ServeFlow 14-dagen pilot",
    paragraphs: [
      "De standaardpilot kost €497 exclusief btw en omvat één horecalocatie en één vooraf schriftelijk afgesproken reserveringsflow.",
      "De pilot kan bestaan uit een intake, inrichting van de flow, reserveringsbevestiging, herinnering, mogelijkheid tot wijzigen of annuleren, een interne samenvatting en een evaluatie na veertien dagen.",
      "De meetperiode van veertien dagen start op de schriftelijk bevestigde livegangsdatum en niet automatisch op de betaaldatum.",
    ],
  },
  {
    title: "3. Geen automatische verlenging",
    paragraphs: [
      "De ServeFlow-pilot eindigt automatisch na de afgesproken pilotperiode. Er ontstaat geen abonnement en er worden geen vervolgkosten geïncasseerd zonder een nieuwe, uitdrukkelijke overeenkomst.",
      "Een vervolgimplementatie, beheerabonnement of uitbreiding wordt afzonderlijk besproken en geprijsd.",
    ],
  },
  {
    title: "4. Wat niet onder de standaardpilot valt",
    paragraphs: [
      "Tenzij schriftelijk anders overeengekomen vallen een complete nieuwe website, meerdere locaties, meerdere reserveringsflows, AI-telefonie, uitgebreide CRM-migratie, onbeperkte koppelingen en onbeperkte wijzigingen niet onder de standaardpilot.",
      "Werk buiten de bevestigde scope wordt alleen uitgevoerd na schriftelijke goedkeuring van prijs en planning.",
    ],
  },
  {
    title: "5. Medewerking van de klant",
    paragraphs: [
      "De klant levert tijdig juiste informatie, toegang, teksten en beslissingen aan die nodig zijn om de afgesproken flow in te richten.",
      "De klant controleert vóór livegang namen, openingstijden, voorwaarden, annuleringsinformatie, berichten en andere bedrijfsspecifieke inhoud.",
      "Vertraging door ontbrekende toegang of informatie verschuift de planning en vormt geen tekortkoming van BonanzaLabs.",
    ],
  },
  {
    title: "6. Leveringsgarantie",
    paragraphs: [
      "Kunnen wij de vooraf schriftelijk afgesproken reserveringsflow niet werkend opleveren, dan kan de klant terugbetaling van het betaalde pilotbedrag vragen.",
      "De klant geeft BonanzaLabs eerst een redelijke mogelijkheid om een aantoonbaar technisch gebrek binnen de afgesproken scope te herstellen.",
      "De garantie geldt niet wanneer levering wordt verhinderd door ontbrekende klantinformatie, ingetrokken toegang, beperkingen van externe platforms, wijzigingen door de klant of uitbreiding buiten de afgesproken scope.",
    ],
  },
  {
    title: "7. Geen resultaatgarantie",
    paragraphs: [
      "BonanzaLabs garandeert geen extra omzet, aantallen reserveringen, terugverdientijd, daling van no-shows, hogere reviewscore of ander commercieel resultaat.",
      "Resultaten hangen mede af van reserveringsvolume, bedrijfsvoering, personeel, gastgedrag, gebruikte kanalen en externe leveranciers.",
    ],
  },
  {
    title: "8. Betaling en btw",
    paragraphs: [
      "Bedragen op de zakelijke website zijn exclusief btw tenzij uitdrukkelijk anders vermeld. Betaling via Stripe vindt vooraf plaats.",
      "Na betaling ontvangt de klant een bevestiging en neemt BonanzaLabs contact op voor de intake. Een betaling is geen stilzwijgende instemming met werk buiten de beschreven aanbieding.",
    ],
  },
  {
    title: "9. Externe diensten en gegevens",
    paragraphs: [
      "Voor hosting, betalingen, berichten, opslag en AI-functionaliteit kunnen externe leveranciers worden gebruikt. Beschikbaarheid en beleid van zulke leveranciers vallen gedeeltelijk buiten de invloed van BonanzaLabs.",
      "Persoonsgegevens worden verwerkt volgens de privacyverklaring op bonanza-labs.com/privacy.",
    ],
  },
  {
    title: "10. Aansprakelijkheid",
    paragraphs: [
      "BonanzaLabs is niet aansprakelijk voor indirecte schade, gemiste winst, gemiste reserveringen of bedrijfsstagnatie, behalve wanneer uitsluiting wettelijk niet is toegestaan.",
      "Voor zover wettelijk toegestaan is de totale aansprakelijkheid beperkt tot het bedrag dat voor de betreffende opdracht is betaald.",
      "De klant blijft verantwoordelijk voor definitieve klantcommunicatie, openingstijden, beschikbaarheid, prijzen, huisregels en de feitelijke uitvoering van reserveringen en diensten.",
    ],
  },
  {
    title: "11. Intellectuele eigendom en gebruik",
    paragraphs: [
      "De klant mag de specifiek voor hem opgeleverde configuratie gebruiken volgens de schriftelijke afspraak. Rechten op algemene software, componenten, methoden en herbruikbare templates blijven bij BonanzaLabs of de betreffende licentiegever.",
      "Materialen van de klant blijven eigendom van de klant. De klant verklaart bevoegd te zijn om aangeleverde teksten, logo’s, beelden en gegevens te gebruiken.",
    ],
  },
  {
    title: "12. Stoppen, klachten en toepasselijk recht",
    paragraphs: [
      "Klachten worden zo snel mogelijk na ontdekking schriftelijk gemeld, met voldoende informatie om het probleem te onderzoeken.",
      "Op de overeenkomst is Nederlands recht van toepassing. Partijen proberen een geschil eerst in overleg op te lossen voordat zij verdere stappen nemen.",
    ],
  },
];

export default function TermsPage() {
  const legalDetailsComplete = Boolean(kvkNumber && businessAddress);

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="font-bold tracking-tight">BonanzaLabs</Link>
          <Link href="/pricing" className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300">Bekijk pilot</Link>
        </div>
      </header>

      <section className="border-b border-white/10 bg-gradient-to-br from-amber-950/25 via-[#070A12] to-blue-950/20 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Link href="/pricing" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Terug naar prijzen</Link>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-200"><FileCheck2 className="h-4 w-4" /> Zakelijke pilotvoorwaarden</div>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">Voorwaarden ServeFlow-pilot</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">De scope, garantie, betaling en verantwoordelijkheden vóórdat een pilot wordt geboekt.</p>
          <p className="mt-5 text-sm text-slate-500">Laatst bijgewerkt: 28 juli 2026</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <section className={`rounded-2xl border p-6 text-sm leading-7 ${legalDetailsComplete ? "border-emerald-300/20 bg-emerald-300/5 text-slate-300" : "border-amber-300/25 bg-amber-300/5 text-amber-100"}`}>
          <p><strong>Contractpartij:</strong> {legalName}</p>
          <p><strong>KvK:</strong> {kvkNumber || "nog niet ingesteld"}</p>
          <p><strong>Vestigingsadres:</strong> {businessAddress || "nog niet ingesteld"}</p>
          <p><strong>E-mail:</strong> {contactEmail}</p>
          {!legalDetailsComplete && <p className="mt-3 font-semibold">Publiceer of merge deze voorwaarden pas nadat KvK-nummer en vestigingsadres als productievariabelen zijn ingesteld.</p>}
        </section>

        <div className="mt-12 space-y-12">
          {terms.map((term) => (
            <section key={term.title}>
              <h2 className="text-2xl font-black">{term.title}</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-300">
                {term.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-[#0D1220] p-8">
          <Mail className="h-6 w-6 text-cyan-300" />
          <h2 className="mt-4 text-2xl font-black">Vraag over de voorwaarden</h2>
          <p className="mt-3 text-slate-400">Vraag vóór betaling om verduidelijking wanneer de pilotscope of garantie niet duidelijk is.</p>
          <a href={`mailto:${contactEmail}`} className="mt-6 inline-flex rounded-xl bg-[#2563EB] px-5 py-3 font-semibold hover:bg-[#1D4ED8]">{contactEmail}</a>
        </div>
      </div>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 text-sm text-slate-500 md:flex-row"><p>© 2026 BonanzaLabs</p><div className="flex gap-5"><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/pricing" className="hover:text-white">Prijzen</Link><Link href="/contact" className="hover:text-white">Contact</Link></div></div>
      </footer>
    </main>
  );
}
