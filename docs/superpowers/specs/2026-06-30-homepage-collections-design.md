# Homepage & Collections — Design Spec

> Status: Draft (awaiting review)
> Date: 2026-06-30
> Builds on: `docs/superpowers/specs/2026-06-29-silkline-v1-design.md`

---

## 0. Design Premise

With a launch catalog of 6 products across 2 collections, the risk isn't building too little — it's building the wrong things to compensate for perceived thinness. Most e-commerce sites respond to a small catalog with more UI: categories grids, filter sidebars, "Popular" badges, newsletter captures. This is exactly wrong for a premium brand. Scarcity, when framed correctly, reads as curation. The design must make that deliberate.

Every section below passed a single test: **if this section disappeared, would the customer understand the brand or find a product less well?** If yes, it stays. If not, it doesn't exist.

---

## 1. Homepage

### Overarching intent

The homepage answers one question: **"Why should I trust this brand?"** Not "what do you sell?" — the header navigation and page layout answer that. The homepage is an editorial experience that makes a visitor feel that SilkLine has taste, that its products are considered, and that buying here means something.

### Section sequence and rationale

#### 1.1 — Hero

**Business purpose:** First impression. Establish the brand's visual register in under 2 seconds.

**UX purpose:** Immediate orientation — what kind of brand is this? Is this for me? A single confident statement. No choices to make. No scroll required to understand the value proposition.

**What it is not:** A carousel. Carousels are the most persistently misused pattern in e-commerce. They dilute the primary message, require CMS automation to stay fresh, test poorly for engagement (most users never see slides past the first), and introduce performance overhead from loading multiple large images. A single, full-viewport image with a single headline is more confident, faster, and more premium.

**Design:**
- Viewport height: `100svh` on desktop, `85svh` on mobile (enough to signal "scroll" without hiding the edge of the next section)
- Background: the featured collection's hero image, full-bleed, object-fit cover
- Overlay: a subtle darkening gradient on the lower third to ensure text legibility without obscuring the photography
- Content: collection name (medium-weight, uppercase tracked type), one tagline (max 5–7 words), one CTA button ("View Collection" in ru/uz)
- The CTA links directly to `/[locale]/collections/[slug]` of the featured collection (same collection as Section 1.2 below)
- No secondary CTA. One action.

**Information hierarchy:**
1. Photography (immediate emotional register)
2. Collection name (context)
3. Tagline (aspiration)
4. CTA (action)

**Data source:** A "featured collection" must be identified. Currently no `isFeatured` flag exists on `Collection`. Two options: (a) add `isFeatured: boolean` to the `Collection` type and seed one collection as featured — clean, explicit; (b) define "featured = first collection in the array" — brittle, non-semantic. Add `isFeatured: boolean` to the `Collection` interface and a repository function `getFeaturedCollection(): Collection | undefined`. This is the correct answer: one explicit flag, one authoritative function, zero guessing.

**Responsive:**
- Desktop: image fills the viewport, content is left-aligned, vertically centered or slightly offset below center (slightly below-center avoids the "bad poster" feeling of perfectly centered text)
- Mobile: image crops to portrait focus point (CSS `object-position: center top` for fashion photography typically shows the garment); text shifts to lower 40% of the viewport, slightly larger line height

**Accessibility:**
- The hero image has `alt=""` while using placeholder SVGs (it is decorative until real photography exists). With real photography: `alt={collection.name[locale]}` — the image is the collection, so naming it is appropriate and useful for screen readers.
- The overlay gradient must maintain sufficient contrast for the heading and CTA text against the darkened background: minimum 4.5:1 WCAG AA for normal text. This must be verified against the actual photography when it arrives.
- CTA button: standard focus ring, keyboard activatable.

