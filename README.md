# SilkLine

Storefront for a Korean womenswear brand in Tashkent, Uzbekistan. Bilingual (Russian/Uzbek). Customers order via Telegram and WhatsApp — there's no checkout.

## Features

- Bilingual routing: Russian default (`/ru/*`), Uzbek via `/uz/*`
- Collection pages, shop-all with filtering and sorting
- Wishlist saved to `localStorage`
- Order CTAs that open Telegram or WhatsApp with the product pre-filled in the message
- JSON-LD structured data (WebSite, Organization, Product)
- Fully static: all pages pre-rendered via `generateStaticParams`

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- next-intl v4
- TypeScript
- Vitest + React Testing Library

## Getting Started

Node.js 20+ required.

```bash
cp .env.local.example .env.local
# fill in the four variables
npm install
npm run dev
```

The dev server starts on port 3000 and redirects `/` to `/ru`.

## Environment Variables

All four are required for production. See `.env.local.example`.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_TELEGRAM_USERNAME` | Telegram handle without the `@` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number in international format, digits only |
| `NEXT_PUBLIC_SITE_URL` | Full URL of the live site, e.g. `https://silkline.uz` |
| `NEXT_PUBLIC_OG_IMAGE` | Path to the Open Graph image, e.g. `/og-default.svg` |

## Project Structure

```
app/[locale]/       Page routes. Each locale gets its own subtree.
components/
  layout/           Header, Footer, NavigationProgress, LocaleSwitcher
  features/         Client components: wishlist, ordering, shop filters
  sections/         Server component page sections
  ui/               Shared primitives
data/               Product, collection, store, and category records
lib/
  data-source/      The only layer that reads from data/
  links/            Telegram and WhatsApp link builders
messages/           ru.json and uz.json translation strings
public/             Static assets. Placeholders are in public/placeholders/.
docs/               Client handoff document
```

## Scripts

```
npm run dev          Development server (Turbopack)
npm run build        Production build
npm run lint         ESLint
npm test             Vitest, single run
npm run test:watch   Vitest, watch mode
npx tsc --noEmit     Type check
```

## Deployment

The project deploys to Vercel with no extra configuration — standard Next.js conventions are picked up automatically.

Set the four environment variables in the Vercel project settings before the first deploy.

## Notes

All product, collection, and store data lives in `data/`. The `lib/data-source/` layer is the only place in the codebase that reads from it, so connecting a CMS or API later is a contained change.

See `docs/content-brief.md` for what the client needs to supply before the site can go live.
