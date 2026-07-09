import Link from 'next/link';
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
        <Link
          href={`/${locale}`}
          className="flex flex-col items-start leading-none group"
          aria-label="SILK LINE"
        >
          <span
            className="block text-[15px] font-bold tracking-[0.45em] text-accent uppercase"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            SILK LINE
          </span>
          <span
            className="block text-[7.5px] font-light italic tracking-[0.35em] text-accent/70 mt-[3px]"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            korean fashion
          </span>
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

        <div className="flex items-center gap-4">
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
