export type BlogAccent = "cyan" | "amber" | "violet" | "emerald";

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  accent: BlogAccent;
  intro: string;
  sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "7-processen-die-mkb-bedrijven-kunnen-automatiseren",
    title: "7 processen die MKB-bedrijven vandaag al kunnen automatiseren",
    description:
      "Een praktische lijst van terugkerend werk dat vaak als eerste geautomatiseerd kan worden, zonder je hele bedrijfssysteem te vervangen.",
    category: "Automatisering",
    publishedAt: "2026-07-28",
    updatedAt: "2026-07-28",
    readTime: "7 min",
    accent: "cyan",
    intro:
      "Automatisering begint niet bij een AI-tool. Het begint bij werk dat vaak terugkomt, voorspelbare regels volgt en nu onnodig tijd kost. Deze zeven processen leveren meestal de snelste eerste verbeteringen op.",
    sections: [
      {
        heading: "1. Nieuwe aanvragen verzamelen",
        paragraphs: [
          "Aanvragen komen vaak binnen via e-mail, WhatsApp, telefoon en losse formulieren. Daardoor ontbreekt één overzicht en is niet duidelijk wie moet opvolgen.",
          "Een centraal intakeformulier kan de juiste vragen stellen, foto’s of documenten verzamelen en direct een lead in de pipeline aanmaken.",
        ],
        bullets: [
          "Bedrijfs- en contactgegevens",
          "Type aanvraag en gewenste planning",
          "Budgetindicatie en locatie",
          "Foto’s, documenten of menukeuzes",
        ],
      },
      {
        heading: "2. Offertes voorbereiden",
        paragraphs: [
          "Veel offertes bestaan voor een groot deel uit herbruikbare onderdelen. Denk aan standaardwerkzaamheden, voorwaarden, materialen en vaste uitleg.",
          "Automatisering kan een eerste concept maken op basis van de intake. Een medewerker controleert prijzen, uitzonderingen en de uiteindelijke belofte voordat de offerte wordt verzonden.",
        ],
      },
      {
        heading: "3. Opvolging na een aanvraag",
        paragraphs: [
          "Een goede aanvraag verliest waarde wanneer er dagenlang geen reactie komt. Met automatische ontvangstbevestigingen, interne taken en herinneringen blijft opvolging zichtbaar.",
        ],
        callout:
          "Automatiseer de herinnering, niet de relatie. Persoonlijke opvolging blijft belangrijk bij grote of complexe opdrachten.",
      },
      {
        heading: "4. Afspraken en reserveringen",
        paragraphs: [
          "Laat klanten beschikbare momenten kiezen en stuur direct een bevestiging. Voeg waar nodig een herinnering, route, voorbereiding of annuleringslink toe.",
        ],
      },
      {
        heading: "5. Veelgestelde vragen",
        paragraphs: [
          "Openingstijden, werkgebied, levertijd, beschikbaarheid en werkwijze hoeven niet telkens handmatig te worden beantwoord. Een goede kennisbank of assistent kan deze vragen afvangen en ingewikkelde gevallen doorsturen.",
        ],
      },
      {
        heading: "6. Reviews en nazorg",
        paragraphs: [
          "Na een afgeronde opdracht of bezoek kan automatisch een bedankbericht, onderhoudstip of reviewverzoek worden gestuurd. Timing en toon moeten passen bij de klantreis.",
        ],
      },
      {
        heading: "7. Interne rapportage",
        paragraphs: [
          "Een wekelijks overzicht van nieuwe leads, openstaande offertes, no-shows en gemiste oproepen maakt snel zichtbaar waar aandacht nodig is.",
        ],
        bullets: [
          "Aantal nieuwe aanvragen",
          "Gemiddelde reactietijd",
          "Openstaande offertes",
          "Afspraken, annuleringen en no-shows",
          "Belangrijkste blokkades voor de komende week",
        ],
      },
      {
        heading: "Waar begin je?",
        paragraphs: [
          "Kies één proces dat vaak voorkomt, merkbare irritatie veroorzaakt en eenvoudig meetbaar is. Leg eerst de huidige stappen vast. Automatiseer daarna alleen de onderdelen die voorspelbaar zijn.",
          "Een Flow Assessment helpt om processen te rangschikken op impact, risico en benodigde inspanning.",
        ],
      },
    ],
  },
  {
    slug: "van-whatsapp-chaos-naar-een-strak-offerteproces",
    title: "Van WhatsApp-chaos naar een strak offerteproces",
    description:
      "Zo voorkom je dat aanvragen, foto’s, prijsafspraken en opvolging verspreid raken over telefoons en losse gesprekken.",
    category: "TradeFlow",
    publishedAt: "2026-07-25",
    updatedAt: "2026-07-28",
    readTime: "6 min",
    accent: "violet",
    intro:
      "WhatsApp is snel en vertrouwd, maar wordt problematisch wanneer het tegelijk inbox, CRM, archief en offerteproces moet zijn. De oplossing is niet om WhatsApp te verbieden, maar om het op de juiste plaats in het proces te gebruiken.",
    sections: [
      {
        heading: "Waarom aanvragen zoekraken",
        paragraphs: [
          "Een klant stuurt eerst een vraag, later een foto en daarna extra informatie. Een medewerker antwoordt tussendoor, maar noteert niets in een centraal systeem. Na een drukke dag is niet meer duidelijk wat is afgesproken.",
        ],
        bullets: [
          "Informatie staat in meerdere gesprekken",
          "Geen eigenaar of volgende actie",
          "Geen vaste intakevragen",
          "Prijsafspraken zijn moeilijk terug te vinden",
          "Opvolging hangt af van geheugen",
        ],
      },
      {
        heading: "De ideale rol van WhatsApp",
        paragraphs: [
          "Gebruik WhatsApp voor snelle communicatie, bevestigingen en korte updates. Sla de zakelijke kerninformatie op in een centrale lead- of projectkaart.",
        ],
        callout:
          "WhatsApp blijft het gesprek. Je CRM of pipeline wordt het geheugen van je bedrijf.",
      },
      {
        heading: "Een praktisch proces in zes stappen",
        paragraphs: [
          "Een werkbaar proces hoeft niet zwaar te zijn. Het moet vooral duidelijk maken wat er nu moet gebeuren.",
        ],
        bullets: [
          "Aanvraag komt binnen via formulier, telefoon of WhatsApp",
          "Klant ontvangt een korte bevestiging",
          "Ontbrekende informatie wordt automatisch uitgevraagd",
          "Lead krijgt een eigenaar en status",
          "Offerteconcept wordt voorbereid en gecontroleerd",
          "Herinneringen volgen wanneer de klant nog niet reageert",
        ],
      },
      {
        heading: "Welke statussen heb je werkelijk nodig?",
        paragraphs: [
          "Begin klein. Voor veel bedrijven zijn Nieuw, Informatie nodig, Offerte maken, Offerte verzonden, Gewonnen en Verloren voldoende.",
          "Te veel statussen maken het systeem zwaarder dan het probleem. Voeg pas iets toe wanneer het team er aantoonbaar beter door werkt.",
        ],
      },
      {
        heading: "Wat automatiseer je niet?",
        paragraphs: [
          "Prijsafwijkingen, technische uitzonderingen en belangrijke klantbeloftes vragen menselijke controle. Ook een afwijzing of probleemmelding verdient persoonlijke aandacht.",
        ],
      },
      {
        heading: "De eerste meetpunten",
        bullets: [
          "Tijd tot eerste reactie",
          "Aantal aanvragen zonder volgende actie",
          "Tijd tussen intake en offerte",
          "Percentage offertes met opvolging",
          "Redenen waarom opdrachten verloren gaan",
        ],
        paragraphs: [
          "Met deze meetpunten zie je of het proces werkelijk beter wordt, in plaats van alleen digitaler.",
        ],
      },
    ],
  },
  {
    slug: "no-shows-verminderen-zonder-gasten-te-irriteren",
    title: "No-shows verminderen zonder gasten te irriteren",
    description:
      "Een gastvriendelijk proces voor reserveringsbevestigingen, herinneringen en eenvoudige annuleringen in de horeca.",
    category: "ServeFlow",
    publishedAt: "2026-07-22",
    updatedAt: "2026-07-28",
    readTime: "6 min",
    accent: "amber",
    intro:
      "No-showpreventie werkt het beste wanneer gasten duidelijkheid en controle krijgen. Een reeks agressieve herinneringen helpt niet. Een goede bevestiging, één passend herinneringsmoment en eenvoudig annuleren vaak wel.",
    sections: [
      {
        heading: "Begin bij een complete bevestiging",
        paragraphs: [
          "De eerste bevestiging moet alle informatie bevatten die een gast later nodig heeft. Dat voorkomt vragen en vergissingen.",
        ],
        bullets: [
          "Datum, tijd en aantal personen",
          "Naam en adres van de locatie",
          "Link om te wijzigen of annuleren",
          "Belangrijke voorwaarden",
          "Contactmogelijkheid voor bijzondere wensen",
        ],
      },
      {
        heading: "Kies het juiste herinneringsmoment",
        paragraphs: [
          "Het ideale moment hangt af van het type zaak en de reservering. Een dinerreservering vraagt een andere aanpak dan een groepsboeking of evenement.",
          "Test één duidelijke herinnering en voeg alleen een tweede moment toe wanneer de gegevens aantonen dat dit nodig is.",
        ],
      },
      {
        heading: "Maak annuleren eenvoudig",
        paragraphs: [
          "Een gast die niet kan komen moet zonder ongemak kunnen annuleren. Een duidelijke knop of korte reply voorkomt dat de tafel onnodig bezet blijft in het systeem.",
        ],
        callout:
          "Een tijdige annulering is operationeel waardevoller dan een gast die uit schaamte niets laat horen.",
      },
      {
        heading: "Wanneer is een aanbetaling passend?",
        paragraphs: [
          "Een aanbetaling kan zinvol zijn bij groepen, speciale menu’s, feestdagen of beperkte capaciteit. Leg vooraf helder uit waarom de betaling nodig is en onder welke voorwaarden deze wordt terugbetaald.",
        ],
      },
      {
        heading: "Gebruik telefonie als vangnet",
        paragraphs: [
          "Niet iedere gast wil een formulier gebruiken. Een telefoonassistent kan buiten openingstijden basisinformatie verzamelen, de reservering registreren of een terugbelverzoek aanmaken.",
        ],
      },
      {
        heading: "Meet meer dan alleen no-shows",
        bullets: [
          "Annuleringen per kanaal",
          "Tijdstip waarop gasten annuleren",
          "Aantal onbeantwoorde oproepen",
          "Wijzigingen in groepsgrootte",
          "Bezetting per tijdsblok",
        ],
        paragraphs: [
          "Deze gegevens helpen niet alleen bij no-shows, maar ook bij personeelsplanning en tafelbezetting.",
        ],
      },
    ],
  },
  {
    slug: "wat-kost-ai-telefonie-voor-een-mkb-bedrijf",
    title: "Wat kost AI-telefonie voor een MKB-bedrijf?",
    description:
      "Welke kostenposten horen bij AI-telefonie en wanneer is een voice-assistent financieel en operationeel zinvol?",
    category: "Bonanza Voice",
    publishedAt: "2026-07-18",
    updatedAt: "2026-07-28",
    readTime: "7 min",
    accent: "emerald",
    intro:
      "De prijs van AI-telefonie bestaat niet alleen uit minuten. De echte kosten worden bepaald door ontwerp, integraties, gespreksvolume, uitzonderingen en het gewenste serviceniveau.",
    sections: [
      {
        heading: "De vier belangrijkste kostenblokken",
        bullets: [
          "Eenmalige inrichting en gespreksscenario’s",
          "Telefonienummers en gespreksminuten",
          "AI-verwerking voor spraak en antwoorden",
          "Integraties, beheer en optimalisatie",
        ],
        paragraphs: [
          "Vraag daarom altijd om een uitsplitsing tussen implementatie, vast beheer en variabel verbruik.",
        ],
      },
      {
        heading: "Wat maakt een implementatie eenvoudig?",
        paragraphs: [
          "Een assistent die openingstijden deelt en terugbelverzoeken verzamelt is eenvoudiger dan een systeem dat afspraken maakt, meerdere agenda’s controleert en betalingen verwerkt.",
        ],
        bullets: [
          "Beperkt aantal gesprekstypen",
          "Duidelijke bedrijfsregels",
          "Eén agenda of reserveringssysteem",
          "Actuele kennisbank",
          "Heldere momenten voor doorverbinden",
        ],
      },
      {
        heading: "Wanneer levert voice waarde op?",
        paragraphs: [
          "De waarde is het grootst wanneer veel oproepen gemist worden, medewerkers vaak dezelfde vragen beantwoorden of de telefoon tijdens werkzaamheden en service niet kan worden opgenomen.",
        ],
      },
      {
        heading: "Bereken de businesscase nuchter",
        paragraphs: [
          "Vergelijk de totale maandkosten met de waarde van teruggewonnen medewerkersuren, extra beantwoorde aanvragen en betere bereikbaarheid. Gebruik conservatieve aannames en meet na livegang wat werkelijk verandert.",
        ],
        callout:
          "AI-telefonie is geen doel op zichzelf. Het is zinvol wanneer bereikbaarheid stijgt zonder dat kwaliteit en controle verdwijnen.",
      },
      {
        heading: "Welke gesprekken moeten naar een mens?",
        bullets: [
          "Klachten of emotionele situaties",
          "Complexe prijs- of contractvragen",
          "Spoed en veiligheidsmeldingen",
          "Gesprekken waarbij de assistent onzeker is",
          "Bestaande klanten met een gevoelig dossier",
        ],
        paragraphs: [
          "Ontwerp deze overdracht voordat de assistent live gaat. Een goede exit is net zo belangrijk als een goed antwoord.",
        ],
      },
      {
        heading: "Start met een beperkte pilot",
        paragraphs: [
          "Begin met één duidelijk gesprekstype of met oproepen buiten openingstijden. Analyseer transcripties en overdrachten, verbeter de kennisbank en breid daarna gecontroleerd uit.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
