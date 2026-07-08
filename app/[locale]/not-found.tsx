import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  const locale = await getLocale();

  return (
    <section className="px-6 py-24 text-center">
      <p className="text-[11px] tracking-[0.3em] uppercase text-muted mb-4">
        {t('code')}
      </p>
      <h1 className="text-2xl font-light tracking-wide text-foreground">
        {t('heading')}
      </h1>
      <p className="mt-4 text-muted">{t('description')}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 inline-block text-[11px] tracking-widest uppercase border-b border-foreground pb-0.5 hover:text-muted hover:border-muted transition-colors"
      >
        {t('backHome')}
      </Link>
    </section>
  );
}
