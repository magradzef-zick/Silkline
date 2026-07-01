import type { AppLocale, Product } from '@/types';
import { TELEGRAM_USERNAME } from './config';

const SIZE_LABEL: Record<AppLocale, string> = {
  ru: 'размер',
  uz: "o'lcham",
};

export function buildTelegramOrderLink(
  product: Product,
  locale: AppLocale,
  origin: string,
  size?: string
): string {
  const productUrl = `${origin}/${locale}/product/${product.slug}`;
  const namePart = size
    ? `${product.name[locale]}, ${SIZE_LABEL[locale]} ${size}`
    : product.name[locale];
  const message = `${namePart} — ${productUrl}`;
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
}
