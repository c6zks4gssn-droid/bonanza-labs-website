import { Check, ClipboardCheck, Phone } from "lucide-react";

// Productbeeld voor de homepage-hero: laat zien wat ServeFlow, Bonanza Voice en
// TradeFlow opleveren, met dezelfde fictieve gegevens als de demo's.
export default function HeroProductVisual() {
  return (
    <figure
      className="bl-hero-visual"
      role="img"
      aria-label="Voorbeeld met fictieve gegevens: een reserveringsbevestiging en herinnering op een telefoon, een samenvatting van een Bonanza Voice-gesprek en een complete TradeFlow-aanvraag."
    >
      <div className="bl-hv-chip" aria-hidden="true">
        <ClipboardCheck size={16} />
        <span><strong>TradeFlow</strong> · aanvraag compleet</span>
      </div>

      <div className="bl-hv-phone" aria-hidden="true">
        <div className="bl-hv-screen">
          <div className="bl-hv-head">
            <span className="bl-hv-avatar">B</span>
            <div><strong>Team Brasserie</strong><small>ServeFlow</small></div>
          </div>
          <div className="bl-hv-thread">
            <p className="bl-hv-msg bl-hv-in">Hoi! Tafel voor 2 personen, vrijdag om 19:00? Graag bij het raam.</p>
            <p className="bl-hv-msg bl-hv-out">Hallo Emma, je reservering voor 2 personen op vrijdag om 19:00 is bevestigd. Wijzigen of annuleren kan via deze link.</p>
            <p className="bl-hv-day">Donderdag</p>
            <p className="bl-hv-msg bl-hv-out">Herinnering: morgen om 19:00 zien we je graag. Tot dan!</p>
            <p className="bl-hv-status"><Check size={13} /> Bevestigd · herinnering verstuurd</p>
          </div>
        </div>
      </div>

      <div className="bl-hv-call" aria-hidden="true">
        <p className="bl-hv-call-title"><Phone size={15} /> Bonanza Voice · gesprek afgerond</p>
        <p className="bl-hv-line"><span>Beller</span>Mijn cv-ketel geeft een storing.</p>
        <p className="bl-hv-line"><span>Voice</span>Ik noteer het voor een medewerker. In welke plaats?</p>
        <p className="bl-hv-summary"><strong>Terugbelverzoek</strong> Sanne de Vries · cv-storing · klaar voor opvolging</p>
      </div>

      <figcaption>Voorbeeld met fictieve gegevens</figcaption>
    </figure>
  );
}