**Performance:**
- Hero image is the **LCP element** on this page. Mark `<Image priority />` (eager load, no lazy). Do not load other images above the fold before this one.
- Use `next/image` with explicit `sizes` to deliver the appropriate resolution per viewport.
- For placeholder SVG: set `priority` anyway (no performance cost, sets the correct final loading strategy so it doesn't need to change when real photos arrive).

**SEO:** Hero image should have structured data markup at the page level for the `WebSite` and `Organization` schema (placed in the page's `<head>` via `generateMetadata`, not in the component itself).

**Implementation strategy:** `HeroSection` — a Server Component (reads `getFeaturedCollection()` from the repository). Props: `collection: Collection`, `locale: AppLocale`. Self-contained, receives data from the page, does not fetch its own.

---

#### 1.2 — Featured Collection

**Business purpose:** Give the primary featured collection room to breathe. The hero established the photograph; this section gives the editorial context — the *why* of this collection.

**UX purpose:** A visitor who was drawn in by the hero image wants to understand it. This section provides the answer before moving to product discovery. It converts visual interest into intent.

**What it is not:** A product grid. Products come later. This is storytelling.

**Design:**
- Two-column layout on desktop: large image (60% width, portrait aspect ratio) on one side; collection name, story text, and "View Full Collection" CTA on the other
- The image here is **different from the hero** — it should be a product-in-context shot or editorial moment from the collection, not the same wide hero shot
- Story text: the collection's `story` field from the data. Currently 1 sentence (placeholder). For real launch content, this should be 3–5 sentences — enough to create atmosphere, not so much that it reads as a press release. Design must accommodate up to ~120 words gracefully.
- Mobile: stacked, image first, then text; image fills screen width

**Information hierarchy:**
1. Image (shows the collection's world)
2. Collection name (anchors the copy)
3. Story (gives it meaning)
4. CTA (invites exploration)

**Data source:** Same `getFeaturedCollection()` as the hero. The Featured Collection section and the Hero must always show the same collection — they are a single editorial unit, split across two viewport scrolls. Do not show two different collections in these two consecutive sections.

**Accessibility:** Same image alt pattern as Hero. Story text is body copy — no special accessibility concerns. CTA: `aria-label="View the [collection name] collection"` to disambiguate from any other "View Collection" elsewhere on the page.

**Performance:** Image here is below the fold — `lazy` loading is appropriate (default for `next/image`). Size it to `60vw` at desktop, `100vw` at mobile.

**Implementation strategy:** `FeaturedCollectionSection` — Server Component. Receives the same `collection` prop passed from the page (not re-fetched). The page passes the same `getFeaturedCollection()` result to both `HeroSection` and `FeaturedCollectionSection` — single fetch, two consumers.

---

#### 1.3 — Editor's Picks

**Business purpose:** Introduce specific products editorially. This is the first place on the homepage where individual items appear. Coming after two screens of collection storytelling, these products feel curated rather than listed.

**UX purpose:** Product discovery that doesn't feel like a catalog. The editorial framing ("Selected by our editors") signals curation and taste, not algorithmic ranking.

**Design:**
- Section heading: "Выбор редакции" (ru) / "Tahririyat tanlovi" (uz) — no "Editor's Picks" in English
- 3–4 products shown, sourced from `getEditorsPicks()` (a new repository function: `products.filter(p => p.isEditorsPick)`)
- Layout: horizontal scrollable row on mobile; 3-column or 4-column grid on desktop depending on count
- Each product: large portrait image (3:4 aspect), product name (localized), price in UZS, no badge/label (the section heading already provides the editorial framing — adding "Editor's Pick" labels on each card is redundant and cheap-looking)
- No "Add to Cart" on cards (no cart exists) — card click goes to product detail page
- Wishlist icon on hover (desktop) / persistent (mobile) — small, unobtrusive
- Hover state: reveal a second product image if available; otherwise a subtle scale on the image container (no zoom, which distorts faces/garments and looks dated)

**Information hierarchy per card:**
1. Product image
2. Product name
3. Price

Nothing else. No descriptions, no category labels, no star ratings. Let the photograph and name do the work.

**What it is not:** A featured collection product grid. This is distinct from Section 1.2, which shows the collection's products. Editor's Picks can draw from *any* collection — the `isEditorsPick` flag is collection-agnostic. If both of today's `isEditorsPick` products are from the same collection, that's fine — the section still exists independently.

**Data source:** `getAllProducts().filter(p => p.isEditorsPick)`. Currently 2 products qualify (`p-wrap-dress`, `p-slip-dress`). The section should show minimum 3 and maximum 4 for visual rhythm. If fewer than 3 products have `isEditorsPick: true`, either (a) mark more products or (b) fall back gracefully with a reduced count. Design note to client: this section requires manual curation maintenance — document it in PROJECT_MEMORY.

**Accessibility:**
- Product cards are links (`<a>` wrapping image + text) — entire card is keyboard-navigable
- Wishlist toggle: `role="button"`, `aria-label="Добавить [name] в список желаний"` / uz equivalent, `aria-pressed` state
- Horizontal scroll container on mobile: `role="list"` on the container with `role="listitem"` per card; `tabIndex={0}` on the scroll container to enable keyboard scrolling

**Performance:**
- These images are below the fold — all lazy loaded
- If 4 products: each image is `25vw` on desktop (including gaps). Set `sizes` accordingly.

**Implementation strategy:** `EditorialProductRow` — a flexible component used for both Editor's Picks and Best Sellers (see 1.5). Props: `products: Product[]`, `locale: AppLocale`, `heading: string`. The distinction between sections is entirely in the heading and the data passed, not the component's structure. **Do not build two separate components for this.**

---

#### 1.4 — Brand Moment

**Business purpose:** Interrupt the product-selling rhythm. Signal that this is a brand, not just a store. Trust-building.

**UX purpose:** A typographic pause between two product sections prevents the page from reading as a product dump. High-end brand sites (COS, Celine, Toteme) use these moments to establish voice without needing to explain themselves.

**Challenge to conventional thinking:** Most e-commerce sites skip this entirely or replace it with a branded banner that reads as marketing ("Discover Our World"). That reads as self-promotion. The alternative is to let the writing speak — a single sentence about what SilkLine believes in, set in large, unhurried type, with no image and no CTA. It's a statement, not a sales pitch.

**Design:**
- Full-width section, generous top/bottom padding (`py-24` or similar)
- Background: very pale stone (approximately `stone-50` from Tailwind — the brand's base background tone), no borders
- Content: one or two sentences in a significantly larger typeface (3–4× normal body size), centered, 70–80 character maximum per line (controlled via `max-w-prose mx-auto` or similar), generous line height
- Placeholder copy: "Мы верим, что одежда должна чувствоваться как решение, а не компромисс." / "Kiyim kompromiss emas, qaror kabi his etilishi kerak deb ishonамиз."
- No CTA. No image. No link.

**Risk:** This section requires real copywriting. Placeholder copy in Russian/Uzbek will likely remain inadequate until a native-speaking copywriter (or the client) refines it. The design must be visually complete without depending on perfect copy.

**Data source:** None — the brand statement is static copy in `messages/ru.json` and `messages/uz.json`. Add a `"brand.statement"` key to both files.

**Accessibility:** Pure text, no interaction. Heading level: this is not a heading — it's body copy at display size. Use `<p>` with appropriate font size, not `<h2>`. Screen readers will read it correctly.

**Performance:** No images, no heavy components. No performance concerns.

**Implementation strategy:** `BrandMoment` — a Server Component using `getTranslations('brand')`. Zero props, zero data dependencies.

---

#### 1.5 — Best Sellers

**Business purpose:** Social validation. After the brand statement has built emotional connection, show the products customers already love. This is the "close" before the page ends.

**UX purpose:** `isBestSeller` implies popularity, which reduces decision anxiety. Even if the flag is manually curated (because orders happen off-platform and can't be automatically tracked), the label functions as a trust signal. The key is the visual treatment — these should *feel* like something worth buying, not like a clearance rack.

**Design:** Identical component to Editor's Picks (`EditorialProductRow`). Distinction: heading in Russian/Uzbek ("Популярное" / "Ommabop"), and different product data.

**Honest challenge:** `isBestSeller` is manually curated. With only 2 products currently flagged (`p-wool-coat`, `p-slip-dress`), the section shows 2 products — which is under the ideal 3-product minimum for visual balance. For launch, either (a) mark a third product as `isBestSeller`, or (b) increase the flex basis on mobile so 2 cards fill the space gracefully. Design with a 3-card default, document the minimum.

**On calling them "Best Sellers":** Some brands avoid this label because it's an assertion without evidence (especially for a new website). An alternative like "Часто выбирают" ("Often Chosen") / "Ko'p tanlanadi" is softer and more defensible. However, "Популярное" / "Ommabop" ("Popular") is standard fashion e-commerce vocabulary and is defensible for any brand that has existing sales via Instagram/Telegram. Keep it — the social proof function outweighs the epistemological concern.

**Data source:** `getAllProducts().filter(p => p.isBestSeller)`. Currently 2 products qualify.

**Accessibility, Performance, Implementation:** Same as Editor's Picks, same component.

---

#### 1.6 — Find Us

**Business purpose:** Humanize the brand. SilkLine has physical stores — that's a significant trust signal for Tashkent shoppers who may want to verify the brand exists before purchasing.

**UX purpose:** A minimal anchor near the bottom of the page for visitors who prefer an in-person experience, or who want to know the brand has a physical presence before committing to a Telegram/WhatsApp order.

**What it is not:** A full Store Locations section (that's its own page). This is a 2-line mention with one link.

**Design:**
- 2-line typographic callout: city name ("Ташкент / Toshkent") and a link to `/[locale]/stores`
- No map embed (heavy, usually unnecessary on a homepage; full stores page handles this)
- No opening hours (too much detail for this context)
- Background: slightly darker warm stone to visually distinguish this from the preceding sections and create a natural visual anchor before the footer

**Data source:** `getAllStores().length` to confirm stores exist (guard against rendering this section if no stores are seeded). The copy itself is static i18n strings: `"stores.findUsHeading"`, `"stores.viewAll"`.

**Implementation strategy:** `StoreCallout` — minimal Server Component. Reads store count from repository, renders only if at least one store exists.

---

#### Excluded sections and reasons

**Categories grid:** A "Browse by Category" section would look like a marketplace index. Premium brands don't lead with taxonomy — they lead with collections and editorial content. Categories are available through the Shop All filters and the header. Adding them to the homepage creates a visual hierarchy conflict (is this a brand or a catalog?) and adds a section that doesn't improve storytelling, trust, or conversion. **Excluded.**

**Newsletter:** No email infrastructure exists. Collecting email addresses with no system to handle them is worse than not collecting them — it erodes trust if nothing is ever sent. **Excluded from V1. Defer to when an email provider is integrated.**

**Recently Added / New Arrivals:** Already excluded by foundation-phase decision. At launch, every product is "new." Revisit in V2 when release cadence exists.

**Collection highlights grid:** Showing both collections as side-by-side cards would duplicate the header nav (which already lists both collections) and would visually compete with the Featured Collection section. With only 2 collections at launch, a dedicated "Explore Collections" section would look sparse. **Excluded.** If SilkLine grows to 5+ collections, a curated collection strip should be reconsidered.

**Social proof / Reviews:** No review system exists. Embedding an Instagram feed is possible but introduces third-party script load, GDPR/data concerns, and potential visual inconsistency (Instagram image quality varies). **Excluded from V1.** An "As Seen on Instagram" strip could be a strong V2 addition if the photography quality is consistently good.

**CTA banner:** A standalone "Order via Telegram" CTA section would look desperate on a brand site. The ordering CTA belongs on product pages, not homepage. **Excluded.**

---

### Final homepage section order

```
Hero
Featured Collection (editorial)
Editor's Picks (3–4 products)
Brand Moment (typography-only)
Best Sellers (3–4 products)
Find Us (store callout)
Footer
```

Six content sections. Deliberate, distinct, purposeful.

---

## 2. Collection Detail Page

**Route:** `/[locale]/collections/[slug]`

**Page-level intent:** "Which style fits me?" The collection page is where editorial storytelling converts into product intent.

**Rendering strategy:** Fully static via `generateStaticParams`. With 2 collections, both pages are pre-rendered at build time. Zero runtime latency. When real photography arrives, static regeneration (`revalidate`) can be added via ISR — architecture supports this without any page restructuring.

---

### 2.1 — Collection Hero

**Design:**
- Full-viewport-width image, fixed height on desktop (`60vh`), full-width on mobile (maintain portrait crop)
- Collection name overlaid in large type, lower-left aligned (avoids the centered-title template feel)
- The image here is `collection.heroImage` — currently the same placeholder SVG for both collections. Real content will require distinct photography per collection.

**Accessibility:** `alt={collection.name[locale]}`

**Performance:** `priority` on this image — it is the above-fold LCP element for this page.

---

### 2.2 — Collection Story

**Design:**
- Full-width text block, generously padded, max-width prose constraint (`max-w-2xl mx-auto`)
- The collection's `story` field — currently 1 sentence, expected to grow to 3–5 for the real launch
- Typography: body-size for the story body, slightly smaller weight than headings. No pull quotes needed unless stories grow long.
- The story is the page's argument for why this collection matters. Design must give it room. No competing imagery in this section.

**Challenge to scope creep:** Do not add "Share" buttons, "Save to wishlist" (that belongs on product cards), or "Collection editorial link" to this section. The story section should contain exactly the story. Any additional UI here dilutes the reading experience.

**Implementation:** Story text displays as-is from the `Collection.story[locale]` field. When content grows, this field may contain multiple paragraphs — the implementation should render it as `<p>` blocks split by `\n\n` (two newlines), not render raw HTML. Keep the data model clean (plain text, no HTML injection).

---

### 2.3 — Product Grid

**Design:**
- 2-column grid on mobile, 3-column on desktop, with generous gap (`gap-6` or `gap-8`)
- Products sourced from `getProductsByCollectionId(collection.id)`
- Each card: identical to the Editor's Picks card (same `ProductCard` component — no special collection-page-only card variant)
- Ordering: currently the order products appear in `data/products.ts`. No UI sort control on the collection page — the editorial curator has already ordered them by populating the data.
- Load all products at once (max 3 per collection at launch; no pagination needed at this scale)

**Empty state:** If a collection has no products — show nothing (the grid simply doesn't render). Do not show "No products yet" on a public-facing brand site; it reads as broken.

---

### 2.4 — Related Collections

**Design:**
- A horizontal strip of 1–2 other collections (all collections except the current one)
- Each: square-ish image with collection name overlay
- Heading: "Другие коллекции" (ru) / "Boshqa kolleksiyalar" (uz)
- With only 2 total collections at launch, this shows exactly 1 related collection — which is fine, but should render as a strip, not a centered singleton. If 0 other collections exist: don't render the section.

**Data source:** `getAllCollections().filter(c => c.slug !== currentSlug)`.

**SEO value:** This creates an internal link from each collection page to all other collection pages — valuable for distributing page rank through the small site.

**Implementation:** `RelatedCollections` — Server Component, receives `collections: Collection[]`, `locale: AppLocale`.

---

### What the collection page deliberately excludes

**Breadcrumb:** On a small site with Collections as primary nav, breadcrumbs are redundant — the user knows they're in a collection. Add breadcrumbs on the Collection page only once SEO analysis shows a need. Breadcrumbs on the Shop All page (where users arrive from search, not navigation) make more sense. **Defer.**

**Category filter within the collection:** With 3 products per collection at launch, a filter control would be absurd. The collection is the filter. Do not add category-level filtering to collection pages — that's the Shop All page's job. **Excluded.**

**Collection-level wishlist / save:** Not in scope. **Excluded.**

---

## 3. Shop All Page

**Route:** `/[locale]/shop`

**Page-level intent:** "Show me everything, filtered." This is the escape hatch for customers who know what they want and don't want to be guided by editorial curation. Design it to feel functional but not industrial.

---

### 3.1 — Rendering and data strategy

**Key architectural decision:** All data is local (no API calls). This means filtering can be entirely client-side after the initial server render, with no network requests per filter interaction.

```
// page.tsx (Server Component)
const products = getAllProducts();
const categories = getAllCategories();
const collections = getAllCollections();
return (
  <ShopAllClient
    products={products}
    categories={categories}
    collections={collections}
    locale={locale}
  />
);

// ShopAllClient.tsx ('use client')
// Owns filter state. Derives filteredProducts from props + state.
// Renders FilterBar + ProductGrid.
```

This is the correct architecture for this data scale. The server component fetches data once; the client component manages interactivity. Zero network calls for filtering. No skeleton loading needed (data is already in-component state).

**URL-based filters:** Not included in V1. Rationale: shareable/bookmarkable filtered URLs are useful for larger catalogs and marketplaces. For a 6–100 product curated catalog, the primary user journey is casual browsing, not URL-sharing. If added later, the migration is additive (URL params → initialize filter state from URL → nothing in the UI changes). Flagged as a V2 consideration.

---

### 3.2 — Filter design

**Available filters:** Collection (multi-select chips), Category (multi-select chips), Size (multi-select chips).

**Multi-select vs. single-select:** Multi-select chips allow "show me dresses from either collection" without forcing a choice. Single-select would be more limiting. Use multi-select with clear active state.

**Filter layout:**
- Desktop: a single horizontal filter bar at the top of the product grid — three dropdown/disclosure triggers ("Collection", "Category", "Size"), each opening a small panel with chips below it. This is the COS/ARKET approach: compact, top-mounted, not a persistent sidebar that eats horizontal space.
- Mobile: a "Filter" button (fixed bottom or floating, or just inline at top) that opens a bottom sheet with all three filter groups stacked vertically. The bottom sheet is a standard mobile pattern that doesn't compete with the product grid for vertical space.

**Active filter indication:** The filter bar shows a dot or count badge on each filter category when active ("Collection · 1"). Filtered results show "X results" count below the bar in small text. No persistent "applied filters" chip row — it adds complexity for minimal benefit at this scale.

**Clear all filters:** A "Сбросить" / "Tozalash" ("Clear") text link appears in the filter bar when any filter is active.

**Implementation:** `ShopFilters` (client component) + `FilterChip` (UI primitive). `ShopFilters` owns the filter state object, calls a `useFilteredProducts(products, filters)` hook that derives the filtered result, and renders `FilterBar` (desktop) or `MobileFilterSheet` as sub-components.

---

### 3.3 — Sorting

**Options:** "Выбор редакции" / "Tahririyat tanlovi" (default, editorial order — same as `isEditorsPick` first, then rest), "Цена: по возрастанию" / "Narx: o'sish bo'yicha", "Цена: по убыванию" / "Narx: kamayish bo'yicha".

No "New" sort: there's no creation date on products. "New" would map to array position in the seed file, which is arbitrary and would confuse users. Exclude it.

Sort is a single-select dropdown in the filter bar, right-aligned (convention: filters left, sort right). Sorting is client-side (derived from the same filtered product array).

---

### 3.4 — Product grid

**Layout:** Same 3-column desktop / 2-column tablet / 1-column mobile grid as the Collection page. Reuses `ProductGrid` and `ProductCard` components.

**Product count display:** Small text above the grid: "6 изделий" / "6 mahsulot" — or the filtered count if filters are active: "Показано 3 из 6" / "6 dan 3 ko'rsatilmoqda". This builds transparency into the filtering experience.

---

### 3.5 — Empty state

When filters produce 0 results:
- Replace the product grid with a centered text block: "Ничего не найдено" / "Hech narsa topilmadi"
- Subtitle: "Попробуйте другие фильтры" / "Boshqa filtrlarni sinab ko'ring"
- A "Сбросить фильтры" / "Filtrlarni tozalash" button to clear filters

No sad face icons. No stock photography of confused people. Clean, minimal, on-brand.

---

### 3.6 — Loading state

None needed. All filtering is synchronous client-side state on a locally-scoped dataset. Page renders fully server-side on initial load; subsequent filter interactions update state instantly. If the catalog moves to a remote API (CMS), loading skeletons would be needed at that point — the `ProductGrid` would need a `loading?: boolean` prop and a skeleton variant. Design for this now: `ProductGrid` accepts a `loading` prop that renders a grid of `ProductSkeleton` placeholders (3×3 animated gray boxes). Implement the skeleton even though it won't be triggered yet — it costs little and avoids a harder retrofit later.

---

### 3.7 — Excluded from Shop All

**Full-text search:** Explicitly out of scope per the V1 spec. A keyword search across 6–30 products is overkill. No search input on the Shop All page.

**Pagination / Infinite scroll:** With a max of 100 products in a curated catalog, all products fit comfortably in a single page without performance issues (product images are lazy-loaded). Pagination adds navigation complexity for no gain at this scale. **Excluded.** Add when catalog exceeds ~80 products and Lighthouse LCP/INP on the page starts suffering.

**Price range slider:** The price range across 6 current products is 480,000–1,690,000 UZS. A slider filter would have 3 stops at most. The utility doesn't justify the UI complexity. **Excluded.** Reconsider when catalog price variance is genuinely wide.

**Grid/list view toggle:** List view on a product catalog of this style just increases click-depth without providing more information. Product names are short; descriptions don't need to be visible before the product page. **Excluded.**

---

## 4. Component Architecture

### 4.1 — Layout components

| Component | Purpose | Server/Client |
|---|---|---|
| `PageContainer` | Max-width wrapper, horizontal padding (`px-4 sm:px-6 lg:px-8`), `mx-auto` | Server (pure structural) |
| `Section` | Vertical spacing unit with consistent `py-*` scale, optional `as` prop for semantic element | Server (pure structural) |

These two components are the rhythmic foundation. Consistent use of `Section` prevents ad-hoc spacing that creates visual inconsistency as the codebase grows.

### 4.2 — UI components (atomic)

| Component | Props (key) | Notes |
|---|---|---|
| `Button` | `variant: 'primary' \| 'secondary' \| 'ghost'`, `size: 'sm' \| 'md' \| 'lg'` | Fully custom, zero shadcn defaults. Primary: solid accent background. Secondary: outline. Ghost: text-only. |
| `ProductCard` | `product: Product`, `locale: AppLocale` | Image, localized name, price. Hover: secondary image or scale. Wishlist icon. Entire card is a link. |
| `ProductGrid` | `products: Product[]`, `locale: AppLocale`, `columns?: 2 \| 3`, `loading?: boolean` | Responsive grid, renders `ProductCard` per product or `ProductSkeleton` if loading. |
| `ProductSkeleton` | — | Animated placeholder, matches ProductCard proportions |
| `FilterChip` | `label: string`, `active: boolean`, `onToggle: () => void` | Multi-select chip. Active state: filled accent background. |
| `CollectionCard` | `collection: Collection`, `locale: AppLocale` | Image + name overlay. Used in Related Collections and potentially a future collections index. |
| `Breadcrumb` | `items: { label: string; href?: string }[]` | Simple breadcrumb trail. JSON-LD structured data injected via adjacent server component. |

### 4.3 — Feature components (domain-specific)

| Component | Used in | Server/Client |
|---|---|---|
| `HeroSection` | Homepage | Server — receives `collection: Collection` prop |
| `FeaturedCollectionSection` | Homepage | Server — receives `collection: Collection` prop |
| `EditorialProductRow` | Homepage (×2) | Server — receives `products: Product[]` and `heading: string` |
| `BrandMoment` | Homepage | Server — reads `getTranslations('brand')` |
| `StoreCallout` | Homepage | Server — reads store count from repository |
| `CollectionStory` | Collection page | Server — renders `collection.story[locale]` |
| `RelatedCollections` | Collection page | Server — receives `collections: Collection[]` |
| `ShopAllClient` | Shop All page | **Client** — owns filter + sort state |
| `ShopFilters` | Inside `ShopAllClient` | **Client** — filter UI, desktop + mobile variants |

### 4.4 — Reuse principles

`EditorialProductRow` handles both Editor's Picks and Best Sellers. The distinction is the heading text and the product array — not the component. Do not build two separate components.

`ProductCard` is identical across the homepage, collection page, and Shop All. One component, zero variants for the card itself. Any layout variation (columns, gap) is handled by the grid wrapper (`ProductGrid`), not the card.

`CollectionCard` is used in Related Collections and could serve a future Collections landing page without modification.

---

## 5. Data Flow

### 5.1 — Repository functions needed for this milestone

New functions to add to `lib/data-source/products.ts`:

```ts
// Already exists:
getAllProducts(): Product[]
getProductBySlug(slug: string): Product | undefined
getProductsByCollectionId(collectionId: string): Product[]
getRelatedProducts(product: Product): Product[]

// New:
getEditorsPicks(): Product[]   // filter(p => p.isEditorsPick)
getBestSellers(): Product[]    // filter(p => p.isBestSeller)
```

New function to add to `lib/data-source/collections.ts`:

```ts
// Already exists:
getAllCollections(): Collection[]
getCollectionBySlug(slug: string): Collection | undefined

// New:
getFeaturedCollection(): Collection | undefined   // find(c => c.isFeatured)
```

New field on `Collection` type (`types/index.ts`):
```ts
isFeatured: boolean;
```

One collection must have `isFeatured: true` — `col-autumn-atelier` for now (arbitrary for placeholder data; client will curate).

### 5.2 — Page-level data flow

**Homepage** (`app/[locale]/page.tsx`, Server Component):
```ts
const collection = await getFeaturedCollection();         // used by Hero + FeaturedCollectionSection
const editorsPicks = await getEditorsPicks();             // used by EditorialProductRow (Editor's Picks)
const bestSellers = await getBestSellers();               // used by EditorialProductRow (Best Sellers)
const storeCount = await getAllStores().length;           // used by StoreCallout guard
```

All are synchronous local reads — no `async` needed, no `await`. But use `async/await` pattern anyway to make CMS migration easier (a future `getEditorsPicks()` call to Sanity will be async; the `async` keyword in the page component is already there).

**Collection page** (`app/[locale]/collections/[slug]/page.tsx`, Server Component):
```ts
const collection = getCollectionBySlug(slug);
const products = getProductsByCollectionId(collection.id);
const relatedCollections = getAllCollections().filter(c => c.slug !== slug);
```

`generateStaticParams`: `getAllCollections().map(c => ({ locale, slug: c.slug }))` for all locales.

**Shop All page** (`app/[locale]/shop/page.tsx`, Server Component):
```ts
const products = getAllProducts();
const categories = getAllCategories();
const collections = getAllCollections();
// All passed as props to ShopAllClient
```

### 5.3 — Server/Client boundary map

| Component | Type | Reason |
|---|---|---|
| All page files | Server | Data fetching |
| HeroSection, FeaturedCollectionSection, EditorialProductRow, BrandMoment, StoreCallout, CollectionStory, RelatedCollections | Server | Display only, no interactivity, no browser APIs |
| ShopAllClient | Client | Owns filter/sort state |
| ShopFilters, FilterChip, MobileFilterSheet | Client | User interaction |
| ProductCard | Server | Display only (wishlist icon handled via a nested client component) |
| WishlistToggle (icon within ProductCard) | Client | `localStorage` access |
| Header, Footer | Server (existing) | Data from repository + translations |
| LocaleSwitcher | Client (existing) | `usePathname()` |

The wishlist icon on `ProductCard` is the only place where a Server Component needs to embed a Client Component for interactivity. This is the standard RSC composition pattern: `ProductCard` (Server) renders `<WishlistToggle productId={product.id} />` (Client) — the client island is self-contained.

### 5.4 — Caching and revalidation

With local file data, there is no network caching concern. Everything is compiled into the server build. When a CMS is introduced, the pattern will be:

```ts
// page.tsx
export const revalidate = 3600; // 1 hour ISR
```

This can be added per-page when the data source changes. No architectural changes needed; the caching strategy is transparent to all components.

---

## 6. Performance Plan

### 6.1 — Image optimization

- All images go through `next/image`. No `<img>` tags.
- Explicit `width`/`height` or `fill` + `aspect-ratio` container on every image. Zero layout shift from images.
- `sizes` prop on every `<Image>`: product cards in 3-column grid → `sizes="(max-width: 768px) 50vw, 33vw"`. Featured collection image → `sizes="(max-width: 768px) 100vw, 60vw"`. Hero → `sizes="100vw"`.
- `priority` on: Hero image, Featured Collection image (these are the two above-fold images; all others are lazy).
- `blurDataURL`: generate blur hashes for real photography to eliminate content flash on load. SVG placeholders don't need blur hashes (they load instantly at ~200 bytes).
- Format: next/image automatically serves WebP to supporting browsers. No manual format configuration needed.
- Local images vs. remote: all current assets are in `/public`. When real client photography arrives, they will be local files in `/public/products/` and `/public/collections/`. No `remotePatterns` config needed until photography is hosted on an external CDN (a V2 concern if Sanity/Cloudinary is introduced as media host).

### 6.2 — Rendering strategy and Core Web Vitals impact

| Page | Rendering | LCP target | Notes |
|---|---|---|---|
| Homepage | Static (pre-rendered at build) | Hero image | Mark hero `priority`. Target LCP < 2.5s. |
| `/collections/[slug]` | Static with `generateStaticParams` | Collection hero image | Mark `priority`. Same target. |
| `/shop` | Static initial + client filter interactivity | First product image (row 1) | No filter-triggered network = no LCP regression on filters. |

CLS targets: All images have explicit dimensions or fill containers. Font: Geist is a `next/font/google` font — loaded with `font-display: optional` or `swap` (Next.js default); no CLS from font swap if `optional` is used. Consider setting `display: 'swap'` for faster text render on slow connections (trade: possible flash of unstyled text). Decision: keep Next.js default (`swap`) — the warm-toned sans-serif fallback (Arial per the original CSS, now corrected to `font-sans`) is close enough in line height that CLS from font swap is minimal.

INP targets: All filter interactions are synchronous client-side state changes — no network latency. Target INP < 200ms trivially achievable.

### 6.3 — Bundle size

- Homepage: zero client JS (all Server Components except `LocaleSwitcher` inherited from layout and `WishlistToggle` on product cards). First meaningful paint is server-rendered HTML.
- Shop All page: `ShopAllClient` is the main client bundle addition for this milestone. It includes `ShopFilters` and filter state logic. Estimated JS addition: ~5–10KB gzipped before Framer Motion. Keep filter logic lean.
- Framer Motion: import only `motion` and `AnimatePresence` via `import { motion } from 'framer-motion'` — not the whole library. Or use CSS-only transitions (`@starting-style`, `transition` property) for simple scroll reveals to avoid adding Framer to pages that don't need it yet.
- Recommendation: defer Framer Motion to the visual polish phase. This milestone's transitions (filter state changes, wishlist toggle) can use CSS transitions entirely. Framer is warranted when scroll-triggered animations or page transitions are designed.

### 6.4 — Loading skeleton for ShopAllClient

```tsx
// ProductSkeleton.tsx
export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-stone-200 rounded-sm" />
      <div className="mt-3 h-4 bg-stone-200 w-3/4" />
      <div className="mt-2 h-3 bg-stone-200 w-1/4" />
    </div>
  );
}
```

The `loading` prop on `ProductGrid` renders these instead of `ProductCard` components. Not triggered by current local-data filtering but required scaffolding for future API data. Implement now to avoid a regression risk later.

---

## 7. Accessibility Plan

### 7.1 — Semantic structure

Every page has exactly one `<h1>`:
- Homepage: the collection name overlaid on the Hero image
- Collection page: the collection name in the hero overlay
- Shop All: "Все изделия" / "Barcha mahsulotlar" as an `<h1>` above the filter bar

Section headings (`<h2>`): Editorial rows, Collection Story heading, filter bar heading on mobile sheet.

Product names in cards: `<h3>` (cards within an `<h2>` section). This is the correct heading hierarchy.

Navigation landmark: `<nav>` exists in `Header`. `<main>` wrapping the page content exists in `layout.tsx`. Add `<footer>` landmark in `Footer.tsx` (confirm it's a `<footer>` element, not a `<div>`).

Skip link: Add a visually-hidden "Skip to main content" link as the first child of `<Header>`. This is required for keyboard users who navigate with Tab on pages with many nav items.

```tsx
// In Header.tsx, before any nav:
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-2">
  {t('nav.skipToContent')}
</a>

// In layout.tsx:
<main id="main-content">{children}</main>
```

### 7.2 — Product cards

The entire card is a link (`<a>`). Do not put an outer `<a>` and also an inner `<a>` on the product name — that creates nested links. Structure:

```tsx
<article>
  <a href={`/${locale}/product/${product.slug}`} aria-label={product.name[locale]}>
    <Image ... alt={product.name[locale]} />
  </a>
  <div>
    <h3><a href={...}>{product.name[locale]}</a></h3>
    <p>{price}</p>
    <WishlistToggle ... />
  </div>
</article>
```

The image link and the name link both go to the same URL — this is standard and accessible.

### 7.3 — Filter interactions (Shop All)

- All filter chips are `<button>` elements (not styled `<div>` or `<span>`)
- `aria-pressed={active}` on each chip
- Filter groupings use `<fieldset>` with `<legend>` (Collection / Category / Size) — proper form semantics for option groups
- Mobile filter sheet: uses `role="dialog"`, `aria-modal="true"`, `aria-label`. Focus is trapped while open (implement with a focus-trap utility or Radix UI's Dialog primitive, which handles this automatically). Focus returns to the "Filter" button on close.
- "Clear filters" action: `<button>` with `aria-label="Сбросить все фильтры"` / uz equivalent

### 7.4 — Reduced motion

Add this to `app/globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This is a blanket approach. If Framer Motion is introduced, use `useReducedMotion()` from `framer-motion` to selectively disable animations. The CSS approach covers all transitions (ProductSkeleton pulse, CSS hover states) without requiring every component to opt in individually.

### 7.5 — Color contrast risk

The current placeholder accent `#8a7a5c` achieves a contrast ratio of approximately 3.7:1 against white — **passing for large text (≥18px or ≥14px bold), failing for normal text** per WCAG AA. This means:
- Do NOT use the accent color for body text or small labels
- Safe uses: decorative borders, large headings, background fill where text is white on top
- The final accent color must be verified by a contrast checker once the real brand palette is established

---

## 8. SEO Plan

### 8.1 — Metadata per page

Each page implements `generateMetadata` (Next.js App Router):

**Homepage:**
```ts
title: 'SilkLine — Корейская мода в Ташкенте' // ru
description: 'Кураторская коллекция корейской женской одежды. Платья, пальто, трикотаж.'
og:image: collection.heroImage (absolute URL)
```

**Collection page:**
```ts
title: `${collection.name[locale]} — SilkLine`
description: collection.story[locale]
og:image: collection.heroImage (absolute URL)
```

**Shop All:**
```ts
title: 'Каталог — SilkLine' // ru
description: 'Весь ассортимент: платья, пальто, трикотаж.'
og:image: site-wide default OG image (to be provided)
```

All pages include `alternates.languages` for hreflang:
```ts
alternates: {
  languages: {
    ru: `https://silkline.uz/ru${path}`,
    uz: `https://silkline.uz/uz${path}`,
  },
  canonical: `https://silkline.uz/ru${path}` // ru is default
}
```

Note: the real domain (`silkline.uz`) is unknown today. Use an environment variable `NEXT_PUBLIC_SITE_URL` to avoid hardcoding. Add to `.env.local.example`.

### 8.2 — Structured data (JSON-LD)

**Homepage:** `WebSite` + `Organization` schema, injected via `<script type="application/ld+json">` in the page component or layout. The `Organization` block should include the brand's social profiles (Instagram, Telegram) once they're confirmed.

**Collection pages:** `CollectionPage` schema (a `WebPage` type with the collection story as `description`). Minimal but correct.

**Product pages (next milestone):** `Product` schema with `offers` (single offer per product, price in UZS, availability). This is the highest-value structured data for a product-based site — schema.org Product markup enables rich results in Google Search. Plan for this now even though implementation is in the next milestone.

Inject structured data via a `<JsonLd>` server component:
```tsx
// components/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

`dangerouslySetInnerHTML` is the only acceptable way to inject JSON-LD in React; it's safe here because the data is derived from the local typed data model, not from user input.

### 8.3 — Internal linking

- Homepage Hero CTA → featured collection page
- Homepage Featured Collection → same collection page
- Homepage Editor's Picks products → individual product pages (next milestone)
- Collection page → product detail pages (next milestone)
- Collection page Related Collections → other collection pages
- Footer → all key routes (collections, about, stores)
- Shop All → product pages

A small but coherent internal linking graph. Every page is reachable within 2 clicks from the homepage.

### 8.4 — Breadcrumbs

Implement breadcrumbs on the Collection page and Shop All page:
- Collection: `Home > [Collection Name]` — rendered as visible breadcrumb trail + JSON-LD `BreadcrumbList` structured data
- Shop All: `Home > Shop All` — same

Homepage: no breadcrumb (it is the root).

Breadcrumb component is a new `Breadcrumb` UI primitive (see §4.2). JSON-LD is injected adjacently on each page via `JsonLd`.

### 8.5 — Deferred SEO items

- Sitemap (`app/sitemap.ts`) — easy to generate from repository, defer to polish phase
- robots.txt (`app/robots.ts`) — trivial, defer
- Google Search Console verification — requires domain, defer

---

## 9. Risks and Challenges

### Risk 1 — Photography dependency (Critical)

**The entire visual design of this milestone depends on real photography.** The Hero, Featured Collection, Collection Story, and product cards are all primarily visual. With placeholder SVG rectangles, it's impossible to verify that layouts feel "premium" — they will look broken regardless of the typography and whitespace quality.

**Mitigation:** Before implementing any image-heavy section, either (a) ensure the client's real photography is available and properly formatted (portrait 3:4 for products, landscape 16:9 or editorial aspect for heroes), or (b) use the highest-quality available curated placeholder photography that matches the brand aesthetic (warm-toned, clean backgrounds, Korean fashion styling). The client has confirmed photography exists "gathered from Instagram/Telegram channels" — prioritize getting these into the project before the visual implementation phase.

**Specific risk:** Instagram/Telegram export images are typically JPEG at social media resolution (often 1080×1350 for products — which is 4:5, not 3:4) or compressed at low quality for story sharing. They may not be suitable for full-bleed hero use. Verify image resolution before relying on them for large viewport rendering.

### Risk 2 — Small catalog at launch reads as sparse

With 6 products across 2 collections, sections like "Best Sellers" (2 matching products), "Editor's Picks" (2 matching products), and the Homepage risk feeling thin. The design decisions made above (generous whitespace, editorial framing, no filler sections) address this editorially — but any implementation that deviates toward tighter grids, smaller cards, or more sections will expose the catalog thinness.

**Mitigation:** Hold the editorial framing firm. Do not be tempted to add more sections to fill vertical space. Whitespace is the product at this catalog size.

### Risk 3 — `isFeatured`, `isEditorsPick`, `isBestSeller` flags create a manual curation burden

These three flag fields must be kept intentionally current as the catalog grows. With no CMS, updating them requires a developer code edit + redeployment. If they fall out of sync (e.g., "Best Sellers" still shows products from 6 months ago while new products were added), the homepage ages badly.

**Mitigation:** Document the update process clearly in `PROJECT_MEMORY.md` under "AI Notes" (as operational documentation for whoever maintains this). Consider in V2 whether a lightweight admin UI or a CMS would better serve this need.

### Risk 4 — Filter URL state (deferred but not forgotten)

Client-side-only filter state (no URL params) means a user who finds a filtered view via social sharing or direct link will not land on their expected filtered results. For a brand site this is low risk today — but if the client begins using filtered URLs in marketing or Instagram links, this becomes a real gap.

**Mitigation:** Architect `ShopFilters` to accept optional `initialFilters` from URL search params even though those aren't populated today. This keeps the migration path open (switch from state → URL params without rewriting the filter logic).

### Risk 5 — Uzbek copy quality

Uzbek translations in the seed data and message files are placeholder quality. The current Uzbek is grammatically approximately correct but has not been reviewed by a native speaker. This affects every user-facing string in the `/uz` locale.

**Mitigation:** Commission a native Uzbek speaker to review all UI strings and product copy before launch. This is a content risk, not a technical risk — but it directly impacts the perceived quality of the brand for Uzbek-speaking users, who are explicitly in the target audience.

### Risk 6 — Accent color accessibility gap

The placeholder accent `#8a7a5c` fails WCAG AA for normal text. Until the real brand palette is selected and checked, the accent color should only be used decoratively (borders, backgrounds, large type). No body text in the accent color.

**Mitigation:** Flag to the client that the real color selection must pass accessibility contrast checks. Include a contrast verification step in the design system work (a later milestone).

---

## 10. Implementation scope (what this milestone delivers)

### Included

- Homepage: all 6 sections defined above
- `/[locale]/collections/[slug]` page: Hero, Story, Product Grid, Related Collections
- `/[locale]/shop` page: Server-rendered product list, client-side filter + sort
- New repository functions: `getFeaturedCollection()`, `getEditorsPicks()`, `getBestSellers()`
- `isFeatured` field added to `Collection` type and one collection flagged
- All new components listed in §4
- Breadcrumbs on Collection and Shop All
- JSON-LD structured data on all three pages
- `generateMetadata` on all three pages with hreflang alternates
- `NEXT_PUBLIC_SITE_URL` env variable added to `.env.local.example`
- `prefers-reduced-motion` global CSS rule
- Skip-to-content link in Header
- `messages/ru.json` and `messages/uz.json` updated with new i18n keys (`brand.statement`, `nav.skipToContent`, `stores.findUsHeading`, `stores.viewAll`, `filters.collection`, `filters.category`, `filters.size`, `filters.clearAll`, `sort.featured`, `sort.priceAsc`, `sort.priceDesc`, `shop.xResults`, `shop.noResults`, `shop.noResultsHint`)
- `ProductSkeleton` component (even though not triggered by current local data)

### Explicitly not in this milestone

- Product detail page (next milestone)
- Wishlist page/drawer (next milestone — wishlist toggle is included on cards, but the view wishlist UI is not)
- "Complete the Look" (next milestone)
- Telegram/WhatsApp CTA on product cards (cards link to product pages; the CTA is a product-page concern)
- Framer Motion animations (defer to visual polish phase; CSS transitions throughout this milestone)
- Sitemap / robots.txt (defer to polish)
- Any typography research or palette finalization (these are design system tasks that should precede visual implementation but are tracked separately)

---

## 11. Open items before implementation begins

1. **Real photography** — required before implementing any large-image section. Define format requirements with the client: minimum resolution, preferred aspect ratios (3:4 for product, 16:9 or editorial for hero/collection).
2. **Brand copy** — the `story` fields on both collections need real editorial copy (3–5 sentences each). The `BrandMoment` section needs a finalized brand statement in both languages.
3. **Typography research** — the design spec calls for a dedicated typography pairing pass before the visual design phase. Geist Sans is the safe placeholder, not the final answer. This should happen as a dedicated design task.
4. **Final accent color** — needs to be selected from the real logo, checked for WCAG AA compliance, and finalized before CSS token implementation.
5. **Real store data** — store names, addresses, and hours in the seed data are placeholder. These must be verified with the client before the Stores page launches.
6. **`NEXT_PUBLIC_SITE_URL`** — domain needs to be confirmed for SEO metadata. Use a placeholder (`https://silkline.uz`) in `.env.local.example` with a comment noting it must be updated before deployment.
