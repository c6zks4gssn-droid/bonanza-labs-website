# Light redesign — verification checkpoint

## Release check 2026-09-13

User explicitly requested publication of the light version. GitHub main still
matches the implementation base `0f2976f`; correct Vercel project and both
custom domains confirmed through the connector.

- Desktop homepage screenshot inspected with loaded hero and logo.
- Mobile homepage inspected in 390px iframe: 375px content, no overflow.
- Mobile menu opens; navigation to contact exposes accessible email input.
- Payment presentation tests: six passed; diff whitespace check passed.
- Production build passed on September 12; no application changes since.
- Earlier route and interaction checks below remain applicable. This release
  review does not claim pixel-exact mockup parity or completed live payment,
  email delivery, or microphone conversation tests.

Visual release check: passed for publication. Production verification pending.

## Update 2026-09-12

- Checkout-result presentation now distinguishes paid, pending and unverified
  sessions. Missing sessions no longer claim a completed checkout. Intake steps
  appear only for a confirmed paid pilot. Provider/payment processing unchanged.
- Added `scripts/test-payment-result.cjs`: all six local status cases passed,
  without Stripe requests or payments.
- Production build passed (exit 0), including TypeScript and 25 generated routes.
  A webpack cache-restore warning was non-fatal.
- `git diff --check` passed.
- No Voice model change: the user's “gpt 2.5 voice” needs model clarification.
- No commit, push or deployment. Full visual release QA and configured
  end-to-end Voice, lead and payment checks below remain outstanding.

## Update 2026-09-10

The public-site migration is implemented, including ServeFlow, TradeFlow,
Bonanza Voice, solutions, pricing, portfolio, about, blog index/articles,
privacy, terms, checkout-result page and 404 styling. Shared light navigation
and footer replace the duplicated headers. Admin remains unchanged.

Verified in this turn:

- Final production build: exit 0; 25 routes generated; TypeScript passed.
- `git diff --check`: passed.
- Preview now remains running after disabling native image optimization only
  in development. Production image optimization remains enabled.
- Desktop rendered screenshots inspected: homepage, TradeFlow, ServeFlow,
  blog index. Warm white/mint/green styling and editorial headings rendered.
- Mobile pricing and TradeFlow rendered in a 390px iframe (375px content width
  after scrollbar). TradeFlow scrollWidth equals clientWidth: no overflow.
- Mobile menu opens and exposes contact CTA.
- Demo TradeFlow selection, keyboard ArrowRight to Voice, and disabling
  follow-up update the visible panel correctly.
- Pricing button without terms selected shows the expected validation error;
  no checkout request or payment was initiated.
- Contact labels resolve by accessible name; invalid email fails native
  validation. No lead or email was sent.
- Solutions, Voice, portfolio, about, privacy, terms and success have exactly
  one shared navigation, warm-white computed canvas, visible h1 and no desktop
  horizontal overflow.
- Application console check on TradeFlow showed no application error; a
  Chrome-extension metadata error was present and is outside the app.
- API routes, Stripe libraries, lead/email code and Voice component unchanged.

Remaining release checks:

- Complete screenshot-based fidelity comparison and full mobile route matrix.
  Several cloud screenshot requests timed out, so no full QA pass is claimed.
- Live Voice interaction, successful lead submission and real/test payment
  require the configured deployment; not exercised by this visual migration.
- No commit, push or production deployment performed.

The historical blocker below is retained for traceability; the preview-start
blocker itself has been resolved. The overall final result remains blocked
until complete release QA, not because the preview is still unavailable.

final result: blocked

## Scope and source

- Existing Next.js project; branch `feat/light-redesign`, based on main `0f2976f`.
- Source visual truth: `/workspace/scratch/9c8f4b5faf5e/generated_images/exec-3c400843-5e19-4622-a66e-a2da1ae6fe20.png`.
- Implemented: homepage, interactive three-tab process example, shared light navigation/footer, contact page styling and accessible labels.
- Other product, pricing and legal routes retain their existing designs and logic.

## Findings

- [P0 verification blocker] Preview process stopped while loading the homepage.
  Browser DOM contained the new page, but the screenshot showed missing CSS/images.
  No reliable rendered comparison or interaction verification can be made from that state.
  Preview setup initially also needed in-checkout dependencies and Next.js flag translation.
  Do not publish or report visual QA passed on the strength of the build alone.

## Evidence and comparison state

- Browser: cloud Chrome, attempted desktop viewport 1348 × 958 CSS pixels.
- State: initial ServeFlow tab, reminder checked.
- Source: 868 × 1813 pixels, confirmed by image metadata.
- Implementation screenshot: viewed through browser output, unstyled/incomplete; no valid saved implementation capture.
- Full-view comparison: blocked by incomplete rendered implementation.
- Focused-region comparison: blocked for the same reason.
- Density normalization: not performed; must capture and normalize a complete render first.
- Primary interactions tested: none accepted as passing. DOM showed tabs, checkbox, navigation and CTA destinations, but DOM alone is not behavioral verification.
- Console checked: browser extension metadata error observed; not treated as an application error. Preview process stopped independently.

## Required fidelity surfaces

- Typography: existing Inter/Instrument Serif retained; rendered font fidelity unverified.
- Spacing/layout: split hero, three services, tabbed demo, four steps and pricing implemented; desktop/mobile visual fidelity unverified.
- Colors/tokens: warm white, mint and green implemented in scoped CSS; rendered contrast unverified.
- Imagery: generated diptych converted to 1200px WebP; real logo retained; browser image rendering unverified.
- Copy: removed unsupported guaranteed call outcome; fixed reminder terminology; fictitious examples labeled; TradeFlow price not invented; VAT and external costs disclosed.

## Checks and remaining work

- Initial production build passed: all 25 routes, TypeScript successful.
- Final production build after contact accessibility/style changes passed: exit 0, all 25 routes generated, TypeScript successful. `git diff --check` passed.
- No payment, lead API, email provider, Voice configuration or production environment changed.
- Next: restore a supported preview, capture full desktop/mobile, compare with source, exercise all tabs and keyboard navigation, toggle reminders, verify contact validation without sending a real lead, check console and route links.
- Do not report completion until these checks pass.
