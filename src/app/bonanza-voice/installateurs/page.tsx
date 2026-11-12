import { PRICES, VOICE_MINUTES, formatEuro, formatEuroPerMinute } from "@/lib/pricing";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import VoiceTranscriptAudio from "@/components/voice-transcript-audio";
import { transcript } from "../voice-content";
import { comparison, doesDoesnt, faq, steps } from "./content";
import "../voice.css";

const base = "https://www.bonanza-labs.com";
const url = `${base}/bonanza-voice/installateurs`;

// FAQPage bevat uitsluitend de vragen en antwoorden die hieronder zichtbaar zijn.
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    { "@type": "BreadcrumbList", itemListElement: [["BonanzaLabs", `${base}/`], ["Bonanza Voice", `${base}/bonanza-voice`], ["Installateurs", url]].map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })) },
  ],
};

export default function VoiceInstallateursPage() {
  return <main id="main-content" className="light-site voice-page">
    <SiteNav active="/bonanza-voice" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />

    <header className="voice-hero voice-wrap">
      <p className="voice-eyebrow">Bonanza Voice · AI-telefonist voor installatiebedrijven</p>
      <h1>AI-telefonist voor installateurs: jij staat bij de klant, <em>Bonanza Voice neemt op</em></h1>
      <p>Bonanza Voice is een AI-telefonist voor installateurs en kleine installatiebedrijven. De agent neemt op als jij niet kunt, stelt vooraf afgesproken intakevragen en zet de offerteaanvraag klaar voor een medewerker. Als abonnement vanaf <strong>{formatEuro(PRICES.abonnementStart)} per maand excl. btw</strong>, plus {formatEuro(PRICES.bonanzaVoiceSetup)} inrichting; maatwerk volgens offerte. Altijd per bedrijf ingericht en getest.</p>
      <div className="voice-actions"><Link className="voice-primary" href="/contact">Bespreek je telefoonsituatie</Link><Link className="voice-secondary" href="/bonanza-voice">Probeer de demo</Link></div>
    </header>

    <section className="voice-band"><div className="voice-wrap">
      <h2>Herkenbaar: de telefoon gaat, jij ligt onder een cv-ketel</h2>
      <p>Je bent bij een klant aan het werk. Je handen zitten vol, of je ligt in een krappe meterkast. Ondertussen belt iemand over een nieuwe badkamer of een cv-installatie. Opnemen lukt niet, en terugbellen schiet er aan het eind van de dag soms bij in.</p>
      <p>Een traditionele telefoonservice of een AI-telefonist kan helpen om die gemiste oproepen toch vast te leggen. Welke past, hangt af van het soort gesprekken dat je krijgt. Hieronder lees je wat Bonanza Voice wel en niet doet.</p>
    </div></section>

    <section className="voice-wrap voice-section">
      <h2>Wat Bonanza Voice doet bij een installatiebedrijf</h2>
      <div className="voice-grid">
        <article><h3>Intakevragen stellen</h3><p>De agent vraagt naar het soort werk, de plaats, de gewenste periode en de contactgegevens. Zo ligt een telefonische offerteaanvraag gestructureerd klaar.</p></article>
        <article><h3>Basisvragen beantwoorden</h3><p>Vragen die je vooraf met ons afspreekt, zoals je werkgebied of welke soort klussen je doet, beantwoordt de agent. Buiten die scope zet hij de vraag klaar voor een medewerker.</p></article>
        <article><h3>Doorschakelen of afspraken</h3><p>Doorschakelen of afspraken inplannen kan alleen als dit voor jouw bedrijf is ingericht en getest. Anders legt de agent het verzoek vast voor opvolging.</p></article>
      </div>
      <p>Na de intake kun je de offerteopvolging regelen met <Link href="/tradeflow" className="underline">TradeFlow</Link>. Onderhoudsklanten op tijd herinneren en laten inplannen doe je met <Link href="/onderhoudsherinneringen" className="underline">TradeFlow Onderhoud</Link>.</p>
    </section>

    <section className="voice-band"><div className="voice-wrap">
      <h2>Voorbeeldgesprek: offerteaanvraag badkamer</h2>
      <p className="voice-eyebrow">Fictief voorbeeld — geen echte klant of beller</p>
      <VoiceTranscriptAudio transcript={transcript} src="/audio/bonanza-voice-demo.mp3" duur="1 minuut 7" titel="Offerteaanvraag voor een badkamer" />
    </div></section>

    <section className="voice-wrap voice-section">
      <h2>Wat de agent wel en niet doet</h2>
      <table className="voice-table"><thead><tr><th scope="col">Doet wel</th><th scope="col">Doet niet</th></tr></thead>
        <tbody>{doesDoesnt.map(([yes, no]) => <tr key={yes}><td>{yes}</td><td>{no}</td></tr>)}</tbody></table>
    </section>

    <section className="voice-band"><div className="voice-wrap">
      <h2>Zo verloopt de implementatie</h2>
      <ol className="voice-steps">{steps.map(([name, text]) => <li key={name}><h3>{name}</h3><p>{text}</p></li>)}</ol>
      <p>Hoe lang de inrichting duurt, hangt af van je telefonie en het gesprekstype. Dat spreken we tijdens de intake af.</p>
    </div></section>

    <section className="voice-wrap voice-section">
      <h2>Wat kost het?</h2>
      <p className="voice-price">Abonnement vanaf <strong>{formatEuro(PRICES.abonnementStart)} per maand excl. btw</strong>, belminuten inbegrepen</p>
      <h3 className="voice-spaced">Abonnement</h3>
      <div className="voice-grid">
        <article><h3>Start</h3><p className="voice-price"><strong>{formatEuro(PRICES.abonnementStart)}</strong> per maand</p><p className="voice-note">{VOICE_MINUTES.start.minutes} belminuten per maand, extra minuut {formatEuroPerMinute(VOICE_MINUTES.start.extraPerMinute)}</p><p>Eén telefoonnummer. Beantwoordt afgesproken vragen, noteert terugbelverzoeken en mailt per gesprek een samenvatting.</p></article>
        <article><h3>Groei</h3><p className="voice-price"><strong>{formatEuro(PRICES.abonnementGroei)}</strong> per maand</p><p className="voice-note">{VOICE_MINUTES.groei.minutes} belminuten per maand, extra minuut {formatEuroPerMinute(VOICE_MINUTES.groei.extraPerMinute)}</p><p>Alles uit Start, plus doorverbinden naar jou of een collega en afspraken doorzetten naar je agenda als een koppeling mogelijk is. Maandelijkse evaluatie.</p></article>
        <article><h3>Pro</h3><p className="voice-price"><strong>{formatEuro(PRICES.abonnementPro)}</strong> per maand</p><p className="voice-note">{VOICE_MINUTES.pro.minutes} belminuten per maand, extra minuut {formatEuroPerMinute(VOICE_MINUTES.pro.extraPerMinute)}</p><p>Alles uit Groei, voor tot drie locaties of telefoonnummers, met koppeling aan je eigen systeem volgens afspraak.</p></article>
      </div>
      <p className="voice-note">Eenmalige inrichting {formatEuro(PRICES.bonanzaVoiceSetup)} bij Start en Groei, bij Pro volgens offerte. Minimale looptijd 3 maanden, daarna maandelijks opzegbaar. Niet gebruikte minuten vervallen aan het eind van de maand. Afsluiten gaat via een afzonderlijke overeenkomst. Alle prijzen excl. btw.</p>
      <h3 className="voice-spaced">Inrichting op maat</h3>
      <ul className="voice-steps">
        <li><p><strong>Inrichting:</strong> volgens offerte, per bedrijf bepaald op basis van gesprekstype en telefonie. Maatwerk, extra koppelingen of meerdere locaties.</p></li>
        <li><p><strong>Beheer:</strong> vanaf {formatEuro(PRICES.beheerBasis)} per maand excl. btw, in drie niveaus: Basis {formatEuro(PRICES.beheerBasis)}, Standaard {formatEuro(PRICES.beheerStandaard)} of Uitgebreid {formatEuro(PRICES.beheerUitgebreid)}. Via een afzonderlijke overeenkomst.</p></li>
        <li><p><strong>Gebruikskosten (belminuten):</strong> komen apart, volgens offerte.</p></li>
      </ul>
      <p>Bekijk alle bedragen op de <Link href="/pricing" className="underline">prijzenpagina</Link> of lees <Link href="/blog/wat-kost-ai-telefonie-voor-een-mkb-bedrijf" className="underline">wat AI-telefonie kost voor een MKB-bedrijf</Link>.</p>
    </section>

    <section className="voice-band"><div className="voice-wrap">
      <h2>AI-telefonist of telefoonservice voor je installatiebedrijf?</h2>
      <p>Beide kunnen werken. Dit overzicht helpt je kiezen; het zegt niets over de prijzen of kwaliteit van specifieke aanbieders.</p>
      <table className="voice-table"><thead><tr><th scope="col"></th><th scope="col">Bonanza Voice</th><th scope="col">Traditionele telefoonservice</th></tr></thead>
        <tbody>{comparison.map(([k, a, b]) => <tr key={k}><th scope="row">{k}</th><td>{a}</td><td>{b}</td></tr>)}</tbody></table>
    </div></section>

    <section className="voice-wrap voice-section"><h2>Veelgestelde vragen</h2>
      {faq.map(([q, a]) => <details className="voice-faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}
    </section>

    <section className="voice-band"><div className="voice-wrap">
      <h2>Welke telefoontjes mis jij nu?</h2>
      <p>Vertel ons hoe je telefonie nu loopt en welke aanvragen blijven liggen. Dan bespreken we of Bonanza Voice past, of dat iets anders beter werkt.</p>
      <div className="voice-actions"><Link className="voice-primary" href="/contact">Bespreek je telefoonsituatie</Link><Link className="voice-secondary" href="/bonanza-voice">Probeer de demo</Link></div>
      <p className="voice-note">BonanzaLabs · Groningen · KvK 88564517</p>
    </div></section>

    <SiteFooter />
  </main>;
}
