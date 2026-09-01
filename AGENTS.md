# BonanzaLabs agent instructions

## Customer-facing work

Before shaping, writing, implementing, or reviewing anything a customer can see or use, read and follow [`public/design.md`](public/design.md).

This applies to website pages and components, navigation, product copy, forms, pricing, proposals, reports, presentations, social assets, email templates, and generated images.

Treat `public/design.md` as the canonical BonanzaLabs design and customer-communication guidance. Existing code shows what is implemented; the design file explains which choices should be repeated and why.

## Scope discipline

- For a review or diagnosis request, report findings without editing unless the user also asks for changes.
- For an implementation request, reuse existing components and tokens before creating variants.
- Do not change pricing, legal promises, product scope, contact details, payment behavior, or analytics based only on design preference.
- Do not expose secrets, private addresses, or unverified business information.
- Skip the design guidance for backend-only changes with no customer-visible behavior, but still load it when errors, states, or responses affect customers.

## Verification

For material UI changes, run the relevant build and checks, inspect the rendered mobile and desktop result, and verify the primary customer journey rather than checking only isolated components.
