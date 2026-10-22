import type { Metadata } from "next";
import LegalDocPage from "@/components/legal-doc-page";
import { withPageSocialMetadata } from "@/lib/page-metadata";
import { businessDetails, fullBusinessAddress } from "@/lib/business-details";

export const metadata: Metadata = withPageSocialMetadata({
  title: "Verwerkersovereenkomst (model voor zakelijke klanten)",
  description: "Model-verwerkersovereenkomst van BonanzaLabs voor ServeFlow, TradeFlow en Bonanza Voice.",
  alternates: { canonical: "https://www.bonanza-labs.com/verwerkersovereenkomst" },
});

const v = businessDetails;

export default function DpaPage() {
  return (
    <LegalDocPage
      eyebrow="Voor zakelijke klanten"
      title="Verwerkersovereenkomst"
      intro="Model-verwerkersovereenkomst (art. 28 AVG) voor klanten van wie BonanzaLabs persoonsgegevens verwerkt, zoals reserveringen, beller- en klantgegevens. Op verzoek sturen we een ondertekenbare versie."
      updated="16 oktober 2026"
      sections={[
        { title: "1. Partijen", paragraphs: [
          "Verwerkingsverantwoordelijke: de zakelijke klant, zoals genoemd in de offerte of bevestiging (hierna: Klant).",
          `Verwerker: ${v.tradeName}, ${v.legalForm.toLowerCase()}, KvK ${v.kvkNumber}, ${fullBusinessAddress}, ${v.contactEmail} (hierna: BonanzaLabs).`,
        ] },
        { title: "2. Onderwerp, duur en doel", paragraphs: [
          "BonanzaLabs verwerkt persoonsgegevens alleen om de afgesproken dienst te leveren (ServeFlow, TradeFlow, Bonanza Voice of een Flow Assessment) en alleen op schriftelijke instructie van de Klant.",
          "Deze overeenkomst loopt zolang BonanzaLabs persoonsgegevens voor de Klant verwerkt.",
        ] },
        { title: "3. Soorten gegevens en betrokkenen", paragraphs: [
          "Betrokkenen: gasten, bellers, klanten en medewerkers van de Klant.",
          "Gegevens: naam, telefoonnummer, e-mailadres, reserverings- of afspraakgegevens, inhoud van berichten, en bij Bonanza Voice het telefoonnummer van de beller, gespreksopname en transcript (als opname aan staat). Geen bijzondere persoonsgegevens, tenzij schriftelijk anders afgesproken.",
        ] },
        { title: "4. Verplichtingen van BonanzaLabs", paragraphs: [
          "Vertrouwelijkheid; passende technische en organisatorische beveiliging (versleutelde verbindingen, beperkte toegang, geheimen alleen server-side).",
          "Hulp aan de Klant bij verzoeken van betrokkenen, DPIA's en meldingen aan de Autoriteit Persoonsgegevens.",
          "Een datalek melden we zonder onredelijke vertraging en uiterlijk binnen 48 uur na ontdekking aan de Klant.",
        ] },
        { title: "5. Subverwerkers", paragraphs: [
          "De Klant geeft algemene toestemming voor de subverwerkers in de privacyverklaring (bonanza-labs.com/privacy, sectie 4). Bij een nieuwe subverwerker informeren we de Klant vooraf; de Klant kan daar binnen 14 dagen gemotiveerd bezwaar tegen maken.",
          "Doorgifte buiten de EER gebeurt alleen met een passende waarborg, zoals het EU-VS Data Privacy Framework of standaardcontractbepalingen.",
        ] },
        { title: "6. AI-transparantie (EU AI Act art. 50)", paragraphs: [
          "Bij Bonanza Voice hoort elke beller aan het begin van het gesprek dat hij met een AI-assistent spreekt, en of het gesprek wordt opgenomen. De Klant mag deze melding niet laten uitschakelen.",
        ] },
        { title: "7. Bewaren, verwijderen en audit", paragraphs: [
          "Na afloop van de dienst verwijdert BonanzaLabs de gegevens, of geeft ze terug, binnen 30 dagen, tenzij de wet langer bewaren verplicht. De bewaartermijn van gespreksopnames en transcripts wordt per klant schriftelijk vastgelegd.",
          "De Klant kan redelijke informatie opvragen om naleving te controleren.",
        ] },
        { title: "8. Aansprakelijkheid en recht", paragraphs: [
          "De aansprakelijkheid volgt de algemene voorwaarden van BonanzaLabs. Nederlands recht is van toepassing.",
        ] },
      ]}
    />
  );
}
