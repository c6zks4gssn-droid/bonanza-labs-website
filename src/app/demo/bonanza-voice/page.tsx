import type { Metadata } from "next";
import DemoShell from "@/components/demos/DemoShell";
import VoiceDemo from "@/components/demos/VoiceDemo";
import { withPageSocialMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = withPageSocialMetadata({
  title: "Demo Bonanza Voice voor installateurs",
  description: "Probeer hoe een digitale telefoonassistent een offerteaanvraag aanneemt en samenvat voor de installateur. Demo met voorbeeldgegevens.",
  alternates: { canonical: "https://www.bonanza-labs.com/demo/bonanza-voice" },
  openGraph: { title: "Demo Bonanza Voice voor installateurs | BonanzaLabs", description: "Zie hoe een aanvraag voor cv-ketel, warmtepomp of zonnepanelen wordt aangenomen en samengevat.", url: "https://www.bonanza-labs.com/demo/bonanza-voice", siteName: "BonanzaLabs", type: "website" },
});

export default function Page() {
  return (
    <DemoShell badge="Bonanza Voice" title="Zo neemt de assistent een aanvraag aan" intro="Kies een voorbeeldgesprek of speel zelf de beller. De assistent vraagt de gegevens uit, en u ziet de samenvatting die de installateur krijgt. Een medewerker belt daarna terug." productHref="/bonanza-voice" productLabel="Meer over Bonanza Voice">
      <VoiceDemo />
    </DemoShell>
  );
}
