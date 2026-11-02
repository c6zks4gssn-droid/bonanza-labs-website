// ServeFlow demo — gescripte regels, fictief restaurant, geen echte reserveringen.
export const RESTAURANT = "Restaurant De Voorbeeldkeuken (fictief), Groningen";

// 0 = zondag ... 6 = zaterdag
export const OPENING: Record<number, { open: string; close: string } | null> = {
  0: { open: "17:00", close: "22:00" },
  1: null,
  2: null,
  3: { open: "17:00", close: "22:00" },
  4: { open: "17:00", close: "22:00" },
  5: { open: "17:00", close: "23:00" },
  6: { open: "17:00", close: "23:00" },
};
const DAYNAMES = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
export const MAX_PERSONS = 8;

export const MENU = [
  { naam: "Pompoensoep met geroosterde pitten", allergenen: ["selderij"], veg: true },
  { naam: "Stoof van Groninger rund met aardappelpuree", allergenen: ["melk", "selderij", "mosterd"], veg: false },
  { naam: "Gebakken kabeljauw met beurre blanc", allergenen: ["vis", "melk"], veg: false },
  { naam: "Risotto met paddenstoelen", allergenen: ["melk"], veg: true },
  { naam: "Chocolademousse", allergenen: ["ei", "melk", "soja"], veg: true },
];

export type Reservation = { date?: string; time?: string; persons?: number; name?: string };
export type State = { stage: "idle" | "collecting" | "name" | "done"; res: Reservation; alt?: string };
export type Reply = { text: string; state: State; confirmation?: Required<Reservation> & { code: string; label: string } };

export const initialState = (): State => ({ stage: "idle", res: {} });

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
export const dateLabel = (s: string) => { const d = fromIso(s); return `${DAYNAMES[d.getDay()]} ${d.getDate()}-${d.getMonth() + 1}`; };

export function parseDate(t: string, today: Date): string | undefined {
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (/overmorgen/.test(t)) return iso(new Date(base.getTime() + 2 * 864e5));
  if (/morgen/.test(t)) return iso(new Date(base.getTime() + 864e5));
  if (/vandaag|vanavond/.test(t)) return iso(base);
  const m = t.match(/\b(\d{1,2})[-/.](\d{1,2})\b/);
  if (m) {
    const d = new Date(base.getFullYear(), Number(m[2]) - 1, Number(m[1]));
    if (d < base) d.setFullYear(d.getFullYear() + 1);
    return iso(d);
  }
  for (let i = 0; i < 7; i++) {
    if (t.includes(DAYNAMES[i])) {
      const diff = (i - base.getDay() + 7) % 7 || 7;
      return iso(new Date(base.getTime() + diff * 864e5));
    }
  }
  return undefined;
}

export function parseTime(t: string): string | undefined {
  const m = t.match(/\b(\d{1,2})[:.](\d{2})\b/) || t.match(/\b(\d{1,2})\s*uur\b/) || t.match(/\bom\s+(\d{1,2})\b/);
  if (!m) return undefined;
  let h = Number(m[1]);
  if (h >= 1 && h <= 11) h += 12; // horeca: "7 uur" = 19:00
  if (h > 23) return undefined;
  return `${pad(h)}:${m[2] ?? "00"}`;
}

