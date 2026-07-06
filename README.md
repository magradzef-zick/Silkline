# SilkLine

E-commerce storefront for a Korean womenswear retailer in Tashkent, Uzbekistan. Bilingual (Russian / Uzbek). Orders placed via Telegram and WhatsApp.

## Tech stack

- Next.js 16.2.9 (App Router, Turbopack)
- React 19, Tailwind CSS v4
- next-intl v4 (i18n routing: `ru` default, `uz` secondary)
- Vitest + React Testing Library

## Local setup

```bash
cp .env.local.example .env.local   # fill in the four env vars
npm install
npm run dev                        # http://localhost:3000 → redirects to /ru
```

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest (run once) |
| `npm run test:watch` | Vitest (watch mode) |
| `npx tsc --noEmit` | TypeScript check |

## Key directories

```
app/[locale]/         — page routes (ru and uz)
components/
  layout/             — Header, Footer, NavigationProgress, LocaleSwitcher
  features/           — Client Components with interactivity
  sections/           — Server Component page sections
  ui/                 — Primitive UI components
data/                 — Seed product, collection, store, and category data (replace before launch)
lib/
  data-source/        — Only code that may import from data/
  config/editorial.ts — Featured collection and selected products
  links/config.ts     — Telegram / WhatsApp handles (from env vars)
messages/             — ru.json and uz.json translation files
public/
  logo.svg            — Transparent placeholder; replace with real logo
  favicon.svg         — Dark square placeholder; replace with brand mark
  og-default.svg      — OG image placeholder; replace before launch
  placeholders/       — Product and collection placeholder images
docs/content-brief.md — Client handoff document
```

## Environment variables

See `.env.local.example`. All four are required for production.

## Content status

All catalog data in `data/` is seed/placeholder. See `docs/content-brief.md` for the complete list of assets and content the client must provide before launch.
