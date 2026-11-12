import type { Metadata } from "next";
import LegalDocPage from "@/components/legal-doc-page";
import { withPageSocialMetadata } from "@/lib/page-metadata";
import { businessDetails } from "@/lib/business-details";

export const metadata: Metadata = withPageSocialMetadata({
  title: "Cookies en lokale opslag",
  description: "Welke cookies en lokale opslag bonanza-labs.com gebruikt.",
  alternates: { canonical: "https://www.bonanza-labs.com/cookies" },
});

export default function CookiesPage() {
  return (
    <LegalDocPage
      eyebrow="Cookies"
      title="Cookies en lokale opslag"
      intro="BonanzaLabs gebruikt geen trackingcookies en geen marketingcookies. We meten wel hoe de site wordt gebruikt, zonder cookies en zonder persoonsgegevens. Hieronder staat welke functionele opslag de website wel gebruikt."
      updated="12 november 2026"
      sections={[
        { title: "1. Functionele opslag van BonanzaLabs", paragraphs: [
          "bl-lang (localStorage, blijft tot je hem wist): onthoudt de taal die je kiest. Noodzakelijk voor de gevraagde functie; hiervoor is geen toestemming nodig.",
          "Het beheergedeelte (/admin) gebruikt HTTP-authenticatie van de browser en plaatst daarvoor geen trackingcookie.",
        ] },
        { title: "2. Diensten van derden", paragraphs: [
          "Bonanza Voice (de spraakwidget van ElevenLabs) wordt niet automatisch geladen. Pas wanneer je op de knop 'Praat met Bonanza Voice' klikt, laadt je browser de widget van ElevenLabs via unpkg.com. Vanaf dat moment kan ElevenLabs functionele opslag gebruiken om het gesprek te laten werken. Zolang je niet klikt, maakt deze site geen verbinding met ElevenLabs of unpkg.com.",
          "Betalen gebeurt op de betaalpagina van Stripe (checkout.stripe.com). Stripe plaatst daar eigen cookies voor betaling en fraudepreventie, volgens het cookiebeleid van Stripe.",
          "Op sommige pagina's staan YouTube-video's. Die laden pas als je op afspelen klikt; YouTube (Google) kan dan cookies of vergelijkbare gegevens opslaan volgens het eigen privacybeleid. We gebruiken daarvoor de privacyvriendelijkere variant youtube-nocookie.com.",
        ] },
        { title: "3. Geen tracking", paragraphs: [
          "We plaatsen geen trackingcookies, geen advertentiepixels en geen fingerprinting. Er staan geen scripts van Google Analytics of vergelijkbare diensten op deze site.",
          `Vragen? Mail ${businessDetails.contactEmail}.`,
        ] },
        { title: "4. Meting zonder cookies", paragraphs: [
          "Om te weten welke pagina's werken, tellen we gebeurtenissen op onze eigen server: een paginaweergave, een klik op een knop, het starten van een betaling en een verstuurde aanvraag.",
          "Daarbij bewaren we geen adresgegevens. Er wordt geen cookie geplaatst, geen IP-adres opgeslagen en geen apparaat herkend. We tellen hoe vaak iets voorkomt, niet wie het doet. De gegevens staan op onze eigen server en worden na een beperkte periode automatisch verwijderd.",
          "Deze meting is bedoeld om de site te verbeteren. Je kunt je verzoek om verwijdering of een klacht indienen via de Autoriteit Persoonsgegevens; onze contactgegevens staan bovenaan deze pagina.",
        ] },
      ]}
    />
  );
}
