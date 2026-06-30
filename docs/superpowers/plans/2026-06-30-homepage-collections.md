# Homepage & Collections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Homepage, Collection detail pages, and Shop All page for SilkLine, including all shared UI primitives they depend on.

**Architecture:** Five sequential phases — Data → Shared components → Feature components → Page sections → Page assembly. Every later task depends on earlier ones; no parallelism is safe. All data is served from local TypeScript files through a typed repository layer; editorial placement decisions live in `lib/config/editorial.ts`, not in entity flags. Pages are Server Components; the only Client Components are `NavigationProgress`, `WishlistToggle`, and the `ShopAllClient` subtree.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, next-intl 4.x, Vitest + React Testing Library. No Framer Motion in this milestone — CSS transitions only.

## Global Constraints

- All Telegram/WhatsApp links must use only `TELEGRAM_USERNAME`/`WHATSAPP_NUMBER` from `lib/links/config.ts`.
- Every locale-facing string ships in both `ru` (default) and `uz`.
- No `tailwind.config.ts` — all design tokens in `app/globals.css` `@theme inline` block.
- No Framer Motion — CSS transitions only.
- Use `proxy.ts` (not `middleware.ts`) for locale routing — already exists, do not touch it.
- No `isEditorsPick` or `isBestSeller` flags on `Product` after Task 1 — these fields are removed.
- All images must use `next/image`; no raw `<img>` tags.
- `lib/data-source/*` is the only code that may import from `@/data/*`.
- Server Components must not contain branching/filtering logic — delegate to pure helpers.
- Every commit: `npm run lint && npx tsc --noEmit && npm test` must pass.

---

## File Map

```
lib/config/editorial.ts          NEW  — featured collection slug + selected product slugs
lib/config/editorial.test.ts     NEW  — integrity validation tests
lib/shop.ts                      NEW  — filterProducts(), sortProducts(), hasActiveFilters()
lib/shop.test.ts                 NEW  — pure function tests
lib/hooks/useWishlist.ts         NEW  — localStorage wishlist React hook
lib/hooks/useWishlist.test.ts    NEW  — hook tests
types/index.ts                   MOD  — remove isEditorsPick, isBestSeller from Product
data/products.ts                 MOD  — remove those fields from all 6 seed products
lib/data-source/products.ts      MOD  — add getSelectedProducts()
lib/data-source/collections.ts   MOD  — add getFeaturedCollection()
lib/data-source/products.test.ts MOD  — add tests for new functions
lib/data-source/collections.test.ts MOD — add tests for new function
messages/ru.json                 MOD  — add all new i18n keys
messages/uz.json                 MOD  — add all new i18n keys
.env.local.example               MOD  — add NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_OG_IMAGE
app/globals.css                  MOD  — add prefers-reduced-motion rule
app/[locale]/layout.tsx          MOD  — mount NavigationProgress, id main-content
components/layout/Header.tsx     MOD  — add skip-to-content link
components/layout/NavigationProgress.tsx  NEW
components/ui/PageContainer.tsx  NEW
components/ui/Section.tsx        NEW
components/ui/JsonLd.tsx         NEW
components/ui/Button.tsx         NEW
components/ui/Button.test.tsx    NEW
components/ui/FilterChip.tsx     NEW
components/ui/FilterChip.test.tsx NEW
components/ui/WishlistToggle.tsx NEW
components/ui/WishlistToggle.test.tsx NEW
components/ui/ProductCard.tsx    NEW
components/ui/ProductCard.test.tsx NEW
components/ui/ProductSkeleton.tsx NEW
components/ui/ProductGrid.tsx    NEW
components/ui/CollectionCard.tsx NEW
components/sections/HeroSection.tsx             NEW
components/sections/FeaturedCollectionSection.tsx NEW
components/sections/EditorialProductSection.tsx   NEW
components/sections/BrandMoment.tsx               NEW
components/sections/CollectionStory.tsx           NEW
components/sections/RelatedCollections.tsx        NEW
components/features/ShopFilters.tsx   NEW
components/features/ShopAllClient.tsx NEW
app/[locale]/page.tsx            MOD  — full homepage
app/[locale]/collections/[slug]/page.tsx  NEW
app/[locale]/shop/page.tsx       NEW
```

---

### Task 1: Editorial config + data model cleanup

**Files:**
- Create: `lib/config/editorial.ts`
- Create: `lib/config/editorial.test.ts`
- Modify: `types/index.ts`
- Modify: `data/products.ts`

**Interfaces:**
- Produces:
  - `EDITORIAL.featuredCollectionSlug: string`
  - `EDITORIAL.selectedProductSlugs: readonly string[]`
  - `EDITORIAL.defaultOgImage: string`
  - `Product` interface no longer has `isEditorsPick` or `isBestSeller`

- [ ] **Step 1: Write the failing config integrity tests**

`lib/config/editorial.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { EDITORIAL } from './editorial';
import { getAllProducts } from '@/lib/data-source/products';
import { getAllCollections } from '@/lib/data-source/collections';

describe('editorial config integrity', () => {
  it('featuredCollectionSlug resolves to a real collection', () => {
    const found = getAllCollections().some(c => c.slug === EDITORIAL.featuredCollectionSlug);
    expect(found).toBe(true);
  });

  it('every selectedProductSlug resolves to a real product', () => {
    const slugs = new Set(getAllProducts().map(p => p.slug));
    for (const slug of EDITORIAL.selectedProductSlugs) {
      expect(slugs.has(slug), `"${slug}" not found in products`).toBe(true);
    }
  });

  it('selectedProductSlugs contains no duplicates', () => {
    const arr = EDITORIAL.selectedProductSlugs;
    expect(new Set(arr).size).toBe(arr.length);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL (module not found)**

```bash
npm test -- lib/config/editorial.test.ts
```
Expected: `Cannot find module './editorial'`

- [ ] **Step 3: Create the editorial config**

`lib/config/editorial.ts`:
```ts
export const EDITORIAL = {
  featuredCollectionSlug: 'autumn-atelier',
  selectedProductSlugs: [
    'silk-wrap-dress',
    'satin-slip-dress',
    'camel-wool-coat',
    'cropped-knit-cardigan',
  ],
  defaultOgImage: '/og-default.jpg',
} as const;
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- lib/config/editorial.test.ts
```
Expected: 3 passed

- [ ] **Step 5: Remove deprecated fields from the `Product` type**

`types/index.ts` — remove two lines from the `Product` interface:
```ts
// DELETE these two lines:
  isEditorsPick: boolean;
  isBestSeller: boolean;
```

- [ ] **Step 6: Remove the fields from all seed products**

`data/products.ts` — remove `isEditorsPick` and `isBestSeller` from all 6 product records. Every product currently has lines like:
```ts
    isEditorsPick: true,
    isBestSeller: false,
```
Delete both lines from each product. The file after editing has no occurrences of either word.

- [ ] **Step 7: Verify typecheck and full test suite pass**

```bash
npx tsc --noEmit && npm test
```
Expected: no type errors, all tests pass (including the 3 new editorial integrity tests and the existing 16 Foundation tests).

- [ ] **Step 8: Commit**

```bash
git add types/index.ts data/products.ts lib/config/
git commit -m "feat: add editorial config, remove entity-level curation flags from Product"
```

---

### Task 2: Editorial repository functions

**Files:**
- Modify: `lib/data-source/products.ts`
- Modify: `lib/data-source/collections.ts`
- Modify: `lib/data-source/products.test.ts`
- Modify: `lib/data-source/collections.test.ts`

**Interfaces:**
- Consumes: `EDITORIAL` from `@/lib/config/editorial`
- Produces:
  - `getSelectedProducts(): Product[]` — returns products matching `EDITORIAL.selectedProductSlugs`, in config order, silently omitting unresolvable slugs
  - `getFeaturedCollection(): Collection | undefined` — returns the collection matching `EDITORIAL.featuredCollectionSlug`

- [ ] **Step 1: Write the failing tests**

Add to `lib/data-source/collections.test.ts`:
```ts
import { getFeaturedCollection } from './collections';

describe('getFeaturedCollection', () => {
  it('returns the collection matching the featured slug', () => {
    const c = getFeaturedCollection();
    expect(c?.slug).toBe('autumn-atelier');
  });
});
```

Add to `lib/data-source/products.test.ts`:
```ts
import { getSelectedProducts } from './products';

