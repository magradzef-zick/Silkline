# Homepage & Collections — Design Spec

> Status: Approved for implementation
> Date: 2026-06-30
> Builds on: `docs/superpowers/specs/2026-06-29-silkline-v1-design.md`
> Revised after: self-critique review (same date)

---

## 0. Design Premise

With a launch catalog of 6 products across 2 collections, the risk isn't building too little — it's building the wrong things to compensate for perceived thinness. Most e-commerce sites respond to a small catalog with more UI: category grids, filter sidebars, "Popular" badges, newsletter captures. This is exactly wrong for a premium brand. Scarcity, when framed correctly, reads as curation. The design must make that deliberate.

**Filtering rule applied to every section:** if this section disappeared, would the customer understand the brand or find a product less well? If not, it doesn't exist.

---

## 1. Homepage

**Page intent:** "Why should I trust this brand?"

**Final section sequence:**

```
1. Hero
2. Featured Collection (editorial)
3. Selected (merged editorial product section — 4 products)
4. Brand Moment (conditional — renders only when real copy exists)
5. Footer
```

Five sections. The "Find Us" store callout and a separate "Best Sellers" section were removed in review. Store information belongs in the footer (where COS, Toteme, Aesop, and every premium reference put it). Separate Editor's Picks and Best Sellers sections were merged because with 6 products the distinction produces overlap and the curation categories aren't genuinely distinct at this catalog size. Revisit the split at 20+ products.

---

### 1.1 — Hero

**Business purpose:** First impression. Establish the brand's visual register within 2 seconds.

**UX purpose:** Orientation without friction. One confident image, one statement, one action. No choices to make.

**Design:**
- `100svh` on desktop, `85svh` on mobile (the lower edge of the next section is visible at mobile viewport height — signals scroll without obscuring it)
- Featured collection's hero image, full-bleed, `object-fit: cover`
- Darkening gradient on the lower third of the image — ensures text legibility without obscuring the photography
- Collection name: medium-weight, `text-2xl` to `text-4xl`, all-caps with generous tracking
- One tagline, max 6 words
- One CTA button linking to `/[locale]/collections/[slug]` — the featured collection
- No secondary CTA. No carousel. One image, one action.

**Not a carousel:** Carousels dilute hierarchy, test poorly beyond the first slide (users rarely advance them), require CMS maintenance to stay fresh, and load multiple large images. A single confident image is more premium in every dimension.

**Data source:** `getFeaturedCollection()` — reads `editorial.ts` config (see §5.1), not a flag on the entity.

**Responsive:**
- Desktop: image fills viewport, text left-aligned, vertically anchored slightly below center (below-center avoids the "motivational poster" feel of perfectly centered type)
- Mobile: `object-position: center top` preserves the garment in the photography crop; text in the lower 40%

**Accessibility:**
- `alt=""` while placeholder SVGs are in use (they are decorative)
- With real photography: `alt={collection.name[locale]}`
- CTA: standard focus ring, keyboard-activatable
- The hero image is the LCP element — mark `<Image priority />`

**Performance:** `priority` on the hero image. All other images on the page: lazy. This single decision has the largest single impact on homepage LCP.

---

### 1.2 — Featured Collection

**Business purpose:** Give the collection room to be understood. The hero established the image; this section provides the editorial context.

**UX purpose:** A visitor drawn in by the hero image wants to understand it before being shown products. This section answers "what is this collection?" before product discovery begins.

**Relationship to Hero:** Hero and Featured Collection always show the **same** collection. They form a single editorial unit across two viewport scrolls. Depth over breadth — one collection presented fully rather than two collections presented superficially.

**Design:**
- Two-column on desktop: collection image left (60% width, portrait aspect ratio, different from the hero image — an editorial or in-context shot), collection name + story + CTA right
- Story text: `collection.story[locale]`
- **Short copy treatment:** At launch, story fields are 1–2 sentences. Do not render this in body-size type with a wide container — it will float. Render short stories (< 3 sentences) at `text-2xl`, centered within the text column, with `max-w-sm` line control. Make brevity a typographic choice, not a content gap. This is how Acne Studios handles their terse collection descriptions.
- CTA: "Смотреть коллекцию" / "Kolleksiyani ko'rish" → `/[locale]/collections/[slug]`
- Mobile: stacked, image full-width first, text below

**Data source:** Same `getFeaturedCollection()` call from the page — passed as a prop. Not re-fetched.

**Accessibility:** `aria-label="View the [collection name] collection"` on the CTA to distinguish from any other "View Collection" links.

**Performance:** This image is below the fold. Lazy load by default.

**Implementation:** `FeaturedCollectionSection` — Server Component. Receives the `collection: Collection` prop from the page (shared with `HeroSection`; one repository call, two consumers).

---

### 1.3 — Selected (editorial product section)

**Business purpose:** Introduce individual products editorially. Four of the strongest items from the catalog.

**UX purpose:** Product discovery that doesn't feel like browsing. The section heading frames the selection as curation, not inventory.

