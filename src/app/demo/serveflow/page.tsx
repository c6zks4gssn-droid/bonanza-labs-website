import type { Metadata } from "next";
import DemoShell from "@/components/demos/DemoShell";
import ServeFlowDemo from "@/components/demos/ServeFlowDemo";
import { withPageSocialMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = withPageSocialMetadata({
  title: "Demo ServeFlow reserveringschat voor horeca",
  description: "Probeer een reserveringschat voor een fictief restaurant: tafel reserveren, openingstijden en allergenen. Demo met voorbeeldgegevens.",
  alternates: { canonical: "https://www.bonanza-labs.com/demo/serveflow" },
  openGraph: { title: "Demo ServeFlow voor horeca | BonanzaLabs", description: "Reserveer een tafel bij een fictief restaurant en zie de bevestiging die de gast krijgt.", url: "https://www.bonanza-labs.com/demo/serveflow", siteName: "BonanzaLabs", type: "website" },
});

export default function Page() {
  return (
    <DemoShell badge="ServeFlow" title="Reserveren via chat, bij een fictief restaurant" intro="Vraag naar openingstijden of allergenen, of reserveer een tafel. Restaurant De Voorbeeldkeuken bestaat niet: beschikbaarheid en menu zijn voorbeeldgegevens." productHref="/serveflow" productLabel="Meer over ServeFlow">
      <ServeFlowDemo />
    </DemoShell>
  );
}
