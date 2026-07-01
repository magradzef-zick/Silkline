# Brand Story, Stores & Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the remaining V1 pages (`/about`, `/stores`), localize the 404 page, add a SEO sitemap and robots.txt, create a minimal OG default image placeholder, and update `PROJECT_MEMORY.md` to reflect the completed V1 — making `main` a complete, shippable V1 baseline.

**Architecture:** All new pages are Server Components following the same pattern as existing pages (Server Component shell → `generateMetadata` → `generateStaticParams` where applicable → page JSX). The `StoreCard` UI primitive is the only new component. No new npm dependencies are introduced.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, next-intl 4.x, Vitest + RTL. No Framer Motion.

## Global Constraints

- Bilingual: Russian (`ru`, default) and Uzbek (`uz`) — every user-facing string ships in both.
- No `tailwind.config.ts` — all tokens in `app/globals.css` `@theme inline`.
- `lib/data-source/*` is the only code that imports `@/data/*`.
- Server Components must not contain filtering or sorting logic that belongs in the repository layer.
- Every commit: `npm run lint && npx tsc --noEmit && npm test` must pass.
- Typography finalization (font pairing), color palette finalization, and Framer Motion animations remain open items until real brand assets are provided — they are explicitly **not** in scope for this plan.

---

## File Map

```
messages/ru.json                    MOD  — add about.*, stores.*, notFound.* keys
messages/uz.json                    MOD  — same, Uzbek translations
components/ui/StoreCard.tsx         NEW  — server component, single store display
components/ui/StoreCard.test.tsx    NEW  — RTL tests
app/[locale]/about/page.tsx         NEW  — brand story page
app/[locale]/stores/page.tsx        NEW  — store locations page
app/[locale]/not-found.tsx          MOD  — localize with next-intl
app/robots.ts                       NEW  — robots.txt via Next.js MetadataRoute
app/sitemap.ts                      NEW  — sitemap.xml via Next.js MetadataRoute
public/og-default.svg               NEW  — minimal OG image placeholder
PROJECT_MEMORY.md                   MOD  — reflect V1 complete milestone
```

---

### Task 1: i18n additions for about, stores, and not-found pages

**Files:**
- Modify: `messages/ru.json`
- Modify: `messages/uz.json`

**Interfaces:**
- Produces new namespaces consumed by Tasks 2–5:
  - `about.*` — brand story page strings
  - `stores.*` — store locations page strings
  - `notFound.*` — localized 404 page strings

No tests (static content). Verification: `npm test` passes, `npx tsc --noEmit` passes.

- [ ] **Step 1: Update `messages/ru.json`**

Add these namespaces to the existing file, preserving all current content:
```json
{
  "about": {
    "title": "О нас — SilkLine",
    "heading": "О нас",
    "story": "SilkLine — кураторский магазин корейской женской одежды в Ташкенте. Мы отбираем вещи, которые сочетают корейскую эстетику с современным взглядом на стиль.",
    "missionLabel": "Наша миссия",
    "mission": "Сделать премиальную корейскую моду доступной для покупателей в Узбекистане — без компромиссов в качестве и стиле.",
    "viewCollections": "Смотреть коллекции"
  },
  "stores": {
    "title": "Магазины — SilkLine",
    "heading": "Наши магазины",
    "hoursLabel": "Часы работы",
    "phoneLabel": "Телефон",
    "mapLink": "Открыть на карте"
  },
  "notFound": {
    "code": "404",
    "heading": "Страница не найдена",
    "description": "Такой страницы не существует.",
    "backHome": "На главную"
  }
}
```

- [ ] **Step 2: Update `messages/uz.json`**

Add the same namespaces with Uzbek translations:
```json
{
  "about": {
    "title": "Biz haqimizda — SilkLine",
    "heading": "Biz haqimizda",
    "story": "SilkLine — Toshkentdagi Koreys ayollar kiyimlarining tanlov do'koni. Biz Koreys estetikasi va zamonaviy uslubni birlashtirgan kiyimlarni tanlaymiz.",
    "missionLabel": "Bizning missiyamiz",
    "mission": "Sifat va uslubda murosasiz Koreys premium modani O'zbekiston xaridorlariga yetkazib berish.",
    "viewCollections": "Kolleksiyalarni ko'rish"
  },
  "stores": {
    "title": "Do'konlar — SilkLine",
    "heading": "Bizning do'konlarimiz",
    "hoursLabel": "Ish vaqti",
    "phoneLabel": "Telefon",
    "mapLink": "Xaritada ochish"
  },
  "notFound": {
    "code": "404",
    "heading": "Sahifa topilmadi",
    "description": "Bunday sahifa mavjud emas.",
    "backHome": "Bosh sahifaga"
  }
}
```

