import type { AppLocale, Product } from '@/types';
import { TELEGRAM_USERNAME } from './config';

export function buildTelegramOrderLink(
  product: Product,
  locale: AppLocale,
  origin: string
): string {
  const productUrl = `${origin}/${locale}/product/${product.slug}`;
  const message = `${product.name[locale]} — ${productUrl}`;
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
}
