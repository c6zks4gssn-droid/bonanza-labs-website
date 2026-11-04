# BonanzaLabs LeadFlow — MVP

LeadFlow is the multi-tenant lead workspace integrated into the BonanzaLabs Next.js website at `/leadflow`.

## Included in the MVP

- Self-service account creation and login with a separate workspace per account.
- Password hashing with Node.js scrypt; opaque, random, HttpOnly session cookie (30-day maximum lifetime).
- Tenant-scoped Redis keys. API handlers derive the workspace ID from the authenticated server-side session; clients cannot select another tenant.
- Manual lead creation, editing, status changes and deletion.
- Six pipeline statuses: nieuw, gekwalificeerd, benaderd, gesprek, klant, verloren.
- Deterministic lead-fit score (0–100) based on industry fit, target province and available contact/website data. It is a transparent heuristic, not an AI prediction.
- CSV import and export.
- Dutch first-contact draft templates; messages are copied for review and are not sent automatically.
- Optional Google Places Text Search adapter for business discovery. Results are not automatically saved; the user must choose to add each result.

## Runtime and storage

- Next.js 15 App Router on the existing Vercel project `bonanza-labs-site`.
- Existing Upstash Redis REST integration in `src/lib/server-store.ts`.
- The existing `STORAGE_NAMESPACE` prefix also applies to LeadFlow keys. The Vercel preview environment for `feat/bonanzalabs-leadflow-saas` is explicitly scoped to `leadflow-preview`, so preview accounts and leads cannot mix with production Redis records.
- Lead records expire after 24 months from their last write. Account/workspace records have a 10-year storage TTL. Session records expire after 30 days.
- No new database or external dependency is required for manual entry, login, pipeline, or CSV operations.

## Required environment

LeadFlow reuses the existing server-side Redis credentials:

- `KV_REST_API_URL` and `KV_REST_API_TOKEN`, or the supported legacy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

Optional company discovery:

- `GOOGLE_MAPS_API_KEY`: server-side Google Places API key with Places API (New) enabled and billing/quotas configured. Do not expose this key through a `NEXT_PUBLIC_*` variable. The discovery UI returns a clear setup message when the key is absent.

## API routes

- `POST /api/leadflow/auth/signup`
- `POST /api/leadflow/auth/login`
- `POST /api/leadflow/auth/logout`
- `GET /api/leadflow/auth/session`
- `GET|POST /api/leadflow/leads`
- `PATCH|DELETE /api/leadflow/leads/:id`
- `POST /api/leadflow/discover`

Every lead-data route requires a valid LeadFlow session. The workspace ID comes only from the session stored in Redis.

## Current MVP boundaries — not yet launch-ready as a paid SaaS

The first release deliberately does not yet include:
- Subscription plans, checkout, invoices, usage metering or customer billing.
- Email verification, password reset, MFA, account recovery or team invitations/seat management.
- Automated outbound email, calling, bulk outreach or background sequences.
- A hosted AI model for lead research or message generation. Scores and outreach drafts are deterministic and user-reviewed.
- Google Places discovery until the optional API key is configured and the provider terms, quotas and data-handling arrangements have been reviewed.
- An independently audited GDPR processor agreement, full self-service account deletion or a security penetration test.

Before inviting external customers, complete a privacy/legal review and processor terms, add account recovery and email verification, test tenant isolation, set the commercial plan, configure Google Places if wanted, and verify all preview journeys. Do not merge to production until the PR gate and preview checks pass.
