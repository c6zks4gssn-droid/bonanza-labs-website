# BonanzaLabs Design Guidance

Version: 1.0  
Last reviewed: 2026-09-01  
Applies to: BonanzaLabs website pages, product pages, proposals, reports, social graphics, presentations, and other customer-facing material.

## Purpose

BonanzaLabs is a practical automation company for Dutch small and medium-sized businesses. The design must help an owner understand, within five seconds:

1. who the offer is for;
2. which operational problem it solves;
3. what is included;
4. what it costs or how pricing starts;
5. what the next low-risk step is.

The brand should feel capable, direct, calm, and commercially credible. It must not look like a speculative AI startup, a developer tool, or a generic SaaS template.

## Audience and reader job

Primary readers are owners and managers of Dutch hospitality, construction, installation, and service businesses. They are often busy, non-technical, and cautious about automation.

Structure every page around the reader's immediate decision. Put the answer, offer, or recommendation before background information. Support scanning first and a detailed audit second.

## Brand position

- Master brand: **BonanzaLabs** (one word, capital B and L).
- Commercial focus: practical automation for Dutch SMEs.
- Current solutions:
  - **ServeFlow** — a bounded reservation workflow for hospitality.
  - **TradeFlow** — intake, quotation, and follow-up workflows for construction and installation.
  - **Bonanza Voice** — call handling and voice automation.
- Working principle: start small, prove that the workflow works, then expand.
- Primary website language: Dutch.
- Default contact address: `info@bonanza-labs.com`.

Do not lead with MCP, Web3, agents, model names, infrastructure, or developer terminology. Open-source projects may appear only as supporting technical proof in the portfolio or company story.

## Voice and copy

Write clear professional Dutch at approximately B1/B2 reading level.

### Do

- Lead with a concrete operational outcome.
- Name the exact scope, duration, price, and next step when known.
- Use short sentences, active verbs, and familiar business language.
- Explain limitations and dependencies close to the related claim.
- Prefer evidence and observable delivery over adjectives.
- Use honest language such as “we richten één afgesproken flow in” and “geen automatische verlenging.”
- Use sentence case for headings and buttons.

### Do not

- Promise guaranteed revenue, fewer no-shows, time savings, or results without evidence.
- Use hype such as “revolutionair,” “baanbrekend,” “volledig autonoom,” “10×,” or “de toekomst van AI.”
- Use vague slogans when concrete scope can be stated.
- Address the reader with technical architecture unless the page is explicitly technical.
- Invent testimonials, customer counts, partnerships, certifications, integrations, phone numbers, prices, or performance metrics.
- Use English UI labels when a clear Dutch term exists.

## Visual system

### Color roles

Use color by semantic role, not decoration.

| Role | Value / utility | Use |
|---|---|---|
| Page background | `#050508` | Default canvas |
| Raised section | `#0A0E18` | Alternating section background |
| Card / overlay | `#0D1220` | Navigation panels and stronger cards |
| Primary text | `#FFFFFF` | Headlines and important content |
| Secondary text | `white/60` to `white/70` | Body copy |
| Muted text | `white/35` to `white/55` | Metadata and supporting detail |
| Border | `white/10` | Default dividers and card outlines |
| Primary action | Tailwind `amber-400` | Main CTA, price, and ServeFlow emphasis |
| Primary hover | Tailwind `amber-300` | Hover state for primary actions |
| TradeFlow accent | Tailwind `violet-300/400` | TradeFlow-specific labels and details |
| Bonanza Voice accent | Tailwind `emerald-300/400` | Voice-specific labels and details |
| Assessment / information | Tailwind `cyan-300/400` | Assessments, supporting information |
| Link / occasional secondary accent | Tailwind `blue-300/400` | Use sparingly |

Amber is the master commercial accent. Product colors help orientation but must not compete with the primary action. Do not introduce another accent family without a reviewed brand decision.

Never use pure color as the only status signal; pair it with text or an icon. Maintain WCAG AA contrast for normal text.

### Typography

- Default interface and body type: **Inter** via `--font-sans`.
- Editorial/display accent: **Instrument Serif** via `--font-display`; use selectively for considered editorial moments, not every heading.
- Technical labels or compact metadata: **Geist Mono** via `--font-mono`; use sparingly.
- Main marketing headings are normally bold Inter with tight tracking.
- Use a clear scale instead of many near-identical sizes.
- Headlines should wrap naturally; do not shrink meaningful copy just to force one line.
- Avoid all-caps paragraphs. Small overlines may be uppercase with generous tracking.

### Logo

- Canonical compact asset: `/logo-256.png`.
- Pair the icon with the word `BonanzaLabs` in navigation and footer where space permits.
- Keep the logo undistorted, with at least half an icon width of clear space.
- Do not recolor, rotate, crop, place inside a decorative badge, or add glow effects.
- Do not substitute an AI-generated logo.

## Layout and composition