export function parsePersons(t: string): number | undefined {
  const words: Record<string, number> = { een: 1, twee: 2, drie: 3, vier: 4, vijf: 5, zes: 6, zeven: 7, acht: 8, negen: 9, tien: 10, twaalf: 12 };
  const m = t.match(/\b(\d{1,2})\s*(personen|persoon|pers|mensen|man|gasten)\b/) || t.match(/\bmet\s+(\d{1,2})\b/);
  if (m) return Number(m[1]);
  for (const [w, n] of Object.entries(words)) if (new RegExp(`\\b(met )?${w}( personen| mensen| man| gasten)\\b`).test(t)) return n;
  if (/met z'?n tweeën|met zijn tweeën/.test(t)) return 2;
  return undefined;
}

/** Nepbeschikbaarheid: deterministisch, op basis van dag en tijd. */
export function checkAvailability(date: string, time: string, persons: number): { ok: true } | { ok: false; reason: string; alternative?: string } {
  const d = fromIso(date);
  const hours = OPENING[d.getDay()];
  if (!hours) return { ok: false, reason: `Op ${DAYNAMES[d.getDay()]} zijn we gesloten. We zijn open van woensdag t/m zondag.` };
  const toMin = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
  if (toMin(time) < toMin(hours.open) || toMin(time) > toMin(hours.close) - 90)
    return { ok: false, reason: `Op die dag kunt u reserveren tussen ${hours.open} en ${pad(Math.floor((toMin(hours.close) - 90) / 60))}:${pad((toMin(hours.close) - 90) % 60)}.` };
  if (persons > MAX_PERSONS) return { ok: false, reason: `Online kunnen we tot ${MAX_PERSONS} personen reserveren. Voor grotere groepen neemt het restaurant contact met u op.` };
  if ((d.getDay() === 5 || d.getDay() === 6) && time === "19:00") return { ok: false, reason: "Om 19:00 zitten we die avond (in deze demo) vol.", alternative: "19:30" };
  return { ok: true };
}

function nextQuestion(res: Reservation): string | undefined {
  if (!res.date) return "Voor welke datum wilt u reserveren? Bijvoorbeeld 'zaterdag' of '24-10'.";
  if (!res.time) return "Hoe laat wilt u komen? Bijvoorbeeld 19:00.";
  if (!res.persons) return "Met hoeveel personen komt u?";
  return undefined;
}

function code(res: Reservation) {
  const s = `${res.date}${res.time}${res.persons}${res.name}`;
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return "DEMO-" + (h % 100000).toString().padStart(5, "0");
}

export function respond(input: string, state: State, today = new Date()): Reply {
  let t = input.toLowerCase().trim();
  const s: State = { stage: state.stage, res: { ...state.res } };
  // "ja" op een voorgesteld alternatief tijdstip
  if (s.stage === "collecting" && state.alt && /^(ja|jazeker|graag|prima|goed|is goed|oké|oke|ok|doe maar)\b/.test(t)) {
    s.res.time = state.alt;
    t = state.alt;
  }

  if (s.stage === "name") {
    if (!t) return { text: "Op welke naam mag ik de reservering zetten?", state: s };
    s.res.name = input.trim().slice(0, 60);
    s.stage = "done";
    const r = s.res as Required<Reservation>;
    return {
      text: `Dank u, ${r.name}. Uw demo-reservering staat hieronder. In een echte opstelling kan de gast hiervan een bevestiging ontvangen, afhankelijk van hoe het restaurant het inricht.`,
      state: s,
      confirmation: { ...r, code: code(r), label: dateLabel(r.date) },
    };
  }

  const wantsReservation = /reserv|tafel|boeken|plek|plaats voor/.test(t);
  const date = parseDate(t, today);
  const time = parseTime(t);
  const persons = parsePersons(t);
  const gaveDetails = date || time || persons;

  const faq = /open|tijden|gesloten|menu|kaart|allerg|vega|gluten/.test(t);
  if ((s.stage === "collecting" && (gaveDetails || !faq)) || wantsReservation || (s.stage !== "done" && gaveDetails && !/open|menu|allerg/.test(t))) {
    if (s.stage === "done") s.res = {};
    s.stage = "collecting";
    if (date) s.res.date = date;
    if (time) s.res.time = time;
    if (persons) s.res.persons = persons;
    const q = nextQuestion(s.res);
    if (q) return { text: (wantsReservation && !gaveDetails ? "Leuk dat u wilt komen eten! " : "") + q, state: s };
    const av = checkAvailability(s.res.date!, s.res.time!, s.res.persons!);
    if (!av.ok) {
      if (av.reason.startsWith("Op ") && av.reason.includes("gesloten")) delete s.res.date;
      else if (av.alternative || av.reason.includes("tussen")) delete s.res.time;
      else delete s.res.persons;
      if (av.alternative) s.alt = av.alternative;
      return { text: av.reason + (av.alternative ? ` Om ${av.alternative} is er nog plek. Zal ik dat noteren? Antwoord met 'ja' of kies een andere tijd.` : " Wat wordt het?"), state: s };
    }
    s.stage = "name";
    return { text: `Goed nieuws: op ${dateLabel(s.res.date!)} om ${s.res.time} is er plek voor ${s.res.persons} ${s.res.persons === 1 ? "persoon" : "personen"}. Op welke naam mag ik de reservering zetten?`, state: s };
  }

  if (/open|tijden|gesloten|dicht|laat/.test(t)) {
    return { text: "We zijn open woensdag t/m zondag vanaf 17:00. Woensdag, donderdag en zondag tot 22:00, vrijdag en zaterdag tot 23:00. Maandag en dinsdag zijn we gesloten.", state: s };
  }
  if (/allerg|gluten|noten|lactose|melk|vis|ei\b|soja|selderij|mosterd/.test(t)) {
    const hit = ["gluten", "noten", "melk", "lactose", "vis", "ei", "soja", "selderij", "mosterd"].find((a) => new RegExp(`\\b${a}`).test(t));
    const key = hit === "lactose" ? "melk" : hit;
    if (key) {
      const without = MENU.filter((m) => !m.allergenen.includes(key)).map((m) => m.naam);
      return { text: `Zonder ${hit}: ${without.join("; ")}. Meld een allergie altijd ook bij de bediening; de keuken controleert het dan nog een keer.`, state: s };
    }
    return { text: "Per gerecht: " + MENU.map((m) => `${m.naam} (${m.allergenen.join(", ")})`).join("; ") + ". Meld een allergie altijd ook bij de bediening.", state: s };
  }
  if (/menu|kaart|eten|gerecht|vega|vegetarisch/.test(t)) {
    const list = /vega/.test(t) ? MENU.filter((m) => m.veg) : MENU;
    return { text: (/vega/.test(t) ? "Vegetarisch: " : "Op de kaart: ") + list.map((m) => m.naam).join("; ") + ".", state: s };
  }
  if (/^(hoi|hallo|goedemiddag|goedenavond|goedemorgen|hey)/.test(t)) {
    return { text: "Hallo! Ik kan een tafel reserveren of vragen beantwoorden over openingstijden, het menu en allergenen.", state: s };
  }
  return { text: "Dat weet ik in deze demo niet. Ik kan helpen met reserveren, openingstijden, het menu en allergenen. Voor andere vragen neemt een medewerker contact met u op.", state: s };
}
