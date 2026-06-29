import { getTranslations } from 'next-intl/server';
import { TELEGRAM_USERNAME, WHATSAPP_NUMBER } from '@/lib/links/config';

export async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className="px-6 py-10 border-t border-stone-200 text-sm text-stone-600">
      <p>{t('contactPrompt')}</p>
      <p>
        Telegram: <a href={`https://t.me/${TELEGRAM_USERNAME}`}>@{TELEGRAM_USERNAME}</a>
      </p>
      <p>
        WhatsApp: <a href={`https://wa.me/${WHATSAPP_NUMBER}`}>{WHATSAPP_NUMBER}</a>
      </p>
    </footer>
  );
}
