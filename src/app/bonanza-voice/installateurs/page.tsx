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
      <p>Bonanza Voice is een AI-telefonist voor installateurs en kleine installatiebedrijven. De agent neemt op als jij niet kunt, stelt vooraf afgesproken intakevragen en zet de offerteaanvraag klaar voor een medewerker. Inrichting vanaf <strong>€1.495 excl. btw</strong>, per bedrijf ingericht en getest.</p>
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
      <p>Na de intake kun je de offerteopvolging regelen met <Link href="/tradeflow" className="underline">TradeFlow</Link>.</p>
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
      <p className="voice-price">Inrichting vanaf <strong>€1.495 excl. btw</strong></p>
      <ul className="voice-steps">
        <li><p><strong>Inrichting:</strong> vanaf €1.495 excl. btw, per bedrijf bepaald op basis van gesprekstype en telefonie.</p></li>
        <li><p><strong>Doorlopend beheer:</strong> €197 of €497 per maand excl. btw, via een afzonderlijke overeenkomst.</p></li>
        <li><p><strong>Externe gebruikskosten:</strong> kosten van bijvoorbeeld telefonie en gesprekken komen apart en bespreken we vooraf.</p></li>
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
