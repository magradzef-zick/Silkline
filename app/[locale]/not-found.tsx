import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  const locale = await getLocale();

  return (
    <section className="px-6 py-24 text-center">
      <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">
        {t('code')}
      </p>
      <h1 className="text-2xl font-light tracking-wide text-stone-800">
        {t('heading')}
      </h1>
      <p className="mt-4 text-stone-500">{t('description')}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 inline-block text-xs tracking-widest uppercase border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors"
      >
        {t('backHome')}
      </Link>
    </section>
  );
}
