// CANONIEKE PRIJSBRON voor BonanzaLabs.
//
// Waarom dit bestand bestaat: de prijzen stonden op drie plekken —
// stripe-products.ts (bedragen in centen), de pagina's in src/app (bedragen
// als tekst) en de documenten in ~/Projects/bonanza-labs-strategie. Ze liepen
// uiteen. TradeFlow stond als "vanaf €1.995" op de site en als €2.500 in
// Stripe. Zo'n verschil betekent dat een klant een ander bedrag ziet dan
// wat hij betaalt.
//
// Regel: elk bedrag komt hier. stripe-products.ts leest hieruit. De pagina's
// lezen hieruit. Niemand typt een bedrag nog ergens hard.
//
// Bedragen staan in centen als gehele getallen. Alle prijzen zijn excl. btw.
//
// Bron van waarheid: PRIJSSTANDAARD.md (~/Projects/bonanza-labs-strategie),
// besluit van 3 november 2026. Wat daar staat, wint. Een prijs wijzigen is
// een nieuw besluit: eerst hier aanpassen, dan de documenten, dan deployen.

export const PRICES = {
  serveflowPilot: 49700,
  flowAssessment: 129500,

  bonanzaVoiceSetup: 49500,

  // Implementatieprijzen. PRIJSSTANDAARD.md (3 november 2026) vermeldt
  // "implementaties vanaf €2.500" als VERVALLEN en noemt TradeFlow vanaf
  // €1.995. Daarom staan zowel TradeFlow als ServeFlow implementatie op
  // €1.995.
  //
  // LET OP: dit is een interpretatie. PRIJSSTANDAARD.md noemt alleen TradeFlow
  // expliciet. De oudere Master Context (15 augustus) sprak van
  // "implementaties vanaf €2.500". Als er voor ServeFlow een apart bedrag
  // geldt, moet dat hier expliciet worden vastgelegd — niet in de pagina's.
  tradeflowImplementation: 199500,
  tradeflowOnderhoud: 99500,

  beheerBasis: 19700,
  beheerStandaard: 29700,
  beheerUitgebreid: 49700,

  abonnementStart: 19900,
  abonnementGroei: 34900,
  abonnementPro: 49900,
} as const;

// Bonanza Voice: belminuten per maand en de prijs per extra minuut.
// Let op: "Extra minuut €0,35" is €0,35 per minuut, dus 35 centen.
export const VOICE_MINUTES = {
  start: { minutes: 300, extraPerMinute: 35 },
  groei: { minutes: 800, extraPerMinute: 30 },
  pro: { minutes: 1000, extraPerMinute: 25 },
} as const;

// Weergave van een prijs per minuut: 35 -> "€0,35".
export function formatEuroPerMinute(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(cents / 100)
    .replace(/\s/g, "");
}

// Human-readable weergave, voor de pagina's. Eén plek zodat de tekst en de
// centen nooit uit elkaar kunnen lopen.
export function formatEuro(cents: number): string {
  // Zonder spatie tussen het teken en het bedrag: "€497", niet "€ 497".
  // De Nederlandse locale zet er standaard een spatie bij, dus die worden
  // expliciet verwijderd.
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(cents / 100)
    .replace(/\s/g, "");
}
