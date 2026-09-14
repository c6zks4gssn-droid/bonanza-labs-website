import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import VoiceRequest from "@/components/voice-request";
import { faq, steps, transcript } from "./voice-content";
import "./voice.css";

const url = "https://www.bonanza-labs.com/bonanza-voice";
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Service", "@id": `${url}#service`, name: "Bonanza Voice", serviceType: "AI-telefonist", description: faq[0][1], url,
      provider: { "@type": "Organization", name: "BonanzaLabs", url: "https://www.bonanza-labs.com", logo: "https://www.bonanza-labs.com/logo-256.png", email: "info@bonanza-labs.com", address: { "@type": "PostalAddress", addressLocality: "Groningen", addressCountry: "NL" } },
      areaServed: { "@type": "Country", name: "Netherlands" },
      offers: { "@type": "Offer", name: "Inrichting Bonanza Voice vanaf €1.495 excl. btw", url, priceSpecification: { "@type": "PriceSpecification", minPrice: 1495, priceCurrency: "EUR", valueAddedTaxIncluded: false } } },
    { "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    { "@type": "HowTo", name: "Hoe een Bonanza Voice-implementatie verloopt", step: steps.map(([name, text]) => ({ "@type": "HowToStep", name, text })) },
    { "@type": "BreadcrumbList", itemListElement: [ ["BonanzaLabs", "https://www.bonanza-labs.com/"], ["Oplossingen", "https://www.bonanza-labs.com/oplossingen"], ["Bonanza Voice", url] ].map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })) },
  ],
};

export default function VoicePage() {
  return <main id="main-content" className="light-site voice-page">
    <SiteNav active="/bonanza-voice" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <header className="voice-hero voice-wrap">
      <p className="voice-eyebrow">Bonanza Voice · AI-telefonist voor horeca, bouw en installatie</p>
      <h1>Je telefoon gaat, jij staat op de steiger of in de keuken. <em>Bonanza Voice neemt op.</em></h1>
      <p>{faq[0][1]} We richten het per klant in en testen het voordat het live gaat.</p>
      <div className="voice-actions"><a className="voice-primary" href="#voice-demo">Probeer Bonanza Voice</a><a className="voice-secondary" href="#voice-aanvraag">Voice-aanvraag doen</a></div>
    </header>
    <section id="voice-demo" className="voice-band"><div className="voice-wrap">
      <p className="voice-eyebrow">Zelf proberen</p><h2>Probeer Bonanza Voice</h2>
      <p>Probeer de agent via spraak of tekst. De demo beantwoordt vragen over BonanzaLabs; een telefoonflow voor jouw bedrijf richten we apart in.</p>
      <p>Open de widget linksonder: kies <strong>Start gesprek</strong> voor spraak of <strong>Bericht</strong> voor tekst. Vraag bijvoorbeeld: “Wat kost de ServeFlow-pilot?”</p>
      <p className="voice-note">Voor spraak is microfoontoegang nodig. Zie je de widget niet? Je kunt hieronder een Voice-aanvraag doen.</p>
    </div></section>
    <section className="voice-wrap voice-section">
      <h2>Zo kan een gesprek lopen</h2><p className="voice-eyebrow">Fictief voorbeeld — geen opname</p>
      <details className="voice-transcript" open><summary>Voorbeeld: offerteaanvraag voor een badkamer</summary>
        <dl>{transcript.map(([speaker, text], i) => <div key={i}><dt>{speaker}</dt><dd>{text}</dd></div>)}</dl>
      </details>
      <p className="voice-note">Ook Installatiebedrijf Jansen en de beller zijn fictief. De agent stelt intakevragen. De beoordeling, prijs en planning blijven bij een medewerker. Het voorbeeld verstuurt geen aanvraag.</p>
    </section>
    <section className="voice-band"><div className="voice-wrap">
      <h2>Waar je Bonanza Voice kunt inzetten</h2>
      <div className="voice-grid">
        <article><h3>Installatie</h3><p>Een klant belt over een nieuwe badkamer of cv-installatie terwijl je bij een andere klant bent. De agent vraagt naar soort werk, plaats, gewenste periode en contactgegevens voor beoordeling door een medewerker.</p><Link href="/tradeflow">Bekijk TradeFlow voor offerteopvolging →</Link></article>
        <article><h3>Horeca</h3><p>Op een drukke avond beantwoordt de agent afgesproken vragen over openingstijden, locatie en parkeren. Reserveringsverzoeken gaan naar een medewerker voor bevestiging. Direct boeken richten we alleen in met een geschikte, geteste koppeling.</p><Link href="/serveflow">Bekijk ServeFlow voor reserveringen →</Link></article>
        <article><h3>Bouw</h3><p>Verzamel bij aanvragen voor verbouw of aanbouw het type klus, de locatie, gewenste periode en contactgegevens. De beoordeling en de offerte blijven bij jouw team.</p><Link href="/tradeflow">Bekijk TradeFlow voor intake →</Link></article>
      </div>
    </div></section>
    <section className="voice-wrap voice-section">
      <h2>Wat het kost</h2><p className="voice-price">Inrichting vanaf <strong>€1.495 excl. btw</strong></p>
      <p>Bonanza Voice wordt per klant ingericht. Wat daarin zit en wat eventueel doorlopend nodig is, bespreken we tijdens de intake op basis van jouw gesprekstype en telefoniesituatie. Externe gebruikskosten en eventueel beheer spreken we apart af.</p>
      <p><Link href="/blog/wat-kost-ai-telefonie-voor-een-mkb-bedrijf">Lees ook: wat kost AI-telefonie voor een MKB-bedrijf?</Link></p>
      <h2 className="voice-spaced">Hoe een implementatie verloopt</h2>
      <ol className="voice-steps">{steps.map(([name, text]) => <li key={name}><h3>{name}</h3><p>{text}</p></li>)}</ol>
    </section>
    <section className="voice-band"><div className="voice-wrap">
      <h2>Wat de agent wel en niet doet</h2>
      <table className="voice-table"><thead><tr><th scope="col">Doet wel</th><th scope="col">Doet niet</th></tr></thead><tbody>{[
        ["Beantwoordt vooraf afgesproken basisvragen.", "Geen antwoorden verzinnen buiten de afgesproken scope."],
        ["Verzamelt contactgegevens en de vraag voor opvolging.", "Geen prijsafspraken of beoordelingen; dat doet een medewerker."],
        ["Vraagt bij onzekerheid om verduidelijking of zet de vraag klaar voor een medewerker.", "Geen belofte van omzet, 100% bereikbaarheid of foutloze afhandeling."],
        ["Legt een gesprekssamenvatting vast zoals per implementatie afgesproken.", "Geen langere bewaring dan afgesproken."],
        ["Kan doorschakelen of afspraken boeken als dit per klant is ingericht en getest.", "Niet starten met een brede scope: eerst één gesprekstype."],
      ].map(([yes, no]) => <tr key={yes}><td>{yes}</td><td>{no}</td></tr>)}</tbody></table>
    </div></section>
    <section className="voice-wrap voice-section"><h2>Veelgestelde vragen</h2>{faq.map(([q, a]) => <details className="voice-faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
    <section id="voice-aanvraag" className="voice-band"><div className="voice-wrap"><h2>Welk telefoontje mis je nu het vaakst?</h2><p>Kies wat het meest lijkt op jouw situatie, dan bespreken we of Bonanza Voice daar past.</p><VoiceRequest /></div></section>
    <SiteFooter />
  </main>;
}
