// Bonanza Voice demo — volledig gescript, geen LLM, geen netwerk, niets opgeslagen.
export type Speaker = "assistent" | "beller";
export type Line = { speaker: Speaker; text: string };
export type Urgency = "Spoed (zelfde dag terugbellen gevraagd)" | "Binnen een paar dagen" | "Geen haast";

export type VoiceAnswers = {
  naam: string;
  plaats: string;
  klus: string;
  probleem: string;
  urgentie: string;
  terugbelmoment: string;
};

export type VoiceSummary = {
  naam: string;
  plaats: string;
  typeKlus: string;
  omschrijving: string;
  urgentie: Urgency;
  terugbelmoment: string;
  vervolg: string;
};

export const QUESTIONS: { key: keyof VoiceAnswers; ask: string; placeholder: string }[] = [
  { key: "naam", ask: "Goedemiddag, u spreekt met de digitale assistent van Installatiebedrijf Voorbeeld. Mag ik uw naam?", placeholder: "Bijv. Sanne de Vries" },
  { key: "plaats", ask: "Dank u. In welke plaats, en eventueel op welk adres, gaat het om?", placeholder: "Bijv. Kerkstraat 12, Zwolle" },
  { key: "klus", ask: "Waar gaat uw aanvraag over? Bijvoorbeeld een cv-ketel, warmtepomp of zonnepanelen.", placeholder: "Bijv. warmtepomp" },
  { key: "probleem", ask: "Kunt u kort vertellen wat u zoekt of wat er aan de hand is?", placeholder: "Bijv. offerte voor hybride warmtepomp" },
  { key: "urgentie", ask: "Hoe snel wilt u graag teruggebeld worden?", placeholder: "Bijv. vandaag nog / deze week / geen haast" },
  { key: "terugbelmoment", ask: "Wanneer kunnen we u het beste terugbellen?", placeholder: "Bijv. morgen na 16:00" },
];

export const CLOSING =
  "Dank u wel. Ik heb alles genoteerd en doorgezet. Een medewerker belt u terug om de aanvraag te bespreken. Ik kan zelf geen prijs of planning toezeggen. Is er sprake van gaslucht of direct gevaar? Hang dan op en bel 112.";

export function classifyKlus(input: string): string {
  const t = input.toLowerCase();
  if (/warmtepomp|hybride/.test(t)) return "Warmtepomp";
  if (/zonnepane|zonne-pane|pv\b|omvormer/.test(t)) return "Zonnepanelen";
  if (/cv|ketel|verwarming|radiator/.test(t)) return "Cv-ketel / verwarming";
  if (/airco|koeling/.test(t)) return "Airco";
  return input.trim() ? capitalize(input.trim()) : "Onbekend";
}

export function classifyUrgency(input: string): Urgency {
  const t = input.toLowerCase();
  if (/vandaag|spoed|nu|direct|zsm|zo snel|meteen|koud|lekt|lekkage|storing/.test(t)) return "Spoed (zelfde dag terugbellen gevraagd)";
  if (/geen haast|maakt niet uit|rustig|maand|later/.test(t)) return "Geen haast";
  return "Binnen een paar dagen";
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function buildSummary(a: VoiceAnswers): VoiceSummary {
  const urgentie = classifyUrgency(`${a.urgentie} ${a.probleem}`);
  return {
    naam: a.naam.trim() || "Niet opgegeven",
    plaats: a.plaats.trim() || "Niet opgegeven",
    typeKlus: classifyKlus(`${a.klus} ${a.probleem}`),
    omschrijving: a.probleem.trim() || "Niet opgegeven",
    urgentie,
    terugbelmoment: a.terugbelmoment.trim() || "Niet opgegeven",
    vervolg:
      urgentie.startsWith("Spoed")
        ? "Beller vraagt om terugbellen vandaag. Beoordeel zelf of en wanneer een monteur kan."
        : "Terugbellen op het gewenste moment en offerte- of afspraakmogelijkheden bespreken.",
  };
}

export function buildTranscript(a: VoiceAnswers): Line[] {
  const lines: Line[] = [];
  for (const q of QUESTIONS) {
    lines.push({ speaker: "assistent", text: q.ask });
    lines.push({ speaker: "beller", text: a[q.key].trim() || "(geen antwoord)" });
  }
  lines.push({ speaker: "assistent", text: CLOSING });
  return lines;
}

export const SCENARIOS: { id: string; label: string; answers: VoiceAnswers }[] = [
  {
    id: "cv",
    label: "Cv-ketel geeft storing",
    answers: { naam: "Sanne de Vries", plaats: "Kerkstraat 12, Zwolle", klus: "Mijn cv-ketel", probleem: "De ketel geeft een storingscode en het huis wordt niet warm.", urgentie: "Liefst vandaag nog", terugbelmoment: "Vandaag tussen 13:00 en 17:00" },
  },
  {
    id: "warmtepomp",
    label: "Offerte hybride warmtepomp",
    answers: { naam: "Mark Jansen", plaats: "Amersfoort", klus: "Warmtepomp", probleem: "Ik wil een offerte voor een hybride warmtepomp naast mijn huidige ketel.", urgentie: "Deze week is prima", terugbelmoment: "Donderdag na 16:00" },
  },
  {
    id: "zon",
    label: "Zonnepanelen op plat dak",
    answers: { naam: "Fatima El Amrani", plaats: "Molenweg 3, Apeldoorn", klus: "Zonnepanelen", probleem: "Ik wil graag weten wat er mogelijk is op een plat dak van ongeveer 40 m².", urgentie: "Geen haast", terugbelmoment: "Volgende week, ochtend" },
  },
];
