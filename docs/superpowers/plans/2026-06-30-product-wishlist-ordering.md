# Product, Wishlist & Ordering — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the product detail page with its image gallery, size selection, Telegram/WhatsApp order CTAs, and "Complete the Look" section; and the localStorage-backed wishlist drawer accessible from the Header — together completing the full "view and buy" flow for V1.

**Architecture:** Product pages are statically generated Server Components (`generateStaticParams` over all product slugs × all locales). Order CTAs, size selection, and the wishlist drawer are isolated Client Components. The product gallery is a Client Component (interactive image switching). Existing repository functions (`getProductBySlug`, `getRelatedProducts`) are the only data access on the product page. The wishlist drawer reads product data through `getAllProducts()` from the repository layer — the existing convention (only `lib/data-source/*` imports `@/data/*`) is preserved. No new npm dependencies are introduced.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, next-intl, Vitest + React Testing Library. CSS transitions only — no Framer Motion.

## Global Constraints

- Telegram/WhatsApp links use only `TELEGRAM_USERNAME`/`WHATSAPP_NUMBER` from `lib/links/config.ts`.
- Bilingual: Russian (`ru`, default) + Uzbek (`uz`) — every user-facing string ships in both.
- No `tailwind.config.ts` — design tokens in `app/globals.css` `@theme inline` block only.
- No Framer Motion — CSS transitions only.
- `lib/data-source/*` is the only code that imports `@/data/*` — existing convention maintained.
- Server Components must not contain branching/filtering/sorting domain logic.
- Every commit: `npm run lint && npx tsc --noEmit && npm test` must pass.
- The link builder changes in Task 1 are backward-compatible: the new `size` parameter is optional and all existing tests continue to pass unchanged.

---

## File Map

```
lib/utils/format.ts              NEW  — shared formatPrice() extracted from ProductCard
lib/utils/format.test.ts         NEW  — unit tests for formatPrice
lib/links/telegram.ts            MOD  — add optional size param to message
lib/links/whatsapp.ts            MOD  — add optional size param to message
lib/links/telegram.test.ts       MOD  — add tests for size-included message
lib/links/whatsapp.test.ts       MOD  — add tests for size-included message
lib/data-source/products.ts      MOD  — add getProductsByIds()
lib/data-source/products.test.ts MOD  — add tests for getProductsByIds()
components/ui/ProductCard.tsx    MOD  — import formatPrice from lib/utils/format
messages/ru.json                 MOD  — add product.order.*, wishlist.* keys
messages/uz.json                 MOD  — add product.order.*, wishlist.* keys
components/ui/ProductGallery.tsx          NEW  — client, image display
components/ui/ProductGallery.test.tsx     NEW
components/ui/SizeSelector.tsx            NEW  — client, controlled size chips
components/ui/SizeSelector.test.tsx       NEW
components/features/ProductOrderActions.tsx       NEW  — client, size + CTA + wishlist
components/features/ProductOrderActions.test.tsx  NEW
components/features/WishlistDrawer.tsx    NEW  — client, slide-over panel
components/features/WishlistButton.tsx    NEW  — client, header icon + drawer trigger
components/features/WishlistButton.test.tsx  NEW
components/layout/Header.tsx     MOD  — add WishlistButton island
app/[locale]/product/[slug]/page.tsx  NEW  — product detail page
```

---

### Task 1: Shared `formatPrice` utility

**Files:**
- Create: `lib/utils/format.ts`
- Create: `lib/utils/format.test.ts`
- Modify: `components/ui/ProductCard.tsx` (import from new location, remove local definition)

**Interfaces:**
- Produces: `formatPrice(price: number): string` — formats UZS price as `"890 000 сум"` using `Intl.NumberFormat('ru-RU')`

- [ ] **Step 1: Write the failing test**

`lib/utils/format.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { formatPrice } from './format';

describe('formatPrice', () => {
  it('formats a round number with thousands separator', () => {
    // ru-RU uses non-breaking space as thousands separator → normalize for comparison
    expect(formatPrice(890000).replace(/\s/g, ' ')).toBe('890 000 сум');
  });

  it('formats a six-digit number correctly', () => {
    expect(formatPrice(480000).replace(/\s/g, ' ')).toBe('480 000 сум');
  });

  it('formats a seven-digit number correctly', () => {
    expect(formatPrice(1690000).replace(/\s/g, ' ')).toBe('1 690 000 сум');
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- lib/utils/format.test.ts
```
Expected: `Cannot find module './format'`

- [ ] **Step 3: Implement**

`lib/utils/format.ts`:
```ts
const formatter = new Intl.NumberFormat('ru-RU');

export function formatPrice(price: number): string {
  return formatter.format(price) + ' сум';
}
```

