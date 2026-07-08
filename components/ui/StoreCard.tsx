import { getTranslations } from 'next-intl/server';
import type { AppLocale, Store } from '@/types';

interface StoreCardProps {
  store: Store;
  locale: AppLocale;
}

export async function StoreCard({ store, locale }: StoreCardProps) {
  const t = await getTranslations('stores');

  return (
    <article className="border border-border p-6">
      <h2 className="text-base font-medium tracking-wide text-foreground">{store.name}</h2>
      <p className="mt-2 text-sm text-muted">{store.address[locale]}</p>

      <dl className="mt-4 space-y-2 text-sm">
        {store.hours && (
          <div>
            <dt className="text-[11px] tracking-widest uppercase text-muted/70">{t('hoursLabel')}</dt>
            <dd className="mt-0.5 text-foreground/80">{store.hours}</dd>
          </div>
        )}
        {store.phone && (
          <div>
            <dt className="text-[11px] tracking-widest uppercase text-muted/70">{t('phoneLabel')}</dt>
            <dd className="mt-0.5">
              <a
                href={`tel:${store.phone.replace(/\s/g, '')}`}
                className="text-foreground/80 hover:text-accent transition-colors"
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
        className="mt-4 inline-block text-[11px] tracking-widest uppercase border-b border-foreground pb-0.5 hover:text-muted hover:border-muted transition-colors"
      >
        {t('mapLink')}
      </a>
    </article>
  );
}
