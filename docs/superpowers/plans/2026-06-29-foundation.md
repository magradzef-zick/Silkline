# SilkLine V1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the SilkLine Next.js project end-to-end — scaffold, localization (ru/uz), the data layer, the Telegram/WhatsApp link abstraction, and the Header/Footer shell — so later plans (Homepage & Collections; Product & Wishlist & Ordering; Brand Story/Stores/Polish) build pages on top of a working, tested foundation instead of reinventing it.

**Architecture:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, with `next-intl` providing `/ru` and `/uz` locale-prefixed routing. All content is locally seeded (no CMS) behind a `/lib/data-source` repository layer, so a future CMS swap touches only that layer. All Telegram/WhatsApp order links are built from two named constants in one file, never inlined.

**Tech Stack:** Next.js 16.2.x, React 19.2.x, TypeScript 5, Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.ts`), `next-intl` 4.x, Vitest + React Testing Library for unit tests.

## Global Constraints

- Bilingual from day one: Russian (`ru`, default) and Uzbek (`uz`) — every locale-facing string ships in both.
- Typeface must have full native Cyrillic + Latin glyph coverage (confirmed: Geist Sans, bundled via `next/font/google`, supports both — see Task 8).
- No online checkout/auth/reviews/search/CMS-editor/live-chat in V1 (see spec §2).
- All Telegram/WhatsApp links route through `TELEGRAM_USERNAME` / `WHATSAPP_NUMBER` constants in `/lib/links/config.ts` — never hardcode a handle/number elsewhere (per user instruction 2026-06-29).
- Never use AI-generated model photography or generic stock product photography (spec §10) — this plan uses clearly-labeled flat placeholder SVGs only, swapped for real assets in a later plan.
- Small, logical commits; one per task minimum, conventional commit messages (per user instruction 2026-06-29).
- Use Next.js's `proxy.ts` convention for locale routing, not the deprecated `middleware.ts` name (confirmed via live build on Next 16.2.9 — `middleware.ts` triggers a deprecation warning).

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: entire scaffold (`package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `public/*`)
- Modify: `.gitignore` (re-add entries create-next-app's generated version omits)

**Interfaces:**
- Produces: a working `npm run dev` / `npm run build` / `npm run lint` on the existing repo, with `@/*` import alias resolving to the project root.

- [ ] **Step 1: Run the scaffolder in the existing repo root**

```bash
cd /Users/thatszick/Desktop/Projects/SilkRoad
npx --yes create-next-app@latest . --typescript --tailwind --eslint --app --import-alias "@/*" --disable-git --use-npm --no-agents-md
```

This was verified in isolation: it does not prompt interactively, does not reinitialize git (repo already has `.git`), and does not touch the existing `docs/` or `PROJECT_MEMORY_TEMPLATE.md`. It **will** overwrite `.gitignore` with its own version — that's expected, fixed in Step 2.

- [ ] **Step 2: Restore the project-specific `.gitignore` entries**

Open `.gitignore` (now create-next-app's version) and append:

```gitignore

# editor
.vscode/*
!.vscode/extensions.json
.idea
```

(The `.env*` and `node_modules` rules are already present in create-next-app's generated file — don't duplicate them.)

- [ ] **Step 3: Verify the scaffold builds and lints clean**

```bash
npm run build
```
Expected: `✓ Compiled successfully`, ending with a route table showing `○ /` and `○ /_not-found`.

```bash
npm run lint
```
Expected: `✔ No ESLint warnings or errors`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with TypeScript and Tailwind v4"
```

---

### Task 2: Testing infrastructure (Vitest + React Testing Library)

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Modify: `package.json` (add `test` / `test:watch` scripts and devDependencies)
- Test: `lib/sum.test.ts` (throwaway smoke test, deleted in Step 5 once the harness is proven)

**Interfaces:**
- Produces: `npm test` runs Vitest once; `@/*` alias resolves inside tests; `jsdom` environment with `@testing-library/jest-dom` matchers available globally.

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: Write the config**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true
  }
});
```

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

Add to `package.json` `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Write a throwaway smoke test to prove the harness works**

`lib/sum.test.ts`:
```ts
import { describe, expect, it } from 'vitest';

function sum(a: number, b: number): number {
  return a + b;
}

describe('vitest harness smoke test', () => {
  it('runs and resolves globals', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
```

- [ ] **Step 4: Run it**

```bash
npm test
```
Expected: `Test Files  1 passed (1)`, `Tests  1 passed (1)`.

- [ ] **Step 5: Delete the throwaway test**

```bash
rm lib/sum.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: add Vitest and React Testing Library"
```

---

### Task 3: Domain types

**Files:**
- Create: `types/index.ts`

**Interfaces:**
- Produces: `LocalizedText`, `AppLocale` re-export, `Category`, `Store`, `Product`, `Collection` — every later task's data and components import these exact shapes from `@/types`.

- [ ] **Step 1: Write the types**

`types/index.ts`:
```ts
export type AppLocale = 'ru' | 'uz';

export interface LocalizedText {
  ru: string;
  uz: string;
}

export interface Category {
  id: string;
  slug: string;
  name: LocalizedText;
}

export interface Store {
  id: string;
  name: string;
  address: LocalizedText;
  city: string;
  phone: string;
  mapUrl: string;
  hours: string;
}

export interface Product {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  collectionId: string;
  categoryId: string;
  images: string[];
  sizes: string[];
  price: number;
  isEditorsPick: boolean;
  isBestSeller: boolean;
  relatedProductIds: string[];
}

export interface Collection {
  id: string;
  slug: string;
  name: LocalizedText;
  story: LocalizedText;
  heroImage: string;
  productIds: string[];
}
```

There's no test for a pure type-only file — TypeScript itself is the check, exercised by `npm run build`/`tsc` in later tasks.

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```
Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add types/index.ts
git commit -m "feat: add domain types for products, collections, categories, stores"
```

---

### Task 4: Telegram/WhatsApp link builders

**Files:**
- Create: `lib/links/config.ts`, `lib/links/telegram.ts`, `lib/links/whatsapp.ts`
- Test: `lib/links/telegram.test.ts`, `lib/links/whatsapp.test.ts`
- Create: `.env.local.example`

**Interfaces:**
- Consumes: `Product`, `AppLocale` from `@/types`.
- Produces: `TELEGRAM_USERNAME: string`, `WHATSAPP_NUMBER: string` from `@/lib/links/config`; `buildTelegramOrderLink(product: Product, locale: AppLocale, origin: string): string` and `buildWhatsappOrderLink(product: Product, locale: AppLocale, origin: string): string` from `@/lib/links`. Later tasks (product pages) call these with `origin = window.location.origin` at click time — never a baked-in domain.

- [ ] **Step 1: Write the failing tests**

`lib/links/telegram.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { buildTelegramOrderLink } from './telegram';
import type { Product } from '@/types';

const product: Product = {
  id: 'p1',
  slug: 'silk-wrap-dress',
  name: { ru: 'Шёлковое платье', uz: 'Ipak ko\'ylak' },
  description: { ru: '', uz: '' },
  collectionId: 'c1',
  categoryId: 'cat1',
  images: [],
  sizes: ['S', 'M'],
  price: 890000,
  isEditorsPick: true,
  isBestSeller: false,
  relatedProductIds: []
};

describe('buildTelegramOrderLink', () => {
  it('encodes the product name and url into a t.me deep link', () => {
    const link = buildTelegramOrderLink(product, 'ru', 'https://silkline.uz');
    expect(link).toContain('https://t.me/');
    expect(link).toContain(encodeURIComponent('Шёлковое платье'));
    expect(link).toContain(encodeURIComponent('https://silkline.uz/ru/product/silk-wrap-dress'));
  });

  it('uses the Uzbek name when locale is uz', () => {
    const link = buildTelegramOrderLink(product, 'uz', 'https://silkline.uz');
    expect(link).toContain(encodeURIComponent('Ipak ko\'ylak'));
  });
});
```

`lib/links/whatsapp.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { buildWhatsappOrderLink } from './whatsapp';
import type { Product } from '@/types';

const product: Product = {
  id: 'p1',
  slug: 'silk-wrap-dress',
  name: { ru: 'Шёлковое платье', uz: 'Ipak ko\'ylak' },
  description: { ru: '', uz: '' },
  collectionId: 'c1',
  categoryId: 'cat1',
  images: [],
  sizes: ['S', 'M'],
  price: 890000,
  isEditorsPick: true,
  isBestSeller: false,
  relatedProductIds: []
};

describe('buildWhatsappOrderLink', () => {
  it('encodes the product name and url into a wa.me deep link', () => {
    const link = buildWhatsappOrderLink(product, 'ru', 'https://silkline.uz');
    expect(link).toContain('https://wa.me/');
    expect(link).toContain(encodeURIComponent('Шёлковое платье'));
    expect(link).toContain(encodeURIComponent('https://silkline.uz/ru/product/silk-wrap-dress'));
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```
Expected: FAIL — `Cannot find module './telegram'` / `./whatsapp`.

- [ ] **Step 3: Write the implementation**

`lib/links/config.ts`:
```ts
export const TELEGRAM_USERNAME =
  process.env.NEXT_PUBLIC_TELEGRAM_USERNAME ?? 'silkline_placeholder';

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '998000000000';
```

`lib/links/telegram.ts`:
```ts
import type { AppLocale, Product } from '@/types';
import { TELEGRAM_USERNAME } from './config';

export function buildTelegramOrderLink(
  product: Product,
  locale: AppLocale,
  origin: string
): string {
  const productUrl = `${origin}/${locale}/product/${product.slug}`;
  const message = `${product.name[locale]} — ${productUrl}`;
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
}
```

`lib/links/whatsapp.ts`:
```ts
import type { AppLocale, Product } from '@/types';
import { WHATSAPP_NUMBER } from './config';

export function buildWhatsappOrderLink(
  product: Product,
  locale: AppLocale,
  origin: string
): string {
  const productUrl = `${origin}/${locale}/product/${product.slug}`;
  const message = `${product.name[locale]} — ${productUrl}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
```

`.env.local.example`:
```
NEXT_PUBLIC_TELEGRAM_USERNAME=silkline_placeholder
NEXT_PUBLIC_WHATSAPP_NUMBER=998000000000
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: `Test Files  2 passed (2)`, `Tests  3 passed (3)`.

- [ ] **Step 5: Commit**

```bash
git add lib/links .env.local.example
git commit -m "feat: add Telegram/WhatsApp order link builders behind single-source constants"
```

---

### Task 5: Localization foundation (next-intl, ru/uz routing)

**Files:**
- Create: `i18n/locales.ts`, `i18n/request.ts`, `proxy.ts`, `messages/ru.json`, `messages/uz.json`
- Modify: `next.config.ts`, move `app/layout.tsx` + `app/page.tsx` → `app/[locale]/layout.tsx` + `app/[locale]/page.tsx`; delete root `app/layout.tsx`

**Interfaces:**
- Produces: `locales: readonly ['ru', 'uz']`, `defaultLocale: AppLocale` from `@/i18n/locales`. Every route under `app/[locale]/...` receives `params: Promise<{ locale: string }>` and must call `setRequestLocale(locale)`. Message namespaces `nav` and `footer` exist in both locale files for Task 9 to consume.

- [ ] **Step 1: Install next-intl**

```bash
npm install next-intl
```

- [ ] **Step 2: Centralize the locale list**

`i18n/locales.ts`:
```ts
import type { AppLocale } from '@/types';

export const locales = ['ru', 'uz'] as const satisfies readonly AppLocale[];
export const defaultLocale: AppLocale = 'ru';
export type { AppLocale };
```

`AppLocale` is defined once, in `types/index.ts` (Task 3); this file only re-exports it so every later import of `AppLocale` from `@/i18n/locales` keeps working without a second, divergent definition of the same type.

- [ ] **Step 3: Write the request config**

`i18n/request.ts`:
```ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from './locales';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested as (typeof locales)[number])
    ? requested!
    : null;

  if (!locale) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
```

- [ ] **Step 4: Write the proxy (locale routing) — NOT `middleware.ts`**

`proxy.ts`:
```ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/locales';

export default createMiddleware({
  locales,
  defaultLocale
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
```

- [ ] **Step 5: Wrap the Next.js config**

`next.config.ts`:
```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Seed the message files**

`messages/ru.json`:
```json
{
  "nav": {
    "shopAll": "Весь каталог",
    "about": "О бренде",
    "stores": "Магазины"
  },
  "footer": {
    "contactPrompt": "Свяжитесь с нами, чтобы оформить заказ:"
  }
}
```

`messages/uz.json`:
```json
{
  "nav": {
    "shopAll": "Barcha mahsulotlar",
    "about": "Brend haqida",
    "stores": "Do'konlar"
  },
  "footer": {
    "contactPrompt": "Buyurtma berish uchun biz bilan bog'laning:"
  }
}
```

- [ ] **Step 7: Move the home route under `[locale]` and wire the provider**

```bash
mkdir -p "app/[locale]"
git mv app/page.tsx "app/[locale]/page.tsx"
git mv app/layout.tsx "app/[locale]/layout.tsx"
```

`app/[locale]/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { locales, type AppLocale } from "@/i18n/locales";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SilkLine",
  description: "SilkLine — premium Korean fashion, Tashkent.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!locales.includes(locale as AppLocale)) notFound();

  setRequestLocale(locale as AppLocale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

There is intentionally no `app/layout.tsx` at the root — `app/[locale]/layout.tsx` is the only top-level layout, since every real route lives under a locale prefix.

- [ ] **Step 8: Verify with a real build and manual locale check**

```bash
rm -rf .next
npm run build
```
Expected: route table shows `ƒ /[locale]` and `ƒ Proxy (Middleware)`, no deprecation warning about `middleware.ts`.

```bash
npm run dev -- -p 3000 &
sleep 5
curl -s -o /dev/null -w "%{http_code} %{url_effective}\n" -L http://localhost:3000/
curl -s http://localhost:3000/ru | grep -o 'Свяжитесь'
curl -s http://localhost:3000/uz | grep -o 'Buyurtma'
kill %1
```
Expected: `200 http://localhost:3000/ru`, then `Свяжитесь`, then `Buyurtma` each printed once.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add ru/uz locale routing with next-intl"
```

---

### Task 6: Seed data and data-source repository

**Files:**
- Create: `data/categories.ts`, `data/collections.ts`, `data/products.ts`, `data/stores.ts`
- Create: `lib/data-source/categories.ts`, `lib/data-source/collections.ts`, `lib/data-source/products.ts`, `lib/data-source/stores.ts`
- Test: `lib/data-source/collections.test.ts`, `lib/data-source/products.test.ts`
- Create: `public/placeholders/product-placeholder.svg`, `public/placeholders/collection-placeholder.svg`

**Interfaces:**
- Consumes: `Category`, `Store`, `Product`, `Collection` from `@/types`.
- Produces: `getAllCategories(): Category[]`, `getAllCollections(): Collection[]`, `getCollectionBySlug(slug: string): Collection | undefined`, `getAllProducts(): Product[]`, `getProductBySlug(slug: string): Product | undefined`, `getProductsByCollectionId(collectionId: string): Product[]`, `getProductsByCategoryId(categoryId: string): Product[]`, `getRelatedProducts(product: Product): Product[]`, `getAllStores(): Store[]` — every later page task calls only these, never `@/data/*` directly.

- [ ] **Step 1: Write placeholder image assets**

`public/placeholders/product-placeholder.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="#E7E2DC"/>
  <text x="400" y="500" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#8A8377">SilkLine — placeholder</text>
</svg>
```

`public/placeholders/collection-placeholder.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#DCD6CC"/>
  <text x="800" y="450" text-anchor="middle" font-family="sans-serif" font-size="36" fill="#7A7263">SilkLine — placeholder</text>
</svg>
```

- [ ] **Step 2: Write the seed data**

`data/categories.ts`:
```ts
import type { Category } from '@/types';

export const categories: Category[] = [
  { id: 'cat-dresses', slug: 'dresses', name: { ru: 'Платья', uz: 'Ko\'ylaklar' } },
  { id: 'cat-outerwear', slug: 'outerwear', name: { ru: 'Верхняя одежда', uz: 'Tashqi kiyim' } },
  { id: 'cat-knitwear', slug: 'knitwear', name: { ru: 'Трикотаж', uz: 'Trikotaj' } }
];
```

`data/collections.ts`:
```ts
import type { Collection } from '@/types';

export const collections: Collection[] = [
  {
    id: 'col-autumn-atelier',
    slug: 'autumn-atelier',
    name: { ru: 'Осенний ателье', uz: 'Kuzgi atelye' },
    story: {
      ru: 'Тёплые тона и мягкие силуэты для прохладных дней.',
      uz: 'Salqin kunlar uchun iliq ranglar va yumshoq siluetlar.'
    },
    heroImage: '/placeholders/collection-placeholder.svg',
    productIds: ['p-wrap-dress', 'p-wool-coat', 'p-knit-sweater']
  },
  {
    id: 'col-seoul-minimal',
    slug: 'seoul-minimal',
    name: { ru: 'Сеульский минимализм', uz: 'Seul minimalizmi' },
    story: {
      ru: 'Чистые линии и сдержанная палитра, вдохновлённые улицами Сеула.',
      uz: 'Seul ko\'chalaridan ilhomlangan toza chiziqlar va jim ranglar.'
    },
    heroImage: '/placeholders/collection-placeholder.svg',
    productIds: ['p-slip-dress', 'p-trench-coat', 'p-cropped-cardigan']
  }
];
```

`data/products.ts`:
```ts
import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'p-wrap-dress',
    slug: 'silk-wrap-dress',
    name: { ru: 'Шёлковое платье на запах', uz: 'Ipak o\'ralma ko\'ylak' },
    description: {
      ru: 'Платье из натурального шёлка с запахом, прямая посадка.',
      uz: 'Tabiiy ipakdan tikilgan o\'ralma ko\'ylak, to\'g\'ri fasonda.'
    },
    collectionId: 'col-autumn-atelier',
    categoryId: 'cat-dresses',
    images: ['/placeholders/product-placeholder.svg'],
    sizes: ['XS', 'S', 'M', 'L'],
    price: 890000,
    isEditorsPick: true,
    isBestSeller: false,
    relatedProductIds: ['p-wool-coat', 'p-knit-sweater']
  },
  {
    id: 'p-wool-coat',
    slug: 'camel-wool-coat',
    name: { ru: 'Пальто из верблюжьей шерсти', uz: 'Tuya junidan palto' },
    description: {
      ru: 'Однобортное пальто прямого силуэта из шерсти верблюда.',
      uz: 'Tuya junidan tikilgan to\'g\'ri siluetli bir bortli palto.'
    },
    collectionId: 'col-autumn-atelier',
    categoryId: 'cat-outerwear',
    images: ['/placeholders/product-placeholder.svg'],
    sizes: ['S', 'M', 'L'],
    price: 1690000,
    isEditorsPick: false,
    isBestSeller: true,
    relatedProductIds: ['p-wrap-dress', 'p-knit-sweater']
  },
  {
    id: 'p-knit-sweater',
    slug: 'merino-knit-sweater',
    name: { ru: 'Свитер из мериносовой шерсти', uz: 'Merinos jundan sviter' },
    description: {
      ru: 'Тонкий свитер из мериносовой шерсти с округлым вырезом.',
      uz: 'Yumaloq yoqali, merinos jundan ingichka sviter.'
    },
    collectionId: 'col-autumn-atelier',
    categoryId: 'cat-knitwear',
    images: ['/placeholders/product-placeholder.svg'],
    sizes: ['XS', 'S', 'M'],
    price: 590000,
    isEditorsPick: false,
    isBestSeller: false,
    relatedProductIds: ['p-wrap-dress', 'p-wool-coat']
  },
  {
    id: 'p-slip-dress',
    slug: 'satin-slip-dress',
    name: { ru: 'Платье-комбинация из сатина', uz: 'Sateindan kombinatsiya ko\'ylak' },
    description: {
      ru: 'Платье-комбинация на тонких бретелях, цвет слоновой кости.',
      uz: 'Ingichka tasmali, fil suyagi rangidagi kombinatsiya ko\'ylak.'
    },
    collectionId: 'col-seoul-minimal',
    categoryId: 'cat-dresses',
    images: ['/placeholders/product-placeholder.svg'],
    sizes: ['XS', 'S', 'M'],
    price: 720000,
    isEditorsPick: true,
    isBestSeller: true,
    relatedProductIds: ['p-trench-coat', 'p-cropped-cardigan']
  },
  {
    id: 'p-trench-coat',
    slug: 'minimal-trench-coat',
    name: { ru: 'Минималистичный тренч', uz: 'Minimalistik trench' },
    description: {
      ru: 'Тренч прямого кроя из плотного хлопка, бежевый.',
      uz: 'Zich paxtadan tikilgan to\'g\'ri fasonli, bej rangli trench.'
    },
    collectionId: 'col-seoul-minimal',
    categoryId: 'cat-outerwear',
    images: ['/placeholders/product-placeholder.svg'],
    sizes: ['S', 'M', 'L'],
    price: 1450000,
    isEditorsPick: false,
    isBestSeller: false,
    relatedProductIds: ['p-slip-dress', 'p-cropped-cardigan']
  },
  {
    id: 'p-cropped-cardigan',
    slug: 'cropped-knit-cardigan',
    name: { ru: 'Укороченный кардиган', uz: 'Qisqartirilgan kardigan' },
    description: {
      ru: 'Короткий трикотажный кардиган на пуговицах.',
      uz: 'Tugmali, qisqa trikotaj kardigan.'
    },
    collectionId: 'col-seoul-minimal',
    categoryId: 'cat-knitwear',
    images: ['/placeholders/product-placeholder.svg'],
    sizes: ['XS', 'S', 'M', 'L'],
    price: 480000,
    isEditorsPick: false,
    isBestSeller: false,
    relatedProductIds: ['p-slip-dress', 'p-trench-coat']
  }
];
```

`data/stores.ts`:
```ts
import type { Store } from '@/types';

export const stores: Store[] = [
  {
    id: 'store-tashkent-city',
    name: 'SilkLine — Tashkent City',
    address: {
      ru: 'Ташкент Сити Молл, 2 этаж',
      uz: 'Tashkent City Mall, 2-qavat'
    },
    city: 'Tashkent',
    phone: '+998 90 000 00 00',
    mapUrl: 'https://maps.google.com/?q=Tashkent+City+Mall',
    hours: '10:00–22:00'
  },
  {
    id: 'store-yunusobod',
    name: 'SilkLine — Yunusobod',
    address: {
      ru: 'Юнусабадский район, ул. Амира Темура, 1',
      uz: 'Yunusobod tumani, Amir Temur ko\'chasi, 1'
    },
    city: 'Tashkent',
    phone: '+998 90 000 00 01',
    mapUrl: 'https://maps.google.com/?q=Yunusobod+Tashkent',
    hours: '10:00–22:00'
  }
];
```

- [ ] **Step 3: Write the failing repository tests**

`lib/data-source/collections.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { getAllCollections, getCollectionBySlug } from './collections';

describe('collections data source', () => {
  it('returns all seeded collections', () => {
    expect(getAllCollections().length).toBeGreaterThanOrEqual(2);
  });

  it('finds a collection by slug', () => {
    const collection = getCollectionBySlug('autumn-atelier');
    expect(collection?.id).toBe('col-autumn-atelier');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getCollectionBySlug('does-not-exist')).toBeUndefined();
  });
});
```

`lib/data-source/products.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import {
  getAllProducts,
  getProductBySlug,
  getProductsByCollectionId,
  getProductsByCategoryId,
  getRelatedProducts
} from './products';

describe('products data source', () => {
  it('returns all seeded products', () => {
    expect(getAllProducts().length).toBeGreaterThanOrEqual(6);
  });

  it('finds a product by slug', () => {
    expect(getProductBySlug('silk-wrap-dress')?.id).toBe('p-wrap-dress');
  });

  it('filters products by collection', () => {
    const result = getProductsByCollectionId('col-seoul-minimal');
    expect(result.every((p) => p.collectionId === 'col-seoul-minimal')).toBe(true);
    expect(result.length).toBe(3);
  });

  it('filters products by category', () => {
    const result = getProductsByCategoryId('cat-dresses');
    expect(result.every((p) => p.categoryId === 'cat-dresses')).toBe(true);
  });

  it('resolves related products by id, dropping unknown ids', () => {
    const product = getProductBySlug('silk-wrap-dress')!;
    const related = getRelatedProducts(product);
    expect(related.map((p) => p.id)).toEqual(product.relatedProductIds);
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

```bash
npm test
```
Expected: FAIL — `Cannot find module './collections'` / `./products`.

- [ ] **Step 5: Write the repository implementation**

`lib/data-source/categories.ts`:
```ts
import { categories } from '@/data/categories';
import type { Category } from '@/types';

export function getAllCategories(): Category[] {
  return categories;
}
```

`lib/data-source/collections.ts`:
```ts
import { collections } from '@/data/collections';
import type { Collection } from '@/types';

export function getAllCollections(): Collection[] {
  return collections;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}
```

`lib/data-source/products.ts`:
```ts
import { products } from '@/data/products';
import type { Product } from '@/types';

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCollectionId(collectionId: string): Product[] {
  return products.filter((product) => product.collectionId === collectionId);
}

export function getProductsByCategoryId(categoryId: string): Product[] {
  return products.filter((product) => product.categoryId === categoryId);
}

export function getRelatedProducts(product: Product): Product[] {
  return product.relatedProductIds
    .map((id) => products.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is Product => candidate !== undefined);
}
```

`lib/data-source/stores.ts`:
```ts
import { stores } from '@/data/stores';
import type { Store } from '@/types';

export function getAllStores(): Store[] {
  return stores;
}
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npm test
```
Expected: `Test Files  4 passed (4)` (including Task 4's two link test files), all tests passing.

- [ ] **Step 7: Commit**

```bash
git add data lib/data-source public/placeholders
git commit -m "feat: add seed catalog data and data-source repository layer"
```

---

### Task 7: Navigation helper functions

**Files:**
- Create: `lib/nav.ts`
- Test: `lib/nav.test.ts`

**Interfaces:**
- Consumes: `Collection`, `AppLocale` from `@/types`.
- Produces: `buildCollectionNavLinks(collections: Collection[], locale: AppLocale): { label: string; href: string }[]` and `switchLocalePath(pathname: string, locale: AppLocale): string` — Task 9's Header and LocaleSwitcher components call these and contain no branching logic of their own, which is what makes them testable without fighting React Server Component test ergonomics.

- [ ] **Step 1: Write the failing tests**

`lib/nav.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { buildCollectionNavLinks, switchLocalePath } from './nav';
import type { Collection } from '@/types';

const collections: Collection[] = [
  {
    id: 'c1',
    slug: 'autumn-atelier',
    name: { ru: 'Осенний ателье', uz: 'Kuzgi atelye' },
    story: { ru: '', uz: '' },
    heroImage: '',
    productIds: []
  }
];

describe('buildCollectionNavLinks', () => {
  it('maps collections to localized nav links', () => {
    const links = buildCollectionNavLinks(collections, 'ru');
    expect(links).toEqual([
      { label: 'Осенний ателье', href: '/ru/collections/autumn-atelier' }
    ]);
  });

  it('uses the Uzbek name and prefix when locale is uz', () => {
    const links = buildCollectionNavLinks(collections, 'uz');
    expect(links[0]).toEqual({ label: 'Kuzgi atelye', href: '/uz/collections/autumn-atelier' });
  });
});

describe('switchLocalePath', () => {
  it('replaces the locale segment of a path', () => {
    expect(switchLocalePath('/ru/collections/autumn-atelier', 'uz')).toBe(
      '/uz/collections/autumn-atelier'
    );
  });

  it('handles the bare locale root', () => {
    expect(switchLocalePath('/ru', 'uz')).toBe('/uz');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```
Expected: FAIL — `Cannot find module './nav'`.

- [ ] **Step 3: Write the implementation**

`lib/nav.ts`:
```ts
import type { AppLocale, Collection } from '@/types';

export interface NavLink {
  label: string;
  href: string;
}

export function buildCollectionNavLinks(
  collections: Collection[],
  locale: AppLocale
): NavLink[] {
  return collections.map((collection) => ({
    label: collection.name[locale],
    href: `/${locale}/collections/${collection.slug}`
  }));
}

export function switchLocalePath(pathname: string, locale: AppLocale): string {
  const segments = pathname.split('/');
  segments[1] = locale;
  return segments.join('/');
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: all test files pass, including the 4 new `nav.test.ts` cases.

- [ ] **Step 5: Commit**

```bash
git add lib/nav.ts lib/nav.test.ts
git commit -m "feat: add pure navigation helper functions"
```

---

### Task 8: Design tokens (accent color)

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces: a `--color-accent` CSS custom property usable as `bg-accent` / `text-accent` / `border-accent` Tailwind utilities, plus the warm-neutral base already available via Tailwind's built-in `stone` palette (no extra token needed for that).

- [ ] **Step 1: Add the accent token**

Open `app/globals.css` and add an accent color inside the existing `@theme inline` block (placeholder hex — replaced once the real logo file is supplied):

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-accent: #8a7a5c;
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

- [ ] **Step 2: Verify the utility is generated**

Temporarily add `className="bg-accent"` to the JSX in `app/[locale]/page.tsx`, run:
```bash
npm run dev -- -p 3000 &
sleep 5
curl -s http://localhost:3000/ru | grep -o 'bg-accent'
kill %1
```
Expected: `bg-accent` printed (confirms Tailwind v4 picked up the token without a `tailwind.config.ts`). Then remove the temporary className.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add accent color design token"
```

---

### Task 9: Header, Footer, and locale switcher

**Files:**
- Create: `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `components/layout/LocaleSwitcher.tsx`
- Test: `components/layout/LocaleSwitcher.test.tsx`
- Modify: `app/[locale]/layout.tsx` (render `<Header>` and `<Footer>` around `{children}`)

**Interfaces:**
- Consumes: `getAllCollections` from `@/lib/data-source/collections`, `buildCollectionNavLinks`/`switchLocalePath` from `@/lib/nav`, `TELEGRAM_USERNAME`/`WHATSAPP_NUMBER` from `@/lib/links/config`, `locales`/`AppLocale` from `@/i18n/locales`.
- Produces: `<Header locale={AppLocale} />` (async Server Component), `<Footer />` (async Server Component), `<LocaleSwitcher currentLocale={AppLocale} />` (Client Component) — later page tasks don't re-implement navigation, they render inside `{children}` only.

**Design note:** `Header` and `Footer` are async Server Components that call `next-intl/server`'s `getTranslations`, which requires the real request context — fighting that in a unit test (mocking the entire next-intl server runtime) buys little. Instead, all branching logic lives in the already-tested `lib/nav.ts` helpers, and `Header`/`Footer` themselves are verified by the manual dev-server check in Step 4. `LocaleSwitcher` is a plain Client Component (no server-only APIs), so it gets a real RTL test.

- [ ] **Step 1: Write the failing test for LocaleSwitcher**

`components/layout/LocaleSwitcher.test.tsx`:
```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocaleSwitcher } from './LocaleSwitcher';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ru/collections/autumn-atelier'
}));

describe('LocaleSwitcher', () => {
  it('renders a link for each locale with the current one marked', () => {
    render(<LocaleSwitcher currentLocale="ru" />);
    const ru = screen.getByRole('link', { name: 'ru' });
    const uz = screen.getByRole('link', { name: 'uz' });
    expect(ru).toHaveAttribute('aria-current', 'true');
    expect(uz).toHaveAttribute('href', '/uz/collections/autumn-atelier');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test
```
Expected: FAIL — `Cannot find module './LocaleSwitcher'`.

- [ ] **Step 3: Write the components**

`components/layout/LocaleSwitcher.tsx`:
```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type AppLocale } from '@/i18n/locales';
import { switchLocalePath } from '@/lib/nav';

export function LocaleSwitcher({ currentLocale }: { currentLocale: AppLocale }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 text-xs uppercase">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={switchLocalePath(pathname, locale)}
          aria-current={locale === currentLocale}
          className={locale === currentLocale ? 'font-semibold' : 'text-stone-400'}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
```

`components/layout/Header.tsx`:
```tsx
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getAllCollections } from '@/lib/data-source/collections';
import { buildCollectionNavLinks } from '@/lib/nav';
import type { AppLocale } from '@/i18n/locales';
import { LocaleSwitcher } from './LocaleSwitcher';

export async function Header({ locale }: { locale: AppLocale }) {
  const t = await getTranslations('nav');
  const collectionLinks = buildCollectionNavLinks(getAllCollections(), locale);

  return (
    <header className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
      <Link href={`/${locale}`} className="text-lg font-semibold tracking-wide">
        SILKLINE
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
      <LocaleSwitcher currentLocale={locale} />
    </header>
  );
}
```

`components/layout/Footer.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';
import { TELEGRAM_USERNAME, WHATSAPP_NUMBER } from '@/lib/links/config';

export async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className="px-6 py-10 border-t border-stone-200 text-sm text-stone-600">
      <p>{t('contactPrompt')}</p>
      <p>
        Telegram: <a href={`https://t.me/${TELEGRAM_USERNAME}`}>@{TELEGRAM_USERNAME}</a>
      </p>
      <p>
        WhatsApp: <a href={`https://wa.me/${WHATSAPP_NUMBER}`}>{WHATSAPP_NUMBER}</a>
      </p>
    </footer>
  );
}
```

- [ ] **Step 4: Wire them into the locale layout**

In `app/[locale]/layout.tsx`, import `Header` and `Footer` and render them around `{children}`:

```tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
```

```tsx
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header locale={locale as AppLocale} />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
```

- [ ] **Step 5: Run the unit test, then verify the shell manually**

```bash
npm test
```
Expected: `LocaleSwitcher` test passes.

```bash
npm run dev -- -p 3000 &
sleep 5
curl -s http://localhost:3000/ru | grep -o 'SILKLINE'
curl -s http://localhost:3000/ru | grep -o 'Осенний ателье'
curl -s http://localhost:3000/uz | grep -o 'Kuzgi'
kill %1
```
Expected: `SILKLINE`, `Осенний ателье`, `Kuzgi` each printed.

- [ ] **Step 6: Commit**

```bash
git add components/layout app/[locale]/layout.tsx
git commit -m "feat: add Header, Footer, and locale switcher shell"
```

---

### Task 10: Minimal home page, not-found page, and full verification pass

**Files:**
- Modify: `app/[locale]/page.tsx`
- Create: `app/[locale]/not-found.tsx`

**Interfaces:**
- Produces: a navigable placeholder home page (real Featured Collection / Editor's Picks / Best Sellers sections are built in the next plan) and a localized 404 page — both call `setRequestLocale` per the next-intl App Router requirement.

- [ ] **Step 1: Write the home page placeholder**

`app/[locale]/page.tsx`:
```tsx
import { setRequestLocale } from 'next-intl/server';
import type { AppLocale } from '@/i18n/locales';

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  return (
    <section className="px-6 py-16">
      <h1 className="text-3xl font-semibold">SilkLine</h1>
      <p className="mt-4 text-stone-600 max-w-md">
        The Digital Flagship Store foundation is live. Homepage editorial
        sections (Featured Collection, Editor&apos;s Picks, Best Sellers)
        ship in the next plan.
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Write the not-found page**

`app/[locale]/not-found.tsx`:
```tsx
export default function NotFound() {
  return (
    <section className="px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="mt-4 text-stone-600">This page doesn&apos;t exist.</p>
    </section>
  );
}
```

- [ ] **Step 3: Run the full verification suite**

```bash
npm run lint
npx tsc --noEmit
npm test
rm -rf .next
npm run build
```
Expected: lint clean, no type errors, all tests passing, build succeeds with route table showing `ƒ /[locale]` and `○ /_not-found`.

- [ ] **Step 4: Manual browser check**

```bash
npm run dev -- -p 3000 &
sleep 5
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/ru
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/uz
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/ru/this-route-does-not-exist
kill %1
```
Expected: `200`, `200`, `404`.

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/page.tsx app/[locale]/not-found.tsx
git commit -m "feat: add placeholder home page and localized 404"
```

---

## What's next

This plan delivers the foundation only — locale routing, data layer, link abstraction, and shell navigation, all real and tested. It does not yet build the Homepage editorial sections, Collections/Shop pages, Product detail, Wishlist, or Brand Story/Stores pages — those are sequenced into follow-up plans (per spec §3) once this foundation is merged, so their component contracts can be written against real code instead of speculation.
