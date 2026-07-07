import type { AppLocale } from '@/types';

export const TELEGRAM_USERNAME =
  process.env.NEXT_PUBLIC_TELEGRAM_USERNAME ?? 'silkline_placeholder';

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '998000000000';

export const SIZE_LABEL: Record<AppLocale, string> = {
  ru: 'размер',
  uz: "o'lcham",
};
