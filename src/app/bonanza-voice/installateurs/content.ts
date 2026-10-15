// Inhoud voor /bonanza-voice/installateurs.
// Prijzen komen uit bestaande bronnen: /pricing en src/lib/stripe-products.ts
// (149500 inrichting, 19700 / 29700 / 49700 beheer per maand via afzonderlijke overeenkomst).
// FAQ-tekst wordt zowel zichtbaar getoond als in FAQPage-schema gebruikt: houd ze identiek.

export const faq = [
  ["Wat is een AI-telefonist voor installateurs?", "Een AI-telefonist neemt inkomende gesprekken aan als jij of je team niet kan opnemen. Bij een installatiebedrijf stelt Bonanza Voice vooraf afgesproken intakevragen, zoals het soort werk, de plaats, de gewenste periode en contactgegevens. Een medewerker beoordeelt de aanvraag daarna en neemt contact op."],
  ["Wat kost Bonanza Voice?", "De inrichting kost vanaf €1.495 excl. btw en wordt per klant bepaald. Beheer kost vanaf €197 per maand excl. btw (Basis €197, Standaard €297 of Uitgebreid €497), via een afzonderlijke overeenkomst. Gebruikskosten (belminuten) komen apart, volgens offerte."],
  ["Geeft de AI prijzen of offertes aan bellers?", "Nee. De agent noemt geen prijzen, doet geen offertes en zegt geen planning toe. Hij legt de aanvraag vast; prijs, beoordeling en planning blijven bij een medewerker."],
  ["Wat als de beller iets vraagt dat de agent niet weet?", "Dan vraagt de agent om verduidelijking of zet hij de vraag klaar voor een medewerker, met de gegevens die tot dan toe zijn verzameld. De agent verzint geen antwoorden buiten de afgesproken scope."],
  ["Kan Bonanza Voice doorschakelen of afspraken inplannen?", "Alleen als dit voor jouw bedrijf is ingericht en getest. Standaard legt de agent de aanvraag vast voor opvolging door een medewerker."],
  ["Weet de beller dat hij met een AI praat?", "Ja. De agent stelt zich aan het begin van het gesprek voor als digitale assistent van jouw bedrijf."],
  ["Hoe lang bewaren jullie gesprekken?", "Dat spreken we per implementatie af en leggen we vast. Gespreksgegevens worden niet langer bewaard dan afgesproken."],
] as const;

export const steps = [
  ["Intake", "We bespreken welk telefoontje je nu het vaakst mist, bijvoorbeeld offerteaanvragen voor badkamers of cv-installaties, en hoe je telefonie nu is ingericht."],
  ["Inrichting", "We stellen de intakevragen, de afgesproken antwoorden en de route naar een medewerker op voor jouw bedrijf."],
  ["Testen", "We testen de flow samen met jou voordat er iets live gaat, inclusief het vastleggen van aanvragen en eventuele doorschakeling als die is ingericht."],
  ["Live met één gesprekstype", "We starten met één gesprekstype, zodat je kunt zien hoe het werkt in de praktijk."],
  ["Evaluatie", "Op basis van de echte gesprekken bespreken we wat werkt, wat beter kan en of uitbreiding zinvol is."],
] as const;

export const doesDoesnt = [
  ["Neemt op en stelt zich voor als digitale assistent.", "Doet zich niet voor als medewerker."],
  ["Stelt intakevragen: soort werk, plaats, gewenste periode en contactgegevens.", "Noemt geen prijzen en doet geen offertes."],
  ["Beantwoordt vooraf afgesproken basisvragen.", "Verzint geen antwoorden buiten de afgesproken scope."],
  ["Zet de aanvraag klaar voor een medewerker.", "Zegt geen planning of monteursbezoek toe."],
  ["Kan doorschakelen of afspraken inplannen als dit voor jou is ingericht en getest.", "Doet geen spoedbeoordeling, tenzij dit apart is afgesproken en getest."],
  ["Legt een gesprekssamenvatting vast zoals per implementatie afgesproken.", "Belooft geen 100% bereikbaarheid of extra omzet."],
] as const;

export const comparison = [
  ["Wie neemt op", "Een AI-agent die zich voorstelt als digitale assistent.", "Een medewerker van de telefoonservice."],
  ["Wat er gebeurt", "Vaste intakevragen en afgesproken basisvragen; de aanvraag wordt klaargezet.", "Afhankelijk van de afspraken: een bericht aannemen of meer, met menselijk inschattingsvermogen."],
  ["Inrichting", "Per bedrijf ingericht en getest, gestart met één gesprekstype.", "Afhankelijk van de aanbieder; vaak een script of belnotitie."],
  ["Kosten", "Inrichting vanaf €1.495 excl. btw, beheer vanaf €197 per maand en belminuten volgens offerte.", "Afhankelijk van de aanbieder en het aantal gesprekken."],
  ["Past goed als", "Je vooral steeds dezelfde soort aanvragen mist en die gestructureerd wilt vastleggen.", "Bellers vaak complexe of gevoelige vragen hebben die een mens moet inschatten."],
] as const;
