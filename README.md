# BonanzaLabs — Automatisering voor het Nederlandse MKB

BonanzaLabs bouwt praktische automatiseringssystemen voor horeca, bouw, installatie en zakelijke dienstverlening.

**Positionering:** minder handwerk, snellere opvolging en meer omzet — zonder onnodige AI-hype of een zwaar softwaretraject.

## Kernoplossingen

| Oplossing | Voor wie | Kernfunctie |
|---|---|---|
| **TradeFlow** | Bouw, installatie en zakelijke dienstverlening | Intake, offertes, WhatsApp-opvolging, leadpipeline en CRM |
| **ServeFlow** | Restaurants, cafés en horecaondernemers | Reserveringen, no-showpreventie, klantcommunicatie en reviews |
| **Bonanza Voice** | Bedrijven die telefoontjes of afspraken missen | AI-telefonie, afspraken, samenvattingen en doorverbinden |

## Commercieel model

- Flow Assessment Introductie: **€497**
- Flow Assessment Standaard: **€999**
- TradeFlow en ServeFlow implementaties: **vanaf €2.500**
- Bonanza Voice implementatie: **vanaf €1.495**
- Beheer en optimalisatie: **vanaf €197 per maand**

Alleen de twee Flow Assessments hebben een directe Stripe Checkout. Implementaties met een vanafprijs lopen eerst via intake en offerte.

## Belangrijkste routes

```text
/                  Homepage
/tradeflow         TradeFlow
/serveflow         ServeFlow
/bonanza-voice     Bonanza Voice
/pricing           Flow Assessments en prijsindicaties
/portfolio         Gebouwde projecten en cases
/over-ons          Over BonanzaLabs
/contact           Leadformulier
/blog              MKB-kennisbank
/privacy           Privacyverklaring
```

## Technische stack

- Next.js App Router
- React en TypeScript
- Tailwind CSS
- Stripe Checkout en webhooks
- Upstash Redis REST voor leads, betalingen, idempotency en rate limiting
- Resend voor optionele leadnotificaties
- MiniMax of OpenRouter voor de website-assistent
- Vercel voor hosting en preview deployments

## Lokale installatie

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Productiebuild:

```bash
pnpm build
```

## Environment variables

Zie `.env.example` voor het volledige overzicht.

Minimaal voor betalingen en leadopslag:

```text
NEXT_PUBLIC_BASE_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Voor leadnotificaties:

```text
RESEND_API_KEY
RESEND_FROM_EMAIL
LEAD_NOTIFICATION_EMAIL
```

Voor de chat-assistent configureer je MiniMax of OpenRouter, niet beide als onbedoelde fallback.

## Betalingsflow

1. De bezoeker kiest een Flow Assessment op `/pricing`.
2. `/api/checkout` valideert het product tegen de server-side catalogus.
3. Stripe Checkout verwerkt de betaling.
4. `/api/stripe-webhook` controleert de signature, betaalstatus, productmetadata en het verwachte bedrag.
5. Het betaalrecord wordt idempotent en duurzaam opgeslagen.

## Leadflow

Contactformulier en chatwidget sturen aanvragen naar `/api/leads`.

De API:

- valideert en begrenst invoer;
- controleert server-side honeypots;
- gebruikt rate limiting;
- bewaart de lead duurzaam;
- kan een e-mailnotificatie sturen via Resend.

## Voor productie controleren

- [ ] Vercel environment variables ingesteld voor Preview én Production
- [ ] Upstash-database gekoppeld en healthchecks gecontroleerd
- [ ] Resend-verzenddomein geverifieerd
- [ ] Stripe-webhookendpoint toegevoegd voor `/api/stripe-webhook`
- [ ] Testbetaling van €497 volledig doorlopen
- [ ] Testlead via contactformulier en chat ontvangen
- [ ] Privacyverklaring aangevuld met officiële handelsnaam, KvK-nummer en adres
- [ ] Mobiele navigatie en formulieren visueel gecontroleerd
- [ ] Productiedomeinen naar de juiste Vercel-deployment verwezen

## Scheiding van merken

`bonanza-labs.com` is de commerciële MKB-site. Open-source developer tools, packages en experimentele agentproducten horen niet op deze homepage en worden later afzonderlijk onder BonanzaForge of GitHub gepositioneerd.