Note: ` ` is a non-breaking space before "сум" — prevents the unit from wrapping to a new line. The `formatter` instance is created once at module level (not per call).

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- lib/utils/format.test.ts
```
Expected: 3 passed.

- [ ] **Step 5: Update ProductCard to import from shared utility**

`components/ui/ProductCard.tsx` — remove lines 6–8 (the local `formatPrice` function definition) and add import at the top:
```ts
import { formatPrice } from '@/lib/utils/format';
```

The rest of `ProductCard.tsx` is unchanged.

- [ ] **Step 6: Run full test suite — confirm no regressions**

```bash
npm test
```
Expected: all tests pass (ProductCard tests included, since formatPrice behavior is identical).

- [ ] **Step 7: Commit**

```bash
git add lib/utils/ components/ui/ProductCard.tsx
git commit -m "feat: extract formatPrice into shared lib/utils/format utility"
```

---

### Task 2: Link builders — add optional size parameter

**Files:**
- Modify: `lib/links/telegram.ts`
- Modify: `lib/links/whatsapp.ts`
- Modify: `lib/links/telegram.test.ts`
- Modify: `lib/links/whatsapp.test.ts`

**Interfaces:**
- Produces:
  - `buildTelegramOrderLink(product: Product, locale: AppLocale, origin: string, size?: string): string`
  - `buildWhatsappOrderLink(product: Product, locale: AppLocale, origin: string, size?: string): string`
- When `size` is provided: message is `"{name}, размер {size} — {url}"` in Russian and `"{name}, o'lcham {size} — {url}"` in Uzbek.
- When `size` is omitted or `undefined`: message is unchanged from current: `"{name} — {url}"`. **All existing tests continue to pass without modification.**

- [ ] **Step 1: Add failing tests (append to existing test files)**

Add to `lib/links/telegram.test.ts`:
```ts
  it('includes size in the message when size is provided', () => {
    const link = buildTelegramOrderLink(product, 'ru', 'https://silkline.uz', 'M');
    expect(link).toContain(encodeURIComponent('M'));
    expect(link).toContain(encodeURIComponent('Шёлковое платье'));
  });

  it('does not change the message when size is undefined', () => {
    const withSize = buildTelegramOrderLink(product, 'ru', 'https://silkline.uz', undefined);
    const without = buildTelegramOrderLink(product, 'ru', 'https://silkline.uz');
    expect(withSize).toBe(without);
  });
```

Add to `lib/links/whatsapp.test.ts`:
```ts
  it('includes size in the message when size is provided', () => {
    const link = buildWhatsappOrderLink(product, 'ru', 'https://silkline.uz', 'L');
    expect(link).toContain(encodeURIComponent('L'));
    expect(link).toContain(encodeURIComponent('Шёлковое платье'));
  });
```

- [ ] **Step 2: Run tests — expect new tests FAIL, existing tests PASS**

```bash
npm test -- lib/links
```
Expected: 2 new tests fail (size param not yet accepted), 3 existing tests pass.

- [ ] **Step 3: Update telegram.ts**

`lib/links/telegram.ts`:
```ts
import type { AppLocale, Product } from '@/types';
import { TELEGRAM_USERNAME } from './config';

const SIZE_LABEL: Record<AppLocale, string> = {
  ru: 'размер',
  uz: "o'lcham",
};

export function buildTelegramOrderLink(
  product: Product,
  locale: AppLocale,
  origin: string,
  size?: string
): string {
  const productUrl = `${origin}/${locale}/product/${product.slug}`;
  const namePart = size
    ? `${product.name[locale]}, ${SIZE_LABEL[locale]} ${size}`
    : product.name[locale];
  const message = `${namePart} — ${productUrl}`;
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
}
```

`lib/links/whatsapp.ts`:
```ts
import type { AppLocale, Product } from '@/types';
import { WHATSAPP_NUMBER } from './config';

const SIZE_LABEL: Record<AppLocale, string> = {
  ru: 'размер',
  uz: "o'lcham",
};

