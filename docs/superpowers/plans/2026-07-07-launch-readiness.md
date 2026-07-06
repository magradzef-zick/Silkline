# Launch Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the SilkLine codebase production-ready — visually credible and structurally clean — before the client supplies final assets (logo, photography, brand copy), so that when those assets arrive, the site can go live with file replacements only and no code changes.

**Architecture:** All tasks are polish and structural work within the existing V1 architecture. No new pages, no new business logic, no new npm dependencies, no CMS, no redesigns. Every addition is either: (a) a file the client will replace, (b) a structural improvement that requires no client input, or (c) a document that enables the client to supply content without developer involvement.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, next-intl 4.x, Vitest + React Testing Library, SVG for all placeholder assets.

## Global Constraints

- Bilingual always: every new locale-facing string must appear in both `messages/ru.json` and `messages/uz.json`.
- No new npm dependencies — use only what is already installed.
- Repository pattern: `lib/data-source/*` is the only code that imports from `data/*` — no task may reach into `/data` from components or pages.
- Server/Client boundaries: async Server Components for layout; isolated Client Components only when interactivity is required. No task may add `'use client'` without a concrete reason.
- No invented marketing copy: the only text additions allowed are structural (copyright year, city name, file-path references in the content brief). No founder stories, company values, quotes, slogans, or editorial content.
- No redesigning pages that depend on client content (About, product pages, collection pages) — those are touched only when adding structural zones, not copy.
- Small, logical commits; one per task; conventional commit messages.
- `proxy.ts` for locale routing — never `middleware.ts`.
- All placeholder SVGs must be warm-toned (matching the site's stone/neutral palette) and feel intentional, not broken.

---

### Task 1: Remove Next.js scaffold assets from /public

**Files:**
- Delete: `public/file.svg`
- Delete: `public/globe.svg`
- Delete: `public/next.svg`
- Delete: `public/vercel.svg`
- Delete: `public/window.svg`

**Interfaces:**
- Consumes: nothing
- Produces: a `/public` directory that contains only assets the application actually uses

- [ ] **Step 1: Verify no application code references these files**

Run:
```bash
grep -r "file\.svg\|globe\.svg\|next\.svg\|vercel\.svg\|window\.svg" . \
  --include="*.ts" --include="*.tsx" --include="*.json" --include="*.css" \
  | grep -v node_modules | grep -v ".next"
```

Expected: no output. If any file appears, stop and investigate before deleting.

- [ ] **Step 2: Delete the files**

```bash
rm public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

- [ ] **Step 3: Verify build still passes**

```bash
npm run build 2>&1 | tail -10
```

Expected: same route table as before, exit 0.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove unused Next.js scaffold assets from /public"
```

---

### Task 2: Create branded placeholder SVGs

Replace the two generic grey placeholder SVGs with warm-toned, on-brand versions that feel intentional during the period before real photography arrives. Both must match the site's stone/neutral palette and carry the SilkLine name as a subtle watermark.

**Files:**
- Modify: `public/placeholders/product-placeholder.svg`
- Modify: `public/placeholders/collection-placeholder.svg`

**Interfaces:**
- Consumes: existing `HeroSection`, `FeaturedCollectionSection`, `ProductCard`, `ProductGallery` — these all reference placeholder paths already; no code changes needed
- Produces: two SVG files that render a credible placeholder at their respective aspect ratios

- [ ] **Step 1: Write the product placeholder**

Product cards use a portrait aspect ratio (~3:4). Write `public/placeholders/product-placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="#E7E2DC"/>
  <text
    x="300" y="400"
    text-anchor="middle" dominant-baseline="middle"
    font-family="sans-serif" font-size="22" font-weight="300"
    letter-spacing="10" fill="#B5AFA8"
  >SILKLINE</text>
</svg>
```

- [ ] **Step 2: Write the collection placeholder**

Collection hero images span full-width at viewport height. Write `public/placeholders/collection-placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#DDD8D1"/>
  <text
    x="800" y="450"
    text-anchor="middle" dominant-baseline="middle"
    font-family="sans-serif" font-size="36" font-weight="300"
    letter-spacing="16" fill="#B5AFA8"
  >SILKLINE</text>
</svg>
```

- [ ] **Step 3: Verify build passes and images render**

```bash
npm run build 2>&1 | tail -5
```

Expected: exit 0, no errors.

Start the production server and open `http://localhost:3000/ru` and `http://localhost:3000/ru/shop`:
```bash
npm run start &
```

Confirm the hero and product cards show a warm-toned placeholder (not a broken image icon). Kill the server.

- [ ] **Step 4: Commit**

```bash
git add public/placeholders/
git commit -m "design: replace generic placeholder SVGs with branded warm-tone versions"
```

---

### Task 3: Add a favicon

The site currently has no favicon. Every browser tab shows the generic browser default. Create a minimal on-brand SVG favicon and wire it into the layout metadata. The client will replace this file with their real mark without touching any code.

**Files:**
- Create: `public/favicon.svg`
- Modify: `app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: a `<link rel="icon">` in the HTML `<head>` for all pages

- [ ] **Step 1: Create the favicon SVG**

Write `public/favicon.svg`. Use a warm stone square with a centered "SL" lettermark:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#4A4540"/>
  <text
    x="16" y="16"
    text-anchor="middle" dominant-baseline="central"
    font-family="sans-serif" font-size="11" font-weight="300"
    letter-spacing="1" fill="#E7E2DC"
  >SL</text>
</svg>
```

- [ ] **Step 2: Wire the favicon in the layout metadata**

Open `app/[locale]/layout.tsx`. The existing `metadata` export is:

```ts
export const metadata: Metadata = {
  title: "SilkLine",
  description: "SilkLine — premium Korean fashion, Tashkent.",
};
```

Replace it with:

```ts
export const metadata: Metadata = {
  title: "SilkLine",
  description: "SilkLine — premium Korean fashion, Tashkent.",
  icons: {
    icon: "/favicon.svg",
  },
};
```

- [ ] **Step 3: Verify favicon appears**

```bash
npm run build 2>&1 | tail -5
npm run start &
```

Open `http://localhost:3000/ru` in a browser. Confirm the browser tab shows the dark square "SL" favicon (not the generic browser icon). Check that the HTML `<head>` contains `<link rel="icon" href="/favicon.svg">`. Kill the server.

- [ ] **Step 4: Commit**

```bash
git add public/favicon.svg app/[locale]/layout.tsx
git commit -m "feat: add SVG favicon placeholder"
```

---

### Task 4: Wire logo image in Header

The Header currently renders the brand name as a plain text link (`SILKLINE`). For a production-grade premium site, the logo must be an image the client can replace with a single file swap. Create a branded SVG wordmark placeholder at `public/logo.svg` and update the Header to load it via `next/image`. When the client provides their real logo file, they replace `public/logo.svg` only — no code change needed.

**Files:**
- Create: `public/logo.svg`
- Modify: `components/layout/Header.tsx`

**Interfaces:**
- Consumes: `next/image` (already installed), `public/logo.svg` (created in this task)
- Produces: `Header` renders a scalable `<Image>` logo with `alt="SilkLine"` instead of text

- [ ] **Step 1: Create the logo SVG placeholder**

Write `public/logo.svg`. A clean typographic wordmark matching the site's stone palette:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 32">
  <text
    x="0" y="22"
    font-family="sans-serif" font-size="18" font-weight="300"
    letter-spacing="6" fill="#1C1917"
  >SILKLINE</text>
</svg>
```

- [ ] **Step 2: Update Header to use `<Image>`**

Open `components/layout/Header.tsx`. The current logo is:

```tsx
import Link from 'next/link';
```

and:

```tsx
<Link href={`/${locale}`} className="text-lg font-semibold tracking-wide">
  SILKLINE
</Link>
```

Replace those two sections with the following (add `Image` import, replace the text link):

```tsx
import Link from 'next/link';
import Image from 'next/image';
```

```tsx
<Link href={`/${locale}`} className="flex items-center">
  <Image
    src="/logo.svg"
    alt="SilkLine"
    width={120}
    height={28}
    priority
    className="h-7 w-auto"
  />
</Link>
```

The full updated file:

```tsx
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { getAllCollections } from '@/lib/data-source/collections';
import { buildCollectionNavLinks } from '@/lib/nav';
import type { AppLocale } from '@/i18n/locales';
import { LocaleSwitcher } from './LocaleSwitcher';
import { WishlistButton } from '@/components/features/WishlistButton';

export async function Header({ locale }: { locale: AppLocale }) {
  const t = await getTranslations('nav');
  const collectionLinks = buildCollectionNavLinks(getAllCollections(), locale);

  return (
    <header className="relative flex items-center justify-between px-6 py-5 border-b border-stone-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow-md"
      >
        {t('skipToContent')}
      </a>
      <Link href={`/${locale}`} className="flex items-center">
        <Image
          src="/logo.svg"
          alt="SilkLine"
          width={120}
          height={28}
          priority
          className="h-7 w-auto"
        />
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        {collectionLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <Link href={`/${locale}/shop`}>{t('shopAll')}</Link>
        <Link href={`/${locale}/about`}>{t('about')}</Link>
        <Link href={`/${locale}/stores`}>{t('stores')}</Link>
      </nav>
      <div className="flex items-center gap-4">
        <WishlistButton locale={locale} />
        <LocaleSwitcher currentLocale={locale} />
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Verify logo renders**

```bash
npm run build 2>&1 | tail -5
npm run start &
```

Open `http://localhost:3000/ru`. Confirm the header shows the SVG wordmark (not placeholder broken icon, not text). Confirm the logo links to `/{locale}`. Kill the server.

- [ ] **Step 4: Run full quality gate**

```bash
npm run lint && npx tsc --noEmit && npm test
```

Expected: lint clean, typecheck clean, 98/98 tests pass.

- [ ] **Step 5: Commit**

```bash
git add public/logo.svg components/layout/Header.tsx
git commit -m "feat: replace text logo with SVG image in Header (client replaces /public/logo.svg)"
```

---

### Task 5: Improve Footer structure

The current footer is four bare lines: a contact prompt, a Telegram link, and a WhatsApp link, in plain `<p>` tags with minimal spacing. A production footer needs a branding area, a copyright line, and cleaner visual hierarchy. No client input is required — every addition is purely structural (brand name, city, copyright year).

**Files:**
- Modify: `components/layout/Footer.tsx`
- Modify: `messages/ru.json`
- Modify: `messages/uz.json`

**Interfaces:**
- Consumes: `TELEGRAM_USERNAME`, `WHATSAPP_NUMBER` from `lib/links/config` (unchanged), `getTranslations('footer')` from next-intl
- Produces: a three-part footer: branding row, contact row, copyright bar

New i18n keys (both locales):
- `footer.city` — the business city (factual, not invented: "Ташкент" / "Toshkent")
- `footer.copyright` — prefix string ("© {year} SilkLine") — the year is computed in code, not translated; only the © symbol and brand name

- [ ] **Step 1: Add new footer keys to `messages/ru.json`**

In the existing `"footer"` object, add two keys:

```json
"footer": {
  "contactPrompt": "Свяжитесь с нами, чтобы оформить заказ:",
  "city": "Ташкент",
  "copyright": "SilkLine"
}
```

- [ ] **Step 2: Add the same keys to `messages/uz.json`**

```json
"footer": {
  "contactPrompt": "Buyurtma berish uchun biz bilan bog'laning:",
  "city": "Toshkent",
  "copyright": "SilkLine"
}
```

- [ ] **Step 3: Rewrite `components/layout/Footer.tsx`**

```tsx
import { getTranslations } from 'next-intl/server';
import { TELEGRAM_USERNAME, WHATSAPP_NUMBER } from '@/lib/links/config';

export async function Footer() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 text-sm text-stone-600">
      <div className="px-6 py-10 flex flex-col gap-8 sm:flex-row sm:justify-between sm:items-start">
        {/* Branding */}
        <div className="flex flex-col gap-1">
          <span className="text-xs tracking-[0.3em] uppercase text-stone-800">
            {t('copyright')}
          </span>
          <span className="text-xs text-stone-400">{t('city')}</span>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-2">
          <p className="text-stone-500">{t('contactPrompt')}</p>
          <a
            href={`https://t.me/${TELEGRAM_USERNAME}`}
            className="hover:text-stone-900 transition-colors"
          >
            Telegram: @{TELEGRAM_USERNAME}
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            className="hover:text-stone-900 transition-colors"
          >
            WhatsApp: +{WHATSAPP_NUMBER}
          </a>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="px-6 py-4 border-t border-stone-100 text-xs text-stone-400">
        © {year} {t('copyright')}
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Verify footer renders correctly in both locales**

```bash
npm run build 2>&1 | tail -5
npm run start &
```

Open `http://localhost:3000/ru` and `http://localhost:3000/uz`. Confirm:
- Branding area shows "SILKLINE" + city in each locale
- Contact section shows the correct prompt text in each locale
- Telegram and WhatsApp links are present and correct
- Copyright bar shows `© {year} SilkLine`
- Layout is two columns on desktop, stacked on mobile

Kill the server.

- [ ] **Step 5: Run full quality gate**

```bash
npm run lint && npx tsc --noEmit && npm test
```

Expected: lint clean, typecheck clean, 98/98 tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/layout/Footer.tsx messages/ru.json messages/uz.json
git commit -m "design: improve Footer with branding area, contact structure, and copyright"
```

---

### Task 6: Write the client content brief

Create `docs/content-brief.md` — a complete, developer-free guide for the client covering every file they must supply, every environment variable they must set, and every field they must fill before the site can go live. The brief must be so clear that a non-developer client can supply all content without asking the development team for clarification.

**Files:**
- Create: `docs/content-brief.md`

**Interfaces:**
- Consumes: the full current state of the codebase (verified in this session)
- Produces: a reference document for the client handoff

- [ ] **Step 1: Write `docs/content-brief.md`**

```markdown
# SilkLine — Content Brief

This document tells you exactly what to provide before the site can go live.
You do not need to touch any code. Replace the files and fill in the fields
described below, then let the development team know — they will run a final
build and deploy.

---

## 1. Environment Variables

Create a file called `.env.local` in the project root (copy from `.env.local.example`).
Fill in the four values:

| Variable | What it is | Example |
|---|---|---|
| `NEXT_PUBLIC_TELEGRAM_USERNAME` | Your Telegram channel/account handle, without the @ | `silkline_uz` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your WhatsApp number in international format, digits only | `998901234567` |
| `NEXT_PUBLIC_SITE_URL` | The full URL of the live website | `https://silkline.uz` |
| `NEXT_PUBLIC_OG_IMAGE` | Path to the Open Graph image (leave as `/og-default.svg` until you have a real one) | `/og-default.svg` |

---

## 2. Logo

**File to replace:** `public/logo.svg`

Replace this file with your logo. Requirements:
- Format: **SVG** (strongly preferred) or PNG with transparent background
- If PNG: minimum **480 × 112 px** at 2× (i.e. the file should be 960 × 224 px)
- If SVG: any dimensions — the browser scales it
- The logo is displayed at **120 × 28 px** in the header
- Background must be transparent
- The logo appears on a white/light background — ensure it is legible

If your logo is a different aspect ratio, tell the development team and they will adjust the display size in one line.

---

## 3. Favicon

**File to replace:** `public/favicon.svg`

Replace this file with your brand mark. Requirements:
- Format: **SVG** (preferred) — browsers scale SVG favicons perfectly
- The icon is displayed at **16 × 16** and **32 × 32 px** — it must be legible at small sizes
- A square or near-square composition works best
- Background should be filled (not transparent) so it is visible on all browser tab backgrounds

---

## 4. Open Graph / Social Preview Image

**File to replace:** `public/og-default.svg`

This image appears when the site URL is shared on social media (Instagram DMs, Telegram, WhatsApp, etc.).

Requirements:
- Dimensions: exactly **1200 × 630 px**
- Format: **JPG** or **PNG** (SVG also accepted)
- If you switch to JPG or PNG, update `NEXT_PUBLIC_OG_IMAGE` in `.env.local` to match (e.g. `/og-default.jpg`)
- Should include your logo, brand name, and a hero product or collection image
- Keep text minimal — it may be cropped by different platforms

---

## 5. Product Catalog

**File to edit:** `data/products.ts`

Each product is one entry in the array. Here is the structure for one product:

```ts
{
  id: 'unique-id',           // lowercase, hyphens only, never changed after first use
  slug: 'url-friendly-name', // appears in the URL: /ru/product/your-slug-here
  name: {
    ru: 'Russian product name',
    uz: 'Uzbek product name',
  },
  description: {
    ru: 'Russian description (1–3 sentences).',
    uz: 'Uzbek description (1–3 sentences).',
  },
  collectionId: 'col-your-collection-id', // must match a collection id in data/collections.ts
  categoryId: 'cat-dresses',              // must match a category id in data/categories.ts
  images: [
    '/products/your-product-photo-1.jpg', // see image requirements below
    '/products/your-product-photo-2.jpg', // optional additional angles
  ],
  sizes: ['XS', 'S', 'M', 'L'],          // list only the sizes you actually stock
  price: 890000,                          // price in Uzbek soum (integer, no decimals)
  relatedProductIds: ['other-product-id'], // 2–3 product ids for "Complete the Look"
}
```

**Product image requirements:**
- Place all product images in `public/products/` (create this folder)
- Format: **JPG** (preferred for photography) or **WebP**
- Dimensions: minimum **800 × 1067 px** (3:4 portrait ratio)
- File names: lowercase, hyphens only — e.g. `silk-wrap-dress-1.jpg`
- The first image in the array is the main image shown in product cards and shop grids

---

## 6. Collections

**File to edit:** `data/collections.ts`

Each collection is one entry in the array:

```ts
{
  id: 'col-unique-id',       // lowercase, hyphens, col- prefix required
  slug: 'url-friendly-name', // appears in the URL: /ru/collections/your-slug
  name: {
    ru: 'Russian collection name',
    uz: 'Uzbek collection name',
  },
  story: {
    ru: 'Russian collection description (1–2 sentences — short and editorial).',
    uz: 'Uzbek collection description.',
  },
  heroImage: '/collections/your-hero-image.jpg', // see image requirements below
  productIds: ['product-id-1', 'product-id-2'],  // ids of products in this collection
}
```

**Collection hero image requirements:**
- Place in `public/collections/` (create this folder)
- Format: **JPG** or **WebP**
- Dimensions: minimum **1600 × 900 px** (16:9 landscape)
- This image is used as a full-bleed hero on the collection page and as the homepage hero

**After adding collections**, update `lib/config/editorial.ts`:
```ts
export const EDITORIAL = {
  featuredCollectionSlug: 'your-featured-collection-slug', // shown on homepage hero
  selectedProductSlugs: [
    'product-slug-1', // 4 products shown in the "Избранное" homepage section
    'product-slug-2',
    'product-slug-3',
    'product-slug-4',
  ],
  defaultOgImage: '/og-default.svg',
} as const;
```

---

## 7. Categories

**File to edit:** `data/categories.ts`

The current categories are: Dresses, Outerwear, Knitwear. If your actual catalog uses different or additional categories, edit this file:

```ts
{
  id: 'cat-unique-id',   // lowercase, hyphens, cat- prefix required
  slug: 'url-slug',
  name: {
    ru: 'Russian category name',
    uz: 'Uzbek category name',
  },
}
```

---

## 8. Store Locations

**File to edit:** `data/stores.ts`

Each physical store is one entry:

```ts
{
  id: 'store-unique-id',
  name: 'SilkLine — Store Name',
  address: {
    ru: 'Russian address',
    uz: 'Uzbek address',
  },
  city: 'Tashkent',
  phone: '+998 90 000 00 00',         // real phone number with spaces
  mapUrl: 'https://maps.google.com/?q=...', // copy the share link from Google Maps
  hours: '10:00–22:00',
}
```

For the `mapUrl`: open Google Maps, find your store, click Share → Copy Link. Use that URL.

---

## 9. Brand Copy (About page + Brand Moment)

**File to edit:** `messages/ru.json` and `messages/uz.json`

In both files, fill in the `about` namespace:

```json
"about": {
  "title": "О нас — SilkLine",
  "heading": "О нас",
  "story": "Your brand story here (2–4 sentences).",
  "missionLabel": "Наша миссия",
  "mission": "Your mission statement here (1–2 sentences).",
  "viewCollections": "Смотреть коллекции"
}
```

And fill in the `brand` namespace (used for the homepage Brand Moment section — appears only when this field is non-empty):

```json
"brand": {
  "statement": "Your brand statement here — a single powerful sentence or short phrase."
}
```

Leave `brand.statement` as `""` if you are not ready to commit to copy yet — the section will remain hidden.

---

## 10. Summary Checklist

Before going live, confirm every item below is complete:

- [ ] `.env.local` created with all four variables
- [ ] `public/logo.svg` replaced with real logo
- [ ] `public/favicon.svg` replaced with real brand mark
- [ ] `public/og-default.svg` replaced (or env var updated)
- [ ] All products in `data/products.ts` reflect real inventory
- [ ] All product images placed in `public/products/`
- [ ] All collections in `data/collections.ts` reflect real collections
- [ ] All collection hero images placed in `public/collections/`
- [ ] `lib/config/editorial.ts` updated with real featured collection + selected products
- [ ] `data/stores.ts` updated with real addresses, phones, and map links
- [ ] `messages/ru.json` about copy reviewed and approved
- [ ] `messages/uz.json` about copy reviewed by a native Uzbek speaker
- [ ] `brand.statement` filled in both language files (or left empty intentionally)
```

- [ ] **Step 2: Verify the document is complete**

Read through `docs/content-brief.md` and check:
- Every item identified in the content audit (Telegram, WhatsApp, products, collections, stores, logo, favicon, OG image, about copy, brand statement, editorial config) has a clear entry.
- Every entry specifies: which file to edit, what format/dimensions are required, and an example.
- A non-developer could follow this document without asking for help.

- [ ] **Step 3: Commit**

```bash
git add docs/content-brief.md
git commit -m "docs: add client content brief for launch preparation"
```

---

### Task 7: Final verification

Run the complete quality gate and confirm the milestone is ready for review.

**Files:** none — verification only

- [ ] **Step 1: Lint**

```bash
npm run lint
```

Expected: exit 0, zero errors, zero warnings.

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no output, exit 0.

- [ ] **Step 3: Tests**

```bash
npm test
```

Expected: 22 test files, 98 tests, all passing.

- [ ] **Step 4: Build**

```bash
npm run build 2>&1
```

Expected: clean build with all existing routes. No new routes added. `/robots.txt` and `/sitemap.xml` still present. Exit 0.

- [ ] **Step 5: Production smoke test**

```bash
npm run start &
```

Manually check each of the following — confirm no visual regressions:

| URL | What to verify |
|---|---|
| `http://localhost:3000/ru` | SVG logo in header, warm placeholder hero, footer has branding + copyright |
| `http://localhost:3000/uz` | Uzbek locale, footer city shows "Toshkent" |
| `http://localhost:3000/ru/shop` | Product cards show warm placeholder images |
| `http://localhost:3000/ru/collections/autumn-atelier` | Warm collection placeholder hero |
| `http://localhost:3000/ru/product/silk-wrap-dress` | Product gallery shows warm placeholder |
| `http://localhost:3000/ru/about` | No regressions |
| `http://localhost:3000/ru/stores` | No regressions |
| Browser tab (any page) | Dark square "SL" favicon visible |
| View source `<head>` | `<link rel="icon" href="/favicon.svg">` present |

Kill the server.

- [ ] **Step 6: Commit if any fixes were needed**

If Step 5 found issues, fix them and commit before marking complete. If all passed, no commit needed.

---

## Self-Review

_(Completed before filing the plan — not a task for the implementer.)_

**Spec coverage check:**

| Requirement | Covered by |
|---|---|
| Remove scaffold SVGs | Task 1 |
| Branded product placeholder | Task 2 |
| Branded collection placeholder | Task 2 |
| Favicon (missing from site entirely) | Task 3 |
| Logo image in Header | Task 4 |
| Footer branding area | Task 5 |
| Footer copyright | Task 5 |
| Footer contact hierarchy | Task 5 |
| Client content brief | Task 6 |
| Final verification | Task 7 |
| Audit for placeholders/leftovers | Done prior to this plan — outputs fed into Task 6 |

**Placeholder scan:** No "TBD", "TODO", or "implement later" strings. Every step includes exact code.

**Type consistency:** The only new types introduced are `footer.city` and `footer.copyright` translation keys — both appear in ru.json and uz.json in the same position.

**Constraint check:**
- No new npm dependencies introduced: ✅
- No invented marketing copy: ✅ (city name and brand name are factual; copyright year is computed)
- Repository pattern intact: ✅ (no task touches `data/*` from outside `lib/data-source`)
- Server/Client boundaries intact: ✅ (Footer remains async Server Component; Header remains async Server Component)
- No new pages or business features: ✅
- Bilingual: ✅ (both i18n files updated in Task 5)

**Scope discipline:** The About page layout was explicitly NOT enriched (the constraint said no speculative editorial content). The BrandMoment section was NOT given placeholder copy (it correctly stays hidden until the client provides their real statement). These are intentional omissions.
