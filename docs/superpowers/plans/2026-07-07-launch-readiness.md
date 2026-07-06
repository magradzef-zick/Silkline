# Launch Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the SilkLine codebase production-ready — visually credible and structurally clean — before the client supplies final assets (logo, photography, brand copy), so that when those assets arrive, the site can go live with file replacements and no code changes.

**Architecture:** All tasks are polish and structural work within the existing V1 architecture. No new pages, no new business logic, no new npm dependencies, no CMS, no redesigns. Every addition is either: (a) infrastructure the client fills by dropping in a file, (b) a structural improvement that requires no client input, or (c) a document that enables the client to supply content without developer involvement.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, next-intl 4.x, Vitest + React Testing Library, SVG for all placeholder assets.

## Global Constraints

- Bilingual always: every new locale-facing string must appear in both `messages/ru.json` and `messages/uz.json`.
- No new npm dependencies — use only what is already installed.
- Repository pattern: `lib/data-source/*` is the only code that imports from `data/*` — no task may reach into `/data` from components or pages.
- Server/Client boundaries: async Server Components for layout; isolated Client Components only when interactivity is required. No task may add `'use client'` without a concrete reason.
- No invented marketing copy: the only text additions allowed are structural (copyright year, city name, file-path references in the content brief). No founder stories, company values, quotes, slogans, or editorial content.
- No redesigning pages that depend on client content (About, product pages, collection pages).
- No logo design, no typeface selection for the logo, no invented brand marks.
- Small, logical commits; one per task; conventional commit messages.
- `proxy.ts` for locale routing — never `middleware.ts`.
- All placeholder SVGs must be warm-toned (matching the site's stone/neutral palette) and feel intentional, not broken.

---

## File Structure

| File | Action | Task |
|---|---|---|
| `public/file.svg` | Delete | 1 |
| `public/globe.svg` | Delete | 1 |
| `public/next.svg` | Delete | 1 |
| `public/vercel.svg` | Delete | 1 |
| `public/window.svg` | Delete | 1 |
| `public/placeholders/product-placeholder.svg` | Modify | 2 |
| `public/placeholders/collection-placeholder.svg` | Modify | 2 |
| `public/favicon.svg` | Create | 3 |
| `app/[locale]/layout.tsx` | Modify | 3 |
| `components/ui/LogoImage.tsx` | Create | 4 |
| `components/layout/Header.tsx` | Modify | 4 |
| `components/layout/Footer.tsx` | Modify | 5 |
| `messages/ru.json` | Modify | 5 |
| `messages/uz.json` | Modify | 5 |
| `docs/content-brief.md` | Create | 6 |

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

Replace the two generic grey placeholder SVGs with warm-toned, on-brand versions that feel intentional during the period before real photography arrives. Both use the site's stone/neutral palette. Neither is a logo or brand mark — they are image-area placeholders only.

**Files:**
- Modify: `public/placeholders/product-placeholder.svg`
- Modify: `public/placeholders/collection-placeholder.svg`

**Interfaces:**
- Consumes: these paths are already referenced throughout the codebase — `HeroSection`, `FeaturedCollectionSection`, `ProductCard`, `ProductGallery` all load them. No code changes needed.
- Produces: two SVG files that render a credible warm-toned placeholder at their respective aspect ratios

- [ ] **Step 1: Write the product placeholder**

Product cards and the product gallery use a portrait aspect ratio (~3:4). Write `public/placeholders/product-placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="#E7E2DC"/>
</svg>
```

Plain warm-stone fill. No text, no mark — just the color field.

- [ ] **Step 2: Write the collection placeholder**

Collection heroes span full-width at viewport height. Write `public/placeholders/collection-placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#DDD8D1"/>
</svg>
```

Slightly darker warm tone to distinguish from the product placeholder at a glance.

- [ ] **Step 3: Verify build passes and placeholders render**

```bash
npm run build 2>&1 | tail -5
npm run start &
```

Open `http://localhost:3000/ru`. Confirm the homepage hero and product cards show a warm-toned fill (not a broken image icon, not a grey box). Open `http://localhost:3000/ru/shop` and confirm product cards show the same warm fill. Kill the server.

- [ ] **Step 4: Commit**

```bash
git add public/placeholders/
git commit -m "design: replace generic placeholder SVGs with warm-tone branded placeholders"
```

---

### Task 3: Add a favicon

The site currently has no favicon — every browser tab shows the generic browser default. Create a minimal SVG favicon and wire it into the layout metadata. The client replaces this file with their real brand mark without touching any code.

**Files:**
- Create: `public/favicon.svg`
- Modify: `app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: a `<link rel="icon" href="/favicon.svg">` in the HTML `<head>` for all pages

- [ ] **Step 1: Create the favicon SVG**

Write `public/favicon.svg`. A filled square at the site's dark stone tone — minimal, undesigned, clearly a placeholder:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#1C1917"/>
</svg>
```

A solid square. No lettermark, no logotype, no invented mark. The client replaces this with their brand mark.

- [ ] **Step 2: Add favicon metadata to the layout**

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

No other changes to the file.

- [ ] **Step 3: Verify favicon appears**

```bash
npm run build 2>&1 | tail -5
npm run start &
```

Open `http://localhost:3000/ru` in a browser. Confirm:
- The browser tab shows a dark square icon (not the generic browser icon).
- The HTML `<head>` contains `<link rel="icon" href="/favicon.svg">`.

Kill the server.

- [ ] **Step 4: Commit**

```bash
git add public/favicon.svg app/\[locale\]/layout.tsx
git commit -m "feat: add favicon infrastructure (client replaces /public/favicon.svg)"
```

---

### Task 4: Wire logo image in Header

The Header currently renders the brand name as a plain text link. The goal of this task is infrastructure only: create a thin component that loads a logo image file from a well-known path and falls back to the text brand name if the file is absent. This gives the client a single file to replace with no code changes. No logo is designed or created in this task — the fallback text is the production state until the client provides the file.

**Design rationale for implementation choices:**
- A plain `<img>` tag (not `next/image`) is used intentionally. `next/image` validates the image source and generates optimization URLs; using it without a real file present would cause build errors or broken optimization requests. A plain `<img>` makes a direct browser request — if the file returns 404, the browser fires `onerror` and the React `onError` handler shows the text fallback. This makes the component truly resilient to the file being absent.
- `LogoImage` must be a Client Component because it uses `useState` to track the error state. The Header itself remains a Server Component.

**Files:**
- Create: `components/ui/LogoImage.tsx`
- Modify: `components/layout/Header.tsx`

**Interfaces:**
- Consumes: `/logo.svg` from `/public` (does not need to exist — component handles 404 gracefully)
- Produces: `<LogoImage />` — renders an `<img src="/logo.svg">` when the file is present, falls back to a `<span>` with the text brand name when it is not

- [ ] **Step 1: Write a test for LogoImage**

Create `components/ui/LogoImage.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LogoImage } from './LogoImage';

describe('LogoImage', () => {
  it('renders an img element with the logo path', () => {
    render(<LogoImage />);
    const img = screen.getByRole('img', { name: 'SilkLine' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/logo.svg');
  });

  it('falls back to brand name text when the image fails to load', () => {
    render(<LogoImage />);
    const img = screen.getByRole('img', { name: 'SilkLine' });
    fireEvent.error(img);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('SilkLine')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run components/ui/LogoImage.test.tsx
```

Expected: FAIL — `LogoImage` is not defined.

- [ ] **Step 3: Create `components/ui/LogoImage.tsx`**

```tsx
'use client';

import { useState } from 'react';

export function LogoImage() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-base font-light tracking-[0.25em] uppercase text-stone-900">
        SilkLine
      </span>
    );
  }

  return (
    <img
      src="/logo.svg"
      alt="SilkLine"
      width={120}
      height={28}
      className="h-7 w-auto"
      onError={() => setFailed(true)}
    />
  );
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run components/ui/LogoImage.test.tsx
```

Expected: PASS — 2 tests, 0 failures.

- [ ] **Step 5: Update `components/layout/Header.tsx`**

The current logo line is:

```tsx
<Link href={`/${locale}`} className="text-lg font-semibold tracking-wide">
  SILKLINE
</Link>
```

Replace it with:

```tsx
<Link href={`/${locale}`} className="flex items-center">
  <LogoImage />
</Link>
```

Add the import at the top of the file (alongside existing imports):

```tsx
import { LogoImage } from '@/components/ui/LogoImage';
```

The full updated file:

```tsx
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getAllCollections } from '@/lib/data-source/collections';
import { buildCollectionNavLinks } from '@/lib/nav';
import type { AppLocale } from '@/i18n/locales';
import { LocaleSwitcher } from './LocaleSwitcher';
import { WishlistButton } from '@/components/features/WishlistButton';
import { LogoImage } from '@/components/ui/LogoImage';

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
        <LogoImage />
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

- [ ] **Step 6: Run the full quality gate**

```bash
npm run lint && npx tsc --noEmit && npm test
```

Expected: lint clean, typecheck clean, all tests pass (was 98; now 100 with the 2 new LogoImage tests).

- [ ] **Step 7: Verify fallback behavior in the browser**

```bash
npm run build 2>&1 | tail -5
npm run start &
```

Open `http://localhost:3000/ru`. Confirm:
- The header shows the fallback text "SilkLine" (because `/public/logo.svg` does not exist).
- The layout is not broken — the text appears where the logo would be.
- The text links correctly to `/ru`.

Now create a temporary test logo to verify the image path works:

```bash
echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 28"><rect width="120" height="28" fill="#E7E2DC"/></svg>' > public/logo.svg
```

Hard-refresh the browser. Confirm the header now shows the warm rectangle image instead of text. Delete the test file:

```bash
rm public/logo.svg
```

Kill the server.

- [ ] **Step 8: Commit**

```bash
git add components/ui/LogoImage.tsx components/ui/LogoImage.test.tsx components/layout/Header.tsx
git commit -m "feat: add LogoImage component with graceful fallback for logo asset handoff"
```

---

### Task 5: Improve Footer structure

The current footer is four bare lines: a contact prompt, a Telegram link, and a WhatsApp link, in plain `<p>` tags. A production footer needs a branding area, a copyright line, and cleaner visual hierarchy. No client input is required — every addition is structural only (brand name, city, copyright year).

**Files:**
- Modify: `components/layout/Footer.tsx`
- Modify: `messages/ru.json`
- Modify: `messages/uz.json`

**Interfaces:**
- Consumes: `TELEGRAM_USERNAME`, `WHATSAPP_NUMBER` from `lib/links/config` (unchanged); `getTranslations('footer')` (extended with two new keys)
- Produces: a two-part footer — a main row with a branding column and a contact column, plus a bottom copyright bar

New i18n keys:
- `footer.city` — the business city (factual data: "Ташкент" / "Toshkent")
- `footer.copyright` — the brand name in the copyright line ("SilkLine" in both locales; the year is computed in code, not translated)

- [ ] **Step 1: Add new keys to `messages/ru.json`**

In the existing `"footer"` object, add two keys. The full updated `"footer"` block:

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
        <div className="flex flex-col gap-1">
          <span className="text-xs tracking-[0.25em] uppercase text-stone-800">
            {t('copyright')}
          </span>
          <span className="text-xs text-stone-400">{t('city')}</span>
        </div>

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

Open `http://localhost:3000/ru`. Confirm:
- Branding column shows "SILKLINE" and "Ташкент".
- Contact column shows the Russian prompt, Telegram handle, and WhatsApp number.
- Copyright bar shows `© {year} SilkLine`.
- Layout is two columns on desktop (flex-row), stacked on mobile (flex-col).

Open `http://localhost:3000/uz`. Confirm:
- City shows "Toshkent" in the branding column.
- Contact prompt is in Uzbek.

Kill the server.

- [ ] **Step 5: Run full quality gate**

```bash
npm run lint && npx tsc --noEmit && npm test
```

Expected: lint clean, typecheck clean, all tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/layout/Footer.tsx messages/ru.json messages/uz.json
git commit -m "design: improve Footer with branding column, contact structure, and copyright bar"
```

---

### Task 6: Write the client content brief

Create `docs/content-brief.md` — a complete guide for the client covering every file they must supply, every environment variable they must set, and every field they must fill before the site can go live. The brief must be precise enough that a non-developer client can supply all content without asking for clarification.

**Files:**
- Create: `docs/content-brief.md`

**Interfaces:**
- Consumes: the full current state of the codebase as audited during this milestone
- Produces: a reference document for the client handoff

- [ ] **Step 1: Write `docs/content-brief.md`**

```markdown
# SilkLine — Content Brief

This document tells you exactly what to provide before the site can go live.
You do not need to touch any code. Replace the files and fill in the fields
described below, then notify the development team — they will run a final
build and deploy.

---

## 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the four values:

| Variable | What it is | Example |
|---|---|---|
| `NEXT_PUBLIC_TELEGRAM_USERNAME` | Your Telegram handle, without the @ | `silkline_uz` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your WhatsApp number, international format, digits only | `998901234567` |
| `NEXT_PUBLIC_SITE_URL` | The full URL of the live website | `https://silkline.uz` |
| `NEXT_PUBLIC_OG_IMAGE` | Path to the Open Graph image | `/og-default.svg` |

---

## 2. Logo

**File to create:** `public/logo.svg`

Drop your logo file here. Requirements:
- **Format:** SVG strongly preferred. PNG with transparent background is also accepted.
- **If SVG:** any native dimensions — the browser scales it. The display size in the header is 120 × 28 px.
- **If PNG:** provide the file at 2× resolution: at least 240 × 56 px. Ensure it looks sharp on retina screens.
- **Background:** transparent.
- **Color:** the logo appears on a white/light header — ensure it is legible on light backgrounds.

If your logo has a significantly different aspect ratio, notify the development team so they can adjust the display dimensions (a one-line code change).

---

## 3. Favicon

**File to create:** `public/favicon.svg`

Drop your brand mark or icon here. Requirements:
- **Format:** SVG strongly preferred.
- **Size:** the icon is displayed at 16 × 16 and 32 × 32 px. It must be legible at small sizes.
- **Composition:** square or near-square works best for favicons.
- **Background:** filled (not transparent) — transparent favicons disappear on some browser tab backgrounds.

---

## 4. Open Graph / Social Preview Image

**File to replace:** `public/og-default.svg`

This image appears when the site URL is shared on social media (Telegram, Instagram DMs, WhatsApp, etc.).

Requirements:
- **Dimensions:** exactly 1200 × 630 px.
- **Format:** JPG or PNG preferred for photography. SVG is also accepted.
- **Content:** include your logo, brand name, and a representative product or collection image.
- **Note:** if you use JPG or PNG, update `NEXT_PUBLIC_OG_IMAGE` in `.env.local` to match (e.g. `/og.jpg`).

---

## 5. Product Catalog

**File to edit:** `data/products.ts`

Each product is one object in the array. Template for one product:

```ts
{
  id: 'unique-id',           // lowercase letters and hyphens only; never change after first use
  slug: 'url-slug',          // appears in the URL: /ru/product/your-slug
  name: {
    ru: 'Название на русском',
    uz: 'O\'zbek tilidagi nomi',
  },
  description: {
    ru: 'Описание на русском (1–3 предложения).',
    uz: 'O\'zbek tilidagi tavsif (1–3 jumla).',
  },
  collectionId: 'col-your-collection-id', // must match a collection id in data/collections.ts
  categoryId: 'cat-dresses',              // must match a category id in data/categories.ts
  images: [
    '/products/your-image-1.jpg',  // main image — shown in product cards and shop grid
    '/products/your-image-2.jpg',  // additional angles (optional)
  ],
  sizes: ['XS', 'S', 'M', 'L'],   // list only the sizes you actually stock
  price: 890000,                   // price in Uzbek soum, integer, no decimals
  relatedProductIds: ['other-id'], // 2–3 product ids for "Complete the Look"
}
```

**Product image requirements:**
- Create the folder `public/products/` and place all product images there.
- Format: JPG preferred for photography; WebP also accepted.
- Dimensions: minimum 800 × 1067 px (3:4 portrait). Provide at 2× (1600 × 2134 px) for retina screens.
- File names: lowercase, hyphens only — e.g. `silk-wrap-dress-front.jpg`.

---

## 6. Collections

**File to edit:** `data/collections.ts`

Each collection is one object in the array. Template:

```ts
{
  id: 'col-unique-id',   // must begin with 'col-'; never change after first use
  slug: 'url-slug',      // appears in the URL: /ru/collections/your-slug
  name: {
    ru: 'Название коллекции',
    uz: 'Kolleksiya nomi',
  },
  story: {
    ru: 'Описание коллекции (1–2 предложения, editorial стиль).',
    uz: 'Kolleksiya tavsifi (1–2 jumla, editorial uslub).',
  },
  heroImage: '/collections/your-hero.jpg',
  productIds: ['product-id-1', 'product-id-2', 'product-id-3'],
}
```

**Collection hero image requirements:**
- Create the folder `public/collections/` and place all hero images there.
- Format: JPG or WebP.
- Dimensions: minimum 1600 × 900 px (16:9 landscape). This image fills the homepage hero and the collection page banner.

**After updating collections**, also update `lib/config/editorial.ts`:

```ts
export const EDITORIAL = {
  featuredCollectionSlug: 'your-slug-here', // shown as the homepage hero
  selectedProductSlugs: [
    'slug-1', // the 4 products shown in the homepage "Избранное" section
    'slug-2',
    'slug-3',
    'slug-4',
  ],
  defaultOgImage: '/og-default.svg',
} as const;
```

---

## 7. Categories

**File to edit:** `data/categories.ts`

Current categories: Платья (Dresses), Верхняя одежда (Outerwear), Трикотаж (Knitwear).

If your catalog uses different or additional categories, edit this file. Template:

```ts
{
  id: 'cat-unique-id', // must begin with 'cat-'; never change after first use
  slug: 'url-slug',
  name: {
    ru: 'Название категории',
    uz: 'Kategoriya nomi',
  },
}
```

---

## 8. Store Locations

**File to edit:** `data/stores.ts`

Each physical store is one object. Template:

```ts
{
  id: 'store-unique-id',
  name: 'SilkLine — Store Name',
  address: {
    ru: 'Адрес на русском',
    uz: 'O\'zbek tilidagi manzil',
  },
  city: 'Tashkent',
  phone: '+998 90 000 00 00',
  mapUrl: 'https://maps.google.com/?q=...',
  hours: '10:00–22:00',
}
```

For `mapUrl`: open Google Maps, find your store location, click Share → Copy link. Paste that URL here.

---

## 9. Brand Copy

### About page (`messages/ru.json` and `messages/uz.json`, namespace `about`)

Fill in the `"about"` block in both language files:

```json
"about": {
  "title": "О нас — SilkLine",
  "heading": "О нас",
  "story": "Your brand story (2–4 sentences).",
  "missionLabel": "Наша миссия",
  "mission": "Your mission statement (1–2 sentences).",
  "viewCollections": "Смотреть коллекции"
}
```

### Brand Moment homepage section (`messages/ru.json` and `messages/uz.json`, key `brand.statement`)

This section appears on the homepage only when this field is non-empty. Leave it as `""` until you have approved copy:

```json
"brand": {
  "statement": "Your brand statement — a single powerful sentence."
}
```

---

## 10. Launch Checklist

- [ ] `.env.local` created with all four variables filled in
- [ ] `public/logo.svg` — client logo file placed
- [ ] `public/favicon.svg` — client brand mark placed
- [ ] `public/og-default.svg` — replaced with real social preview image (or env var updated)
- [ ] `data/products.ts` — real product catalog, all placeholder products removed
- [ ] `public/products/` — all product photography placed
- [ ] `data/collections.ts` — real collections, all placeholder collections removed
- [ ] `public/collections/` — all collection hero images placed
- [ ] `lib/config/editorial.ts` — `featuredCollectionSlug` and `selectedProductSlugs` updated
- [ ] `data/stores.ts` — real store addresses, phones, and map links
- [ ] `messages/ru.json` `about` copy — reviewed and approved
- [ ] `messages/uz.json` `about` copy — reviewed by a native Uzbek speaker
- [ ] `brand.statement` — filled in both language files, or intentionally left empty
```

- [ ] **Step 2: Verify the brief is complete**

Read through `docs/content-brief.md` and check each of the following:
- Every item in the pre-milestone content audit is covered (Telegram, WhatsApp, products, collections, stores, logo, favicon, OG image, about copy, brand statement, editorial config).
- Every entry states which file to edit, what format/dimensions are required, and includes an example.
- The launch checklist matches every item in the brief body.

- [ ] **Step 3: Commit**

```bash
git add docs/content-brief.md
git commit -m "docs: add client content brief for launch preparation"
```

---

### Task 7: Final verification

Run the complete quality gate and confirm the milestone is clean.

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

Expected: 23 test files, 100 tests, all passing. (Tasks 1–6 add 2 tests in `LogoImage.test.tsx`; all prior 98 remain green.)

- [ ] **Step 4: Build**

```bash
npm run build 2>&1
```

Expected: clean build with all existing routes, no new routes, exit 0.

- [ ] **Step 5: Full production smoke test**

```bash
npm run start &
```

Check each URL:

| URL | What to verify |
|---|---|
| `http://localhost:3000/ru` | Header shows "SilkLine" text fallback (no logo.svg yet); footer shows branding column + copyright; homepage hero shows warm placeholder |
| `http://localhost:3000/uz` | Footer city reads "Toshkent"; contact prompt in Uzbek |
| `http://localhost:3000/ru/shop` | Product cards show warm placeholder fill |
| `http://localhost:3000/ru/collections/autumn-atelier` | Collection hero shows warm placeholder fill |
| `http://localhost:3000/ru/product/silk-wrap-dress` | Product gallery shows warm placeholder fill |
| `http://localhost:3000/ru/about` | No regressions from prior milestone |
| `http://localhost:3000/ru/stores` | No regressions from prior milestone |
| Browser tab (any page) | Dark square favicon visible |
| Page `<head>` (view source) | `<link rel="icon" href="/favicon.svg">` present |

Kill the server.

- [ ] **Step 6: Commit if any fixes were needed**

If Step 5 uncovered issues, fix them and commit before marking the milestone complete.

---

## Self-Review

_(Completed before filing the plan.)_

**Spec coverage:**

| Requirement | Task |
|---|---|
| Remove scaffold SVGs | 1 |
| Warm-toned product placeholder | 2 |
| Warm-toned collection placeholder | 2 |
| Favicon (absent from site) | 3 |
| Logo infrastructure — `<img>` + `onError` fallback | 4 |
| Logo infrastructure — Header wired to LogoImage | 4 |
| Footer branding column | 5 |
| Footer copyright bar | 5 |
| Footer contact hierarchy | 5 |
| Client content brief | 6 |
| Final verification | 7 |

**Placeholder scan:** No "TBD", "TODO", or "fill in later" strings. Every step contains exact code or exact commands.

**Type consistency:** `LogoImage` is referenced identically in `LogoImage.tsx`, `LogoImage.test.tsx`, and `Header.tsx`. The two new footer i18n keys (`city`, `copyright`) appear in both `ru.json` and `uz.json` at the same path.

**Constraint check:**
- No new npm dependencies: ✅
- No invented marketing copy: ✅ (city name and brand name are factual; copyright year is computed)
- No logo designed: ✅ — Task 4 creates no logo file; the `LogoImage` component is pure infrastructure
- Repository pattern intact: ✅ — no task reaches into `data/*` from outside `lib/data-source`
- Server/Client boundaries: ✅ — `LogoImage` is Client because it needs `useState`; `Footer` and `Header` remain Server Components
- No new pages or business features: ✅
- Bilingual: ✅ — both i18n files updated in Task 5; no locale-facing strings added in other tasks

**Key design decisions documented:**
- `LogoImage` uses a plain `<img>` tag, not `next/image`, specifically to avoid build-time file validation and allow graceful 404 fallback. This is intentional and should not be "fixed" by a reviewer.
- Placeholder SVGs have no text or mark — plain warm fills only. This is intentional; they are image-area holders, not brand assets.
- `public/favicon.svg` is a solid square with no lettermark. This is intentional; the client replaces it with their real mark.