- [ ] **Step 3: Verify**

```bash
npm test && npx tsc --noEmit
```
Expected: all tests pass, no type errors.

- [ ] **Step 4: Commit**

```bash
git add messages/
git commit -m "feat: add about, stores, and notFound i18n keys"
```

---

### Task 2: `StoreCard` component

**Files:**
- Create: `components/ui/StoreCard.tsx`
- Create: `components/ui/StoreCard.test.tsx`

**Interfaces:**
- Consumes: `Store` from `@/types`, `AppLocale` from `@/i18n/locales`, i18n strings via `useTranslations('stores')`
- Wait — `StoreCard` is a Server Component that calls `getTranslations('stores')` from `next-intl/server`. This makes it an `async` Server Component.
- Produces: `<StoreCard store={Store} locale={AppLocale} />` — renders store name, localized address, hours, phone link, map link

Testing an async Server Component that calls `getTranslations` requires mocking `next-intl/server`. The most practical approach: test a pure `StoreCardContent` helper (all the rendering logic) separately from the async data-fetch, OR mock `next-intl/server` in the test. We'll mock `next-intl/server` as the plan consistently does.

- [ ] **Step 1: Write the failing tests**

`components/ui/StoreCard.test.tsx`:
```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoreCard } from './StoreCard';
import type { Store } from '@/types';

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
}));

const store: Store = {
  id: 'store-1',
  name: 'SilkLine — Test',
  address: { ru: 'ул. Тестовая, 1', uz: "Test ko'chasi, 1" },
  city: 'Tashkent',
  phone: '+998 90 000 00 00',
  mapUrl: 'https://maps.google.com/?q=test',
  hours: '10:00–22:00',
};

describe('StoreCard', () => {
  it('renders the store name', async () => {
    const { container } = render(await StoreCard({ store, locale: 'ru' }));
    expect(container.textContent).toContain('SilkLine — Test');
  });

  it('renders the localized address in ru', async () => {
    const { container } = render(await StoreCard({ store, locale: 'ru' }));
    expect(container.textContent).toContain('ул. Тестовая, 1');
  });

  it('renders the localized address in uz', async () => {
    const { container } = render(await StoreCard({ store, locale: 'uz' }));
    expect(container.textContent).toContain("Test ko'chasi, 1");
  });

  it('renders a tel: link for the phone number', async () => {
    const { container } = render(await StoreCard({ store, locale: 'ru' }));
    const phoneLink = container.querySelector('a[href^="tel:"]');
    expect(phoneLink).not.toBeNull();
  });

  it('renders a link to the map', async () => {
    const { container } = render(await StoreCard({ store, locale: 'ru' }));
    const mapLink = container.querySelector(`a[href="${store.mapUrl}"]`);
    expect(mapLink).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- components/ui/StoreCard.test.tsx
```
Expected: `Cannot find module './StoreCard'`

- [ ] **Step 3: Implement**

