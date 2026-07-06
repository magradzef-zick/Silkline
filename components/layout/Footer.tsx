import { getTranslations } from 'next-intl/server';
import { TELEGRAM_USERNAME, WHATSAPP_NUMBER } from '@/lib/links/config';

export async function Footer() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 text-sm text-stone-600">
      <div className="px-6 py-10 flex flex-col gap-8 sm:flex-row sm:justify-between sm:items-start">
        <div className="flex flex-col gap-1">
          <span className="text-xs tracking-[0.25em] uppercase text-stone-800">
            {t('copyright')}
          </span>
          <span className="text-xs text-stone-400">{t('city')}</span>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-stone-500">{t('contactPrompt')}</p>
          <a
            href={`https://t.me/${TELEGRAM_USERNAME}`}
            className="hover:text-stone-900 transition-colors"
          >
            Telegram: @{TELEGRAM_USERNAME}
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            className="hover:text-stone-900 transition-colors"
          >
            WhatsApp: +{WHATSAPP_NUMBER}
          </a>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-stone-100 text-xs text-stone-400">
        © {year} {t('copyright')}
      </div>
    </footer>
  );
}
