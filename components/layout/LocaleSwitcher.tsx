'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type AppLocale } from '@/i18n/locales';
import { switchLocalePath } from '@/lib/nav';

export function LocaleSwitcher({ currentLocale }: { currentLocale: AppLocale }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 text-xs uppercase">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={switchLocalePath(pathname, locale)}
          aria-current={locale === currentLocale}
          className={locale === currentLocale ? 'font-semibold' : 'text-stone-400'}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