`components/ui/StoreCard.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';
import type { AppLocale, Store } from '@/types';

interface StoreCardProps {
  store: Store;
  locale: AppLocale;
}

export async function StoreCard({ store, locale }: StoreCardProps) {
  const t = await getTranslations('stores');

  return (
    <article className="border border-stone-200 p-6">
      <h2 className="text-base font-medium tracking-wide">{store.name}</h2>
      <p className="mt-2 text-sm text-stone-600">{store.address[locale]}</p>

      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="text-xs tracking-widest uppercase text-stone-400">{t('hoursLabel')}</dt>
          <dd className="mt-0.5 text-stone-700">{store.hours}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-widest uppercase text-stone-400">{t('phoneLabel')}</dt>
          <dd className="mt-0.5">
            <a
              href={`tel:${store.phone.replace(/\s/g, '')}`}
              className="text-stone-700 hover:text-stone-900 transition-colors"
            >
              {store.phone}
            </a>
          </dd>
        </div>
      </dl>

      <a
        href={store.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-xs tracking-widest uppercase border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors"
      >
        {t('mapLink')}
      </a>
    </article>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- components/ui/StoreCard.test.tsx
```
Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add components/ui/StoreCard.tsx components/ui/StoreCard.test.tsx
git commit -m "feat: add StoreCard component"
```

---

### Task 3: Brand Story page (`/about`)

**Files:**
- Create: `app/[locale]/about/page.tsx`

**Interfaces:**
- Consumes: `getTranslations('about')`, `getAllCollections` (for the CTA link), `locales`/`AppLocale`
- `generateMetadata`: localized title, description, hreflang alternates
- No `generateStaticParams` needed — `[locale]` is handled by the parent segment
- Page layout: editorial, minimal — heading, story paragraph, mission statement, CTA to `/collections/[slug]`

- [ ] **Step 1: Create the page**

```bash
mkdir -p "app/[locale]/about"
```

`app/[locale]/about/page.tsx`:
```tsx
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getFeaturedCollection } from '@/lib/data-source/collections';
import { PageContainer } from '@/components/ui/PageContainer';
import { Section } from '@/components/ui/Section';
import { locales, type AppLocale } from '@/i18n/locales';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as AppLocale;
  const t = await getTranslations({ locale: loc, namespace: 'about' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  return {
    title: t('title'),
    alternates: {
      canonical: `${siteUrl}/ru/about`,
      languages: { ru: `${siteUrl}/ru/about`, uz: `${siteUrl}/uz/about` },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as AppLocale)) notFound();
  const loc = locale as AppLocale;
  setRequestLocale(loc);

  const t = await getTranslations('about');
  const featuredCollection = getFeaturedCollection();

  return (
    <PageContainer>
      <Section>
        <div className="max-w-2xl">
          <h1 className="text-3xl lg:text-4xl font-light tracking-wide">
            {t('heading')}
          </h1>
          <p className="mt-8 text-base lg:text-lg text-stone-600 leading-relaxed">
            {t('story')}
          </p>
        </div>

        <div className="mt-16 border-t border-stone-200 pt-10 max-w-2xl">
          <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">
            {t('missionLabel')}
          </p>
          <p className="text-lg lg:text-xl font-light text-stone-700 leading-relaxed">
            {t('mission')}
          </p>
        </div>

        {featuredCollection && (
          <div className="mt-12">
            <Link
              href={`/${loc}/collections/${featuredCollection.slug}`}
              className="text-xs tracking-widest uppercase border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors"
            >
              {t('viewCollections')}
            </Link>
          </div>
        )}
      </Section>
    </PageContainer>
  );
}
```

- [ ] **Step 2: Typecheck and test**

```bash
npx tsc --noEmit && npm test
```
Expected: clean, all tests pass.

- [ ] **Step 3: Build and smoke test**

```bash
rm -rf .next && npm run build 2>&1 | grep -E "about|Compiled|error"
```
Expected: `✓ Compiled successfully`, route table includes `○ /[locale]/about` with `/ru/about` and `/uz/about`.

```bash
(npm run dev -- -p 3200 &) && sleep 8 && \
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3200/ru/about && \
  curl -s http://localhost:3200/ru/about | grep -o 'О нас' | head -1 && \
  curl -s http://localhost:3200/uz/about | grep -o 'Biz haqimizda' | head -1 && \
  lsof -ti:3200 | xargs kill -9 2>/dev/null
```
Expected: `200`, `О нас`, `Biz haqimizda`.

- [ ] **Step 4: Commit**

```bash
git add "app/[locale]/about/"
git commit -m "feat: implement Brand Story (About) page"
```

---

### Task 4: Store Locations page (`/stores`)

**Files:**
- Create: `app/[locale]/stores/page.tsx`

**Interfaces:**
- Consumes: `getAllStores`, `StoreCard`, `getTranslations('stores')`, `locales`/`AppLocale`
- `generateMetadata`: localized title, hreflang alternates
- Renders a grid of `StoreCard` components, one per store

- [ ] **Step 1: Create the page**

```bash
mkdir -p "app/[locale]/stores"
```

`app/[locale]/stores/page.tsx`:
```tsx
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getAllStores } from '@/lib/data-source/stores';
import { StoreCard } from '@/components/ui/StoreCard';
import { PageContainer } from '@/components/ui/PageContainer';
import { Section } from '@/components/ui/Section';
import { locales, type AppLocale } from '@/i18n/locales';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as AppLocale;
  const t = await getTranslations({ locale: loc, namespace: 'stores' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  return {
    title: t('title'),
    alternates: {
      canonical: `${siteUrl}/ru/stores`,
      languages: { ru: `${siteUrl}/ru/stores`, uz: `${siteUrl}/uz/stores` },
    },
  };
}

export default async function StoresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as AppLocale)) notFound();
  const loc = locale as AppLocale;
  setRequestLocale(loc);

  const t = await getTranslations('stores');
  const stores = getAllStores();

  return (
    <PageContainer>
      <Section>
        <h1 className="text-3xl lg:text-4xl font-light tracking-wide mb-10">
          {t('heading')}
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
          {stores.map(store => (
            <StoreCard key={store.id} store={store} locale={loc} />
          ))}
        </div>
      </Section>
    </PageContainer>
  );
}
```

- [ ] **Step 2: Typecheck and test**

```bash
npx tsc --noEmit && npm test
```
Expected: clean, all tests pass.

- [ ] **Step 3: Build and smoke test**

```bash
rm -rf .next && npm run build 2>&1 | grep -E "stores|Compiled|error"
```
Expected: route table includes `○ /[locale]/stores`.

```bash
(npm run dev -- -p 3210 &) && sleep 8 && \
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3210/ru/stores && \
  curl -s http://localhost:3210/ru/stores | grep -o 'Наши магазины' | head -1 && \
  curl -s http://localhost:3210/ru/stores | grep -o 'SilkLine — Tashkent City' | head -1 && \
  lsof -ti:3210 | xargs kill -9 2>/dev/null
