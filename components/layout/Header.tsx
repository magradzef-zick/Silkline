import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { getAllCollections } from '@/lib/data-source/collections';
import type { AppLocale } from '@/i18n/locales';
import { LocaleSwitcher } from './LocaleSwitcher';
import { WishlistButton } from '@/components/features/WishlistButton';
import { MobileMenu } from './MobileMenu';

const NEW_COLLECTION_SLUG = 'new-collection-2026';

export async function Header({ locale }: { locale: AppLocale }) {
  const t = await getTranslations('nav');
  const collections = getAllCollections();

  const newCollection = collections.find(c => c.slug === NEW_COLLECTION_SLUG);
  const archiveCollections = collections.filter(c => c.slug !== NEW_COLLECTION_SLUG);

  // Mobile: new collection first, then archives
  const mobileCollectionLinks = [
    ...(newCollection ? [{ href: `/${locale}/collections/${newCollection.slug}`, label: newCollection.name[locale] }] : []),
    ...archiveCollections.map(c => ({ href: `/${locale}/collections/${c.slug}`, label: c.name[locale] })),
  ];

  const linkClass = "relative text-foreground/60 hover:text-foreground transition-colors duration-300 after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-foreground/40 after:transition-[width] after:duration-300 hover:after:w-full";

  return (
    <header className="relative bg-background border-b border-border">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow-md"
      >
        {t('skipToContent')}
      </a>

      <div className="flex items-center justify-between px-6 lg:px-10 py-5">
        {/* Logo */}
        <Link href={`/${locale}`} aria-label="SilkLine">
          <Image
            src="/brand/logo.jpg"
            alt="SilkLine"
            width={1631}
            height={619}
            className="h-11 w-auto mix-blend-multiply"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-wide" aria-label="Main navigation">
          {/* New Collection — promoted, direct link */}
          {newCollection && (
            <Link href={`/${locale}/collections/${newCollection.slug}`} className={linkClass}>
              {newCollection.name[locale]}
            </Link>
          )}

          {/* Catalog dropdown */}
          <div className="relative group">
            <Link href={`/${locale}/shop`} className={`${linkClass} flex items-center gap-1`}>
              {t('catalog')}
              <span className="text-[8px] opacity-50 mt-px">▾</span>
            </Link>

            {/* Dropdown — CSS-only (hover + focus-within) */}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50
                opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto
                transition-opacity duration-200"
            >
              <div className="bg-background border border-border/60 shadow-sm min-w-[200px] py-3">
                <Link
                  href={`/${locale}/shop`}
                  className="block px-5 py-2.5 text-[12px] tracking-[0.1em] text-foreground/60 hover:text-foreground transition-colors"
                >
                  {t('shopAll')}
                </Link>
                {archiveCollections.length > 0 && (
                  <div className="mx-5 my-2 h-px bg-border/50" />
                )}
                {archiveCollections.map(c => (
                  <Link
                    key={c.id}
                    href={`/${locale}/collections/${c.slug}`}
                    className="block px-5 py-2.5 text-[12px] tracking-[0.1em] text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {c.name[locale]}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href={`/${locale}/about`} className={linkClass}>{t('about')}</Link>
          <Link href={`/${locale}/stores`} className={linkClass}>{t('stores')}</Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Search — first-class action on every page */}
          <Link
            href={`/${locale}/shop`}
            aria-label="Search"
            className="flex items-center justify-center w-9 h-9 text-foreground/50 hover:text-foreground transition-colors duration-200"
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="7.5" cy="7.5" r="5.5" />
              <line x1="11.5" y1="11.5" x2="15.5" y2="15.5" />
            </svg>
          </Link>

          <WishlistButton locale={locale} />

          <div className="hidden lg:block">
            <LocaleSwitcher currentLocale={locale} />
          </div>

          <MobileMenu
            locale={locale}
            collectionLinks={mobileCollectionLinks}
            shopLabel={t('shopAll')}
            aboutLabel={t('about')}
            storesLabel={t('stores')}
          />
        </div>
      </div>
    </header>
  );
}
