import { getTranslations } from 'next-intl/server';
import type { AppLocale, Store } from '@/types';

interface StoreCardProps {
  store: Store;
  locale: AppLocale;
}

export async function StoreCard({ store, locale }: StoreCardProps) {
  const t = await getTranslations('stores');

  return (
    <article className="border border-stone-200 p-6">
      <h2 className="text-base font-medium tracking-wide">{store.name}</h2>
      <p className="mt-2 text-sm text-stone-600">{store.address[locale]}</p>

      <dl className="mt-4 space-y-2 text-sm">
        {store.hours && (
          <div>
            <dt className="text-xs tracking-widest uppercase text-stone-400">{t('hoursLabel')}</dt>
            <dd className="mt-0.5 text-stone-700">{store.hours}</dd>
          </div>
        )}
        {store.phone && (
          <div>
            <dt className="text-xs tracking-widest uppercase text-stone-400">{t('phoneLabel')}</dt>
            <dd className="mt-0.5">
              <a
                href={`tel:${store.phone.replace(/\s/g, '')}`}
                className="text-stone-700 hover:text-stone-900 transition-colors"
              >
                {store.phone}
              </a>
            </dd>
          </div>
        )}
      </dl>

      <a
        href={store.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-xs tracking-widest uppercase border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors"
      >
        {t('mapLink')}
      </a>
    </article>
  );
}
