import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getAllCollections } from '@/lib/data-source/collections';
import { buildCollectionNavLinks } from '@/lib/nav';
import type { AppLocale } from '@/i18n/locales';
import { LocaleSwitcher } from './LocaleSwitcher';
import { WishlistButton } from '@/components/features/WishlistButton';
import { MobileMenu } from './MobileMenu';

export async function Header({ locale }: { locale: AppLocale }) {
  const t = await getTranslations('nav');
  const collectionLinks = buildCollectionNavLinks(getAllCollections(), locale);

  const navLinks = [
    ...collectionLinks,
    { href: `/${locale}/shop`, label: t('shopAll') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/stores`, label: t('stores') },
  ];

  return (
    <header className="relative bg-background border-b border-border">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow-md"
      >
        {t('skipToContent')}
      </a>

      <div className="flex items-center justify-between px-6 lg:px-10 py-4">
        <Link
          href={`/${locale}`}
          className="flex flex-col items-start leading-none group"
          aria-label="SilkLine — на главную"
        >
          <span
            className="block text-[13px] font-bold tracking-[0.45em] text-accent uppercase"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            SILK LINE
          </span>
          <span
            className="block text-[7.5px] font-light italic tracking-[0.35em] text-accent/80 mt-[3px]"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            korean fashion
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-wide" aria-label="Main navigation">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/70 hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <WishlistButton locale={locale} />
          <div className="hidden lg:block">
            <LocaleSwitcher currentLocale={locale} />
          </div>
          <MobileMenu
            locale={locale}
            collectionLinks={collectionLinks}
            shopLabel={t('shopAll')}
            aboutLabel={t('about')}
            storesLabel={t('stores')}
          />
        </div>
      </div>
    </header>
  );
}