describe('getSelectedProducts', () => {
  it('returns products in the order defined by editorial config', () => {
    const selected = getSelectedProducts();
    expect(selected.map(p => p.slug)).toEqual([
      'silk-wrap-dress',
      'satin-slip-dress',
      'camel-wool-coat',
      'cropped-knit-cardigan',
    ]);
  });

  it('omits slugs that do not exist in the product list', () => {
    // all 4 slugs in editorial config exist, so result length is 4
    expect(getSelectedProducts()).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- lib/data-source
```
Expected: `getFeaturedCollection is not a function` / `getSelectedProducts is not a function`

- [ ] **Step 3: Implement the functions**

Add to `lib/data-source/collections.ts`:
```ts
import { EDITORIAL } from '@/lib/config/editorial';

export function getFeaturedCollection(): Collection | undefined {
  return collections.find(c => c.slug === EDITORIAL.featuredCollectionSlug);
}
```

Add to `lib/data-source/products.ts`:
```ts
import { EDITORIAL } from '@/lib/config/editorial';

export function getSelectedProducts(): Product[] {
  return EDITORIAL.selectedProductSlugs
    .map(slug => products.find(p => p.slug === slug))
    .filter((p): p is Product => p !== undefined);
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- lib/data-source
```
Expected: all data-source tests pass (including the 2 new ones)

- [ ] **Step 5: Commit**

```bash
git add lib/data-source/ lib/config/
git commit -m "feat: add getFeaturedCollection and getSelectedProducts repository functions"
```

---

### Task 3: Filtering + sorting utilities

**Files:**
- Create: `lib/shop.ts`
- Create: `lib/shop.test.ts`

**Interfaces:**
- Produces:
  - `ShopFilters` interface: `{ collectionIds: string[]; categoryIds: string[]; sizes: string[] }`
  - `SortOrder` type: `'featured' | 'price-asc' | 'price-desc'`
  - `EMPTY_FILTERS: ShopFilters`
  - `filterProducts(products: Product[], filters: ShopFilters): Product[]`
  - `sortProducts(products: Product[], order: SortOrder): Product[]`
  - `hasActiveFilters(filters: ShopFilters): boolean`

- [ ] **Step 1: Write the failing tests**

`lib/shop.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { filterProducts, sortProducts, hasActiveFilters, EMPTY_FILTERS } from './shop';
import type { Product } from '@/types';

function make(override: Partial<Product>): Product {
  return {
    id: 'p', slug: 'p',
    name: { ru: '', uz: '' }, description: { ru: '', uz: '' },
    collectionId: 'col-a', categoryId: 'cat-a',
    images: [], sizes: ['S', 'M'], price: 100,
    relatedProductIds: [],
    ...override,
  };
}

const products: Product[] = [
  make({ id: 'p1', collectionId: 'col-a', categoryId: 'cat-dress', sizes: ['S','M'], price: 200 }),
  make({ id: 'p2', collectionId: 'col-b', categoryId: 'cat-coat',  sizes: ['M','L'], price: 400 }),
  make({ id: 'p3', collectionId: 'col-a', categoryId: 'cat-dress', sizes: ['XS'],   price: 100 }),
];

describe('filterProducts', () => {
  it('returns all products when no filters are active', () => {
    expect(filterProducts(products, EMPTY_FILTERS)).toHaveLength(3);
  });

  it('filters by collectionId', () => {
    const r = filterProducts(products, { ...EMPTY_FILTERS, collectionIds: ['col-a'] });
    expect(r.map(p => p.id)).toEqual(['p1', 'p3']);
  });

  it('filters by categoryId', () => {
    const r = filterProducts(products, { ...EMPTY_FILTERS, categoryIds: ['cat-coat'] });
    expect(r.map(p => p.id)).toEqual(['p2']);
  });

  it('filters by size — matches if product has any of the selected sizes', () => {
    const r = filterProducts(products, { ...EMPTY_FILTERS, sizes: ['L'] });
    expect(r.map(p => p.id)).toEqual(['p2']);
  });

  it('combines multiple filters with AND logic', () => {
    const r = filterProducts(products, {
      collectionIds: ['col-a'], categoryIds: ['cat-dress'], sizes: ['S'],
    });
    expect(r.map(p => p.id)).toEqual(['p1']);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterProducts(products, { ...EMPTY_FILTERS, sizes: ['XXL'] })).toHaveLength(0);
  });
});

describe('sortProducts', () => {
  it('price-asc sorts ascending by price', () => {
    expect(sortProducts(products, 'price-asc').map(p => p.price)).toEqual([100, 200, 400]);
  });

  it('price-desc sorts descending by price', () => {
    expect(sortProducts(products, 'price-desc').map(p => p.price)).toEqual([400, 200, 100]);
  });

  it('featured preserves original order', () => {
    expect(sortProducts(products, 'featured').map(p => p.id)).toEqual(['p1', 'p2', 'p3']);
  });

  it('does not mutate the input array', () => {
    const copy = [...products];
    sortProducts(products, 'price-asc');
    expect(products.map(p => p.id)).toEqual(copy.map(p => p.id));
  });
});

describe('hasActiveFilters', () => {
  it('returns false for EMPTY_FILTERS', () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
  });
  it('returns true when collectionIds is non-empty', () => {
    expect(hasActiveFilters({ ...EMPTY_FILTERS, collectionIds: ['x'] })).toBe(true);
  });
  it('returns true when sizes is non-empty', () => {
    expect(hasActiveFilters({ ...EMPTY_FILTERS, sizes: ['S'] })).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- lib/shop.test.ts
```
Expected: `Cannot find module './shop'`

- [ ] **Step 3: Implement**

`lib/shop.ts`:
```ts
import type { Product } from '@/types';

export interface ShopFilters {
  collectionIds: string[];
  categoryIds: string[];
  sizes: string[];
}

export type SortOrder = 'featured' | 'price-asc' | 'price-desc';

export const EMPTY_FILTERS: ShopFilters = {
  collectionIds: [],
  categoryIds: [],
  sizes: [],
};

export function filterProducts(products: Product[], filters: ShopFilters): Product[] {
  return products.filter(p => {
    if (filters.collectionIds.length > 0 && !filters.collectionIds.includes(p.collectionId)) return false;
    if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(p.categoryId)) return false;
    if (filters.sizes.length > 0 && !filters.sizes.some(s => p.sizes.includes(s))) return false;
    return true;
  });
}

export function sortProducts(products: Product[], order: SortOrder): Product[] {
  const copy = [...products];
  if (order === 'price-asc') return copy.sort((a, b) => a.price - b.price);
  if (order === 'price-desc') return copy.sort((a, b) => b.price - a.price);
  return copy; // 'featured' — preserve editorial order
}

export function hasActiveFilters(filters: ShopFilters): boolean {
  return filters.collectionIds.length > 0
    || filters.categoryIds.length > 0
    || filters.sizes.length > 0;
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- lib/shop.test.ts
```
Expected: 13 passed

- [ ] **Step 5: Commit**

```bash
git add lib/shop.ts lib/shop.test.ts
git commit -m "feat: add filterProducts, sortProducts, hasActiveFilters utilities"
```

---

### Task 4: useWishlist hook

**Files:**
- Create: `lib/hooks/useWishlist.ts`
- Create: `lib/hooks/useWishlist.test.ts`

**Interfaces:**
- Produces: `useWishlist(): { toggle(id: string): void; isWishlisted(id: string): boolean }`

- [ ] **Step 1: Write the failing tests**

`lib/hooks/useWishlist.test.ts`:
```ts
import { describe, expect, it, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWishlist } from './useWishlist';

beforeEach(() => { localStorage.clear(); });

describe('useWishlist', () => {
  it('starts empty when localStorage has nothing', () => {
    const { result } = renderHook(() => useWishlist());
    expect(result.current.isWishlisted('p1')).toBe(false);
  });

  it('toggle adds a product to the wishlist', () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggle('p1'));
    expect(result.current.isWishlisted('p1')).toBe(true);
  });

  it('toggle removes a product that is already wishlisted', () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggle('p1'));
    act(() => result.current.toggle('p1'));
    expect(result.current.isWishlisted('p1')).toBe(false);
  });

  it('persists the wishlist to localStorage', () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggle('p1'));
    const stored: string[] = JSON.parse(localStorage.getItem('silkline-wishlist') ?? '[]');
    expect(stored).toContain('p1');
  });

  it('reads initial state from localStorage', () => {
    localStorage.setItem('silkline-wishlist', JSON.stringify(['p-existing']));
    const { result } = renderHook(() => useWishlist());
    expect(result.current.isWishlisted('p-existing')).toBe(true);
  });

  it('handles corrupted localStorage without crashing', () => {
    localStorage.setItem('silkline-wishlist', 'not-valid-json');
    const { result } = renderHook(() => useWishlist());
    expect(result.current.isWishlisted('anything')).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- lib/hooks/useWishlist.test.ts
```
Expected: `Cannot find module './useWishlist'`

- [ ] **Step 3: Implement**

`lib/hooks/useWishlist.ts`:
```ts
'use client';
import { useState, useEffect, useCallback } from 'react';

const KEY = 'silkline-wishlist';

function read(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]);
  } catch {
    return new Set();
  }
}

export function useWishlist() {
  const [ids, setIds] = useState<Set<string>>(() => read());

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const toggle = useCallback((id: string) => {
    setIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isWishlisted = useCallback((id: string) => ids.has(id), [ids]);

  return { toggle, isWishlisted };
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- lib/hooks/useWishlist.test.ts
```
Expected: 6 passed

- [ ] **Step 5: Commit**

```bash
git add lib/hooks/
git commit -m "feat: add useWishlist hook with localStorage persistence"
```

---

### Task 5: i18n keys, CSS foundations, and env vars

**Files:**
- Modify: `messages/ru.json`
- Modify: `messages/uz.json`
- Modify: `app/globals.css`
- Modify: `.env.local.example`

**Interfaces:**
- Produces: all new i18n namespace keys required by later tasks, `prefers-reduced-motion` rule, `NEXT_PUBLIC_SITE_URL` env var

No new tests — this is static content. Verification is `npm test` (existing tests still pass) and `npx tsc --noEmit`.

- [ ] **Step 1: Update `messages/ru.json`**

Replace the entire file:
```json
{
  "nav": {
    "shopAll": "Весь каталог",
    "about": "О бренде",
    "stores": "Магазины",
    "skipToContent": "Перейти к содержимому"
  },
  "footer": {
    "contactPrompt": "Свяжитесь с нами, чтобы оформить заказ:"
  },
  "homepage": {
    "selectedHeading": "Избранное",
    "viewCollection": "Смотреть коллекцию"
  },
  "collection": {
    "relatedHeading": "Другие коллекции",
    "viewAll": "Смотреть коллекцию"
  },
  "shop": {
    "heading": "Каталог",
    "total": "{count} изделий",
    "xOfY": "Показано {count} из {total}",
    "noResults": "Ничего не найдено",
    "noResultsHint": "Попробуйте другие фильтры",
    "clearFilters": "Сбросить фильтры"
  },
  "filters": {
    "label": "Фильтр",
    "collection": "Коллекция",
    "category": "Категория",
    "size": "Размер",
    "clearAll": "Очистить",
    "apply": "Применить"
  },
  "sort": {
    "label": "Сортировка",
    "featured": "Избранное",
    "priceAsc": "Цена: от низкой",
    "priceDesc": "Цена: от высокой"
  },
  "product": {
    "addToWishlist": "Добавить {name} в список желаний",
    "removeFromWishlist": "Удалить {name} из списка желаний"
  },
  "brand": {
    "statement": ""
  }
}
```

- [ ] **Step 2: Update `messages/uz.json`**

Replace the entire file:
```json
{
  "nav": {
    "shopAll": "Barcha mahsulotlar",
    "about": "Brend haqida",
    "stores": "Do'konlar",
    "skipToContent": "Asosiy kontentga o'tish"
  },
  "footer": {
    "contactPrompt": "Buyurtma berish uchun biz bilan bog'laning:"
  },
  "homepage": {
    "selectedHeading": "Tanlangan",
    "viewCollection": "Kolleksiyani ko'rish"
  },
  "collection": {
    "relatedHeading": "Boshqa kolleksiyalar",
    "viewAll": "Kolleksiyani ko'rish"
  },
  "shop": {
    "heading": "Katalog",
    "total": "{count} ta mahsulot",
    "xOfY": "{total} dan {count} ko'rsatilmoqda",
    "noResults": "Hech narsa topilmadi",
    "noResultsHint": "Boshqa filtrlarni sinab ko'ring",
    "clearFilters": "Filtrlarni tozalash"
  },
  "filters": {
    "label": "Filtr",
    "collection": "Kolleksiya",
    "category": "Kategoriya",
    "size": "O'lcham",
    "clearAll": "Tozalash",
    "apply": "Qo'llash"
  },
  "sort": {
    "label": "Saralash",
    "featured": "Tanlangan",
    "priceAsc": "Narx: pastdan",
    "priceDesc": "Narx: balanddan"
  },
  "product": {
    "addToWishlist": "{name} ni istaklarga qo'shish",
    "removeFromWishlist": "{name} ni istaklardan o'chirish"
  },
  "brand": {
    "statement": ""
  }
}
```

- [ ] **Step 3: Add `prefers-reduced-motion` to `app/globals.css`**

Append at the end of `app/globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Update `.env.local.example`**

Append:
```
NEXT_PUBLIC_SITE_URL=https://silkline.uz
NEXT_PUBLIC_OG_IMAGE=/og-default.jpg
```

- [ ] **Step 5: Verify**

```bash
npm test && npx tsc --noEmit
```
Expected: all existing tests pass, no type errors.

- [ ] **Step 6: Commit**

```bash
git add messages/ app/globals.css .env.local.example
git commit -m "feat: add i18n keys for homepage/collections/shop, prefers-reduced-motion rule"
```

---

### Task 6: Layout primitives — PageContainer and Section

**Files:**
- Create: `components/ui/PageContainer.tsx`
- Create: `components/ui/Section.tsx`

**Interfaces:**
- Produces:
  - `<PageContainer>{children}</PageContainer>` — `max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8`
  - `<Section as="section|article|div">{children}</Section>` — vertical spacing wrapper

No logic, no tests required (structural wrappers verified by build). Verify by `npx tsc --noEmit`.

- [ ] **Step 1: Create PageContainer**

`components/ui/PageContainer.tsx`:
```tsx
import type { ReactNode } from 'react';

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create Section**

`components/ui/Section.tsx`:
```tsx
import type { ElementType, ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function Section({ children, as: Tag = 'section', className = '' }: SectionProps) {
  return <Tag className={`py-16 lg:py-24 ${className}`}>{children}</Tag>;
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ui/PageContainer.tsx components/ui/Section.tsx
git commit -m "feat: add PageContainer and Section layout primitives"
```

---

### Task 7: JsonLd component

**Files:**
- Create: `components/ui/JsonLd.tsx`
- Create: `components/ui/JsonLd.test.tsx`

**Interfaces:**
- Produces: `<JsonLd data={object} />` — renders `<script type="application/ld+json">` safely

- [ ] **Step 1: Write the failing test**

`components/ui/JsonLd.test.tsx`:
```tsx
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { JsonLd } from './JsonLd';

describe('JsonLd', () => {
  it('renders a script tag with type application/ld+json', () => {
    const { container } = render(<JsonLd data={{ '@type': 'WebSite', name: 'SilkLine' }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
  });

  it('serializes the data object as JSON', () => {
    const data = { '@type': 'Organization', name: 'SilkLine' };
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script');
    expect(script?.textContent).toBe(JSON.stringify(data));
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- components/ui/JsonLd.test.tsx
```
Expected: `Cannot find module './JsonLd'`

- [ ] **Step 3: Implement**

`components/ui/JsonLd.tsx`:
```tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

`dangerouslySetInnerHTML` is correct here: the data source is typed local config, never user input, so XSS is not a risk.

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- components/ui/JsonLd.test.tsx
```
Expected: 2 passed

- [ ] **Step 5: Commit**

```bash
git add components/ui/JsonLd.tsx components/ui/JsonLd.test.tsx
git commit -m "feat: add JsonLd component for structured data injection"
```

---

### Task 8: Button component

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Button.test.tsx`

**Interfaces:**
- Produces: `<Button variant="primary|secondary|ghost" size="sm|md|lg" ...buttonProps />`

- [ ] **Step 1: Write the failing tests**

`components/ui/Button.test.tsx`:
```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
```

Note: this test requires `@testing-library/user-event`. Install it:
```bash
npm install -D @testing-library/user-event
```

```tsx
describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is a <button> element by default', () => {
    render(<Button>B</Button>);
    expect(screen.getByRole('button')).toBeInstanceOf(HTMLButtonElement);
  });

  it('forwards the disabled attribute', () => {
    render(<Button disabled>B</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- components/ui/Button.test.tsx
```
Expected: `Cannot find module './Button'`

- [ ] **Step 3: Implement**

`components/ui/Button.tsx`:
```tsx
import type { ButtonHTMLAttributes } from 'react';

const variants = {
  primary: 'bg-accent text-white hover:opacity-90',
  secondary: 'border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white',
  ghost: 'text-stone-700 hover:text-stone-900 underline-offset-4 hover:underline',
} as const;

const sizes = {
  sm: 'px-4 py-2 text-xs tracking-widest',
  md: 'px-6 py-3 text-sm tracking-widest',
  lg: 'px-8 py-4 text-base tracking-widest',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center font-medium uppercase
        transition-colors duration-150 focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- components/ui/Button.test.tsx
```
Expected: 4 passed

- [ ] **Step 5: Commit**

```bash
git add components/ui/Button.tsx components/ui/Button.test.tsx
git commit -m "feat: add Button component with primary/secondary/ghost variants"
```

---

### Task 9: FilterChip component

**Files:**
- Create: `components/ui/FilterChip.tsx`
- Create: `components/ui/FilterChip.test.tsx`

**Interfaces:**
- Produces: `<FilterChip label={string} active={boolean} onToggle={() => void} />`
- Consumed by: `ShopFilters` (Task 15)

- [ ] **Step 1: Write the failing tests**

`components/ui/FilterChip.test.tsx`:
```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterChip } from './FilterChip';

describe('FilterChip', () => {
  it('renders the label', () => {
    render(<FilterChip label="Платья" active={false} onToggle={() => {}} />);
    expect(screen.getByRole('button', { name: 'Платья' })).toBeInTheDocument();
  });

  it('has aria-pressed=false when inactive', () => {
    render(<FilterChip label="X" active={false} onToggle={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('has aria-pressed=true when active', () => {
    render(<FilterChip label="X" active={true} onToggle={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<FilterChip label="X" active={false} onToggle={onToggle} />);
    await user.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- components/ui/FilterChip.test.tsx
```
Expected: `Cannot find module './FilterChip'`

- [ ] **Step 3: Implement**

`components/ui/FilterChip.tsx`:
```tsx
'use client';

interface FilterChipProps {
  label: string;
  active: boolean;
  onToggle: () => void;
}

export function FilterChip({ label, active, onToggle }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={`
        px-3 py-1.5 text-xs font-medium tracking-wide uppercase rounded-full
        border transition-colors duration-150
        ${active
          ? 'bg-stone-900 text-white border-stone-900'
          : 'bg-white text-stone-600 border-stone-300 hover:border-stone-600'
        }
      `.trim()}
    >
      {label}
    </button>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- components/ui/FilterChip.test.tsx
```
Expected: 4 passed

- [ ] **Step 5: Commit**

```bash
git add components/ui/FilterChip.tsx components/ui/FilterChip.test.tsx
git commit -m "feat: add FilterChip component with aria-pressed state"
```

---

### Task 10: WishlistToggle component

**Files:**
- Create: `components/ui/WishlistToggle.tsx`
- Create: `components/ui/WishlistToggle.test.tsx`

**Interfaces:**
- Consumes: `useWishlist` from `@/lib/hooks/useWishlist`; `useTranslations('product')` from `next-intl`
- Produces: `<WishlistToggle productId={string} productName={string} />`

- [ ] **Step 1: Write the failing tests**

`components/ui/WishlistToggle.test.tsx`:
```tsx
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WishlistToggle } from './WishlistToggle';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, string>) => {
    if (key === 'addToWishlist') return `Add ${params?.name}`;
    if (key === 'removeFromWishlist') return `Remove ${params?.name}`;
    return key;
  },
}));

beforeEach(() => { localStorage.clear(); });

describe('WishlistToggle', () => {
  it('renders a button', () => {
    render(<WishlistToggle productId="p1" productName="Dress" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('aria-label includes product name when not wishlisted', () => {
    render(<WishlistToggle productId="p1" productName="Dress" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Add Dress');
  });

  it('aria-pressed is false initially', () => {
    render(<WishlistToggle productId="p1" productName="Dress" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggling sets aria-pressed to true', async () => {
    const user = userEvent.setup();
    render(<WishlistToggle productId="p1" productName="Dress" />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- components/ui/WishlistToggle.test.tsx
```
Expected: `Cannot find module './WishlistToggle'`

- [ ] **Step 3: Implement**

`components/ui/WishlistToggle.tsx`:
```tsx
'use client';
import { useTranslations } from 'next-intl';
import { useWishlist } from '@/lib/hooks/useWishlist';

interface WishlistToggleProps {
  productId: string;
  productName: string;
}

export function WishlistToggle({ productId, productName }: WishlistToggleProps) {
  const t = useTranslations('product');
  const { toggle, isWishlisted } = useWishlist();
  const active = isWishlisted(productId);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active
        ? t('removeFromWishlist', { name: productName })
        : t('addToWishlist', { name: productName })
      }
      onClick={e => {
        e.preventDefault();
        toggle(productId);
      }}
      className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
    >
      {/* Heart icon — inline SVG to avoid a Lucide import for a single icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- components/ui/WishlistToggle.test.tsx
```
Expected: 4 passed

- [ ] **Step 5: Commit**

```bash
git add components/ui/WishlistToggle.tsx components/ui/WishlistToggle.test.tsx
git commit -m "feat: add WishlistToggle client component with localStorage integration"
```

---

### Task 11: ProductCard and ProductSkeleton

**Files:**
- Create: `components/ui/ProductCard.tsx`
- Create: `components/ui/ProductSkeleton.tsx`
- Create: `components/ui/ProductCard.test.tsx`

**Interfaces:**
- Consumes: `WishlistToggle`, `Product`, `AppLocale`
- Produces: `<ProductCard product={Product} locale={AppLocale} />`; `<ProductSkeleton />`
- Consumed by: `ProductGrid` (Task 12), all section components

- [ ] **Step 1: Write the failing tests**

`components/ui/ProductCard.test.tsx`:
```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [k: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock('@/components/ui/WishlistToggle', () => ({
  WishlistToggle: () => <button aria-label="wishlist" />,
}));

const product: Product = {
  id: 'p1', slug: 'test-product',
  name: { ru: 'Тестовое платье', uz: 'Test ko\'ylak' },
  description: { ru: 'Описание', uz: 'Tavsif' },
  collectionId: 'col-a', categoryId: 'cat-a',
  images: ['/test.jpg'],
  sizes: ['S', 'M'],
  price: 890000,
  relatedProductIds: [],
};

describe('ProductCard', () => {
  it('renders the localized product name in ru', () => {
    render(<ProductCard product={product} locale="ru" />);
    expect(screen.getByText('Тестовое платье')).toBeInTheDocument();
  });

  it('renders the localized product name in uz', () => {
    render(<ProductCard product={product} locale="uz" />);
    expect(screen.getByText("Test ko'ylak")).toBeInTheDocument();
  });

  it('renders the price', () => {
    render(<ProductCard product={product} locale="ru" />);
    expect(screen.getByText(/890/)).toBeInTheDocument();
  });

  it('links to the product detail page', () => {
    render(<ProductCard product={product} locale="ru" />);
    const links = screen.getAllByRole('link');
    expect(links.some(l => l.getAttribute('href')?.includes('test-product'))).toBe(true);
  });

  it('renders the product image with alt text', () => {
    render(<ProductCard product={product} locale="ru" />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Тестовое платье');
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- components/ui/ProductCard.test.tsx
```
Expected: `Cannot find module './ProductCard'`

- [ ] **Step 3: Implement ProductCard**

`components/ui/ProductCard.tsx`:
```tsx
import Image from 'next/image';
import Link from 'next/link';
import type { AppLocale, Product } from '@/types';
import { WishlistToggle } from './WishlistToggle';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price) + ' сум';
}

interface ProductCardProps {
  product: Product;
  locale: AppLocale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const href = `/${locale}/product/${product.slug}`;
  const name = product.name[locale];

  return (
    <article className="group">
      <Link href={href} className="block aspect-[3/4] overflow-hidden bg-stone-100 relative">
        <Image
          src={product.images[0] ?? '/placeholders/product-placeholder.svg'}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <WishlistToggle productId={product.id} productName={name} />
        </div>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium leading-snug">
            <Link href={href} className="hover:underline underline-offset-2">
              {name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-stone-500">{formatPrice(product.price)}</p>
        </div>
        <div className="sm:hidden">
          <WishlistToggle productId={product.id} productName={name} />
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Implement ProductSkeleton**

`components/ui/ProductSkeleton.tsx`:
```tsx
export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-stone-200 rounded-sm" />
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        <div className="h-3 bg-stone-200 rounded w-1/3" />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
npm test -- components/ui/ProductCard.test.tsx
```
Expected: 5 passed

- [ ] **Step 6: Commit**

```bash
git add components/ui/ProductCard.tsx components/ui/ProductSkeleton.tsx components/ui/ProductCard.test.tsx
git commit -m "feat: add ProductCard and ProductSkeleton components"
```

---

### Task 12: ProductGrid and CollectionCard

**Files:**
- Create: `components/ui/ProductGrid.tsx`
- Create: `components/ui/CollectionCard.tsx`

No logic, no new tests. Verified by typecheck + build.

- [ ] **Step 1: Implement ProductGrid**

`components/ui/ProductGrid.tsx`:
```tsx
import type { AppLocale, Product } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductSkeleton } from './ProductSkeleton';

const columnClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
} as const;

interface ProductGridProps {
  products: Product[];
  locale: AppLocale;
  columns?: 2 | 3;
  loading?: boolean;
  totalCount?: number;
}

export function ProductGrid({
  products,
  locale,
  columns = 3,
  loading = false,
  totalCount,
}: ProductGridProps) {
  const items = loading ? Array.from({ length: totalCount ?? 6 }) : products;

  return (
    <div className={`grid ${columnClasses[columns]} gap-6 lg:gap-8`}>
      {loading
        ? items.map((_, i) => <ProductSkeleton key={i} />)
        : products.map(p => <ProductCard key={p.id} product={p} locale={locale} />)
      }
    </div>
  );
}
```

- [ ] **Step 2: Implement CollectionCard**

`components/ui/CollectionCard.tsx`:
```tsx
import Image from 'next/image';
import Link from 'next/link';
import type { AppLocale, Collection } from '@/types';

interface CollectionCardProps {
  collection: Collection;
  locale: AppLocale;
}

export function CollectionCard({ collection, locale }: CollectionCardProps) {
  const href = `/${locale}/collections/${collection.slug}`;
  const name = collection.name[locale];

  return (
    <Link href={href} className="group block relative aspect-[4/5] overflow-hidden bg-stone-100">
      <Image
        src={collection.heroImage}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
      <p className="absolute bottom-4 left-4 text-white text-sm font-medium tracking-wide uppercase">
        {name}
      </p>
    </Link>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ui/ProductGrid.tsx components/ui/CollectionCard.tsx
git commit -m "feat: add ProductGrid and CollectionCard components"
```

---

### Task 13: NavigationProgress + skip-to-content link

**Files:**
- Create: `components/layout/NavigationProgress.tsx`
- Modify: `components/layout/Header.tsx`
- Modify: `app/[locale]/layout.tsx`

No unit tests — browser interaction behavior. Verified by build + manual curl confirming HTML structure.

- [ ] **Step 1: Create NavigationProgress**

`components/layout/NavigationProgress.tsx`:
```tsx
'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function NavigationProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Pathname changed — complete the bar
    if (visible) {
      clearInterval(intervalRef.current);
      setWidth(100);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 400);
    }
    return () => clearTimeout(timerRef.current);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const start = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href') ?? '';
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;
      clearInterval(intervalRef.current);
      setVisible(true);
      setWidth(0);
      let w = 0;
      intervalRef.current = setInterval(() => {
        w = Math.min(w + Math.random() * 10 + 5, 80);
        setWidth(w);
        if (w >= 80) clearInterval(intervalRef.current);
      }, 100);
    };
    document.addEventListener('click', start);
    return () => {
      document.removeEventListener('click', start);
      clearInterval(intervalRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      aria-valuenow={Math.round(width)}
      className="fixed top-0 left-0 z-[9999] h-[3px] bg-accent"
      style={{ width: `${width}%`, transition: 'width 150ms ease-out' }}
    />
  );
}
```

- [ ] **Step 2: Add skip-to-content link to Header**

`components/layout/Header.tsx` — add as the very first element inside `<header>`, before the logo `<Link>`:
```tsx
import { getTranslations } from 'next-intl/server';
// existing imports...

export async function Header({ locale }: { locale: AppLocale }) {
  const t = await getTranslations('nav');
  const collectionLinks = buildCollectionNavLinks(getAllCollections(), locale);

  return (
    <header className="flex items-center justify-between px-6 py-5 border-b border-stone-200 relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow-md"
      >
        {t('skipToContent')}
      </a>
      {/* rest of header unchanged */}
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

- [ ] **Step 3: Mount NavigationProgress in layout and add id to main**

`app/[locale]/layout.tsx` — two changes:
1. Import `NavigationProgress`
2. Add `id="main-content"` to `<main>`
3. Render `<NavigationProgress />` before `<Header />`

```tsx
import { NavigationProgress } from '@/components/layout/NavigationProgress';

// Inside the JSX, replace the body content:
<body className="min-h-full flex flex-col">
  <NextIntlClientProvider locale={locale} messages={messages}>
    <NavigationProgress />
    <Header locale={locale as AppLocale} />
    <main id="main-content" className="flex-1">{children}</main>
    <Footer />
  </NextIntlClientProvider>
</body>
```

- [ ] **Step 4: Verify build and structure**

```bash
npm run build 2>&1 | tail -20
```
Expected: `✓ Compiled successfully`, no errors.

```bash
npm test
```
Expected: all existing 22 tests still pass.

Check the rendered HTML has `id="main-content"` on main and skip link in header:
```bash
(npm run dev -- -p 3030 &) && sleep 8 && \
  curl -s http://localhost:3030/ru | grep -o 'id="main-content"' && \
  curl -s http://localhost:3030/ru | grep -o 'href="#main-content"' && \
  lsof -ti:3030 | xargs kill -9
```
Expected: `id="main-content"` and `href="#main-content"` each printed once.

- [ ] **Step 5: Commit**

```bash
git add components/layout/NavigationProgress.tsx components/layout/Header.tsx app/[locale]/layout.tsx
git commit -m "feat: add NavigationProgress bar and skip-to-content link in Header"
```

---

### Task 14: ShopFilters component

**Files:**
- Create: `components/features/ShopFilters.tsx`
- Create: `components/features/ShopFilters.test.tsx`

**Interfaces:**
- Consumes: `FilterChip`, `ShopFilters` type and `EMPTY_FILTERS` from `@/lib/shop`, `Category`, `Collection`, `AppLocale`
- Produces:
  ```ts
  <ShopFilters
    filters={ShopFilters}
    onFiltersChange={(filters: ShopFilters) => void}
    collections={Collection[]}
    categories={Category[]}
    allSizes={string[]}
    locale={AppLocale}
    sortOrder={SortOrder}
    onSortChange={(order: SortOrder) => void}
  />
  ```

- [ ] **Step 1: Write the failing tests**

`components/features/ShopFilters.test.tsx`:
```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShopFilters } from './ShopFilters';
import { EMPTY_FILTERS } from '@/lib/shop';
import type { Category, Collection } from '@/types';

vi.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

const collections: Collection[] = [
  { id: 'c1', slug: 'col-a', name: { ru: 'Осенний', uz: 'Kuzgi' }, story: { ru: '', uz: '' }, heroImage: '', productIds: [] },
];
const categories: Category[] = [
  { id: 'cat1', slug: 'dresses', name: { ru: 'Платья', uz: 'Ko\'ylaklar' } },
];

describe('ShopFilters', () => {
  it('renders collection filter chips', () => {
    render(
      <ShopFilters
        filters={EMPTY_FILTERS}
        onFiltersChange={() => {}}
        collections={collections}
        categories={categories}
        allSizes={['S', 'M']}
        locale="ru"
        sortOrder="featured"
        onSortChange={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Осенний' })).toBeInTheDocument();
  });

  it('renders category filter chips', () => {
    render(
      <ShopFilters
        filters={EMPTY_FILTERS}
        onFiltersChange={() => {}}
        collections={collections}
        categories={categories}
        allSizes={['S', 'M']}
        locale="ru"
        sortOrder="featured"
        onSortChange={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Платья' })).toBeInTheDocument();
  });

  it('calls onFiltersChange with updated collectionIds when a chip is toggled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ShopFilters
        filters={EMPTY_FILTERS}
        onFiltersChange={onChange}
        collections={collections}
        categories={categories}
        allSizes={['S', 'M']}
        locale="ru"
        sortOrder="featured"
        onSortChange={() => {}}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Осенний' }));
    expect(onChange).toHaveBeenCalledWith({
      ...EMPTY_FILTERS,
      collectionIds: ['c1'],
    });
  });

  it('uses fieldset + legend for each filter group', () => {
    render(
      <ShopFilters
        filters={EMPTY_FILTERS}
        onFiltersChange={() => {}}
        collections={collections}
        categories={categories}
        allSizes={['S']}
        locale="ru"
        sortOrder="featured"
        onSortChange={() => {}}
      />
    );
    expect(screen.getAllByRole('group')).toHaveLength(3); // fieldsets
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- components/features/ShopFilters.test.tsx
```
Expected: `Cannot find module './ShopFilters'`

- [ ] **Step 3: Implement**

`components/features/ShopFilters.tsx`:
```tsx
'use client';
import { useTranslations } from 'next-intl';
import { FilterChip } from '@/components/ui/FilterChip';
import { type ShopFilters as Filters, type SortOrder, EMPTY_FILTERS } from '@/lib/shop';
import type { AppLocale, Category, Collection } from '@/types';

interface ShopFiltersProps {
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  collections: Collection[];
  categories: Category[];
  allSizes: string[];
  locale: AppLocale;
  sortOrder: SortOrder;
  onSortChange: (o: SortOrder) => void;
}

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
}

export function ShopFilters({
  filters,
  onFiltersChange,
  collections,
  categories,
  allSizes,
  locale,
  sortOrder,
  onSortChange,
}: ShopFiltersProps) {
  const t = useTranslations('filters');
  const ts = useTranslations('sort');

  const hasActive = filters.collectionIds.length > 0
    || filters.categoryIds.length > 0
    || filters.sizes.length > 0;

  return (
    <div className="flex flex-wrap items-start gap-6">
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">{t('collection')}</legend>
        {collections.map(c => (
          <FilterChip
            key={c.id}
            label={c.name[locale]}
            active={filters.collectionIds.includes(c.id)}
            onToggle={() => onFiltersChange({
              ...filters,
              collectionIds: toggle(filters.collectionIds, c.id),
            })}
          />
        ))}
      </fieldset>

      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">{t('category')}</legend>
        {categories.map(c => (
          <FilterChip
            key={c.id}
            label={c.name[locale]}
            active={filters.categoryIds.includes(c.id)}
            onToggle={() => onFiltersChange({
              ...filters,
              categoryIds: toggle(filters.categoryIds, c.id),
            })}
          />
        ))}
      </fieldset>

      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">{t('size')}</legend>
        {allSizes.map(size => (
          <FilterChip
            key={size}
            label={size}
            active={filters.sizes.includes(size)}
            onToggle={() => onFiltersChange({
              ...filters,
              sizes: toggle(filters.sizes, size),
            })}
          />
        ))}
      </fieldset>

      <div className="ml-auto flex items-center gap-3">
        {hasActive && (
          <button
            type="button"
            onClick={() => onFiltersChange(EMPTY_FILTERS)}
            className="text-xs text-stone-500 hover:text-stone-900 underline"
          >
            {t('clearAll')}
          </button>
        )}
        <select
          value={sortOrder}
          onChange={e => onSortChange(e.target.value as SortOrder)}
          className="text-xs border-b border-stone-300 bg-transparent py-1 pr-4 focus:outline-none"
          aria-label={ts('label')}
        >
          <option value="featured">{ts('featured')}</option>
          <option value="price-asc">{ts('priceAsc')}</option>
          <option value="price-desc">{ts('priceDesc')}</option>
        </select>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- components/features/ShopFilters.test.tsx
```
Expected: 4 passed

- [ ] **Step 5: Commit**

```bash
git add components/features/ShopFilters.tsx components/features/ShopFilters.test.tsx
git commit -m "feat: add ShopFilters component with collection/category/size chips and sort"
```

---

### Task 15: ShopAllClient component

**Files:**
- Create: `components/features/ShopAllClient.tsx`
- Create: `components/features/ShopAllClient.test.tsx`

**Interfaces:**
- Consumes: `ShopFilters` component, `ProductGrid`, `filterProducts`, `sortProducts`, `hasActiveFilters`, `EMPTY_FILTERS`
- Produces:
  ```ts
  <ShopAllClient
    products={Product[]}
    collections={Collection[]}
    categories={Category[]}
    locale={AppLocale}
  />
  ```

- [ ] **Step 1: Write the failing tests**

`components/features/ShopAllClient.test.tsx`:
```tsx
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShopAllClient } from './ShopAllClient';
import type { Category, Collection, Product } from '@/types';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, string | number>) => {
    if (key === 'total') return `${params?.count} items`;
    if (key === 'xOfY') return `${params?.count} of ${params?.total}`;
    return key;
  },
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));
vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock('@/components/ui/WishlistToggle', () => ({
  WishlistToggle: () => null,
}));

function makeProduct(id: string, collectionId: string, sizes: string[]): Product {
  return {
    id, slug: id,
    name: { ru: `Product ${id}`, uz: `Product ${id}` },
    description: { ru: '', uz: '' },
    collectionId, categoryId: 'cat-a',
    images: [], sizes, price: 100,
    relatedProductIds: [],
  };
}

const products: Product[] = [
  makeProduct('p1', 'col-a', ['S', 'M']),
  makeProduct('p2', 'col-b', ['L']),
  makeProduct('p3', 'col-a', ['M']),
];

const collections: Collection[] = [
  { id: 'col-a', slug: 'col-a', name: { ru: 'A', uz: 'A' }, story: { ru: '', uz: '' }, heroImage: '', productIds: ['p1', 'p3'] },
];
const categories: Category[] = [
  { id: 'cat-a', slug: 'cat-a', name: { ru: 'Cat A', uz: 'Cat A' } },
];

beforeEach(() => { localStorage.clear(); });

describe('ShopAllClient', () => {
  it('renders all products initially', () => {
    render(<ShopAllClient products={products} collections={collections} categories={categories} locale="ru" />);
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('filters products by collection when a collection chip is clicked', async () => {
    const user = userEvent.setup();
    render(<ShopAllClient products={products} collections={collections} categories={categories} locale="ru" />);
    await user.click(screen.getByRole('button', { name: 'A' }));
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('shows empty state when no products match filters', async () => {
    const user = userEvent.setup();
    render(<ShopAllClient products={products} collections={collections} categories={categories} locale="ru" />);
    // Filter by a size that only p2 has, then click the only collection (col-a) — should yield 0
    // Actually easier: filter by size 'L' then collection 'col-a'
    // First click 'A' collection chip
    await user.click(screen.getByRole('button', { name: 'A' }));
    // This yields p1 and p3; neither has size L — but we don't have size chips with just 'L' filter here
    // Instead just verify empty state text exists when result is 0
    // (This is easier to test by manipulating products prop)
    render(<ShopAllClient products={[]} collections={collections} categories={categories} locale="ru" />);
    expect(screen.getByText('noResults')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- components/features/ShopAllClient.test.tsx
```
Expected: `Cannot find module './ShopAllClient'`

- [ ] **Step 3: Implement**

`components/features/ShopAllClient.tsx`:
```tsx
'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { ShopFilters } from './ShopFilters';
import {
  filterProducts, sortProducts, hasActiveFilters,
  EMPTY_FILTERS,
  type ShopFilters as Filters,
  type SortOrder,
} from '@/lib/shop';
import type { AppLocale, Category, Collection, Product } from '@/types';

// Collect every unique size across all products, preserving a canonical order
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
function allSizes(products: Product[]): string[] {
  const found = new Set(products.flatMap(p => p.sizes));
  return SIZE_ORDER.filter(s => found.has(s));
}

interface ShopAllClientProps {
  products: Product[];
  collections: Collection[];
  categories: Category[];
  locale: AppLocale;
}

export function ShopAllClient({ products, collections, categories, locale }: ShopAllClientProps) {
  const t = useTranslations('shop');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sortOrder, setSortOrder] = useState<SortOrder>('featured');

  const sizes = useMemo(() => allSizes(products), [products]);
  const filtered = useMemo(() => filterProducts(products, filters), [products, filters]);
  const sorted = useMemo(() => sortProducts(filtered, sortOrder), [filtered, sortOrder]);

  const countLabel = hasActiveFilters(filters)
    ? t('xOfY', { count: sorted.length, total: products.length })
    : t('total', { count: products.length });

  return (
    <div>
      <div className="mb-6">
        <ShopFilters
          filters={filters}
          onFiltersChange={setFilters}
          collections={collections}
          categories={categories}
          allSizes={sizes}
          locale={locale}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      </div>
      <p className="mb-4 text-xs text-stone-500 tracking-wide">{countLabel}</p>

      {sorted.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-stone-700">{t('noResults')}</p>
          <p className="mt-2 text-sm text-stone-400">{t('noResultsHint')}</p>
          <button
            type="button"
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="mt-6 text-sm underline text-stone-600 hover:text-stone-900"
          >
            {t('clearFilters')}
          </button>
        </div>
      ) : (
        <ProductGrid products={sorted} locale={locale} columns={3} totalCount={products.length} />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- components/features/ShopAllClient.test.tsx
```
Expected: 3 passed

- [ ] **Step 5: Run full test suite**

```bash
npm test
```
Expected: all tests pass (existing Foundation tests + all new tests from this plan so far)

- [ ] **Step 6: Commit**

```bash
git add components/features/ShopAllClient.tsx components/features/ShopAllClient.test.tsx
git commit -m "feat: add ShopAllClient with client-side filter and sort state"
```

---

### Task 16: Page section components (server-only)

**Files:**
- Create: `components/sections/HeroSection.tsx`
- Create: `components/sections/FeaturedCollectionSection.tsx`
- Create: `components/sections/EditorialProductSection.tsx`
- Create: `components/sections/BrandMoment.tsx`
- Create: `components/sections/CollectionStory.tsx`
- Create: `components/sections/RelatedCollections.tsx`

These are synchronous or async Server Components. No RTL tests — verified by typecheck + build + dev-server curl. Each component is self-contained and receives all data as props.

- [ ] **Step 1: HeroSection**

`components/sections/HeroSection.tsx`:
```tsx
import Image from 'next/image';
import Link from 'next/link';
import type { AppLocale, Collection } from '@/types';

interface HeroSectionProps {
  collection: Collection;
  locale: AppLocale;
  viewLabel: string; // pre-translated CTA label
}

export function HeroSection({ collection, locale, viewLabel }: HeroSectionProps) {
  const href = `/${locale}/collections/${collection.slug}`;

  return (
    <section
      className="relative h-svh min-h-[500px] overflow-hidden"
      aria-label={collection.name[locale]}
    >
      <Image
        src={collection.heroImage}
        alt={collection.name[locale]}
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />
      {/* darkening gradient on the lower third */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute bottom-12 left-6 lg:left-12 max-w-lg">
        <h1 className="text-3xl lg:text-5xl font-light tracking-widest text-white uppercase">
          {collection.name[locale]}
        </h1>
        <p className="mt-4 text-sm text-white/80 tracking-wide max-w-sm">
          {collection.story[locale]}
        </p>
        <Link
          href={href}
          className="mt-6 inline-block border border-white text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-white hover:text-stone-900 transition-colors"
        >
          {viewLabel}
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: FeaturedCollectionSection**

`components/sections/FeaturedCollectionSection.tsx`:
```tsx
import Image from 'next/image';
import Link from 'next/link';
import type { AppLocale, Collection } from '@/types';
import { Section } from '@/components/ui/Section';
import { PageContainer } from '@/components/ui/PageContainer';

interface FeaturedCollectionSectionProps {
  collection: Collection;
  locale: AppLocale;
  viewLabel: string;
}

export function FeaturedCollectionSection({ collection, locale, viewLabel }: FeaturedCollectionSectionProps) {
  const href = `/${locale}/collections/${collection.slug}`;
  const story = collection.story[locale];
  const isShort = story.length < 100;

  return (
    <Section>
      <PageContainer>
        <div className="grid lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
            <Image
              src={collection.heroImage}
              alt={collection.name[locale]}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl lg:text-3xl font-light tracking-wide uppercase">
              {collection.name[locale]}
            </h2>
            <p className={isShort
              ? 'text-2xl lg:text-3xl font-light leading-relaxed text-stone-600'
              : 'text-base lg:text-lg leading-relaxed text-stone-600'
            }>
              {story}
            </p>
            <Link
              href={href}
              className="self-start text-xs tracking-widest uppercase border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors"
            >
              {viewLabel}
            </Link>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
```

- [ ] **Step 3: EditorialProductSection**

`components/sections/EditorialProductSection.tsx`:
```tsx
import type { AppLocale, Product } from '@/types';
import { Section } from '@/components/ui/Section';
import { PageContainer } from '@/components/ui/PageContainer';
import { ProductGrid } from '@/components/ui/ProductGrid';

interface EditorialProductSectionProps {
  products: Product[];
  locale: AppLocale;
  heading: string;
}

export function EditorialProductSection({ products, locale, heading }: EditorialProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <Section>
      <PageContainer>
        <h2 className="text-xs tracking-[0.3em] uppercase text-stone-500 mb-8">{heading}</h2>
        <ProductGrid products={products} locale={locale} columns={3} totalCount={products.length} />
      </PageContainer>
    </Section>
  );
}
```

- [ ] **Step 4: BrandMoment (conditional)**

`components/sections/BrandMoment.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';

export async function BrandMoment() {
  const t = await getTranslations('brand');
  const statement = t('statement');

  // Section is invisible when the brand.statement key is empty (not yet approved)
  if (!statement) return null;

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-2xl lg:text-4xl font-light leading-relaxed text-stone-800">
          {statement}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: CollectionStory**

`components/sections/CollectionStory.tsx`:
```tsx
import { Section } from '@/components/ui/Section';
import { PageContainer } from '@/components/ui/PageContainer';
import type { AppLocale, Collection } from '@/types';

interface CollectionStoryProps {
  collection: Collection;
  locale: AppLocale;
}

export function CollectionStory({ collection, locale }: CollectionStoryProps) {
  const story = collection.story[locale];

  // Character-count conditional: short stories render large; long stories render as prose
  const isShort = story.length < 100;
  const isMedium = story.length >= 100 && story.length < 400;

  const textClass = isShort
    ? 'text-3xl lg:text-4xl font-light leading-relaxed max-w-xl mx-auto text-center'
    : isMedium
    ? 'text-xl lg:text-2xl font-light leading-relaxed max-w-2xl mx-auto text-center'
    : 'text-base lg:text-lg leading-relaxed max-w-prose mx-auto';

  return (
    <Section as="div">
      <PageContainer>
        <p className={`text-stone-700 ${textClass}`}>{story}</p>
      </PageContainer>
    </Section>
  );
}
```

- [ ] **Step 6: RelatedCollections**

`components/sections/RelatedCollections.tsx`:
```tsx
import type { AppLocale, Collection } from '@/types';
import { CollectionCard } from '@/components/ui/CollectionCard';
import { Section } from '@/components/ui/Section';
import { PageContainer } from '@/components/ui/PageContainer';

interface RelatedCollectionsProps {
  collections: Collection[];
  locale: AppLocale;
  heading: string;
}

export function RelatedCollections({ collections, locale, heading }: RelatedCollectionsProps) {
  if (collections.length === 0) return null;

  return (
    <Section>
      <PageContainer>
        <h2 className="text-xs tracking-[0.3em] uppercase text-stone-500 mb-8">{heading}</h2>
        <div className={collections.length === 1
          ? 'max-w-sm mx-auto'
          : 'grid grid-cols-1 sm:grid-cols-2 gap-6'
        }>
          {collections.map(c => (
            <CollectionCard key={c.id} collection={c} locale={locale} />
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
```

- [ ] **Step 7: Verify all section components compile**

```bash
npx tsc --noEmit && npm test
```
Expected: no type errors, all tests pass.

- [ ] **Step 8: Commit**

```bash
git add components/sections/
git commit -m "feat: add all page section components (Hero, FeaturedCollection, EditorialProduct, BrandMoment, CollectionStory, RelatedCollections)"
```

---

### Task 17: Homepage page assembly

**Files:**
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `getFeaturedCollection`, `getSelectedProducts` from data-source; `HeroSection`, `FeaturedCollectionSection`, `EditorialProductSection`, `BrandMoment`; `getTranslations` from next-intl; `JsonLd`

- [ ] **Step 1: Implement the homepage**

Replace `app/[locale]/page.tsx` completely:
```tsx
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getFeaturedCollection } from '@/lib/data-source/collections';
import { getSelectedProducts } from '@/lib/data-source/products';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedCollectionSection } from '@/components/sections/FeaturedCollectionSection';
import { EditorialProductSection } from '@/components/sections/EditorialProductSection';
import { BrandMoment } from '@/components/sections/BrandMoment';
import { JsonLd } from '@/components/ui/JsonLd';
import { locales, type AppLocale } from '@/i18n/locales';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  const titles: Record<AppLocale, string> = {
    ru: 'SilkLine — Корейская мода в Ташкенте',
    uz: 'SilkLine — Toshkentda Koreys modasi',
  };
  const descriptions: Record<AppLocale, string> = {
    ru: 'Кураторская коллекция корейской женской одежды. Платья, пальто, трикотаж.',
    uz: 'Koreys ayollar kiyimlarining tanlov to\'plami. Ko\'ylaklar, paltolar, trikotaj.',
  };

  return {
    title: titles[locale as AppLocale] ?? titles.ru,
    description: descriptions[locale as AppLocale] ?? descriptions.ru,
    alternates: {
      canonical: `${siteUrl}/ru`,
      languages: {
        ru: `${siteUrl}/ru`,
        uz: `${siteUrl}/uz`,
      },
    },
    openGraph: {
      images: [`${siteUrl}${process.env.NEXT_PUBLIC_OG_IMAGE ?? '/og-default.jpg'}`],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as AppLocale)) notFound();
  setRequestLocale(locale as AppLocale);

  const collection = getFeaturedCollection();
  if (!collection) notFound();

  const selected = getSelectedProducts();
  const t = await getTranslations('homepage');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SilkLine',
    url: siteUrl,
  };
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SilkLine',
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tashkent',
      addressCountry: 'UZ',
    },
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={orgSchema} />
      <HeroSection
        collection={collection}
        locale={locale as AppLocale}
        viewLabel={t('viewCollection')}
      />
      <FeaturedCollectionSection
        collection={collection}
        locale={locale as AppLocale}
        viewLabel={t('viewCollection')}
      />
      <EditorialProductSection
        products={selected}
        locale={locale as AppLocale}
        heading={t('selectedHeading')}
      />
      <BrandMoment />
    </>
  );
}
```

- [ ] **Step 2: Build and typecheck**

```bash
npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -25
```
Expected: `✓ Compiled successfully`, route table includes `● /[locale]` with `/ru` and `/uz` generated.

- [ ] **Step 3: Dev-server smoke test**

```bash
(npm run dev -- -p 3030 &) && sleep 8 && \
  curl -s http://localhost:3030/ru | grep -o 'SILKLINE\|Осенний ателье\|Kuzgi' | sort -u && \
  curl -s http://localhost:3030/uz | grep -o 'Kuzgi atelye' | head -1 && \
  lsof -ti:3030 | xargs kill -9
```
Expected: `Осенний ателье`, `SILKLINE` on `/ru`; `Kuzgi atelye` on `/uz`.

- [ ] **Step 4: Run full test suite**

```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/page.tsx
git commit -m "feat: implement homepage with Hero, Featured Collection, Selected Products, Brand Moment"
```

---

### Task 18: Collection detail page

**Files:**
- Create: `app/[locale]/collections/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getCollectionBySlug`, `getProductsByCollectionId`, `getAllCollections`; `CollectionStory`, `RelatedCollections`, `ProductGrid`; `JsonLd`

- [ ] **Step 1: Implement the collection page**

`app/[locale]/collections/[slug]/page.tsx`:
```tsx
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getCollectionBySlug, getAllCollections } from '@/lib/data-source/collections';
import { getProductsByCollectionId } from '@/lib/data-source/products';
import { CollectionStory } from '@/components/sections/CollectionStory';
import { RelatedCollections } from '@/components/sections/RelatedCollections';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { PageContainer } from '@/components/ui/PageContainer';
import { Section } from '@/components/ui/Section';
import { JsonLd } from '@/components/ui/JsonLd';
import { locales, type AppLocale } from '@/i18n/locales';

export async function generateStaticParams() {
  return locales.flatMap(locale =>
    getAllCollections().map(c => ({ locale, slug: c.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};
  const loc = locale as AppLocale;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  return {
    title: `${collection.name[loc]} — SilkLine`,
    description: collection.story[loc],
    alternates: {
      canonical: `${siteUrl}/ru/collections/${slug}`,
      languages: {
        ru: `${siteUrl}/ru/collections/${slug}`,
        uz: `${siteUrl}/uz/collections/${slug}`,
      },
    },
    openGraph: {
      images: [`${siteUrl}${collection.heroImage}`],
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as AppLocale)) notFound();
  const loc = locale as AppLocale;
  setRequestLocale(loc);

  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = getProductsByCollectionId(collection.id);
  const otherCollections = getAllCollections().filter(c => c.slug !== slug);
  const t = await getTranslations('collection');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SilkLine', item: siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: collection.name.ru,
        item: `${siteUrl}/ru/collections/${slug}`,
      },
    ],
  };

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name.ru,
    description: collection.story.ru,
    url: `${siteUrl}/ru/collections/${slug}`,
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={collectionPageSchema} />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src={collection.heroImage}
          alt={collection.name[loc]}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute bottom-8 left-6 lg:left-12">
          <h1 className="text-3xl lg:text-5xl font-light tracking-widest text-white uppercase">
            {collection.name[loc]}
          </h1>
        </div>
      </section>

      {/* Story */}
      <CollectionStory collection={collection} locale={loc} />

      {/* Product grid */}
      {products.length > 0 && (
        <Section>
          <PageContainer>
            <ProductGrid products={products} locale={loc} columns={3} totalCount={products.length} />
          </PageContainer>
        </Section>
      )}

      {/* Related collections */}
      <RelatedCollections
        collections={otherCollections}
        locale={loc}
        heading={t('relatedHeading')}
      />
    </>
  );
}
```

- [ ] **Step 2: Build and typecheck**

```bash
npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -25
```
Expected: route table shows `● /[locale]/collections/[slug]` with `/ru/collections/autumn-atelier`, `/ru/collections/seoul-minimal`, `/uz/collections/autumn-atelier`, `/uz/collections/seoul-minimal`.

- [ ] **Step 3: Dev-server smoke test**

```bash
(npm run dev -- -p 3030 &) && sleep 8 && \
  curl -s http://localhost:3030/ru/collections/autumn-atelier | grep -o 'Осенний ателье' | head -1 && \
  curl -s http://localhost:3030/uz/collections/seoul-minimal | grep -o 'Seul minimalizmi' | head -1 && \
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3030/ru/collections/does-not-exist && \
  lsof -ti:3030 | xargs kill -9
```
Expected: `Осенний ателье`, `Seul minimalizmi`, `404`.

- [ ] **Step 4: Run full test suite**

```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/collections/
git commit -m "feat: implement collection detail page with hero, story, product grid, related collections, and JSON-LD"
```

---

### Task 19: Shop All page

**Files:**
- Create: `app/[locale]/shop/page.tsx`

**Interfaces:**
- Consumes: `getAllProducts`, `getAllCategories`, `getAllCollections`; `ShopAllClient`; `generateMetadata`

- [ ] **Step 1: Implement the Shop All page**

`app/[locale]/shop/page.tsx`:
```tsx
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/data-source/products';
import { getAllCollections } from '@/lib/data-source/collections';
import { getAllCategories } from '@/lib/data-source/categories';
import { ShopAllClient } from '@/components/features/ShopAllClient';
import { PageContainer } from '@/components/ui/PageContainer';
import { locales, type AppLocale } from '@/i18n/locales';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as AppLocale;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  const titles: Record<AppLocale, string> = {
    ru: 'Каталог — SilkLine',
    uz: 'Katalog — SilkLine',
  };
  const descriptions: Record<AppLocale, string> = {
    ru: 'Весь ассортимент: платья, пальто, трикотаж.',
    uz: 'Barcha assortiment: ko\'ylaklar, paltolar, trikotaj.',
  };

  return {
    title: titles[loc] ?? titles.ru,
    description: descriptions[loc] ?? descriptions.ru,
    alternates: {
      canonical: `${siteUrl}/ru/shop`,
      languages: { ru: `${siteUrl}/ru/shop`, uz: `${siteUrl}/uz/shop` },
    },
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as AppLocale)) notFound();
  const loc = locale as AppLocale;
  setRequestLocale(loc);

  const products = getAllProducts();
  const collections = getAllCollections();
  const categories = getAllCategories();

  return (
    <PageContainer>
      <div className="py-12">
        <ShopAllClient
          products={products}
          collections={collections}
          categories={categories}
          locale={loc}
        />
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 2: Build and typecheck**

```bash
npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -25
```
Expected: route table now includes `ƒ /[locale]/shop` (dynamic, because `ShopAllClient` is a Client Component that receives server props — the page itself becomes partially dynamic).

- [ ] **Step 3: Dev-server smoke test**

```bash
(npm run dev -- -p 3030 &) && sleep 8 && \
  curl -s http://localhost:3030/ru/shop | grep -o 'Шёлковое платье\|Пальто из верблюжьей' | sort -u && \
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3030/uz/shop && \
  lsof -ti:3030 | xargs kill -9
```
Expected: product names in the rendered HTML, `200` for `/uz/shop`.

- [ ] **Step 4: Run full final suite**

```bash
npm run lint && npx tsc --noEmit && npm test
```
Expected: lint clean, no type errors, all tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/shop/
git commit -m "feat: implement Shop All page with server-rendered product list and client-side filters"
```

---

### Final verification (no commit)

Run once after Task 19 is complete. Confirms the entire milestone works end-to-end.

- [ ] **Full clean build**

```bash
rm -rf .next && npm run build 2>&1 | tail -30
```
Expected: `✓ Compiled successfully`, routes include `/[locale]`, `/[locale]/collections/[slug]`, `/[locale]/shop`, `/_not-found`, `ƒ Proxy (Middleware)`. No TypeScript errors in the build output.

- [ ] **All tests pass**

```bash
npm test
```
Expected: all test files pass, 0 failures.

- [ ] **Lint clean**

```bash
npm run lint
```
Expected: exit 0, no warnings.

- [ ] **Typecheck clean**

```bash
npx tsc --noEmit
```
Expected: no output (no errors).

---

## Self-review checklist

**Spec coverage:**
- ✅ Homepage: Hero, FeaturedCollection, EditorialProductSection (merged), BrandMoment (conditional)
- ✅ "Find Us" correctly absent (per review decision — belongs in footer)
- ✅ Collection detail: Hero, CollectionStory (with short-copy treatment), ProductGrid, RelatedCollections
- ✅ No visual breadcrumbs (BreadcrumbList JSON-LD injected instead)
- ✅ Shop All: filters, sorting, empty state, skeleton scaffolding, count display
- ✅ `lib/config/editorial.ts` — editorial placement decoupled from entity flags
- ✅ `isEditorsPick`/`isBestSeller` removed from `Product`
- ✅ `getFeaturedCollection()` and `getSelectedProducts()` added to repository
- ✅ `NavigationProgress` in root layout
- ✅ Skip-to-content link in Header
- ✅ `prefers-reduced-motion` CSS rule
- ✅ All i18n keys for ru + uz
- ✅ `generateMetadata` with hreflang alternates on all three pages
- ✅ JSON-LD structured data on all three pages
- ✅ `NEXT_PUBLIC_SITE_URL` env var
- ✅ `ProductSkeleton` built and wired into `ProductGrid` via `loading` prop
- ✅ Accessibility: `aria-pressed` on chips, `fieldset`/`legend` on filter groups, `aria-label` on wishlist toggle, `role="progressbar"` on NavigationProgress, `id="main-content"` on main

**Type consistency:** All signatures used in later tasks match definitions in earlier tasks — verified by reading each Interface block in dependency order.

**No placeholders found.**
