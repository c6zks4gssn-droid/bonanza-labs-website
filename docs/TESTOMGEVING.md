# Testomgeving: de klantreis testen zonder de livesite te raken

Doel: de volledige reis — aanvraag → opgeslagen lead → e-mail → betaling → bevestiging →
admin — één keer doorlopen op een **aparte** omgeving, voordat er iets naar productie gaat.

## 1. Eén vaste branch, één vast adres

Gebruik één branch die je niet hernoemt, bijvoorbeeld `stripe-test`, en hang daar één
eigen domein aan vast:

```
stripe-test.bonanza-labs.com   →  gekoppeld aan branch stripe-test
```

Waarom geen preview-URL: die bevat een afgekapte branchnaam plus een hash per uitrol
(bijvoorbeeld `bonanza-labs-site-git-fix-check-898301-…vercel.app`). Een webhook die je
één keer instelt, moet een vast adres hebben.

## 2. Variabelen per branch, niet voor alle previews

Vercel ondersteunt een git-branch als doel bij een variabele. Gebruik dat, zodat alleen
deze branch de testsleutels krijgt en niet elke pull-request-preview:

```bash
vercel env add STRIPE_SECRET_KEY      preview stripe-test
vercel env add STRIPE_WEBHOOK_SECRET  preview stripe-test
vercel env add ADMIN_USERNAME         preview stripe-test
vercel env add ADMIN_PASSWORD         preview stripe-test
vercel env add STORAGE_NAMESPACE      preview stripe-test   # waarde: test
```

Het admin-wachtwoord voor de testomgeving hoeft niet hetzelfde te zijn als productie —
gebruik juist een ander, en niet het wachtwoord dat je elders gebruikt.

## 3. Testgegevens gescheiden van echte gegevens

`STORAGE_NAMESPACE=test` zet een voorvoegsel op elke opgeslagen sleutel:

```
zonder:  lead:…            stripe:payment:…
met:     test:lead:…       test:payment:…
```

Op productie staat deze variabele niet, dus daar verandert niets. De testomgeving ziet
alleen testgegevens, en productie ziet nooit een testlead of testbetaling.

## 4. Webhooks

Maak in Stripe (in **testmodus**) een eindpunt:

```
https://stripe-test.bonanza-labs.com/api/stripe-webhook
```

Het ondertekeningsgeheim daarvan hoort in `STRIPE_WEBHOOK_SECRET` op de testbranch — niet
het live geheim. Het live eindpunt blijft:

```
https://www.bonanza-labs.com/api/stripe-webhook
```

**De handtekening wordt altijd gecontroleerd** en dat blijft zo: een ontbrekende of ongeldige
handtekening geeft `400` en de gebeurtenis wordt niet verwerkt. Nooit uitzetten om een test
te laten slagen.

## 5. Deployment Protection

Gemeten op 16-09-2026: preview-uitrollen van dit project zijn **openbaar** (een preview gaf
`HTTP 200` zonder inlog). Webhooks komen dus aan.

Zet je bescherming later toch aan, dan blokkeert die ook Stripe — Stripe kan geen eigen
headers meesturen. Twee oplossingen:

- **Protection Bypass for Automation**: het geheim als queryparameter in de webhook-URL,
  `…/api/stripe-webhook?x-vercel-protection-bypass=<geheim>`. Voor webhook-URL's is de
  queryparameter de voorgeschreven vorm, want Stripe kan geen headers zetten.
- **Deployment Protection Exceptions**: het testdomein uitzonderen van bescherming.

## 6. Controleren, niet aannemen

Een groene healthcheck bewijst alleen dat de variabelen *bestaan*. Per stap hoort er bewijs:

| Stap | Bewijs dat je nodig hebt |
|---|---|
| Aanvraag | een lead-id en `notified: true` van `/api/leads` |
| E-mail | de **bezorgstatus** bij de mailprovider — `notified: true` betekent alleen dat de mail is *aangenomen* |
| Betaling | `/api/checkout` geeft een echte Stripe-URL, en de testbetaling slaagt |
| Terugkeer | de browser komt terug op **de preview**, niet op de livesite |
| Webhook | de gebeurtenis is verwerkt: `test:stripe:payment:…` staat in de opslag |
| Bevestiging | de successpagina toont betaald, niet onbekend |
| Admin | de testlead is zichtbaar in de adminlijst én weer te verwijderen |

## 7. Pas daarna productie

Live sleutel, live webhookgeheim en een **sterk** admin-wachtwoord op Production. Opnieuw
uitrollen vanuit de juiste commit — bestaande uitrollen pakken nieuwe variabelen niet.

Btw en automatische facturen komen later; dat is een keuze over factureren, niet over of
de reis werkt.

## 8. Waakhond op de mailbezorging

Een groene healthcheck en `notified: true` zeggen alleen dat de verzendpartij het verzoek
heeft aangenomen. Op 8 september werd een leadnotificatie gebounced, waarna de verzendpartij
het adres op een onderdrukkingslijst zette — en sindsdien werd er niets meer verstuurd
terwijl de code succes bleef melden.

Daarom draait er één keer per dag een controle op `/api/cron/mail-watch`, via een cron in
`vercel.json`. Die kijkt bij de verzendpartij welke verzendingen in de laatste 26 uur zijn
gebounced, onderdrukt of mislukt, en stuurt daarvan een bericht naar Telegram.

De melding bevat **geen klantgegevens**: alleen het tijdstip, de status en het interne nummer
van de verzending. Geen namen, geen onderwerpen, geen adressen.

Vereiste variabelen op Production:

```bash
vercel env add RESEND_API_KEY        production
vercel env add CRON_SECRET           production   # zelf te kiezen; Vercel stuurt die mee bij de cron
vercel env add TELEGRAM_BOT_TOKEN    production
vercel env add TELEGRAM_CHAT_ID      production
```

Zonder `CRON_SECRET` weigert de route elke aanroep. Zonder Telegram-variabelen wordt er niets
gemeld maar blijft de uitkomst wel in het antwoord staan.

**Deze waakhond herstelt de mailbezorging niet.** Hij zorgt dat een dichte deur niet meer
ongemerkt dicht blijft. De bezorging zelf repareren blijft stap 1 tot en met 3 hierboven.
