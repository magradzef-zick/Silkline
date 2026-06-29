# PROJECT MEMORY

> Version: 1.0
> Status: In Progress

---

# 0. PROJECT DIRECTIVE

This document is the **single source of truth** for the project.

Rules:
1. Read this file before making any project decision.
2. If requirements change, update this file first.
3. Then update code.
4. Then update TASKS.

For the full design rationale, see `docs/superpowers/specs/2026-06-29-silkline-v1-design.md`. For the implementation plan this codebase executes, see `docs/superpowers/plans/2026-06-29-foundation.md`.

---

# 1. PROJECT STATUS

- **Project Name:** SilkLine — Digital Flagship Store (V1)
- **Client:** SilkLine
- **Industry:** Premium fashion retail (women's, Korean clothing)
- **Country:** Uzbekistan (Tashkent)
- **Status:** In Progress
- **Current Phase:** Foundation plan complete, approved to merge. Next: Homepage & Collections plan.
- **Completion:** Foundation (scaffold/i18n/data layer/shell) done. No real pages beyond a placeholder home page yet.
- **Priority:** High
- **Current Sprint Goal:** Merge Foundation to `main`, then brainstorm/plan the Homepage & Collections phase.
- **Next Task:** Write the Homepage & Collections implementation plan (Featured Collection → Editor's Picks → Best Sellers sections, Collection detail pages, Shop All).

---

# 2. COMPANY OVERVIEW

## Company
SilkLine — a premium women's fashion retailer based in Tashkent, Uzbekistan, specializing in Korean clothing.

## Product
Women's fashion: dresses, outerwear, knitwear (curated catalog, not exhaustive inventory).

## Target Audience
Premium/fashion-conscious shoppers in Tashkent who currently discover and buy via Instagram/Telegram/physical stores.

## Social Media
- Instagram: (existing, used for current sales)
- Telegram: (existing, used for current sales and will be the V1 ordering channel)
- Website: none yet — this project is the first one

## Business
- Stores: multiple physical stores in Tashkent (2 seeded as placeholder data: Tashkent City, Yunusobod — real store data to be supplied)
- Delivery: not yet defined for the website (orders route to Telegram/WhatsApp, fulfillment is handled off-platform)
- Current Sales Channels: Instagram, Telegram, physical stores

---

# 5. MAIN BUSINESS PROBLEMS

1. No website — entire sales funnel depends on Instagram/Telegram, which under-serves a premium brand's discovery and trust-building needs.
2. No formal digital brand identity (logo exists, but no defined type/color/spacing/motion system) — risks the brand reading as inconsistent or low-effort online.
3. Existing catalog is large across physical stores, but a feature-heavy "marketplace" site would dilute the premium positioning.

---

# 6. PROJECT GOAL

## Primary Goal
Build a "Digital Flagship Store" — a premium brand website that elevates perception, showcases collections beautifully, and simplifies discovery — without becoming a full e-commerce platform.

## Secondary Goals
- Establish a reusable digital design system around the existing logo.
- Keep the architecture CMS/auth/checkout/search-ready for future growth without building any of those in V1.

## Business Value
Higher perceived brand value → more conversions through existing Telegram/WhatsApp ordering channels, and a credible web presence for new-customer discovery.

## Expected Impact
A site that feels comparable in restraint/polish to COS, ARKET, Massimo Dutti, Aritzia — without imitating them.

---

# 8. PROJECT RULES

- Mobile First
- Premium Visual Quality
- Performance First
- No WordPress
- No Ready-made Templates
- Minimalism
- Responsive
- Clean Architecture
- Reusable Components
- Bilingual from day one (Russian default + Uzbek); English explicitly excluded from V1
- No online checkout/auth/reviews/search/CMS-editor/live-chat in V1 — orders happen via Telegram/WhatsApp deep links
- Never use AI-generated model photography or generic stock product photography — real client photography or clearly-labeled placeholders only

---

# 9. DESIGN PRINCIPLES

- The website should feel alive — avoid pages that read as static blocks; use motion, spacing, and visual rhythm deliberately. Motion must be invisible: every animation serves storytelling, hierarchy, or feedback — never decorative.
- Every section must justify itself in storytelling, trust, conversion, or brand perception, or be removed.
- Every page answers exactly one question (see §12 below).
- Build reusable systems, not one-off pages — abstract any pattern that repeats.
- Study premium brands, don't imitate them — the goal is for SilkLine to feel premium on its own terms.
- Portfolio-quality bar: every page should be strong enough to stand alone as a showcase piece.
- Typography is a first-class decision, researched before heavy visual work, with a hard constraint: full native Cyrillic + Latin glyph support (rules out most Latin-only editorial display webfonts).

---

# 11. UX PRINCIPLES

- Editorial-first navigation (Collections primary), with a quiet "Shop All" escape hatch for direct browsing.
- Telegram/WhatsApp order CTA gets the same design weight a real "Add to Cart" would.
- Wishlist via localStorage only — no auth.
- "Complete the Look" — manually curated related products, not an automated recommendation engine.

---

# 12. WEBSITE STRUCTURE (V1)

| Page | Route | Answers |
|---|---|---|
| Home | `/[locale]` | Why should I trust this brand? |
| Collections | `/[locale]/collections/[slug]` | Which style fits me? |
| Shop All | `/[locale]/shop` | Show me everything, filtered |
| Product detail | `/[locale]/product/[slug]` | Why should I buy this item? |
| Brand Story | `/[locale]/about` | Why does this brand exist? |
| Store Locations | `/[locale]/stores` | Where can I experience the brand? |
| 404 | — | — |

Contact info lives in the footer + Stores page — no dedicated Contact page.

Homepage sections: Featured Collection → Editor's Picks → Best Sellers (manually flagged, no "New Arrivals" in V1 — see DECISIONS).

---

# 14. NOT INCLUDED (V1)

- Online payments/checkout
- User accounts / authentication
- Product reviews/ratings
- Real-time inventory sync
- Site search
- Headless CMS editor UI
- Live chat widget
- "New Arrivals" homepage section
- English language

Reason: keep V1 minimal and curated; architecture stays ready for all of these later (see §15 Tech Stack and the data-source/repository boundary).

---

# 15. TECH STACK

- Framework: Next.js 16 (App Router), Turbopack
- Language: TypeScript
- Styling: Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.ts`)
- UI Library: shadcn/ui (used selectively, not as a default look)
- Animation: Framer Motion (not yet introduced — planned for visual-design phase)
- Localization: `next-intl` 4.x — `ru` (default) + `uz`, locale-prefixed routing via `proxy.ts` (NOT `middleware.ts` — deprecated on Next.js 16.2.9)
- Testing: Vitest + React Testing Library
- Database/CMS: none in V1 — local typed data in `/data`, accessed only through `/lib/data-source` (repository layer, swappable for Sanity/Payload later without touching UI)
- Deployment: Vercel (planned, not yet set up)

---

# 16. COMPONENTS (built so far)

- `Header` (async Server Component) — logo, collection links (from repository), Shop All/About/Stores, `LocaleSwitcher`. Contains no branching logic of its own — delegates to `lib/nav.ts`.
- `Footer` (async Server Component) — contact prompt + Telegram/WhatsApp links built from `lib/links/config.ts` constants.
- `LocaleSwitcher` (Client Component) — ru/uz toggle, path-preserving via `lib/nav.ts`'s `switchLocalePath`.

Not yet built: Hero, Section Header, Product Card, Product Gallery, Category Card, Store Card, Button, Modal, Badge.

---

# 17. FOLDER STRUCTURE

```
/app/[locale]/          (locale-prefixed routes; layout.tsx is the de facto root layout)
/components/layout/     (Header, Footer, LocaleSwitcher)
/components/ui/         (not yet populated)
/components/sections/   (not yet populated)
/data/                  (raw seed data: categories, collections, products, stores)
/lib/data-source/       (repository layer — only this layer touches /data)
/lib/links/             (Telegram/WhatsApp link builders + config.ts constants)
/lib/nav.ts             (pure nav-helper functions, the only logic Header/Footer use)
/i18n/                  (locale list + next-intl request config)
/messages/              (ru.json, uz.json)
/types/                 (single source of truth for domain types — AppLocale, Product, Collection, Category, Store)
/public/placeholders/   (flat SVG placeholders — never real client assets, never stock photography)
proxy.ts                (locale routing — NOT middleware.ts)
```

---

# 18. NAMING CONVENTIONS

- Components → PascalCase
- Hooks → camelCase
- Utilities → camelCase
- Constants → UPPER_CASE (e.g. `TELEGRAM_USERNAME`, `WHATSAPP_NUMBER`)

---

# 20. DESIGN REFERENCES

## Websites
- COS, ARKET, Massimo Dutti, Aritzia (studied for restraint/polish, not imitated)

## Mood
- Premium, minimal, elegant, confident, calm, editorial, fashion-first
- Explicitly avoid: template/Shopify-theme/cheap-local/marketplace feel

---

# 21. DESIGN SYSTEM

## Colors
- Base palette: Tailwind's built-in `stone`/neutral scale (warm-toned minimal base)
- Accent: `--color-accent: #8a7a5c` — **placeholder**, to be finalized once the real logo file is supplied

## Typography
- Current: Geist Sans (`next/font/google`, subsets `latin` + `cyrillic` — confirmed full Cyrillic+Latin coverage), wired via `--font-sans` and actually applied to `body` (was inert until the Foundation-merge fix — see DECISIONS).
- Status: **placeholder/safe default**, not yet the final researched typeface pairing. A dedicated typography research pass (Cyrillic+Latin pairing options) is still owed before the visual-design phase, per the design spec.

## Spacing / Layout / Animation
- Not yet defined — owed to the next (visual-design) plan.

---

# 24. DECISIONS

## Decision: Use Next.js (App Router) + TypeScript + Tailwind v4 + next-intl + Vercel as the standing tech stack
**Reason:** Image-heavy bilingual site, future CMS migration path, Vercel-centric tooling already present in this environment.
**Alternatives considered:** Astro (leaner static output, weaker CMS/ecosystem fit); Remix/SvelteKit (no specific advantage here).
**Date:** 2026-06-29

## Decision: Collections-first primary nav, with a secondary "Shop All" escape hatch
**Reason:** Editorial-first browsing fits the brand, but a pure-editorial nav would trap customers who know exactly what they want.
**Alternatives considered:** Catalog-first nav (rejected — feels like a marketplace); pure-editorial-only nav (rejected — usability gap).
**Date:** 2026-06-29

## Decision: Drop "New Arrivals" from the V1 homepage
**Reason:** This is the brand's first website — every product is technically "new" at launch, so the section would read as padding, not editorial richness, against an intentionally small (30–100 product) catalog.
**Alternatives considered:** Keep it anyway (rejected by the user after this reasoning was presented).
**Date:** 2026-06-29

## Decision: Telegram/WhatsApp order links route through exactly two named constants (`TELEGRAM_USERNAME`, `WHATSAPP_NUMBER`) in `lib/links/config.ts`, never inlined
**Reason:** Real contact details are unknown today; swapping them in later must be a one-line change with zero risk of a missed hardcoded instance elsewhere.
**Alternatives considered:** None — explicit user instruction.
**Date:** 2026-06-29

## Decision: Decompose the V1 build into multiple plans (Foundation first, then Homepage & Collections, then Product & Wishlist & Ordering, then Brand Story/Stores/Polish) instead of one giant plan
**Reason:** Each plan should produce working, testable software on its own; later plans' component contracts are written against real Foundation code instead of guesses.
**Date:** 2026-06-29

## Decision: Use `proxy.ts`, not `middleware.ts`, for next-intl locale routing
**Reason:** Empirically confirmed on Next.js 16.2.9 — `middleware.ts` triggers a deprecation warning at build time; `proxy.ts` with identical content does not.
**Date:** 2026-06-29

## Decision: `node_modules` stays a normal directory inside the iCloud-synced project folder; do not symlink it elsewhere
**Reason:** A disk-space-driven build failure was traced to iCloud Drive's file-provider layer interacting with this directory under low disk space. Freeing disk space resolved the root cause. A symlink-relocation workaround was tried and reverted: it surfaced a separate, unrelated incompatibility — Next.js's custom `require-hook.js` module resolution does not work correctly through a symlinked `node_modules` (`Cannot find module 'next/dist/compiled/commander'`, reproduced even with a freshly-installed, byte-verified copy).
**Alternatives considered:** Symlinking `node_modules` outside iCloud sync (tried, reverted — breaks Next.js's module loader); disabling iCloud Desktop sync system-wide (declined by user, out of scope for this fix).
**Date:** 2026-06-29/30

---

# 26. KNOWN ISSUES

- `data/`/`messages/uz.json` Uzbek copy is placeholder-quality machine-assisted translation, not reviewed by a native speaker — needs a content pass before real launch.
- `products.test.ts`'s "dropping unknown ids" test doesn't exercise the actual drop path (seed data has no dangling related-product references) — the implementation is correct by inspection, but the test wouldn't catch a regression. Needs a synthetic dangling-reference test case.
- `not-found.tsx` renders English-only copy (plan-intended for the Foundation phase; needs localization when the 404 gets real design treatment).
- `lib/nav.ts`'s `switchLocalePath` has no defensive handling for malformed pathnames (no leading slash, query/hash) — low risk since Next's `usePathname()` won't produce those, but worth hardening if it's ever fed anything else.
- This host machine's `~/Desktop/Projects/` is iCloud-synced; under low disk space this caused real native-binary build failures (resolved by freeing disk space — see DECISIONS). If builds start timing out again on this machine, check disk space first.

---

# 27. AI NOTES

Priorities:
1. UX
2. Premium Design
3. Performance
4. Simplicity

If you discover a better solution:
- Explain why.
- Suggest it.
- Do not blindly follow previous implementations.

Standing instructions from the project owner (2026-06-29):
- Build the smallest possible product that feels premium, not the largest possible product with the most features.
- Continuously ask: "If this were one of the best fashion websites in the world, what would be different?" — propose genuinely valuable findings even if not asked.
- Challenge weak decisions (including this document's own prior entries) with reasoning, not deference.
- Small, logical, conventionally-messaged commits; never leave large amounts of uncommitted work; keep `main` production-quality at all times.
- Work happens on dedicated feature branches/worktrees per milestone, merged only after build/lint/typecheck are clean and docs are updated.

---

# 29. CHANGE LOG

## 2026-06-29/30

### Changed
- Initialized repository, wrote the V1 design spec and the Foundation implementation plan (10 tasks).
- Executed the Foundation plan via subagent-driven development: Next.js 16 scaffold, Vitest+RTL, domain types, Telegram/WhatsApp link abstraction, ru/uz localization (next-intl, `proxy.ts`), seed catalog data + repository layer, pure nav helpers, accent color token, Header/Footer/LocaleSwitcher shell, placeholder home page + localized 404.
- Final whole-branch review approved merge; post-review fixes applied: typeface now actually renders (was falling back to Arial), package renamed to `silkline`, a host-level Turbopack workspace-root warning silenced.
- Created this PROJECT_MEMORY.md from the template, reflecting everything decided through the end of the Foundation phase.

### Reason
First implementation phase of the SilkLine Digital Flagship Store, per the approved design spec.