- Default content maximum: `max-w-6xl` with `px-4` or `px-6` horizontal padding.
- Long-form reading width: approximately `max-w-3xl` to `max-w-4xl`.
- Use generous vertical separation, normally `py-16` to `py-24` for major sections.
- Use one dominant idea per section.
- Let the primary offer or recommendation occupy more visual weight than supporting options.
- Use grids only when the items are genuinely comparable.
- Give comparison tables the full useful content width; do not squeeze them into prose width.
- On mobile, stack decision-critical information in this order: outcome, scope, price, CTA, caveat.
- Do not make every section a floating card. Flat sections and borders should carry much of the structure.

### Page hierarchy

A commercial landing page normally follows this logic, adapted to the reader's job:

1. Specific outcome and audience.
2. Scope, price or starting price, and primary action.
3. Recognizable operational problem.
4. What BonanzaLabs delivers.
5. Process, boundaries, and dependencies.
6. Evidence or relevant portfolio proof.
7. Risks, FAQ, and honest caveats.
8. Final action.

This is a decision sequence, not a mandatory template. A report should lead with the recommendation; a portfolio page should lead with proof; a contact page should minimize friction.

## Components and interaction

- Use the shared `SiteNav` and `SiteFooter` for standard pages.
- Primary button: amber background, black text, strong weight, clear action label.
- Secondary button: subtle border, transparent or restrained tinted background.
- Buttons describe the next action: “Plan kennismaking,” “Bekijk de pilotscope,” or “Start de pilot.” Avoid “Klik hier.”
- Cards use restrained rounding (`rounded-2xl` or `rounded-3xl`), thin borders, and little or no shadow.
- Use Lucide icons already available in the project. Do not use emoji as interface icons.
- Motion must clarify entry, progress, or state. Keep transitions short and subtle.
- Respect `prefers-reduced-motion` and keep content usable without animation or client JavaScript.
- Every interactive control needs a visible focus state, accessible name, and sufficient touch target.
- Navigation, forms, pricing, and core explanations must work at mobile widths without horizontal scrolling.

## Images, charts, and evidence

- Prefer real product interfaces, workflow diagrams, customer-owned material, or restrained abstract system visuals.
- Do not generate fake employees, fake customers, fake dashboards, fake review screenshots, or invented results.
- Images must add evidence or understanding; decoration alone is not a reason to add an image.
- Use `next/image` for production images unless a documented technical constraint prevents it.
- Charts must state units, time range, source, and whether values are actual, estimated, or illustrative.
- Clearly label demos and hypothetical examples.

## Forms, pricing, and trust

- Ask only for information needed for the next step.
- Explain what happens after submission and when the user can expect a response.
- Show validation errors next to the related field and preserve entered values.
- Never display a success state unless the request was durably accepted.
- Prices must state whether VAT is included or excluded.
- Trials and pilots must state duration, included scope, renewal behavior, and material exclusions.
- Legal, privacy, payment, and cancellation language must remain consistent with the actual implementation.
- Never expose private residential details merely to make a page look complete.

## Responsive and resilient behavior

- Design from a narrow mobile viewport first, then enhance for wider screens.
- Essential content must remain visible if animation, analytics, Voice, or another third-party script fails.
- Provide useful loading, empty, error, permission-denied, and success states where relevant.
- A third-party widget may not cover navigation, CTAs, form controls, or legal links.
- Keep the site functional with keyboard input and common browser zoom levels.

## Prohibited generated-design patterns

Avoid these recurring AI-generated patterns:

- **Glow soup:** multiple large neon blurs competing behind every section.
- **Card carpet:** every sentence placed in an identical rounded card.
- **Rainbow products:** assigning new colors to every feature without semantic need.
- **Badge preamble:** several pills and labels before the page states the offer.
- **Metric theatre:** impressive numbers without a traceable source or relevant decision.
- **Logo constellation:** partner or customer logos without permission or a real relationship.
- **Feature avalanche:** long capability grids before the reader understands the primary outcome.
- **AI costume:** robots, brains, circuits, or synthetic people used as generic automation imagery.
- **Copy fog:** abstract phrases such as “unlock your potential” without scope or evidence.
- **Double launcher:** two floating chat, contact, or voice controls competing on one screen.

## Required checks before shipping

For every material customer-facing change, verify:

- The audience, problem, offer, and next action are clear within the first viewport.
- Facts, prices, scope, legal statements, and contact details match the current implementation.
- The page uses the shared navigation, footer, tokens, and product color roles.
- Mobile and desktop hierarchy remain clear.
- Keyboard, focus, contrast, reduced-motion, and form states are usable.
- No invented evidence, claims, integrations, or personal details were added.
- Voice and other third-party widgets do not block the customer journey.
- The production build passes and the rendered page is visually reviewed.

## Governance

This file records accepted decisions, not temporary preferences. Update it only when a reviewed design or repeated correction establishes a reusable rule. Put deterministic mechanics in components, CSS, lint rules, or tests rather than relying only on prose. Preserve human review for material brand, pricing, legal, and conversion decisions.
