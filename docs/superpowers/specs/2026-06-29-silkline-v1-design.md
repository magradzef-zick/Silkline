# SilkLine — V1 Digital Flagship Store — Design Spec

> Status: Approved
> Date: 2026-06-29

## 1. Project Brief

SilkLine is a premium women's fashion retailer based in Tashkent, Uzbekistan, specializing in Korean clothing. They currently sell exclusively through Instagram, Telegram, and physical stores — there is no website today.

**Goal:** a Digital Flagship Store — a premium brand site that elevates perception, showcases collections beautifully, simplifies discovery, and builds trust. Not a traditional e-commerce platform. Orders continue to happen through Telegram/WhatsApp.

**Design bar:** comparable in restraint and polish to COS, ARKET, Massimo Dutti, Aritzia — studied, not imitated. The goal is for SilkLine to feel like a premium brand in its own right.

## 2. Goals and Non-Goals

**In scope for V1:**
- Editorial homepage, Collections (primary nav), Shop All (secondary escape hatch), Product detail, Brand Story, Store Locations, 404
- Telegram/WhatsApp-based ordering (no checkout)
- Wishlist (localStorage, no auth)
- "Complete the Look" (manually curated related products)
- Bilingual: Russian + Uzbek (`next-intl`), scalable to more languages later
- Curated catalog: 4–8 collections, 30–100 products, dev-managed data

**Explicitly NOT in V1** (revisit later, architecture must not block these):
- Online payments/checkout
- User accounts / authentication
- Product reviews/ratings
- Real-time inventory sync
- Site search
- Headless CMS editor UI (data is dev-managed for now, but data access is abstracted so a CMS can be added without refactoring UI)
- Live chat widget
- "New Arrivals" homepage section — every product is "new" at launch; revisit once there's real release cadence (V2)

## 3. Information Architecture

| Page | Route | Answers |
|---|---|---|
| Home | `/[locale]` | Why should I trust this brand? |
| Collections (primary nav) | `/[locale]/collections/[slug]` | Which style fits me? |
| Shop All (secondary, filterable) | `/[locale]/shop` | Show me everything, filtered by Collection/Category/Size |
| Product detail | `/[locale]/product/[slug]` | Why should I buy this item? |
| Brand Story | `/[locale]/about` | Why does this brand exist? |
| Store Locations | `/[locale]/stores` | Where can I experience the brand? |
| 404 | — | — |

Contact information (socials, phone, Telegram/WhatsApp handles) lives in the **footer** and on the **Stores** page — no dedicated Contact page in V1.

**Homepage sections:** Featured Collection → Editor's Picks → Best Sellers. `isEditorsPick` and `isBestSeller` are manual flags on the Product data (no real-time sales data exists, since orders happen off-platform).

**Navigation:** Collections-first (editorial), with a quiet "Shop All" link as a secondary path for customers who want to filter directly without browsing by collection narrative.

## 4. Ordering Flow (replaces checkout)

Each product page's primary CTA opens a pre-filled message to Telegram or WhatsApp:
- Telegram: `https://t.me/<TELEGRAM_USERNAME>?text=<encoded product name + link>`
- WhatsApp: `https://wa.me/<WHATSAPP_NUMBER>?text=<encoded product name + link>`

`TELEGRAM_USERNAME` and `WHATSAPP_NUMBER` are the only two hardcoded values in the whole ordering flow, defined once in `/lib/links/config.ts` (env-overridable). Every CTA calls `buildTelegramOrderLink(product)` / `buildWhatsappOrderLink(product)` from `/lib/links` — nothing constructs these URLs inline. Real contact details are unknown today, so V1 ships with clearly-named placeholder values; replacing them later is a one-line change with zero risk of missing a hardcoded instance elsewhere.

This CTA is the actual "buy button" for V1 and gets the same design attention a real Add-to-Cart action would — not an afterthought link.

## 5. Data Model

