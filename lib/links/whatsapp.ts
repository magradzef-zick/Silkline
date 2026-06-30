import type { AppLocale, Product } from '@/types';
import { WHATSAPP_NUMBER } from './config';

export function buildWhatsappOrderLink(
  product: Product,
  locale: AppLocale,
  origin: string
): string {
  const productUrl = `${origin}/${locale}/product/${product.slug}`;
  const message = `${product.name[locale]} — ${productUrl}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
