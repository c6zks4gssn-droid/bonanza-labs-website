import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { ArrowLeft, Download, FileCheck2, Mail } from "lucide-react";
import LegalConceptNote from "@/components/legal-concept-note";
import { businessDetails, fullBusinessAddress } from "@/lib/business-details";

const terms = [
  {
    title: "1. Onderneming en toepasselijkheid",
    paragraphs: [
      `${businessDetails.tradeName} is een geregistreerde handelsnaam van een eenmanszaak, ingeschreven bij de Kamer van Koophandel onder nummer ${businessDetails.kvkNumber}. Het vestigingsnummer is ${businessDetails.branchNumber}.`,
      "Deze voorwaarden gelden voor de ServeFlow 14-dagen pilot, Flow Assessments, Bonanza Voice en andere diensten die BonanzaLabs schriftelijk aanbiedt. Afwijkingen gelden alleen wanneer ze schriftelijk zijn bevestigd.",
      "Bij tegenstrijdigheid gaat de individuele offerte of schriftelijk bevestigde pilotscope vóór op deze algemene voorwaarden.",
      "Onze diensten zijn uitsluitend bedoeld voor bedrijven en professionals die handelen in de uitoefening van hun beroep of bedrijf. Het wettelijke herroepingsrecht voor consumenten (14 dagen bedenktijd) is daarom niet van toepassing.",
    ],
  },
  {
    title: "1a. Flow Assessment",
    paragraphs: [
      "Het Flow Assessment kost €1.295 exclusief btw en omvat procesonderzoek, een rapport met prioriteiten en implementatievolgorde en een reviewcall. Betaling vindt vooraf plaats via Stripe.",
      "Na betaling plannen we samen de intake. De klant kan een geplande afspraak kosteloos verzetten tot 24 uur vooraf. Bij later verzetten of niet verschijnen plannen we één keer opnieuw; daarna kan BonanzaLabs de gereserveerde tijd in rekening brengen.",
      "Annuleren vóór de intake: volledige terugbetaling. Annuleren na de intake maar vóór oplevering van het rapport: de terugbetaling bedraagt de prijs minus de bestede uren à €95 per uur excl. btw, maar nooit meer dan 50% van de prijs. Na oplevering van het rapport is er geen terugbetaling.",
      "Wordt binnen 30 dagen na oplevering een implementatie bij BonanzaLabs afgenomen, dan wordt het betaalde bedrag van het Flow Assessment met die implementatie verrekend.",
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
    title: "3. Geen automatische verlenging van de pilot",
    paragraphs: [
      "De ServeFlow-pilot eindigt automatisch na de afgesproken pilotperiode. Er ontstaat geen abonnement en er worden geen vervolgkosten geïncasseerd zonder een nieuwe, uitdrukkelijke overeenkomst.",
      "Een vervolgimplementatie, beheerabonnement of uitbreiding wordt afzonderlijk besproken en geprijsd. Kiest de klant uitdrukkelijk voor een abonnement, dan gelden de afspraken in artikel 3a.",
    ],
  },
  {
    title: "3a. Abonnementen Bonanza Voice en ServeFlow (concept, laat juridisch toetsen)",
    paragraphs: [
      "Abonnementen (Start, Groei, Pro) worden schriftelijk afgesloten voor bedrijven. Het herroepingsrecht voor consumenten is niet van toepassing.",
      "Looptijd: minimaal 3 maanden vanaf de livegangsdatum. Daarna loopt het abonnement per kalendermaand door en is het maandelijks opzegbaar met een opzegtermijn van één kalendermaand, per e-mail aan BonanzaLabs.",
      "Inrichting: de eenmalige inrichtingskosten worden vooraf gefactureerd en niet terugbetaald nadat de inrichting is gestart, tenzij de leveringsgarantie van toepassing is.",
      "Belminuten: elk pakket bevat een maandelijks aantal belminuten. Niet gebruikte minuten vervallen aan het einde van de maand en worden niet meegenomen naar een volgende maand. Minuten boven de bundel worden achteraf per maand gefactureerd tegen het tarief van het pakket. Een minuut telt per begonnen minuut gespreksduur van de AI-assistent, inclusief doorverbonden tijd zolang de assistent in het gesprek is.",
      "Telefoonkosten van de klant zelf, zoals doorschakelen van het eigen nummer naar het nummer van Bonanza Voice, vallen onder het abonnement van de klant bij zijn eigen provider.",
      "Wijzigen van pakket kan per de eerstvolgende kalendermaand. Prijzen kunnen eenmaal per jaar worden aangepast, met minimaal 30 dagen vooraankondiging; de klant mag dan per de ingangsdatum opzeggen.",
      "Bij betalingsachterstand van meer dan 14 dagen na herinnering mag BonanzaLabs de dienst opschorten.",
      "Na beëindiging zet BonanzaLabs de assistent uit en verwijdert of retourneert de gegevens volgens de verwerkersovereenkomst.",
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
    title: "8a. Facturatie van abonnementen en meerminuten",
    paragraphs: [
      "Abonnementen (artikel 3a) en meerminuten worden maandelijks gefactureerd. Het abonnementsbedrag wordt per kalendermaand gefactureerd; meerminuten worden achteraf over de afgelopen kalendermaand gefactureerd.",
      "Meerminuten worden berekend tegen het tarief van het gekozen pakket: Start €0,35, Groei €0,30 en Pro €0,25 per extra minuut, exclusief btw.",
      "De betalingstermijn van facturen is 14 dagen na factuurdatum.",
      "Betaalt de klant niet binnen de betalingstermijn, dan is de klant zonder nadere ingebrekestelling de wettelijke handelsrente verschuldigd op grond van artikel 6:119a van het Burgerlijk Wetboek.",
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
    title: "9a. Bonanza Voice en AI-transparantie",
    paragraphs: [
      "Bonanza Voice is een AI-assistent. Conform artikel 50 van de EU AI-verordening (AI Act) hoort elke beller aan het begin van ieder gesprek dat hij met een AI-assistent spreekt. Deze melding staat standaard aan en de klant laat haar niet uitschakelen.",
      "Wordt een gesprek opgenomen of getranscribeerd, dan wordt dat aan het begin van het gesprek gemeld. Gegevens van bellers (zoals telefoonnummer, naam, gespreksinhoud) worden alleen verwerkt om het gesprek af te handelen en de klant te informeren.",
      "Voor de verwerking van gegevens van bellers en gasten van de klant sluiten partijen een verwerkersovereenkomst; het model staat op bonanza-labs.com/verwerkersovereenkomst.",
      "AI kan fouten maken. De klant controleert de ingerichte antwoorden en blijft verantwoordelijk voor afspraken die aan bellers worden bevestigd.",
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
    title: "10a. Overmacht",
    paragraphs: [
      "BonanzaLabs is niet gehouden tot het nakomen van een verplichting wanneer zij daartoe verhinderd is door overmacht. Onder overmacht valt iedere omstandigheid buiten de wil van BonanzaLabs, waaronder storingen, uitval of beperkingen bij leveranciers en externe diensten zoals ElevenLabs, Telnyx of Twilio (telefonie), Vercel (hosting), betaal- en e-maildiensten, en storingen in internet- of telefoonnetwerken.",
      "Tijdens overmacht worden de verplichtingen van BonanzaLabs opgeschort. Duurt de overmacht langer dan 30 dagen, dan mogen beide partijen de overeenkomst schriftelijk beëindigen voor het deel dat nog niet is uitgevoerd, zonder verplichting tot schadevergoeding.",
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
      "Geschillen worden voorgelegd aan de bevoegde rechter van de Rechtbank Noord-Nederland.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main id="main-content" className="light-site light-subpage min-h-screen">
      <SiteNav />

      <section className="border-b border-white/10 bg-gradient-to-br from-amber-950/25 via-[#070A12] to-blue-950/20 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Link href="/pricing" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Terug naar prijzen</Link>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-200"><FileCheck2 className="h-4 w-4" /> Zakelijke pilotvoorwaarden</div>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">Algemene voorwaarden</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">De scope, garantie, betaling en verantwoordelijkheden vóórdat een pilot wordt geboekt.</p>
          <p className="mt-5 text-sm text-slate-500">Laatst bijgewerkt: 16 oktober 2026</p>
          <LegalConceptNote />
          <a href="/algemene-voorwaarden-bonanzalabs.pdf" download className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/10"><Download className="h-4 w-4" /> Download als PDF</a>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <section className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-6 text-sm leading-7 text-slate-300">
          <p><strong>Handelsnaam:</strong> {businessDetails.tradeName}</p>
          <p><strong>Rechtsvorm:</strong> {businessDetails.legalForm}</p>
          <p><strong>KvK-nummer:</strong> {businessDetails.kvkNumber}</p>
          <p><strong>Vestigingsnummer:</strong> {businessDetails.branchNumber}</p>
          <p><strong>Hoofdvestiging:</strong> {fullBusinessAddress}</p>
          <p><strong>E-mail:</strong> {businessDetails.contactEmail}</p>
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
          <a href={`mailto:${businessDetails.contactEmail}`} className="mt-6 inline-flex rounded-xl bg-[#2563EB] px-5 py-3 font-semibold hover:bg-[#1D4ED8]">{businessDetails.contactEmail}</a>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
