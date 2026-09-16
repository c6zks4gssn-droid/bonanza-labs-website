# Overdracht: hoe wij samenwerken aan deze site

Dit bestand is de afspraak tussen **Clarence** (eigenaar), **GPT** (bouwt) en **Hermes**
(controleert en publiceert). Het doel is simpel: één bron van waarheid, één meetlat, en geen
herwerk bij de partij die per ronde geld kost.

## De kernregel

**De Git-repository is de waarheid. Vercel publiceert, het bouwt niet zelf iets nieuws.**

Elke wijziging komt binnen als commit op een branch, daarna als pull request. Vercel maakt
automatisch een preview per pull request, en publiceert naar productie zodra de pull request
in `main` staat.

Wat hierdoor niet meer gebeurt:

- Wijzigingen die alleen in Vercel staan en niet in de repository — dan controleert Hermes iets
  anders dan er live staat, en de volgende `git push` overschrijft het werk zonder waarschuwing.
- Twee partijen die hetzelfde bestand anders aanpakken, waarna één kant het werk opnieuw moet doen.

## Wie doet wat

| Wie | Doet | Doet níet |
|---|---|---|
| **GPT** | Ontwerpen, nieuwe features, code schrijven, lastige keuzes | Bouw- en typefouten herstellen die gereedschap kan vinden |
| **Hermes** | Installeren, typechecken, bouwen, diff nalezen, uitrollen, live verifiëren, cron en scripts | Zonder opdracht architectuurkeuzes maken |
| **Clarence** | Beslissen, goedkeuren wat naar buiten gaat, klanten | Handmatig bestanden heen en weer kopiëren |

## Elke inkomende wijziging moet dit melden

1. **Branch of PR** — waar staat het werk.
2. **Wat is er veranderd** — in één alinea, geen bestandenlijst.
3. **Wat moet er gecontroleerd worden** — het gedrag dat iemand moet zien om dit goed te keuren.
4. **Wat is onzeker** — waar is nog een beslissing of een tweede blik nodig.
5. **Wat is niet aangeraakt** — zodat duidelijk is waar niets te zoeken valt.

Zonder die vijf punten kost de controle meer tijd dan het bouwen, en dat is precies de kostenpost
die we hiermee weghalen.

## De controle (voor mens én agent)

```bash
bash scripts/pr-gate.sh          # afhankelijkheden + types + productiebuild
bash scripts/pr-gate.sh --snel   # zonder installeren, als node_modules al bestaat
bash scripts/pr-gate.sh --smoke https://<preview-url>   # plus de rooktest op de preview
```

Dezelfde stappen draaien automatisch in GitHub Actions bij elke pull request. Groen betekent:
types kloppen en de productiebuild slaagt. Pas daarna gaat het naar `main`.

## Vaste huisregels voor deze site

- **Taal:** Nederlands in alle zichtbare tekst, tenzij een pagina expliciet Engelstalig is.
- **Naam en URL:** altijd `BonanzaLabs`, canonieke host `https://www.bonanza-labs.com`
  (met `www`). Geen `bonanza-labs.com` zonder `www` in metadata, canonical of schema.
- **Prijzen:** ServeFlow €497, Flow Assessment €999, Bonanza Voice vanaf €1.495, TradeFlow op
  aanvraag — alle excl. btw. Staat een prijs in de tekst, dan moet hetzelfde getal ook in
  `public/schema.json` en in de metadata staan.
- **Geen beloftes die we niet kunnen bewijzen.** Geen gegarandeerde omzet, geen "foutloze
  afhandeling", geen klantaantallen die niet gemeten zijn. Demo's zijn fictief en dat staat erbij.
- **Menselijke beoordeling blijft** in elke flow die met klanten of geld te maken heeft.
- **Persoonsgegevens:** geen adres, telefoonnummer of e-mailadres van klanten in de repository,
  in logs of in chat.

## Werkwijze in de praktijk

1. GPT of Clarence opent een branch en een pull request.
2. GitHub Actions draait de PR-gate.
3. Hermes leest de diff na, controleert de huisregels hierboven, en kijkt of er iets
   buiten de opdracht is veranderd.
4. Is het groen en klopt het: naar `main`, Vercel publiceert.
5. Hermes haalt daarna de **live** pagina op om te bevestigen wat er echt staat — niet het
   groene vinkje, maar de pagina zelf.

## Meta-bestanden die mee moeten veranderen

Bij wijzigingen aan tekst, prijzen of diensten horen deze bestanden in dezelfde pull request:

- `public/llms.txt` — wat AI-assistenten over BonanzaLabs horen te weten
- `public/schema.json` — machineleesbare bedrijfs- en dienstgegevens
- `public/robots.txt` en `src/app/sitemap.ts` — crawl- en sitemapregels

Dat is geen bijzaak: de vorige keer bleef `public/schema.json` staan op de oude positionering
terwijl de rest van de site al was omgezet. Dat is precies het soort tegenspraak dat
zoekmachines en AI-modellen het minst goed verdragen.