**Why merged (not two sections):** With 6 products total, "Editor's Picks" and "Best Sellers" as separate sections risk showing the same product twice (confirmed in review: `p-slip-dress` would appear in both). Two sections claiming different meanings but functionally identical, on a 6-product catalog, reads as padding. One honest section with 4 distinct products is stronger. Split them when the catalog reaches 20+ products and the curation categories can be meaningfully distinct.

**Heading:** "Избранное" / "Tanlangan" (Selected). Not "Editor's Picks" — that label requires earned editorial authority. "Selected" is honest at launch.

**Design:**
- 4 products displayed as a horizontal scroll on mobile, 4-column grid on desktop
- Each product: portrait image (3:4 aspect ratio), localized name, price. Nothing else — no badges, no "Add to Wishlist" text, no category label. The section heading provides the editorial framing; individual cards don't need to repeat it.
- Hover state on desktop: reveal second product image if available, otherwise subtle image scale (`scale-[1.02]` — perceptible but not dramatic)
- Wishlist icon: appears on hover (desktop), persistent (mobile) — unobtrusive, icon-only
- Entire card is a link to the product detail page

**What is not here:** No "Editor's Pick" or "Best Seller" badge on individual cards. Badges are a visual pattern borrowed from discount retailers to highlight specific items. On a brand site with curated selection, they read as a lack of confidence — if everything is selected, nothing needs a badge to justify its presence.

**Data source:** `getSelectedProducts()` — reads from `editorial.ts` config (see §5.1). Four product slugs listed explicitly.

**Accessibility:**
- Cards are `<article>` elements with a primary `<a>` link on the image
- Product name links to the same URL as the image — do not nest `<a>` inside `<a>`, use two separate links at the same depth
- Wishlist toggle: `role="button"`, `aria-label="Добавить [name] в список желаний"`, `aria-pressed={isWishlisted}`
- Horizontal scroll container on mobile: `role="list"`, items are `role="listitem"`

**Performance:** All images lazy. `sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"` for accurate resolution delivery.

**Implementation:** `EditorialProductSection` — Server Component receiving `products: Product[]` and `locale: AppLocale`. The same component structure is reusable for any future editorial product section.

---

### 1.4 — Brand Moment (conditional)

**Condition:** This section only renders when `messages/ru.json` and `messages/uz.json` contain a real, approved `brand.statement` key. It must NOT render with placeholder copy. Ship this section hidden (key absent → section absent). Activate when the client provides or approves the copy.

**Why conditional:** An aspiration like "clothing should feel like a decision, not a compromise" is indistinguishable from copy on any fashion brand's website. Generic aspiration without earned authority reads as pretension, not confidence. The section adds editorial weight only when the copy is genuinely distinctive.

**What the copy should be:** A specific, true statement about SilkLine's actual proposition — origin, provenance, or a factual description of what the brand does. Something like "Sourced personally in Seoul, brought to Tashkent" is specific and checkable. It doesn't require decades of brand-building to land with authority. Specificity > aspiration, always.