Local, typed, structured data for V1 (no CMS), accessed only through a `/lib/data-source` repository layer so a future CMS (Sanity/Payload) swap touches that layer only, not UI components.

```
Collection
  id, slug, name (per locale), story (per locale), heroImage, productIds[]

Product
  id, slug, name (per locale), description (per locale), collectionId, categoryId,
  images[], sizes[], price, isEditorsPick, isBestSeller, relatedProductIds[]

Category
  id, slug, name (per locale)

Store
  id, name, address (per locale), city, phone, mapUrl, hours
```

Filtering in V1: Collection, Category, Size only — intentionally minimal.

## 6. Architecture

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui (used selectively, not as a default look) + Framer Motion + Lucide Icons + React Hook Form + Zod + `next-intl` + Vercel.

```
/app/[locale]/
  page.tsx                  (home)
  /collections/[slug]
  /shop
  /product/[slug]
  /about
  /stores
/components
  /ui          (primitives)
  /sections    (homepage sections, product sections, etc.)
  /layout      (header, footer, nav)
/data          (collections.ts, products.ts, categories.ts, stores.ts)
/lib
  /data-source (repository layer — the only thing a future CMS migration touches)
  /links       (config.ts holds TELEGRAM_USERNAME/WHATSAPP_NUMBER; telegram.ts, whatsapp.ts build URLs from it)
  /utils
/messages      (ru.json, uz.json)
/types
```

Future-proofing: the data-source/repository boundary is what makes CMS, auth, checkout, and search addable later without rearchitecting. None of those are built now — the boundary just means they won't require a rewrite.

## 7. Localization

`next-intl` with `ru` and `uz` locales, locale-prefixed routing (`/ru/...`, `/uz/...`). All product/collection/store copy fields are locale-keyed in the data model from day one, so adding a third language later is a content task, not a code change.

## 8. Design System Direction

(Token values — exact hex/type — are finalized once the actual logo file is provided; this section sets direction, not final values.)

- **Palette:** neutral, warm-toned minimal base (off-white/stone, charcoal) plus one accent drawn from the existing logo. Restraint over variety.
- **Typography:** a confident grotesk sans for UI/body, paired with a serif or heavier-weight sans for editorial headings. **Hard constraint: full native Cyrillic + Latin glyph support** — Russian needs Cyrillic, Uzbek is Latin-script; this rules out most Latin-only editorial display webfonts. Typography is treated as a first-class design decision — font pairing options will be researched and presented before implementation if multiple strong candidates exist.
- **Spacing:** generous, rhythmic whitespace scale.
- **Iconography:** Lucide, used sparingly — navigation stays text-led.
- **Motion:** scroll-triggered reveals, hover states on product cards (image swap, not just zoom), route transitions. Motion must be invisible — in service of storytelling, hierarchy, or feedback only; respects `prefers-reduced-motion`; no decorative animation.

## 9. Standing Principles (apply to all future work, not just V1)

1. The site should feel alive — avoid pages that read as static blocks; use motion, spacing, and visual rhythm deliberately.
2. Every section must justify itself in storytelling, trust, conversion, or brand perception, or be removed.
3. Every page answers exactly one question (see Information Architecture table).
4. Build reusable systems, not one-off pages — abstract any pattern that repeats.
5. Study premium brands, don't imitate them — the goal is for SilkLine to feel premium on its own terms.
6. Portfolio-quality bar: every page should be strong enough to stand alone as a showcase piece.
7. Architecture stays future-proof for CMS/auth/checkout/search even though none are built in V1.

## 10. Assets and Open Items

- Logo file and product photography exist (gathered from Instagram/Telegram) — to be supplied during implementation. Never use AI-generated models; avoid generic stock for products. High-quality placeholders only for layout exploration, clearly separated from real client assets.
- Typography shortlist (Cyrillic+Latin pairing options) to be researched and presented before visual design work begins.
- Exact color tokens finalized against the real logo file.
