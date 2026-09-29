/**
 * Transcript met een echte opname ernaast.
 *
 * Waarom geen custom JS-speler: design.md eist dat essentiële content blijft
 * werken zonder client-JavaScript. De native <audio controls> doet dat, is
 * toetsenbord-toegankelijk en respecteert prefers-reduced-motion vanzelf.
 *
 * De opname is een FICTIEF voorbeeldgesprek (zie het label), geen echte klant.
 */
type Regel = readonly string[];

export default function VoiceTranscriptAudio({
  transcript,
  src,
  duur,
  titel,
  bron,
}: {
  transcript: readonly Regel[];
  src: string;
  duur: string;
  titel: string;
  bron?: string;
}) {
  const isVoice = (s: string) => s.toLowerCase() === "voice";

  return (
    <div className="voice-audio">
      <div className="voice-audio-head">
        <div>
          <p className="voice-audio-label">Beluister het voorbeeld</p>
          <p className="voice-audio-meta">
            {titel} · <span>{duur}</span>
          </p>
        </div>
        {/* Label staat NAST de speler, niet erin: de klant moet meteen weten
            dat dit geen opname van een echte klant of echte beller is. */}
        <p className="voice-audio-flag">Fictief gesprek — geen echte klant</p>
      </div>

      <audio
        className="voice-audio-player"
        controls
        preload="metadata"
        src={src}
      >
        Je browser ondersteunt geen audio-afspelen.{" "}
        <a href={src}>Download het voorbeeldgesprek (mp3, {duur})</a>.
      </audio>

      <details className="voice-transcript" open>
        <summary>Uitgeschreven gesprek</summary>
        <dl>
          {transcript.map(([speaker, text], i) => (
            <div key={i} data-speaker={isVoice(speaker) ? "voice" : "beller"}>
              <dt>{speaker}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </details>

      <p className="voice-note">
        {bron ? `${bron} ` : ""}
        De agent stelt intakevragen. De beoordeling, prijs en planning blijven
        bij een medewerker. Dit voorbeeld verstuurt geen aanvraag.
      </p>
    </div>
  );
}
