import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getAllCollections } from '@/lib/data-source/collections';
import { buildCollectionNavLinks } from '@/lib/nav';
import type { AppLocale } from '@/i18n/locales';
import { LocaleSwitcher } from './LocaleSwitcher';
import { WishlistButton } from '@/components/features/WishlistButton';
import { LogoImage } from '@/components/ui/LogoImage';

export async function Header({ locale }: { locale: AppLocale }) {
  const t = await getTranslations('nav');
  const collectionLinks = buildCollectionNavLinks(getAllCollections(), locale);

  return (
    <header className="relative flex items-center justify-between px-6 py-5 border-b border-stone-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow-md"
      >
        {t('skipToContent')}
      </a>
      <Link href={`/${locale}`} className="flex items-center">
        <LogoImage />
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
      <div className="flex items-center gap-4">
        <WishlistButton locale={locale} />
        <LocaleSwitcher currentLocale={locale} />
      </div>
    </header>
  );
}
