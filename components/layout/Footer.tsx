import { getTranslations } from 'next-intl/server';
import { TELEGRAM_USERNAME, WHATSAPP_NUMBER } from '@/lib/links/config';

export async function Footer() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border text-sm text-muted bg-background">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12 flex flex-col gap-10 sm:flex-row sm:justify-between sm:items-start">
        <div className="flex flex-col gap-2">
          <span
            className="text-[12px] font-bold tracking-[0.4em] text-accent uppercase"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            SILK LINE
          </span>
          <span
            className="text-[7.5px] font-light italic tracking-[0.3em] text-accent/70"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            korean fashion
          </span>
          <span className="text-[11px] text-muted/60 mt-1">{t('city')}</span>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[12px] tracking-wide text-muted mb-1">{t('contactPrompt')}</p>
          <a
            href={`https://t.me/${TELEGRAM_USERNAME}`}
            className="text-[13px] hover:text-foreground transition-colors"
          >
            Telegram: @{TELEGRAM_USERNAME}
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            className="text-[13px] hover:text-foreground transition-colors"
          >
            WhatsApp: +{WHATSAPP_NUMBER}
          </a>
        </div>
      </div>

      <div className="border-t border-border px-6 lg:px-10 py-4 text-[11px] text-muted/50">
        © {year} {t('copyright')}
      </div>
    </footer>
  );
}