**Design (when rendered):**
- Full-width, `py-24`
- Background: `stone-50` (the page's base tone, slightly distinct from surrounding sections)
- One or two sentences at `text-3xl` or larger, centered, `max-w-2xl mx-auto`, generous line height
- No image. No CTA. No link. A statement, not a sales pitch.

**Data source:** `brand.statement` key in messages files. If key is absent or empty string, the server component returns `null`.

**Accessibility:** `<p>` element, not a heading — this is body copy at display size, not a navigational landmark.

---

## 2. Collection Detail Page

**Route:** `/[locale]/collections/[slug]`

**Page intent:** "Which style fits me?"

**Rendering:** Fully static via `generateStaticParams`. Both collection pages are pre-rendered at build time — zero runtime server cost.

### Section sequence

```
1. Collection Hero
2. Collection Story
3. Product Grid
4. Related Collections
```

**No visual breadcrumb.** Premium fashion references (COS, Acne Studios, Toteme) don't show breadcrumb trails on collection pages — the URL and header nav provide location context. A breadcrumb trail signals "filing system" rather than editorial world. `BreadcrumbList` JSON-LD structured data is still injected in the `<head>` for SEO benefit — that's completely independent of the visual element.

---

### 2.1 — Collection Hero

- Full-viewport-width, `60vh` height on desktop
- `collection.heroImage` — currently the same placeholder SVG for both collections; real implementation requires distinct photography per collection
- Collection name overlaid in large type, lower-left aligned (centered type is the "first design choice" default — left-aligned is more considered)
- `priority` on this image — it's the LCP element for the collection page

---

### 2.2 — Collection Story

**Short copy specification (critical at launch):** With 1-sentence seed stories, body-size text in a wide container will look unfinished. Implement with a character-count conditional:

- Under 100 characters: render at `text-3xl lg:text-4xl`, centered, `max-w-lg mx-auto`, `leading-relaxed`
- 100–400 characters: render at `text-xl lg:text-2xl`, centered or left-aligned, `max-w-2xl mx-auto`
- Over 400 characters: standard prose style, `text-base lg:text-lg`, `max-w-prose mx-auto`, left-aligned

This makes 1-sentence brevity feel intentional (large type, centered, confident) rather than like a content gap.

**Future content expectation:** When real collection stories are written, they should be 3–5 sentences — enough to create atmosphere and voice. The design accommodates this via the character-count conditional above. Stories longer than ~600 characters (roughly 100 words) don't need to be shown in full — consider showing a truncated excerpt with a "Read more" expand, to preserve the page's visual rhythm.

---

### 2.3 — Product Grid

- 2-column on mobile, 3-column on desktop, `gap-6 lg:gap-8`
- `getProductsByCollectionId(collection.id)` — current max 3 products per collection
- Products rendered in the order they appear in the collection's `productIds` array (explicit editorial ordering)
- Uses `ProductCard` component (same as everywhere else — no special collection-page variant)
- No sort controls (3 products don't need sorting)
- Empty state: if a collection has no products, the grid simply doesn't render — no "No products yet" message on a production brand site

---

### 2.4 — Related Collections

- `getAllCollections().filter(c => c.slug !== currentSlug)`
- With 2 total collections: shows exactly 1 other collection
- Renders only when at least 1 other collection exists (guard in the component)
- Each: portrait image + collection name overlay + link
- Heading: "Другие коллекции" / "Boshqa kolleksiyalar"
- SEO value: cross-links all collection pages

**When 1 collection:** renders as a single wide card, not a strip — it shouldn't look like a list of one item trying to be a strip. Design: card spans 50% of the content width, centered on desktop. Mobile: full width.

---

## 3. Shop All Page

**Route:** `/[locale]/shop`

**Page intent:** "Show me everything, filtered."

**Character:** Functional, but premium in execution. This is the utilitarian escape hatch — it can be slightly more catalog-like than collection pages, but should not feel industrial.

---

### 3.1 — Rendering and data strategy

All data is local. Filter interactions require zero network requests. The architecture:

```ts
// page.tsx — Server Component
// Runs once at request time; returns all products, all categories, all collections
const products = getAllProducts();
const categories = getAllCategories();
const collections = getAllCollections();
return <ShopAllClient products={products} categories={categories} collections={collections} locale={locale} />;
```

```ts
// ShopAllClient.tsx — 'use client'
// Owns filter state. Derives filtered + sorted list from props + state.
// Renders: heading, product count, FilterBar, ProductGrid
```

Initial render is server-rendered HTML (all products visible, no filters applied). Filter changes update client state only — no network calls, no loading states needed. **This is correct for a local data source at any catalog size up to ~300 products.**

**URL-based filters (not included in V1):** Client-only state means filtered views aren't shareable via URL. This is acceptable for a browsing catalog. Migration path: `ShopFilters` should accept an `initialFilters` prop from URL search params even in V1, so future URL filter support is additive, not structural. Wire the prop to receive `undefined` for now.

---

### 3.2 — Page heading and count

```
<h1>Каталог / Katalog</h1>
<p>6 изделий / 6 ta mahsulot</p>  {/* filtered count / total */}
```

When filters are active: "Показано 3 из 6" / "6 dan 3 ko'rsatilmoqda". This makes filtering legible without requiring a separate "results" notification.

---

### 3.3 — Filters

**Available:** Collection (multi-select chips), Category (multi-select chips), Size (multi-select chips). These are the three filters specified in the design spec. Nothing added.

**Why multi-select chips (not radio buttons or dropdowns):** Chips are persistent (user can see what's selected without opening a dropdown), multi-select is natural (a customer might want dresses from either collection), and chips at this scale don't overwhelm the filter bar.

**Layout:**
- Desktop: single horizontal filter bar below the `<h1>` + count. Three disclosure triggers ("Коллекция", "Категория", "Размер"), each opening a small dropdown panel with chips. Sort control is right-aligned in the same bar.
- Mobile: "Фильтр" / "Filtr" button (inline, top of page, not floating/fixed) opens a bottom sheet with all three filter groups stacked. Focus is trapped in the sheet while open. Closes on "Применить" / "Qo'llash" or backdrop tap.

**Active state:** When filters are active, the filter bar shows "Очистить" / "Tozalash" (Clear all) as a text link on the right. No "applied filter chips" row — this adds complexity without enough benefit at this scale.

**Form accessibility:**
- Filter groups use `<fieldset>` + `<legend>` (Collection / Category / Size)
- Each chip: `<button>` with `aria-pressed={active}`
- Mobile sheet: `role="dialog"`, `aria-modal="true"`, `aria-label="Фильтры"`, focus trap

---

### 3.4 — Sorting

Three options:
- "Избранное" / "Tanlangan" (default — matches `editorial.ts` `selectedProductSlugs` order, then alphabetically for unranked products)
- "Цена: от низкой" / "Narx: pastdan" (price ascending)
- "Цена: от высокой" / "Narx: balanddan" (price descending)

No "New" / "Latest" sort — there is no creation date on `Product`. Array position is arbitrary. Don't expose arbitrary ordering as "New" — that reads as a mistake when users notice it doesn't change.

---

### 3.5 — Product grid

Same `ProductGrid` and `ProductCard` as everywhere else. `columns={3}` on desktop, 2 on tablet, 1 on mobile.

**Pagination thresholds:**
- At launch (6 products): no pagination. All products render in a single DOM.
- At 30+ products: run Lighthouse INP and DOM size audits. If either flag warnings, implement "Load 24 more" button pattern (adds products to DOM in batches).
- At 60+ products: consider virtual scrolling or pagination. Do not defer this decision until you're at 80 products and facing a rewrite.
- The `ProductGrid` component must accept a `totalCount: number` prop from the start, so adding pagination or a "load more" count doesn't require component restructuring.

---

### 3.6 — Empty state

When filters return 0 results:

```
Ничего не найдено  /  Hech narsa topilmadi
Попробуйте другие фильтры  /  Boshqa filtrlarni sinab ko'ring
[Сбросить фильтры]  /  [Filtrlarni tozalash]
```

Centered in the product grid area. Button clears all filter state. No illustrations, no emoji, no stock photography. Clean, minimal, on-brand.

---

### 3.7 — Loading state (skeleton — scaffolding only)

All filtering is synchronous local state — no loading states are triggered. However, `ProductGrid` must accept a `loading?: boolean` prop that renders `ProductSkeleton` placeholders instead of cards. Build this now:

```tsx
function ProductSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="aspect-[3/4] bg-stone-200 rounded-sm" />
      <div className="h-4 bg-stone-200 w-3/4 rounded" />
      <div className="h-3 bg-stone-200 w-1/3 rounded" />
    </div>
  );
}
```

When `loading` is `true`, `ProductGrid` renders `[1..12].map(() => <ProductSkeleton />)`. This is not triggered by current local data but prevents a breaking API change when data moves to a CMS.

---

## 4. Component Architecture

### 4.1 — Layout components (structural, no visual opinions)

| Component | Purpose | Notes |
|---|---|---|
| `PageContainer` | `max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8` | Every page's content wrapper |
| `Section` | Consistent `py-*` vertical spacing; `as` prop for semantic element | Use `as="article"`, `as="section"`, etc. — not always `<div>` |

### 4.2 — UI components (atomic, reusable everywhere)

| Component | Key props | Notes |
|---|---|---|
| `Button` | `variant: 'primary' \| 'secondary' \| 'ghost'`, `size: 'sm' \| 'md' \| 'lg'` | Fully custom — no shadcn defaults visible. Primary: solid accent. Secondary: outline. Ghost: text-only. |
| `ProductCard` | `product: Product`, `locale: AppLocale` | Image (3:4), name, price. Hover: second image or scale. `WishlistToggle` as nested client island. |
| `ProductGrid` | `products: Product[]`, `locale: AppLocale`, `columns?: 2 \| 3`, `loading?: boolean`, `totalCount: number` | Renders `ProductCard` or `ProductSkeleton`. |
| `ProductSkeleton` | — | Matches `ProductCard` proportions. CSS `animate-pulse`. |
| `FilterChip` | `label: string`, `active: boolean`, `onToggle: () => void` | `aria-pressed`. Active = filled accent background. |
| `CollectionCard` | `collection: Collection`, `locale: AppLocale` | Image + name overlay + link. Used in Related Collections. |
| `NavigationProgress` | — | Thin progress bar at page top, triggered on navigation start, fades on completion. Client Component in root layout. |
| `JsonLd` | `data: object` | Injects `<script type="application/ld+json">` safely. Server Component. |

**No `Breadcrumb` component in this milestone.** JSON-LD BreadcrumbList is injected via `JsonLd` without a corresponding visual element.

### 4.3 — Feature components (domain-specific)

| Component | Used in | Type |
|---|---|---|
| `HeroSection` | Homepage | Server — receives `collection: Collection` |
| `FeaturedCollectionSection` | Homepage | Server — receives `collection: Collection` |
| `EditorialProductSection` | Homepage | Server — receives `products: Product[]`, `heading: string` |
| `BrandMoment` | Homepage | Server — reads `brand.statement` from `getTranslations`; returns `null` if key is absent |
| `CollectionStory` | Collection page | Server — renders `collection.story[locale]` with character-count conditional |
| `RelatedCollections` | Collection page | Server — receives `collections: Collection[]` |
| `ShopAllClient` | Shop All page | **Client** — owns filter + sort state |
| `ShopFilters` | Inside `ShopAllClient` | **Client** — filter bar (desktop) + bottom sheet (mobile) |
| `WishlistToggle` | Inside `ProductCard` | **Client** — localStorage access, icon-only |

### 4.4 — Reuse principle

`EditorialProductSection` is the only component for any editorial product row on any page. Its content is determined entirely by which products are passed in and what heading is used. Do not build page-specific variants.

`ProductCard` and `ProductGrid` are genuinely universal — identical on the homepage, collection pages, and Shop All. No special-case styling for context.

---

## 5. Data Flow

### 5.1 — Editorial configuration (architectural change from original spec)

**New file: `lib/config/editorial.ts`**

```ts
export const EDITORIAL = {
  featuredCollectionSlug: 'autumn-atelier',
  selectedProductSlugs: [
    'silk-wrap-dress',
    'satin-slip-dress',
    'camel-wool-coat',
    'cropped-knit-cardigan',
  ],
} as const;
```

**Why this replaces boolean flags on entities:**

`isEditorsPick` and `isBestSeller` stored on `Product` entities are editorial placement decisions masquerading as product properties. A product doesn't intrinsically "be" a best seller — it's placed there by an editorial decision. Storing placement decisions in the data model conflates what a product *is* with what someone has *decided to do with it*.

A dedicated config file:
- Makes editorial decisions immediately legible — one file, all homepage placement
- Makes data/products.ts purely descriptive (name, price, category, images — things intrinsic to the product)
- Is easier to hand off to a client ("to change what appears on the homepage, edit `lib/config/editorial.ts`")
- Trivially extends: `featuredBannerSlug`, `highlightedCategorySlug`, etc. are one line each

**Type changes:**
- Remove `isEditorsPick: boolean` and `isBestSeller: boolean` from `Product` interface
- Do NOT add `isFeatured: boolean` to `Collection` (the original spec proposed this, but `EDITORIAL.featuredCollectionSlug` supersedes it)

**Repository changes:**

```ts
// lib/data-source/collections.ts
import { EDITORIAL } from '@/lib/config/editorial';

export function getFeaturedCollection(): Collection | undefined {
  return collections.find(c => c.slug === EDITORIAL.featuredCollectionSlug);
}
```

```ts
// lib/data-source/products.ts
import { EDITORIAL } from '@/lib/config/editorial';

export function getSelectedProducts(): Product[] {
  return EDITORIAL.selectedProductSlugs
    .map(slug => products.find(p => p.slug === slug))
    .filter((p): p is Product => p !== undefined);
}
```

### 5.2 — Page-level data flow

**Homepage** (`app/[locale]/page.tsx`, Server Component):
```ts
const collection = getFeaturedCollection();   // Hero + FeaturedCollectionSection
const selected = getSelectedProducts();        // EditorialProductSection
// BrandMoment reads from getTranslations() internally; no page-level data needed
```

**Collection page** (`app/[locale]/collections/[slug]/page.tsx`, Server Component):
```ts
const collection = getCollectionBySlug(slug);
if (!collection) notFound();
const products = getProductsByCollectionId(collection.id);
const relatedCollections = getAllCollections().filter(c => c.slug !== slug);
```

`generateStaticParams`: returns `{locale, slug}` for every `locale × collection` combination.

**Shop All** (`app/[locale]/shop/page.tsx`, Server Component):
```ts
const products = getAllProducts();
const categories = getAllCategories();
const collections = getAllCollections();
// All passed to ShopAllClient as props
```

### 5.3 — Server/Client boundary

| Component | Boundary | Reason |
|---|---|---|
| All page files | Server | Data access |
| `HeroSection`, `FeaturedCollectionSection`, `EditorialProductSection`, `BrandMoment`, `CollectionStory`, `RelatedCollections` | Server | Display-only; no browser APIs |
| `ProductCard`, `ProductGrid`, `CollectionCard` | Server | Display-only; `WishlistToggle` is the only client island inside ProductCard |
| `WishlistToggle` | **Client** | `localStorage` |
| `ShopAllClient`, `ShopFilters` | **Client** | Filter/sort state |
| `NavigationProgress` | **Client** | Tracks navigation events |
| `Header`, `Footer`, `LocaleSwitcher` | Existing (Server / Client respectively) | Unchanged |

### 5.4 — Caching

All data is local files compiled into the bundle. No caching configuration is needed. When a CMS is introduced, add `export const revalidate = 3600` per page — no other structural changes needed.

---

## 6. Performance Plan

### 6.1 — Image loading strategy

| Image | Loading | Sizes |
|---|---|---|
| Hero | `priority` (LCP) | `100vw` |
| Featured Collection editorial image | `priority` | `(max-width: 768px) 100vw, 60vw` |
| Selected product cards (4 cards) | Lazy | `(max-width: 640px) 80vw, 25vw` |
| Collection hero | `priority` (LCP on collection page) | `100vw` |
| Collection editorial images (product grid) | Lazy | `(max-width: 640px) 100vw, 33vw` |

**`next/image` is mandatory for all images.** No raw `<img>` tags. Explicit `width`/`height` or `fill` + parent container with defined `aspect-ratio` on every image — zero CLS from images.

**Real photography considerations:** Social-media-exported images (Instagram/Telegram) are JPEG at 1080px typical. They will not serve well at full-bleed hero sizes (e.g., a `100vw` image on a 2560px display needs a 2560px source). Verify with the client that high-resolution originals are available before implementing any hero section. Social exports are not production-ready for large-format display.

### 6.2 — Route transition feedback

**`NavigationProgress` component** — a thin progress bar (`4px` height, accent color, `position: fixed`, `top: 0`, `z-index: 9999`) that:
- Starts on navigation begin (Next.js router event)
- Animates width from 0 → 85% while waiting for the server response
- Jumps to 100% and fades out when the new page renders

Implementation uses the Next.js App Router `usePathname` to detect navigations, not the legacy `router.events`. This is a known gap in App Router (no native loading event exposed) — the pattern is to detect pathname changes:

```tsx
// components/layout/NavigationProgress.tsx
'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  // ...interval-driven progress animation, reset on pathname change
}
```

Mounted in `app/[locale]/layout.tsx`, before `<Header>`. This is the smallest change with the largest perceptible UX impact at the transition layer.

### 6.3 — Bundle size discipline

- Homepage: zero client JS below the layout (Server Components throughout), except `WishlistToggle` client islands on product cards
- Shop All: `ShopAllClient` + `ShopFilters` + filter state logic = the primary bundle addition for this milestone
- Defer Framer Motion to the visual polish milestone — CSS transitions handle all interactions in this milestone (hover states, filter chip transitions, brand moment fade-in if rendered)
- Do not install Framer Motion in this plan

### 6.4 — Core Web Vitals targets

| Metric | Target | Primary risk |
|---|---|---|
| LCP | < 2.5s | Hero image on homepage; collection hero on collection page. Mitigated by `priority`. |
| CLS | < 0.1 | All images must have explicit dimensions or fill containers. |
| INP | < 200ms | Filter interactions are synchronous local state — trivially fast. Route transitions covered by `NavigationProgress`. |

---

## 7. Accessibility Plan

### 7.1 — Landmark structure (every page)

```html
<!-- In Header.tsx — first child, before nav -->
<a href="#main-content" class="sr-only focus:not-sr-only ...">
  {t('nav.skipToContent')}  <!-- new i18n key -->
</a>

<!-- In layout.tsx -->
<main id="main-content">{children}</main>

<!-- Footer.tsx must use <footer>, not <div> — confirm and fix if needed -->
```

Every page: one `<h1>`. The hero collection name on Homepage and Collection page is the `<h1>` — not the brand name in the header (which is a link, not a heading).

### 7.2 — Product cards

```tsx
<article>
  <a href={`/${locale}/product/${product.slug}`}>
    <Image alt={product.name[locale]} ... />
  </a>
  <div>
    <h3>
      <a href={`/${locale}/product/${product.slug}`}>{product.name[locale]}</a>
    </h3>
    <p aria-label={`${formattedPrice} UZS`}>{formattedPrice} сум</p>
    <WishlistToggle productId={product.id} productName={product.name[locale]} />
  </div>
</article>
```

Two links to the same URL (image link + name link) is the standard accessible pattern for product cards. Do not wrap the entire card in a single link — that reads the entire card text as one link label to screen readers.

### 7.3 — Filter controls

```html
<fieldset>
  <legend>Коллекция / Kolleksiya</legend>
  <button aria-pressed="false">Осенний ателье / Kuzgi atelye</button>
  <button aria-pressed="true">Сеульский минимализм / Seul minimalizmi</button>
</fieldset>
```

Mobile filter sheet: `role="dialog"`, `aria-modal="true"`, `aria-label`. Focus trapped while open. Focus returns to the "Фильтр" button on close.

### 7.4 — Reduced motion

Add to `app/globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This covers: `ProductSkeleton` pulse animation, hover transitions, `NavigationProgress` animation, any CSS transitions added in this milestone. Blanket approach avoids per-component opt-in.

### 7.5 — Color contrast risk

The placeholder accent color `#8a7a5c` achieves ~3.7:1 contrast ratio against white. This passes WCAG AA for **large text only** (≥18px or ≥14px bold). It fails for normal body text.

**Rule for this milestone:** the accent color is used only for:
- CTA button backgrounds (where text on top is white — verify that white on `#8a7a5c` meets 3:1 minimum for large button text: `(1.05 / (0.236 + 0.05)) = 3.67:1` — barely passes for large text)
- Border lines / decorative rules
- Filter chip active state (text on accent background — verify)

**Not used for:** body text, small labels, metadata text, breadcrumbs.

The final color palette must pass a contrast audit before any production launch. This remains on the open items list.

---

## 8. SEO Plan

### 8.1 — Metadata

All three pages implement `generateMetadata`. Add `NEXT_PUBLIC_SITE_URL` environment variable (used for absolute URLs in OG images and hreflang).

```ts
// Homepage
title: 'SilkLine — Корейская мода в Ташкенте'
description: 'Кураторская коллекция корейской женской одежды. Платья, пальто, трикотаж.'
og:image: absolute URL of featured collection hero image

// Collection page
title: `${collection.name[locale]} — SilkLine`
description: collection.story[locale]
og:image: absolute URL of collection.heroImage

// Shop All
title: 'Каталог — SilkLine'
description: 'Весь ассортимент: платья, пальто, трикотаж.'
og:image: site-wide default OG image (TBD — add to EDITORIAL config)
```

All pages:
```ts
alternates: {
  languages: {
    ru: `${siteUrl}/ru${path}`,
    uz: `${siteUrl}/uz${path}`,
  },
  canonical: `${siteUrl}/ru${path}`,
}
```

### 8.2 — Structured data

**Homepage:** `WebSite` + `Organization` schema, injected via `<JsonLd>` in the page.

```ts
{
  "@type": "WebSite",
  "name": "SilkLine",
  "url": siteUrl,
}
{
  "@type": "Organization",
  "name": "SilkLine",
  "url": siteUrl,
  "sameAs": [/* Instagram URL, Telegram URL — add when confirmed */],
  "address": { "@type": "PostalAddress", "addressLocality": "Tashkent", "addressCountry": "UZ" }
}
```

**Collection pages:** `CollectionPage` (a `WebPage` subtype) + `BreadcrumbList` JSON-LD.

```ts
{
  "@type": "CollectionPage",
  "name": collection.name['ru'],  // canonical language for structured data
  "description": collection.story['ru'],
  "url": absoluteUrl,
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "SilkLine", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": collection.name['ru'], "item": absoluteUrl }
    ]
  }
}
```

**Shop All:** `WebPage` type, no breadcrumb (flat hierarchy — "Home → Shop" is trivially obvious).

**Product pages (next milestone):** `Product` schema with `offers` — plan for it now, implement when the product detail page is built.

### 8.3 — Alt text for real photography

When real photography replaces SVG placeholders, alt text must be:
- Specific and descriptive, not just the product name
- Example: `alt="Шёлковое платье на запах, кремовый, прямой крой"` (not just `"Шёлковое платье на запах"`)
- For hero/editorial images: describe the scene, not the product — `alt="Модель в пальто из верблюжьей шерсти на фоне осеннего пейзажа"`

Specific alt text improves both accessibility (screen reader experience) and image search SEO. Add this as a content task when real photography is provided.

### 8.4 — Internal link graph

```
Homepage Hero CTA → /collections/autumn-atelier
Homepage FeaturedCollection CTA → /collections/autumn-atelier
Homepage Selected product cards → /product/[slug] (next milestone)
Collection page products → /product/[slug] (next milestone)
Collection page Related Collections → /collections/[slug]
Header nav → /collections/[slug] × 2
Header "Shop All" → /shop
Footer → /collections/[slug], /about, /stores
```

Every page is reachable in ≤ 2 clicks from the homepage. Both collection pages link to each other (via Related Collections).

---

## 9. Risks

### Risk 1 — Photography (Critical)

**This entire milestone depends on real photography.** Placeholder SVGs are monochrome rectangles. Hero, Featured Collection, and product cards designed around strong fashion photography will look broken with SVGs during development and will be impossible to evaluate for "premium feel" until real assets arrive.

**Photography requirements to specify before implementation begins:**
- Product images: minimum 1500 × 2000px (3:4 aspect ratio), JPEG, white or neutral background
- Collection hero images: minimum 2400 × 1350px (16:9 or editorial portrait crop), lifestyle/editorial context
- Instagram exports are typically 1080 × 1350px JPEG at compressed quality — this may be insufficient for full-bleed hero use at retina desktop resolutions. Request original files, not social exports.

**Mitigation:** The project should not be launched without confirming photography meets these specifications. If real photography is unavailable during development, use a curated set of royalty-free images that genuinely match the brand aesthetic (Korean fashion editorial style, neutral backgrounds, clean styling) rather than generic stock.

### Risk 2 — Small catalog at launch

With 6 products and 2 collections at launch, the Selected section (4 products) contains 67% of the entire catalog. A visitor who views the homepage in full will have seen most of what SilkLine sells before opening any product page. This is not a design failure — it's a function of the catalog size, and the editorial treatment makes it feel curated rather than thin. But it means the client should understand: the homepage is a near-complete preview of V1 inventory. When new collections are added (which is the correct growth path for this brand), the homepage will feel more layered.

### Risk 3 — `editorial.ts` curation discipline

The new config file (`lib/config/editorial.ts`) centralizes homepage curation but creates an implicit contract: the listed product slugs must always exist in `data/products.ts`. If a product is removed from the catalog (and thus from `data/products.ts`), `getSelectedProducts()` silently omits it (the `.filter(p => p !== undefined)` handles this), but the Selected section may show 3 or 2 products instead of 4 without any warning.

Add a development-time validation (not production code — e.g., a test or a startup check): if `editorial.ts` references a slug not in `data/products.ts`, throw a clear error message. This prevents silent catalog gaps.

### Risk 4 — Uzbek copy quality

All user-facing strings in `/uz` — navigation labels, section headings, collection stories, brand statement, filter labels — are placeholder quality and have not been reviewed by a native speaker. This directly affects the half of the target audience that primarily reads Uzbek. Content review before launch is a requirement, not a nicety.

### Risk 5 — Brand Moment may never activate

The Brand Moment section ships hidden (returns `null` if `brand.statement` is absent). If the client does not provide real copy before launch, the section will not appear — and the homepage will have 4 sections instead of 5. This is a reasonable fallback (4 strong sections > 5 sections with a weak one), but it should be explicitly communicated to the client: the Brand Moment slot exists and is designed, but it requires real copy to appear.

### Risk 6 — NavigationProgress implementation in App Router

The App Router does not expose a native "navigation start" event equivalent to the old `router.events.on('routeChangeStart')`. The workaround (detecting pathname changes via `usePathname` and running a simulated progress animation) is imprecise — the bar will animate at a fixed rate rather than tracking real loading progress. This is fine for the UX purpose (feedback that "something is happening") but is technically a simulation, not actual progress tracking. Document this in the implementation.

---

## 10. Implementation scope

### Included in this milestone

- Homepage (5 sections as specced above)
- `/[locale]/collections/[slug]` page (Hero, Story, Product Grid, Related Collections)
- `/[locale]/shop` page (full filter/sort interface)
- New `lib/config/editorial.ts` with featured collection and selected products
- Type changes: remove `isEditorsPick` and `isBestSeller` from `Product`
- New repository functions: `getFeaturedCollection()`, `getSelectedProducts()`
- All new components listed in §4
- `NavigationProgress` in root layout
- `JsonLd` component + structured data on all three pages
- `generateMetadata` with hreflang alternates on all three pages
- `NEXT_PUBLIC_SITE_URL` env variable in `.env.local.example`
- `prefers-reduced-motion` CSS rule in `app/globals.css`
- Skip-to-content link in `Header`
- New i18n keys in `messages/ru.json` and `messages/uz.json` (see §11 below)
- `ProductSkeleton` component (scaffolding — `loading` prop on `ProductGrid`)
- Development-time validation: editorial.ts slugs exist in products.ts
- Seed data cleanup: remove `isEditorsPick` and `isBestSeller` from all product records

### Not in this milestone

- Product detail page
- Wishlist view (toggle on cards is included; viewing saved items is not)
- "Complete the Look" section
- Telegram/WhatsApp CTA on product cards
- Framer Motion (CSS transitions only)
- Sitemap, robots.txt
- Typography research / final palette selection
- Newsletter

---

## 11. New i18n keys required

```json
// messages/ru.json additions
{
  "nav": {
    "skipToContent": "Перейти к содержимому",
    "shopAll": "Весь каталог",    // already exists
    "about": "О бренде",          // already exists
    "stores": "Магазины"          // already exists
  },
  "homepage": {
    "selectedHeading": "Избранное",
    "viewCollection": "Смотреть коллекцию"
  },
  "collection": {
    "relatedHeading": "Другие коллекции"
  },
  "shop": {
    "heading": "Каталог",
    "xOfY": "Показано {{count}} из {{total}}",
    "total": "{{count}} изделий",
    "noResults": "Ничего не найдено",
    "noResultsHint": "Попробуйте другие фильтры",
    "clearFilters": "Сбросить фильтры"
  },
  "filters": {
    "label": "Фильтр",
    "collection": "Коллекция",
    "category": "Категория",
    "size": "Размер",
    "clearAll": "Очистить"
  },
  "sort": {
    "label": "Сортировка",
    "featured": "Избранное",
    "priceAsc": "Цена: от низкой",
    "priceDesc": "Цена: от высокой"
  },
  "brand": {
    "statement": ""
  }
}
```

Identical structure in `messages/uz.json` with Uzbek translations. The `brand.statement` key ships as an empty string — the `BrandMoment` component checks for this and returns `null`. Real copy from the client activates the section.

---

## 12. Open items before implementation begins

1. **Real photography** — required before implementing any image-heavy section. Specify format requirements with the client. Social exports (1080px) are likely insufficient for full-bleed heroes.
2. **Collection story copy** — seed stories are 1 sentence (placeholder). Real editorial copy needed before launch. The design accommodates short copy gracefully at launch, but the intent is 3–5 sentences per collection.
3. **Brand Moment copy** — the section ships hidden. Client must approve specific, true copy before it activates.
4. **Typography research** — Geist Sans is the safe placeholder, not the final answer. A dedicated typography pairing pass (Cyrillic+Latin) is owed before the visual design phase.
5. **Final accent color** — `#8a7a5c` is placeholder. Final color must pass WCAG AA contrast check.
6. **`NEXT_PUBLIC_SITE_URL`** — the real domain (`silkline.uz` assumed) must be confirmed before SEO metadata is finalized.
7. **`EDITORIAL.defaultOgImage`** — a default Open Graph image for the Shop All page and any page without a collection-specific image. Add this to `editorial.ts` and provide an actual image file.
8. **Uzbek copy review** — all Uzbek strings should be reviewed by a native speaker before production launch.
