# BonanzaLabs

BonanzaLabs bouwt praktische automatiseringsoplossingen voor het Nederlandse MKB.

## Primaire aanbieding

### ServeFlow 14-dagen pilot — €497 ex. btw

- één horecalocatie;
- één reserveringsflow;
- intake en inrichting;
- bevestiging, herinnering en wijzigen/annuleren;
- interne reserveringssamenvatting;
- evaluatie na 14 dagen;
- geen automatische verlenging;
- geen gegarandeerde omzet, reserveringsvolume of daling van no-shows.

Kunnen we de vooraf schriftelijk afgesproken reserveringsflow niet werkend opleveren, dan geldt de leveringsgarantie uit `/voorwaarden`.

## Secundaire aanbieding

### Flow Assessment — €999 ex. btw

Voor meerdere processen, teams, locaties of complexe integraties.

## Kernpagina’s

- `/` — pilotgerichte homepage
- `/serveflow` — ServeFlow-pilotscope
- `/pricing` — Stripe Checkout voor pilot en Flow Assessment
- `/voorwaarden` — pilotvoorwaarden
- `/privacy` — privacyverklaring
- `/contact` — formulier, WhatsApp en telefoon
- `/admin/leads` — beveiligd leadoverzicht
- `/blog` — Nederlandse MKB-kennisbank

## Productievoorzieningen

- Stripe Checkout en webhookvalidatie
- Upstash Redis voor leads, betalingen, idempotency en rate limiting
- Resend voor optionele leadnotificaties
- HTTP Basic Auth voor `/admin/*` en `/api/admin/*`
- MiniMax of OpenRouter voor de chat

Zie `.env.example` voor alle vereiste variabelen.

## Productiegate

Merge pas nadat het volgende daadwerkelijk is getest:

1. officiële handelsnaam, KvK en vestigingsadres ingesteld;
2. Upstash-, Stripe- en adminvariabelen ingesteld voor Preview en Production;
3. testlead opgeslagen en zichtbaar in `/admin/leads`;
4. Resend-notificatie ontvangen;
5. Stripe-testbetaling van €497 voltooid;
6. webhookbetaling zichtbaar in Upstash;
7. admin-API getest met onjuiste en juiste credentials;
8. WhatsApp- en telefoonlinks op mobiel getest;
9. preview visueel gecontroleerd op mobiel en desktop.

## Scheiding van merken

`bonanza-labs.com` is de commerciële MKB-site. Open-source developer tools en experimentele agentproducten horen onder BonanzaForge of GitHub.
