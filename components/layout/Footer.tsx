import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { TELEGRAM_USERNAME, WHATSAPP_NUMBER } from '@/lib/links/config';
import { getAllCollections } from '@/lib/data-source/collections';
import { LocaleSwitcher } from './LocaleSwitcher';
import type { AppLocale } from '@/types';

export async function Footer({ locale }: { locale: AppLocale }) {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const collections = getAllCollections();
  const year = new Date().getFullYear();

  const hasTelegram = !!TELEGRAM_USERNAME;
  const hasWhatsApp = !!WHATSAPP_NUMBER;
  const hasContact = hasTelegram || hasWhatsApp;

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pt-14 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand identity */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <div>
              <Image
                src="/brand/logo.jpg"
                alt="SilkLine"
                width={1631}
                height={619}
                className="h-8 w-auto mix-blend-multiply"
              />
            </div>
            <span className="text-[11px] text-muted">{t('city')}</span>
            <LocaleSwitcher currentLocale={locale} />
          </div>

          {/* Collections */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] tracking-[0.35em] uppercase text-muted mb-1">
              {t('collectionsLabel')}
            </h3>
            {collections.map(col => (
              <Link
                key={col.id}
                href={`/${locale}/collections/${col.slug}`}
                className="text-[12px] text-muted hover:text-foreground transition-colors duration-200"
              >
                {col.name[locale]}
              </Link>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] tracking-[0.35em] uppercase text-muted mb-1">
              {t('pagesLabel')}
            </h3>
            <Link
              href={`/${locale}/shop`}
              className="text-[12px] text-muted hover:text-foreground transition-colors duration-200"
            >
              {nav('shopAll')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-[12px] text-muted hover:text-foreground transition-colors duration-200"
            >
              {nav('about')}
            </Link>
            <Link
              href={`/${locale}/stores`}
              className="text-[12px] text-muted hover:text-foreground transition-colors duration-200"
            >
              {nav('stores')}
            </Link>
          </div>

          {/* Contact / order */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] tracking-[0.35em] uppercase text-muted mb-1">
              {t('contactLabel')}
            </h3>
            {hasContact ? (
              <>
                {hasTelegram && (
                  <a
                    href={`https://t.me/${TELEGRAM_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-muted hover:text-foreground transition-colors duration-200"
                  >
                    Telegram
                  </a>
                )}
                {hasWhatsApp && (
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-muted hover:text-foreground transition-colors duration-200"
                  >
                    WhatsApp
                  </a>
                )}
              </>
            ) : (
              <>
                <p className="text-[12px] text-muted leading-relaxed max-w-[180px]">
                  {t('visitStores')}
                </p>
                <Link
                  href={`/${locale}/stores`}
                  className="text-[12px] text-muted hover:text-foreground transition-colors duration-200"
                >
                  {t('storesLink')}
                </Link>
              </>
            )}
          </div>

        </div>
      </div>

      <div className="border-t border-border px-6 lg:px-10 py-4 text-[11px] text-muted/70">
        © {year} {t('copyright')}
      </div>
    </footer>
  );
}
