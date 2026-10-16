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
      intro="BonanzaLabs gebruikt geen analytics- of marketingcookies. Hieronder staat welke functionele opslag de website wel gebruikt."
      updated="16 oktober 2026"
      sections={[
        { title: "1. Functionele opslag van BonanzaLabs", paragraphs: [
          "bl-lang (localStorage, blijft tot je hem wist): onthoudt de taal die je kiest. Noodzakelijk voor de gevraagde functie; hiervoor is geen toestemming nodig.",
          "Het beheergedeelte (/admin) gebruikt HTTP-authenticatie van de browser en plaatst daarvoor geen trackingcookie.",
        ] },
        { title: "2. Diensten van derden", paragraphs: [
          "Bonanza Voice (de spraakwidget) wordt geladen van ElevenLabs via unpkg.com. Wanneer je de widget opent of een gesprek start, kan ElevenLabs functionele opslag gebruiken om het gesprek te laten werken. [TODO: exacte cookies/opslag van de ElevenLabs-widget controleren en hier opsommen.]",
          "Betalen gebeurt op de betaalpagina van Stripe (checkout.stripe.com). Stripe plaatst daar eigen cookies voor betaling en fraudepreventie, volgens het cookiebeleid van Stripe.",
        ] },
        { title: "3. Geen tracking", paragraphs: [
          "We gebruiken geen Google Analytics, advertentiepixels of andere tracking. Als dat verandert, vragen we eerst je toestemming via een cookiemelding en passen we deze pagina aan.",
          `Vragen? Mail ${businessDetails.contactEmail}.`,
        ] },
      ]}
    />
  );
}
