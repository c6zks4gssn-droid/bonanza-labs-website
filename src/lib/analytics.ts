// First-party analytics: het meten van wat op de site gebeurt, zonder
// cookies, zonder derde partij en zonder persoonsgegevens.
//
// Waarom zo gebouwd: /cookies en /privacy beloven letterlijk "We gebruiken geen
// analytics- of marketingcookies" en "We gebruiken geen Google Analytics,
// advertentiepixels of andere tracking". Dat is een sterk verkoopargument voor
// klanten in de horeca en voor zakelijke klanten die een verwerkersovereenkomst
// tekenen. Een GA- of Plausible-script zou die belofte meteen breken.
//
// Dus: geen cookie, geen IP-opslag, geen user-agent, geen fingerprint. We
// tellen alleen hoe vaak een gebeurtenis voorkomt, in welke volgorde, en op
// welke pagina. Het IP-adres wordt niet bewaard; alleen de hash daarvan zou
// al een persoonsgegeven kunnen zijn.
//
// De opslag is dezelfde Upstash Redis die al draait voor leads, betalingen en
// rate limits. Er is dus geen extra account, geen extra kosten en geen extra
// persoonsgegevensverwerking buiten de huidige verwerkersovereenkomst.

export type AnalyticsEventName =
  | "page_view"
  | "cta_click"
  | "checkout_start"
  | "checkout_error"
  | "lead_submit"
  | "quickscan_start"
  | "video_play";

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  // Vrij categorisch label, bv. "gratis-quickscan" of "boek-en-betaal".
  label?: string;
  // Het pad van de pagina waar het gebeurde, zonder query.
  path?: string;
  // Marketing- of UTM-parameter die de bezoeker meebracht, bv. "linkedin".
  source?: string;
  campaign?: string;
  timestamp: string;
}

const ANALYTICS_PREFIX = "analytics";
const EVENT_TTL_SECONDS = 60 * 60 * 24 * 400; // 400 dagen voor trendmeting.

// De teller per gebeurtenisnaam. Hiermee zie je in één oogopslag welke CTA
// wint van welke, zonder de hele eventstroom te hoeven doorlezen.
const COUNTER_KEY = `${ANALYTICS_PREFIX}:counters`;
// De volledige stroom, begrensd tot de laatste N gebeurtenissen.
const STREAM_KEY = `${ANALYTICS_PREFIX}:stream`;
// Per dag, voor de trend: analytics:day:YYYY-MM-DD
const dayKey = (timestamp: string) => `${ANALYTICS_PREFIX}:day:${timestamp.slice(0, 10)}`;

// Er wordt niets uniek of herleidbaar vastgelegd. Een willekeurige sessie-id
// zou een cookie zijn; daarom doen we dat niet. We tellen gebeurtenissen, en
// de volgorde van gebeurtenissen binnen één paginabezoek is goed genoeg om te
// zien waar iemand afhaakt.
export function sanitizeEvent(input: Partial<AnalyticsEvent>): AnalyticsEvent | null {
  const allowed: AnalyticsEventName[] = [
    "page_view",
    "cta_click",
    "checkout_start",
    "checkout_error",
    "lead_submit",
    "quickscan_start",
    "video_play",
  ];

  if (!input.name || !allowed.includes(input.name)) return null;

  const clean = (value: unknown, max: number) =>
    typeof value === "string" ? value.trim().slice(0, max) : "";

  const path = clean(input.path, 200);
  // Alleen het pad, geen query en geen hash: voorkomt dat persoonsgegevens in
  // een URL (bijvoorbeeld een e-mailadres in een UTM) in de opslag belanden.
  const safePath = path.startsWith("/") ? path.split("?")[0].split("#")[0] : "";

  return {
    name: input.name,
    label: clean(input.label, 60) || undefined,
    path: safePath || undefined,
    source: clean(input.source, 60) || undefined,
    campaign: clean(input.campaign, 60) || undefined,
    timestamp: new Date().toISOString(),
  };
}
