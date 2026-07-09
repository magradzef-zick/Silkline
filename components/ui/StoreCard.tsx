import { getTranslations } from 'next-intl/server';
import type { AppLocale, Store } from '@/types';

interface StoreCardProps {
  store: Store;
  locale: AppLocale;
  index: number;
}

export async function StoreCard({ store, locale, index }: StoreCardProps) {
  const t = await getTranslations('stores');
  const num = String(index).padStart(2, '0');

  return (
    <article className="border-t border-border py-8 grid grid-cols-[3rem_1fr] sm:grid-cols-[4rem_1fr_auto] gap-x-6 gap-y-4 items-start">
      <span
        className="text-[13px] text-muted/60 pt-0.5"
        style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
      >
        {num}
      </span>

      <div>
        <h2
          className="text-xl lg:text-2xl font-light text-foreground leading-snug"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {store.name}
        </h2>
        <p className="mt-1 text-[13px] text-muted">{store.address[locale]}</p>

        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[12px]">
          {store.hours && (
            <div>
              <dt className="text-[10px] tracking-[0.3em] uppercase text-muted mb-0.5">
                {t('hoursLabel')}
              </dt>
              <dd className="text-foreground/80">{store.hours}</dd>
            </div>
          )}
          {store.phone && (
            <div>
              <dt className="text-[10px] tracking-[0.3em] uppercase text-muted mb-0.5">
                {t('phoneLabel')}
              </dt>
              <dd>
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
      </div>

      <div className="col-start-2 sm:col-start-auto sm:pt-0.5">
        <a
          href={store.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] tracking-widest uppercase border-b border-foreground pb-0.5 hover:text-muted hover:border-muted transition-colors whitespace-nowrap"
        >
          {t('mapLink')} →
        </a>
      </div>
    </article>
  );
}
