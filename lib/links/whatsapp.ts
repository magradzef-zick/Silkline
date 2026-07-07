import type { AppLocale, Product } from '@/types';
import { WHATSAPP_NUMBER, SIZE_LABEL } from './config';

export function buildWhatsappOrderLink(
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
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
