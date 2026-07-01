import type { AppLocale, Product } from '@/types';
import { WHATSAPP_NUMBER } from './config';

const SIZE_LABEL: Record<AppLocale, string> = {
  ru: 'размер',
  uz: "o'lcham",
};

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