export function buildWhatsappOrderLink(
  product: Product,
  locale: AppLocale,
  origin: string,
  size?: string
): string {
  const productUrl = `${origin}/${locale}/product/${product.slug}`;
  const namePart = size
    ? `${product.name[locale]}, ${SIZE_LABEL[locale]} ${size}`
    : product.name[locale];
  const message = `${namePart} — ${productUrl}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 4: Run tests — expect all PASS**

```bash
npm test -- lib/links
```
Expected: 5 passed (3 original + 2 new per file = actually 3 existing + 3 new total for telegram, 1 existing + 1 new for whatsapp = 5 link tests total currently… run and verify the count).

- [ ] **Step 5: Commit**

```bash
git add lib/links/
git commit -m "feat: add optional size parameter to order link builders"
```

---

### Task 3: `getProductsByIds` repository function

**Files:**
- Modify: `lib/data-source/products.ts`
- Modify: `lib/data-source/products.test.ts`

**Interfaces:**
- Produces: `getProductsByIds(ids: string[]): Product[]` — returns products whose `id` matches any entry in `ids`, in the order the IDs appear in the input array. Returns `[]` for empty input. Silently drops unknown IDs.

- [ ] **Step 1: Write the failing tests**

Add to `lib/data-source/products.test.ts` (append new `describe` block):
```ts
import { getProductsByIds } from './products';

describe('getProductsByIds', () => {
  it('returns an empty array for empty input', () => {
    expect(getProductsByIds([])).toHaveLength(0);
  });

  it('returns matched products in input order', () => {
    const result = getProductsByIds(['p-wool-coat', 'p-wrap-dress']);
    expect(result.map(p => p.id)).toEqual(['p-wool-coat', 'p-wrap-dress']);
  });

  it('silently drops unknown ids', () => {
    const result = getProductsByIds(['p-wrap-dress', 'does-not-exist']);
    expect(result.map(p => p.id)).toEqual(['p-wrap-dress']);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- lib/data-source/products.test.ts
```
Expected: `getProductsByIds is not a function`

- [ ] **Step 3: Implement**

Add to `lib/data-source/products.ts`:
```ts
export function getProductsByIds(ids: string[]): Product[] {
  if (ids.length === 0) return [];
  return ids
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined);
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- lib/data-source/products.test.ts
```
Expected: all data-source product tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/data-source/products.ts lib/data-source/products.test.ts
git commit -m "feat: add getProductsByIds repository function"
```

---

### Task 4: i18n additions for product and wishlist

**Files:**
- Modify: `messages/ru.json`
- Modify: `messages/uz.json`

No tests — static content. Verification: `npm test` passes (existing tests intact) and `npx tsc --noEmit` passes.

- [ ] **Step 1: Update `messages/ru.json`**

Add these keys to the existing file. The `product` namespace already has `addToWishlist` and `removeFromWishlist` — extend it:

```json
{
  "nav": { ... },
  "footer": { ... },
  "homepage": { ... },
  "collection": { ... },
  "shop": { ... },
  "filters": { ... },
  "sort": { ... },
  "product": {
    "addToWishlist": "Добавить {name} в список желаний",
    "removeFromWishlist": "Удалить {name} из списка желаний",
    "order": {
      "telegram": "Заказать в Telegram",
      "whatsapp": "Заказать в WhatsApp"
    },
    "selectSize": "Выберите размер",
    "completeTheLook": "Дополните образ",
    "details": "О товаре"
  },
  "wishlist": {
    "heading": "Список желаний",
    "empty": "В вашем списке желаний пока ничего нет.",
    "emptyHint": "Нажмите на сердечко рядом с товаром, чтобы сохранить его.",
    "open": "Открыть список желаний",
    "close": "Закрыть",
    "count": "{count}"
  },
  "brand": {
    "statement": ""
  }
}
```

Replace the full file content (preserving all existing keys, adding new ones).

- [ ] **Step 2: Update `messages/uz.json`**

Same structure, Uzbek translations:

```json
{
  "nav": { ... },
  "footer": { ... },
  "homepage": { ... },
  "collection": { ... },
  "shop": { ... },
  "filters": { ... },
  "sort": { ... },
  "product": {
    "addToWishlist": "{name} ni istaklarga qo'shish",
    "removeFromWishlist": "{name} ni istaklardan o'chirish",
    "order": {
      "telegram": "Telegramda buyurtma berish",
      "whatsapp": "WhatsAppda buyurtma berish"
    },
    "selectSize": "O'lchamni tanlang",
    "completeTheLook": "Uslubni to'ldiring",
    "details": "Mahsulot haqida"
  },
  "wishlist": {
    "heading": "Istaklар ro'yxati",
    "empty": "Istaklар ro'yxatingiz hali bo'sh.",
    "emptyHint": "Saqlash uchun mahsulot yonidagi yurakcha belgisini bosing.",
    "open": "Istaklар ro'yxatini ochish",
    "close": "Yopish",
    "count": "{count}"
  },
  "brand": {
    "statement": ""
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
git commit -m "feat: add product and wishlist i18n keys"
```

---

### Task 5: `ProductGallery` component

**Files:**
- Create: `components/ui/ProductGallery.tsx`
- Create: `components/ui/ProductGallery.test.tsx`

**Interfaces:**
- Produces: `<ProductGallery images={string[]} name={string} priority?: boolean />`
- When `images` is empty: renders the placeholder SVG.
- When `images` has exactly 1 entry: renders it full-width.
- When `images` has 2+ entries: renders the first as the main image and shows a scrollable thumbnail row below. Clicking a thumbnail replaces the main image.

The current seed data has 1 placeholder image per product, so the multi-image path is scaffolded but not exercised in the test environment.

- [ ] **Step 1: Write the failing tests**

`components/ui/ProductGallery.test.tsx`:
```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductGallery } from './ProductGallery';

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [k: string]: unknown }) => (
    <img src={src} alt={alt} {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />
  ),
}));

describe('ProductGallery', () => {
  it('renders the first image with the product name as alt text', () => {
    render(<ProductGallery images={['/img1.jpg']} name="Test Dress" />);
    expect(screen.getByRole('img', { name: 'Test Dress' })).toBeInTheDocument();
  });

  it('falls back to the placeholder when images array is empty', () => {
    render(<ProductGallery images={[]} name="Test Dress" />);
    const img = screen.getByRole('img', { name: 'Test Dress' });
    expect(img.getAttribute('src')).toContain('placeholder');
  });

  it('renders thumbnail buttons when more than one image is provided', () => {
    render(<ProductGallery images={['/img1.jpg', '/img2.jpg']} name="Test Dress" />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('switches the main image when a thumbnail is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductGallery images={['/img1.jpg', '/img2.jpg']} name="Test Dress" />);
    const thumbnails = screen.getAllByRole('button');
    await user.click(thumbnails[1]);
    const mainImg = screen.getAllByRole('img')[0];
    expect(mainImg.getAttribute('src')).toBe('/img2.jpg');
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- components/ui/ProductGallery.test.tsx
```
Expected: `Cannot find module './ProductGallery'`

- [ ] **Step 3: Implement**

`components/ui/ProductGallery.tsx`:
```tsx
'use client';
import { useState } from 'react';
import Image from 'next/image';

const PLACEHOLDER = '/placeholders/product-placeholder.svg';

interface ProductGalleryProps {
  images: string[];
  name: string;
  priority?: boolean;
}

export function ProductGallery({ images, name, priority = false }: ProductGalleryProps) {
  const srcs = images.length > 0 ? images : [PLACEHOLDER];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <Image
          src={srcs[activeIndex]}
          alt={name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {srcs.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {srcs.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`${name} — image ${i + 1}`}
              aria-pressed={i === activeIndex}
              onClick={() => setActiveIndex(i)}
              className={`relative shrink-0 aspect-square w-16 overflow-hidden bg-stone-100 border ${
                i === activeIndex ? 'border-stone-900' : 'border-transparent'
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- components/ui/ProductGallery.test.tsx
```
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add components/ui/ProductGallery.tsx components/ui/ProductGallery.test.tsx
git commit -m "feat: add ProductGallery component with image switching"
```

---

### Task 6: `SizeSelector` component

**Files:**
- Create: `components/ui/SizeSelector.tsx`
- Create: `components/ui/SizeSelector.test.tsx`

**Interfaces:**
- Produces: `<SizeSelector sizes={string[]} selected={string | null} onChange={(size: string | null) => void} />`
- Clicking an unselected chip calls `onChange(size)`.
- Clicking the already-selected chip calls `onChange(null)` (deselects).
- Each chip: `type="button"`, `aria-pressed={size === selected}`.

- [ ] **Step 1: Write the failing tests**

`components/ui/SizeSelector.test.tsx`:
```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SizeSelector } from './SizeSelector';

describe('SizeSelector', () => {
  it('renders a button for each size', () => {
    render(<SizeSelector sizes={['S', 'M', 'L']} selected={null} onChange={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('has aria-pressed=false on unselected chips', () => {
    render(<SizeSelector sizes={['S', 'M']} selected={null} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'S' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('has aria-pressed=true on the selected chip', () => {
    render(<SizeSelector sizes={['S', 'M']} selected="M" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'M' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onChange with the size when an unselected chip is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SizeSelector sizes={['S', 'M']} selected={null} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'S' }));
    expect(onChange).toHaveBeenCalledWith('S');
  });

  it('calls onChange with null when the selected chip is clicked (deselect)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SizeSelector sizes={['S', 'M']} selected="S" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'S' }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- components/ui/SizeSelector.test.tsx
```
Expected: `Cannot find module './SizeSelector'`

- [ ] **Step 3: Implement**

`components/ui/SizeSelector.tsx`:
```tsx
'use client';

interface SizeSelectorProps {
  sizes: string[];
  selected: string | null;
  onChange: (size: string | null) => void;
}

export function SizeSelector({ sizes, selected, onChange }: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(size => (
        <button
          key={size}
          type="button"
          aria-pressed={size === selected}
          onClick={() => onChange(size === selected ? null : size)}
          className={`
            px-4 py-2 text-sm border transition-colors duration-150
            ${size === selected
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-stone-700 border-stone-300 hover:border-stone-700'
            }
          `.trim()}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- components/ui/SizeSelector.test.tsx
```
Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add components/ui/SizeSelector.tsx components/ui/SizeSelector.test.tsx
git commit -m "feat: add SizeSelector component with aria-pressed state"
```

---

### Task 7: `ProductOrderActions` component

**Files:**
- Create: `components/features/ProductOrderActions.tsx`
- Create: `components/features/ProductOrderActions.test.tsx`

**Interfaces:**
- Produces: `<ProductOrderActions product={Product} locale={AppLocale} />`
- Manages `selectedSize: string | null` in local state.
- Renders: `SizeSelector`, Telegram CTA link, WhatsApp CTA link, `WishlistToggle`.
- CTAs are `<a>` elements with `target="_blank" rel="noopener noreferrer"`.
- The href is computed at render time using `window.location.origin` (falls back to `NEXT_PUBLIC_SITE_URL` env var on SSR).

- [ ] **Step 1: Write the failing tests**

`components/features/ProductOrderActions.test.tsx`:
```tsx
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductOrderActions } from './ProductOrderActions';
import type { Product } from '@/types';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/ui/WishlistToggle', () => ({
  WishlistToggle: ({ productName }: { productName: string }) => (
    <button aria-label={`wishlist-${productName}`} />
  ),
}));

vi.mock('@/components/ui/SizeSelector', () => ({
  SizeSelector: ({
    sizes,
    onChange,
  }: {
    sizes: string[];
    selected: string | null;
    onChange: (s: string | null) => void;
  }) => (
    <div>
      {sizes.map(s => (
        <button key={s} onClick={() => onChange(s)}>
          {s}
        </button>
      ))}
    </div>
  ),
}));

beforeEach(() => { localStorage.clear(); });

const product: Product = {
  id: 'p1',
  slug: 'test-product',
  name: { ru: 'Тест', uz: 'Test' },
  description: { ru: '', uz: '' },
  collectionId: 'col-a',
  categoryId: 'cat-a',
  images: [],
  sizes: ['S', 'M', 'L'],
  price: 500000,
  relatedProductIds: [],
};

describe('ProductOrderActions', () => {
  it('renders size chips for every size on the product', () => {
    render(<ProductOrderActions product={product} locale="ru" />);
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('renders the Telegram CTA link', () => {
    render(<ProductOrderActions product={product} locale="ru" />);
    const link = screen.getByRole('link', { name: 'order.telegram' });
    expect(link.getAttribute('href')).toContain('t.me');
  });

  it('renders the WhatsApp CTA link', () => {
    render(<ProductOrderActions product={product} locale="ru" />);
    const link = screen.getByRole('link', { name: 'order.whatsapp' });
    expect(link.getAttribute('href')).toContain('wa.me');
  });

  it('renders the wishlist toggle', () => {
    render(<ProductOrderActions product={product} locale="ru" />);
    expect(screen.getByLabelText('wishlist-Тест')).toBeInTheDocument();
  });

  it('includes the selected size in the order link after selection', async () => {
    const user = userEvent.setup();
    render(<ProductOrderActions product={product} locale="ru" />);
    await user.click(screen.getByText('M'));
    const telegramLink = screen.getByRole('link', { name: 'order.telegram' });
    expect(telegramLink.getAttribute('href')).toContain(encodeURIComponent('M'));
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- components/features/ProductOrderActions.test.tsx
```
Expected: `Cannot find module './ProductOrderActions'`

- [ ] **Step 3: Implement**

`components/features/ProductOrderActions.tsx`:
```tsx
'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SizeSelector } from '@/components/ui/SizeSelector';
import { WishlistToggle } from '@/components/ui/WishlistToggle';
import { buildTelegramOrderLink } from '@/lib/links/telegram';
import { buildWhatsappOrderLink } from '@/lib/links/whatsapp';
import type { AppLocale, Product } from '@/types';

interface ProductOrderActionsProps {
  product: Product;
  locale: AppLocale;
}

export function ProductOrderActions({ product, locale }: ProductOrderActionsProps) {
  const t = useTranslations('product');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz');

  const telegramHref = buildTelegramOrderLink(
    product,
    locale,
    origin,
    selectedSize ?? undefined
  );
  const whatsappHref = buildWhatsappOrderLink(
    product,
    locale,
    origin,
    selectedSize ?? undefined
  );

  return (
    <div className="flex flex-col gap-6">
      {product.sizes.length > 0 && (
        <div>
          <p className="mb-3 text-xs tracking-widest uppercase text-stone-500">
            {t('selectSize')}
          </p>
          <SizeSelector
            sizes={product.sizes}
            selected={selectedSize}
            onChange={setSelectedSize}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <a
          href={telegramHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border border-stone-900 bg-stone-900 text-white text-xs tracking-widest uppercase px-6 py-4 hover:bg-stone-700 transition-colors"
        >
          {t('order.telegram')}
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border border-stone-300 text-stone-700 text-xs tracking-widest uppercase px-6 py-4 hover:border-stone-700 transition-colors"
        >
          {t('order.whatsapp')}
        </a>
      </div>

      <WishlistToggle productId={product.id} productName={product.name[locale]} />
    </div>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- components/features/ProductOrderActions.test.tsx
```
Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add components/features/ProductOrderActions.tsx components/features/ProductOrderActions.test.tsx
git commit -m "feat: add ProductOrderActions component with size selection and order CTAs"
```

---

### Task 8: `WishlistButton` and `WishlistDrawer` components

**Files:**
- Create: `components/features/WishlistDrawer.tsx`
- Create: `components/features/WishlistButton.tsx`
- Create: `components/features/WishlistButton.test.tsx`

**Interfaces:**
- `WishlistDrawer`: `<WishlistDrawer isOpen={boolean} onClose={() => void} locale={AppLocale} />`
  - Reads `useWishlist()` for product IDs.
  - Calls `getAllProducts()` from the repository (works in client context — no server-only APIs in the data layer).
  - Filters to wishlisted products.
  - Renders a slide-over panel from the right.
  - Renders `ProductCard` per wishlisted product.
  - Empty state when wishlist is empty.
- `WishlistButton`: `<WishlistButton locale={AppLocale} />`
  - Manages `isOpen` state.
  - Renders a heart icon button with a count badge (hidden when count = 0).
  - Opens/closes `WishlistDrawer`.

- [ ] **Step 1: Write the failing tests**

`components/features/WishlistButton.test.tsx`:
```tsx
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WishlistButton } from './WishlistButton';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/features/WishlistDrawer', () => ({
  WishlistDrawer: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? <div role="dialog"><button onClick={onClose}>close</button></div> : null,
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

beforeEach(() => { localStorage.clear(); });

describe('WishlistButton', () => {
  it('renders a button', () => {
    render(<WishlistButton locale="ru" />);
    expect(screen.getByRole('button', { name: 'open' })).toBeInTheDocument();
  });

  it('opens the wishlist drawer when clicked', async () => {
    const user = userEvent.setup();
    render(<WishlistButton locale="ru" />);
    await user.click(screen.getByRole('button', { name: 'open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes the drawer when onClose is called', async () => {
    const user = userEvent.setup();
    render(<WishlistButton locale="ru" />);
    await user.click(screen.getByRole('button', { name: 'open' }));
    await user.click(screen.getByRole('button', { name: 'close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- components/features/WishlistButton.test.tsx
```
Expected: `Cannot find module './WishlistButton'`

- [ ] **Step 3: Implement WishlistDrawer**

`components/features/WishlistDrawer.tsx`:
```tsx
'use client';
import { useTranslations } from 'next-intl';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { getAllProducts } from '@/lib/data-source/products';
import { ProductCard } from '@/components/ui/ProductCard';
import type { AppLocale } from '@/types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: AppLocale;
}

export function WishlistDrawer({ isOpen, onClose, locale }: WishlistDrawerProps) {
  const t = useTranslations('wishlist');
  const { wishlist } = useWishlist();

  const allProducts = getAllProducts();
  const wishlisted = allProducts.filter(p => wishlist.has(p.id));

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('heading')}
        className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-xl"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
          <h2 className="text-sm font-medium tracking-wide uppercase">{t('heading')}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="text-stone-400 hover:text-stone-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {wishlisted.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-600">{t('empty')}</p>
              <p className="mt-2 text-sm text-stone-400">{t('emptyHint')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {wishlisted.map(product => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Implement WishlistButton**

`components/features/WishlistButton.tsx`:
```tsx
'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { WishlistDrawer } from './WishlistDrawer';
import type { AppLocale } from '@/types';

interface WishlistButtonProps {
  locale: AppLocale;
}

export function WishlistButton({ locale }: WishlistButtonProps) {
  const t = useTranslations('wishlist');
  const { wishlist } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const count = wishlist.size;

  return (
    <>
      <button
        type="button"
        aria-label={t('open')}
        onClick={() => setIsOpen(true)}
        className="relative p-1 text-stone-600 hover:text-stone-900 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        {count > 0 && (
          <span
            aria-label={t('count', { count })}
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white text-[10px] font-medium leading-none"
          >
            {count}
          </span>
        )}
      </button>

      <WishlistDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        locale={locale}
      />
    </>
  );
}
```

Note: `useWishlist()` from Task 4 returns `{ toggle, isWishlisted }`. We need `.wishlist` (the `Set` itself) to get `.size`. Update the hook's return value to include `wishlist`:

In `lib/hooks/useWishlist.ts`, change the return statement:
```ts
return { toggle, isWishlisted, wishlist: ids };
```

This is additive — existing consumers (`WishlistToggle`) only destructure `{ toggle, isWishlisted }` so they are unaffected.

- [ ] **Step 5: Run tests — expect PASS**

```bash
npm test -- components/features/WishlistButton.test.tsx
```
Expected: 3 passed.

- [ ] **Step 6: Run full test suite**

```bash
npm test
```
Expected: all tests pass (useWishlist tests still pass since the hook's new `wishlist` return is additive).

- [ ] **Step 7: Commit**

```bash
git add components/features/WishlistDrawer.tsx components/features/WishlistButton.tsx components/features/WishlistButton.test.tsx lib/hooks/useWishlist.ts
git commit -m "feat: add WishlistButton and WishlistDrawer components"
```

---

### Task 9: Header — add WishlistButton island

**Files:**
- Modify: `components/layout/Header.tsx`

**Interfaces:**
- Consumes: `WishlistButton` from `@/components/features/WishlistButton`
- Change: adds `<WishlistButton locale={locale} />` between the `<nav>` and `<LocaleSwitcher />` in the existing header layout

No new tests (Header is an async Server Component — verified by build and the existing LocaleSwitcher test pattern). Verified by `npx tsc --noEmit` + dev server smoke test.

- [ ] **Step 1: Read the current Header**

```bash
cat components/layout/Header.tsx
```

- [ ] **Step 2: Add the import and the WishlistButton**

In `components/layout/Header.tsx`, add after the existing imports:
```ts
import { WishlistButton } from '@/components/features/WishlistButton';
```

In the JSX, add `<WishlistButton locale={locale} />` between `</nav>` and `<LocaleSwitcher currentLocale={locale} />`:

```tsx
    </nav>
    <div className="flex items-center gap-4">
      <WishlistButton locale={locale} />
      <LocaleSwitcher currentLocale={locale} />
    </div>
```

This replaces the bare `<LocaleSwitcher currentLocale={locale} />` with a wrapper `<div>` that groups both the wishlist button and the locale switcher on the right side of the header.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit && npm test
```
Expected: no type errors, all tests pass.

- [ ] **Step 4: Manual dev-server check**

```bash
(npm run dev -- -p 3080 &) && sleep 8 && \
  curl -s http://localhost:3080/ru | grep -o 'wishlist\|Список' | head -2 && \
  lsof -ti:3080 | xargs kill -9 2>/dev/null
```
Expected: wishlist button markup present in rendered HTML.

- [ ] **Step 5: Commit**

```bash
git add components/layout/Header.tsx
git commit -m "feat: add WishlistButton to Header"
```

---

### Task 10: Product detail page assembly

**Files:**
- Create: `app/[locale]/product/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getProductBySlug`, `getRelatedProducts`, `getAllProducts` from data-source; `ProductGallery`, `ProductOrderActions`, `EditorialProductSection`; `JsonLd`; `formatPrice` from `lib/utils/format`
- `generateStaticParams`: all `product.slug` × all `locales` = 6 products × 2 locales = 12 static pages
- `generateMetadata`: localized title + description, hreflang alternates, OG image from `product.images[0]`
- Page sections (exact order):
  1. Left column: `ProductGallery` (with `priority`)
  2. Right column: product name (`<h1>`), price, description, `ProductOrderActions`
  3. Full-width: "Complete the Look" (`EditorialProductSection` with related products, shown only when `relatedProducts.length > 0`)
- JSON-LD: `Product` schema.org type with `offers`

- [ ] **Step 1: Create the directory and page**

```bash
mkdir -p "app/[locale]/product/[slug]"
```

`app/[locale]/product/[slug]/page.tsx`:
```tsx
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getProductBySlug, getRelatedProducts, getAllProducts } from '@/lib/data-source/products';
import { ProductGallery } from '@/components/ui/ProductGallery';
import { ProductOrderActions } from '@/components/features/ProductOrderActions';
import { EditorialProductSection } from '@/components/sections/EditorialProductSection';
import { JsonLd } from '@/components/ui/JsonLd';
import { PageContainer } from '@/components/ui/PageContainer';
import { formatPrice } from '@/lib/utils/format';
import { locales, type AppLocale } from '@/i18n/locales';

export async function generateStaticParams() {
  return locales.flatMap(locale =>
    getAllProducts().map(p => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const loc = locale as AppLocale;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  return {
    title: `${product.name[loc]} — SilkLine`,
    description: product.description[loc],
    alternates: {
      canonical: `${siteUrl}/ru/product/${slug}`,
      languages: {
        ru: `${siteUrl}/ru/product/${slug}`,
        uz: `${siteUrl}/uz/product/${slug}`,
      },
    },
    openGraph: {
      images: [`${siteUrl}${product.images[0] ?? '/placeholders/product-placeholder.svg'}`],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as AppLocale)) notFound();
  const loc = locale as AppLocale;
  setRequestLocale(loc);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product);
  const t = await getTranslations('product');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name.ru,
    description: product.description.ru,
    image: `${siteUrl}${product.images[0] ?? '/placeholders/product-placeholder.svg'}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'UZS',
      price: product.price,
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/ru/product/${slug}`,
    },
  };

  return (
    <>
      <JsonLd data={productSchema} />

      <PageContainer>
        <div className="py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left: gallery */}
            <ProductGallery
              images={product.images}
              name={product.name[loc]}
              priority
            />

            {/* Right: product info + order actions */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-light tracking-wide">
                  {product.name[loc]}
                </h1>
                <p className="mt-2 text-xl text-stone-600">{formatPrice(product.price)}</p>
              </div>

              {product.description[loc] && (
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">
                    {t('details')}
                  </p>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {product.description[loc]}
                  </p>
                </div>
              )}

              <ProductOrderActions product={product} locale={loc} />
            </div>
          </div>
        </div>
      </PageContainer>

      {relatedProducts.length > 0 && (
        <EditorialProductSection
          products={relatedProducts}
          locale={loc}
          heading={t('completeTheLook')}
        />
      )}
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Build**

```bash
rm -rf .next && npm run build 2>&1 | tail -30
```
Expected: `✓ Compiled successfully`. Route table includes:
```
└ ● /[locale]/product/[slug]
  ├ /ru/product/silk-wrap-dress
  ├ /ru/product/camel-wool-coat
  ... (12 product pages total, 6 products × 2 locales)
```

- [ ] **Step 4: Dev-server smoke test**

```bash
(npm run dev -- -p 3090 &) && sleep 8 && \
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3090/ru/product/silk-wrap-dress && \
  curl -s http://localhost:3090/ru/product/silk-wrap-dress | grep -o 'Шёлковое платье на запах' | head -1 && \
  curl -s http://localhost:3090/uz/product/satin-slip-dress | grep -o "Sateindan kombinatsiya" | head -1 && \
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3090/ru/product/does-not-exist && \
  curl -s http://localhost:3090/ru/product/silk-wrap-dress | grep -o '"@type":"Product"' | head -1 && \
  lsof -ti:3090 | xargs kill -9 2>/dev/null; echo done
```
Expected: `200`, `Шёлковое платье на запах`, `Sateindan kombinatsiya`, `404`, `"@type":"Product"`.

- [ ] **Step 5: Run full suite**

```bash
npm run lint && npx tsc --noEmit && npm test
```
Expected: lint clean, typecheck clean, all tests pass.

- [ ] **Step 6: Commit**

```bash
git add "app/[locale]/product/"
git commit -m "feat: implement product detail page with gallery, size selection, order CTAs, and JSON-LD"
```

---

### Task 11: Final verification pass

No new code. Runs the full suite and confirms the complete milestone is clean.

- [ ] **Step 1: Lint**

```bash
npm run lint 2>&1; echo "EXIT:$?"
```
Expected: exit 0, no errors, no warnings.

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit 2>&1 && echo "TYPECHECK_CLEAN"
```
Expected: `TYPECHECK_CLEAN`

- [ ] **Step 3: Tests**

```bash
npm test 2>&1 | tail -10
```
Expected: all test files pass, 0 failures.

- [ ] **Step 4: Build**

```bash
rm -rf .next && npm run build 2>&1 | tail -35
```
Expected: `✓ Compiled successfully`. Route table should now include:
- `● /[locale]` (`/ru`, `/uz`)
- `● /[locale]/collections/[slug]` (4 pages)
- `● /[locale]/shop` (2 pages)
- `● /[locale]/product/[slug]` (12 pages)
- `○ /_not-found`

- [ ] **Step 5: Full dev-server smoke test**

```bash
(npm run dev -- -p 3100 &) && sleep 8 && \
  echo "homepage:" && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/ru && \
  echo "collection:" && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/ru/collections/autumn-atelier && \
  echo "shop:" && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/ru/shop && \
  echo "product:" && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/ru/product/silk-wrap-dress && \
  echo "invalid product:" && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/ru/product/does-not-exist && \
  echo "wishlist button in header:" && curl -s http://localhost:3100/ru | grep -o 'wishlist' | head -1 && \
  lsof -ti:3100 | xargs kill -9 2>/dev/null; echo done
```
Expected: `200`, `200`, `200`, `200`, `404`, `wishlist` (button rendered in header).

---

## Self-Review Checklist (for controller)

**Spec coverage:**
- ✅ Product detail page (`/[locale]/product/[slug]`) with gallery, info, size selector, order CTAs, "Complete the Look"
- ✅ Telegram/WhatsApp CTAs use existing `buildTelegramOrderLink`/`buildWhatsappOrderLink` with new `size` param
- ✅ Wishlist drawer accessible from Header icon (localStorage-backed, no auth)
- ✅ `formatPrice` extracted into shared utility — no duplication between ProductCard and product page
- ✅ `getProductsByIds` added to repository for wishlist drawer's product lookup
- ✅ `generateStaticParams` on product page (all products × all locales)
- ✅ JSON-LD `Product` schema on product pages
- ✅ `generateMetadata` with hreflang alternates on product pages
- ✅ "Complete the Look" rendered via existing `EditorialProductSection` — no new component needed
- ✅ No Framer Motion
- ✅ `useWishlist` updated to expose `.wishlist` (the Set) — additive change, existing consumers unaffected

**Type consistency across tasks:**
- `SizeSelector.onChange: (size: string | null) => void` matches `ProductOrderActions`'s `setSelectedSize` usage ✓
- `WishlistButton` consumes `useWishlist().wishlist.size` — requires `wishlist` to be returned from the hook (Task 8 adds this) ✓
- `buildTelegramOrderLink(product, locale, origin, selectedSize ?? undefined)` — `size?: string` means `undefined` = no size, matching Task 2 ✓
- `getProductsByIds` returns `Product[]` — matches what `WishlistDrawer` needs for `ProductCard` ✓

**No placeholders found.**