```
Expected: `200`, `Наши магазины`, `SilkLine — Tashkent City`.

- [ ] **Step 4: Commit**

```bash
git add "app/[locale]/stores/"
git commit -m "feat: implement Store Locations page"
```

---

### Task 5: Localize the not-found page

**Files:**
- Modify: `app/[locale]/not-found.tsx`

**Interfaces:**
- Changes: converts from a plain synchronous component to an `async` Server Component using `getTranslations('notFound')`; adds a "Back to Home" link via `getLocale()` from `next-intl/server`

No new tests (the not-found page is verified manually and by build).

- [ ] **Step 1: Read the current file**

```bash
cat "app/[locale]/not-found.tsx"
```

- [ ] **Step 2: Replace with localized version**

`app/[locale]/not-found.tsx`:
```tsx
import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  const locale = await getLocale();

  return (
    <section className="px-6 py-24 text-center">
      <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">
        {t('code')}
      </p>
      <h1 className="text-2xl font-light tracking-wide text-stone-800">
        {t('heading')}
      </h1>
      <p className="mt-4 text-stone-500">{t('description')}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 inline-block text-xs tracking-widest uppercase border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors"
      >
        {t('backHome')}
      </Link>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck, test, build**

```bash
npx tsc --noEmit && npm test
```
Expected: clean, all tests pass.

```bash
rm -rf .next && npm run build 2>&1 | grep -E "Compiled|error"
```
Expected: `✓ Compiled successfully`.

Smoke test:
```bash
(npm run dev -- -p 3220 &) && sleep 8 && \
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3220/ru/this-does-not-exist && \
  curl -s http://localhost:3220/ru/this-does-not-exist | grep -o 'Страница не найдена' | head -1 && \
  lsof -ti:3220 | xargs kill -9 2>/dev/null
```
Expected: `404`, `Страница не найдена`.

- [ ] **Step 4: Commit**

```bash
git add "app/[locale]/not-found.tsx"
git commit -m "feat: localize 404 not-found page with next-intl"
```

---

### Task 6: robots.txt, sitemap, and OG placeholder

**Files:**
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Create: `public/og-default.svg`

No tests (static files and pure data functions). Verified by build confirming Next.js generates the routes.

- [ ] **Step 1: Create `app/robots.ts`**

```ts
import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Create `app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/data-source/products';
import { getAllCollections } from '@/lib/data-source/collections';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';
const locales = ['ru', 'uz'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/shop', '/about', '/stores'].flatMap(route =>
    locales.map(locale => ({
      url: `${siteUrl}/${locale}${route}`,
      lastModified: new Date(),
    }))
  );

  const collectionRoutes = getAllCollections().flatMap(c =>
    locales.map(locale => ({
      url: `${siteUrl}/${locale}/collections/${c.slug}`,
      lastModified: new Date(),
    }))
  );

  const productRoutes = getAllProducts().flatMap(p =>
    locales.map(locale => ({
      url: `${siteUrl}/${locale}/product/${p.slug}`,
      lastModified: new Date(),
    }))
  );

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
```

- [ ] **Step 3: Create `public/og-default.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#E7E2DC"/>
  <text x="600" y="315" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="64" font-weight="300" letter-spacing="16" fill="#4A4540">SILKLINE</text>
</svg>
```

This provides a valid fallback OG image that renders the brand name on a warm neutral background, matching the brand palette. Replace with a real OG image when photography is available.

- [ ] **Step 4: Typecheck, test, and build**

```bash
npx tsc --noEmit && npm test
```
Expected: clean.

```bash
rm -rf .next && npm run build 2>&1 | grep -E "Compiled|sitemap|robots|error"
```
Expected: `✓ Compiled successfully`. The route table may show `○ /robots.txt` and `○ /sitemap.xml`.

Verify the sitemap generates correct URLs:
```bash
(npm run dev -- -p 3230 &) && sleep 8 && \
  curl -s http://localhost:3230/sitemap.xml | grep -o 'silkline.uz/ru/product/silk-wrap-dress' | head -1 && \
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3230/robots.txt && \
  lsof -ti:3230 | xargs kill -9 2>/dev/null
```
Expected: `silkline.uz/ru/product/silk-wrap-dress`, `200`.

- [ ] **Step 5: Commit**

```bash
git add app/robots.ts app/sitemap.ts public/og-default.svg
git commit -m "feat: add robots.txt, sitemap.xml, and OG default image placeholder"
```

---

### Task 7: Final verification + PROJECT_MEMORY.md update

No new code (unless a verification step reveals a genuine issue that must be fixed).

- [ ] **Step 1: Lint**

```bash
npm run lint 2>&1; echo "EXIT:$?"
```
Expected: exit 0, zero errors, zero warnings.

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit 2>&1 && echo "TYPECHECK_CLEAN"
```
Expected: `TYPECHECK_CLEAN`.

- [ ] **Step 3: Tests**

```bash
npm test 2>&1 | tail -10
```
Expected: all test files pass.

- [ ] **Step 4: Build**

```bash
rm -rf .next && npm run build 2>&1 | tail -40
```
Expected: `✓ Compiled successfully`. Route table includes:
- `○ /[locale]` (`/ru`, `/uz`)
- `● /[locale]/collections/[slug]` (4 pages)
- `● /[locale]/product/[slug]` (12 pages)
- `○ /[locale]/shop` (2 pages)
- `○ /[locale]/about` (2 pages)
- `○ /[locale]/stores` (2 pages)
- `○ /_not-found`
- `○ /robots.txt`
- `○ /sitemap.xml`

- [ ] **Step 5: Full smoke test**

```bash
(npm run dev -- -p 3300 &) && sleep 8 && \
  echo "about /ru:" && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3300/ru/about && \
  echo "about /uz:" && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3300/uz/about && \
  echo "stores /ru:" && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3300/ru/stores && \
  echo "store name:" && curl -s http://localhost:3300/ru/stores | grep -o 'SilkLine — Tashkent City' | head -1 && \
  echo "404 localized:" && curl -s http://localhost:3300/ru/nope | grep -o 'Страница не найдена' | head -1 && \
  echo "sitemap:" && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3300/sitemap.xml && \
  echo "robots:" && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3300/robots.txt && \
  lsof -ti:3300 | xargs kill -9 2>/dev/null; echo done
```
Expected: `200`, `200`, `200`, `SilkLine — Tashkent City`, `Страница не найдена`, `200`, `200`.

- [ ] **Step 6: Update `PROJECT_MEMORY.md`**

Update §1 (PROJECT STATUS), §12 (WEBSITE STRUCTURE), and §29 (CHANGE LOG) in `PROJECT_MEMORY.md` to reflect the completion of all V1 pages.

- [ ] **Step 7: Commit**

```bash
git add PROJECT_MEMORY.md
git commit -m "docs: update PROJECT_MEMORY.md to reflect completed V1"
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Brand Story page (`/about`) with heading, story, mission, CTA
- ✅ Store Locations page (`/stores`) with `StoreCard` per store
- ✅ `StoreCard` renders localized address, hours, `tel:` phone link, map link
- ✅ 404 page localized in both languages with "Back to Home" link
- ✅ `robots.txt` via `app/robots.ts` — allow-all, points to sitemap
- ✅ Sitemap via `app/sitemap.ts` — all pages across both locales
- ✅ OG default image placeholder at `public/og-default.svg`
- ✅ All new i18n keys in both `ru.json` and `uz.json`
- ✅ `generateMetadata` with hreflang alternates on both new pages

**Type consistency:**
- `StoreCard` receives `Store` (from `@/types`) and `AppLocale` (from `@/i18n/locales`) — both defined in earlier tasks ✓
- `StoreCard` test mocks `next-intl/server`'s `getTranslations` — consistent with how `BrandMoment` is handled ✓
- `getLocale()` from `next-intl/server` in `not-found.tsx` — this API is available in Next.js App Router Server Components when the locale is set by the parent layout ✓

**No placeholders.**
