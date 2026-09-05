# Stripe integration plan — BonanzaLabs

Status: implementation prepared; Stripe account connection and sandbox verification pending.

## Business model and payment routes

| Offer | Stripe route | Reason |
|---|---|---|
| ServeFlow 14-day pilot (€497 excl. VAT) | Public Stripe Checkout, one-time payment | Fixed price, scope and no automatic renewal |
| Flow Assessment (€999 excl. VAT) | Public Stripe Checkout, one-time payment | Fixed deliverable and fixed price |
| Custom implementation | Stripe quote and invoice after written scope approval | Price and deliverables depend on the agreed scope |
| Monthly management | Stripe Billing subscription after a separate agreement | Recurring charge must not begin from a public hidden product ID |

## Technical flow

1. The pricing page submits a product identifier to `POST /api/checkout`.
2. The server validates the identifier, price and self-service eligibility.
3. Stripe creates a Dutch hosted Checkout Session with dynamic payment methods, billing address and optional business VAT ID collection.
4. Stripe redirects the customer to `/success`; this page retrieves the Session server-side.
5. Stripe sends signed lifecycle events to `POST /api/stripe-webhook`.
6. The webhook validates the signature, checks the pre-tax subtotal and stores an idempotent record in Upstash Redis.

## Stripe Dashboard configuration

### Sandbox first

- Create a BonanzaLabs sandbox.
- Confirm the account country and business profile.
- Configure BonanzaLabs branding, support email and statement descriptor.
- Enable cards and iDEAL in Payment methods. Checkout chooses eligible methods dynamically.
- Create the webhook destination:
  `https://www.bonanza-labs.com/api/stripe-webhook`
- Subscribe it to:
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`
  - `checkout.session.async_payment_failed`
  - `invoice.paid`
  - `invoice.payment_failed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

### Tax and invoicing gates

- Keep `STRIPE_AUTOMATIC_TAX_ENABLED=false` until registrations, default tax code and tax treatment have been checked with the bookkeeper or tax adviser.
- Keep `STRIPE_INVOICE_CREATION_ENABLED=false` until invoice numbering, legal details, VAT ID, footer and branding have been verified.
- Checkout can already collect a business VAT ID; Stripe Tax must not be enabled merely because the field is present.

### Vercel secrets

Set secrets directly in the `bonanza-labs-site` Vercel project. Never paste them into chat or commit them.

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_AUTOMATIC_TAX_ENABLED`
- `STRIPE_INVOICE_CREATION_ENABLED`

Use sandbox credentials in Preview. Use live credentials only in Production after the sandbox flow passes.

## Verification gates

1. Create a sandbox Checkout Session for each public product.
2. Confirm card and iDEAL eligibility on the hosted page.
3. Complete a successful payment and confirm the success page.
4. Confirm the webhook delivery returns HTTP 200 and the Redis record is created once.
5. Resend the same event and confirm it is treated as a duplicate.
6. Test an asynchronous failure event.
7. Test invoice paid/failed and subscription update/cancel events before enabling monthly management.
8. Run the production build, deploy a preview and test the complete browser-to-Stripe-to-webhook flow.
9. Only then add live keys and repeat one low-value live payment with immediate refund.

## Later improvement

Create stable Stripe Products and Prices in the Dashboard and replace inline `price_data` with environment-specific Price IDs. This keeps the first connection simple while avoiding a future product per Checkout Session and improving reporting.
