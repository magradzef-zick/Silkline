import type { AppLocale } from '@/types';

export const TELEGRAM_USERNAME =
  process.env.NEXT_PUBLIC_TELEGRAM_USERNAME ?? '';

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

export const SIZE_LABEL: Record<AppLocale, string> = {
  ru: 'размер',
  uz: "o'lcham",
};
