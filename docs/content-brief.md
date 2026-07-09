# SilkLine — Content Brief

This document tells you exactly what to provide before the site can go live.
You do not need to touch any code. Replace the files and fill in the fields
described below, then notify the development team — they will run a final
build and deploy.

---

## 1. Environment Variables

Copy `.env.local.example` to `.env.local` in the project root and fill in the four values:

| Variable | What it is | Example |
|---|---|---|
| `NEXT_PUBLIC_TELEGRAM_USERNAME` | Your Telegram handle, without the @ | `silkline_uz` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your WhatsApp number, international format, digits only | `998901234567` |
| `NEXT_PUBLIC_SITE_URL` | The full URL of the live website | `https://silkline.uz` |
| `NEXT_PUBLIC_OG_IMAGE` | Path to the Open Graph image (leave as `/og-default.svg` until you have a real one) | `/og-default.svg` |

---

## 2. Logo

**File to replace:** `public/logo.svg`

Replace this file with your logo. The header will automatically display the new file.

Requirements:
- **Format:** SVG strongly preferred. PNG with transparent background is also accepted.
- **If SVG:** any native dimensions — the browser scales it. The display size in the header is 120 × 28 px.
- **If PNG:** provide at 2× resolution, minimum 240 × 56 px, so it looks sharp on retina screens.
- **Background:** transparent.
- **Color:** the logo appears on a white header — it must be legible on a light background.

If your logo has a significantly different aspect ratio, notify the development team so they can adjust the display size (a one-line code change).

Until the file is replaced, the header logo area appears blank.

---

## 3. Favicon

**File to replace:** `public/favicon.svg`

Replace this file with your brand mark or icon.

Requirements:
- **Format:** SVG strongly preferred.
- **Size:** displayed at 16 × 16 and 32 × 32 px — it must be legible at small sizes.
- **Composition:** square or near-square works best for browser tabs.
- **Background:** filled (not transparent) — a transparent favicon can disappear on some browser tab backgrounds.

---

## 4. Open Graph / Social Preview Image

**File to replace:** `public/og-default.svg`

This image appears when the site URL is shared on social media (Telegram, Instagram DMs, WhatsApp, etc.).

Requirements:
- **Dimensions:** exactly 1200 × 630 px.
- **Format:** JPG or PNG preferred for photography; SVG is also accepted.
- **Content:** include your logo, brand name, and a representative product or collection image.

If you switch to JPG or PNG, also update `NEXT_PUBLIC_OG_IMAGE` in `.env.local` to match (e.g. `/og.jpg`).

---

## 5. Product Catalog

**File to edit:** `data/products.ts`

Each product is one object in the array. Replace all existing entries with your real catalog. Template:

```ts
{
  id: 'unique-id',           // lowercase letters and hyphens only; never change this after first use
  slug: 'url-slug',          // appears in the URL: /ru/product/your-slug
  name: {
    ru: 'Название на русском',
    uz: "O'zbek tilidagi nomi",
  },
  description: {
    ru: 'Описание на русском (1–3 предложения).',
    uz: "O'zbek tilidagi tavsif (1–3 jumla).",
  },
  collectionId: 'col-your-collection-id', // must match an id from data/collections.ts
  categoryId: 'cat-dresses',              // must match an id from data/categories.ts
  images: [
    '/products/your-image-1.jpg',  // main image shown in cards and grids
    '/products/your-image-2.jpg',  // additional angles are optional
  ],
  sizes: ['XS', 'S', 'M', 'L'],   // list only the sizes you actually stock
  price: 890000,                   // price in Uzbek soum, integer, no decimals
  relatedProductIds: ['other-id'], // 2–3 product ids for the "Complete the Look" section
}
```

**Product image requirements:**
- Create the folder `public/products/` and place all product images there.
- Format: JPG preferred for photography; WebP also accepted.
- Minimum dimensions: 800 × 1067 px (3:4 portrait ratio). For retina screens provide at 2×: 1600 × 2134 px.
- File names: lowercase, hyphens only — e.g. `silk-wrap-dress-front.jpg`.
- The first image in the `images` array is the main image displayed in product cards and shop grids.

---

## 6. Collections

**File to edit:** `data/collections.ts`

Replace all existing entries with your real collections. Template:

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
- Minimum dimensions: 1600 × 900 px (16:9 landscape). This image fills the full homepage hero and the collection page banner.

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

If your catalog uses different or additional categories, replace the entries. Template:

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

Replace both placeholder entries with your real store data. Template:

```ts
{
  id: 'store-unique-id',
  name: 'SilkLine — Store Name',
  address: {
    ru: 'Адрес на русском',
    uz: "O'zbek tilidagi manzil",
  },
  city: 'Tashkent',
  phone: '+998 90 000 00 00',
  mapUrl: 'https://maps.google.com/?q=...',
  hours: '10:00–22:00',
}
```

For `mapUrl`: open Google Maps, find your exact store location, click Share → Copy link. Paste that URL here.

---

## 9. Brand Copy

### About page

**File to edit:** `messages/ru.json` and `messages/uz.json`, namespace `about`.

Fill in the `"about"` block in both files:

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

Have a native Uzbek speaker review the `uz.json` version before launch.

### Brand Moment — homepage statement

**File to edit:** `messages/ru.json` and `messages/uz.json`, key `brand.statement`.

A single sentence displayed as a full-width statement on the homepage. The section is hidden until this field is filled. Leave it as `""` until you have approved copy:

```json
"brand": {
  "statement": "Your brand statement — a single sentence."
}
```

---

## 10. Launch Checklist

Before going live, confirm every item below is complete:

- [ ] `.env.local` created with all four variables filled in
- [ ] `public/logo.svg` — placeholder replaced with real logo
- [ ] `public/favicon.svg` — real brand mark placed
- [ ] `public/og-default.svg` — replaced with real social preview image (or `NEXT_PUBLIC_OG_IMAGE` updated)
- [ ] `data/products.ts` — real product catalog; all placeholder products removed
- [ ] `public/products/` — all product photography placed
- [ ] `data/collections.ts` — real collections; all placeholder collections removed
- [ ] `public/collections/` — all collection hero images placed
- [ ] `lib/config/editorial.ts` — `featuredCollectionSlug` and `selectedProductSlugs` updated to real values
- [ ] `data/stores.ts` — real store addresses, phone numbers, and Google Maps links
- [ ] `messages/ru.json` `about` copy — reviewed and approved
- [ ] `messages/uz.json` `about` copy — reviewed by a native Uzbek speaker
- [ ] `brand.statement` — filled in both language files, or intentionally left empty
