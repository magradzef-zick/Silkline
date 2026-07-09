'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SizeSelector } from '@/components/ui/SizeSelector';
import { WishlistToggle } from '@/components/ui/WishlistToggle';
import { buildTelegramOrderLink } from '@/lib/links/telegram';
import { buildWhatsappOrderLink } from '@/lib/links/whatsapp';
import type { AppLocale, Product } from '@/types';

interface ProductOrderActionsProps {
  product: Product;
  locale: AppLocale;
}

export function ProductOrderActions({ product, locale }: ProductOrderActionsProps) {
  const t = useTranslations('product');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  const telegramHref = buildTelegramOrderLink(
    product,
    locale,
    origin,
    selectedSize ?? undefined
  );
  const whatsappHref = buildWhatsappOrderLink(
    product,
    locale,
    origin,
    selectedSize ?? undefined
  );

  return (
    <div className="flex flex-col gap-6">
      {product.sizes.length > 0 && (
        <div>
          <p className="mb-3 text-xs tracking-widest uppercase text-muted">
            {t('selectSize')}
          </p>
          <SizeSelector
            sizes={product.sizes}
            selected={selectedSize}
            onChange={setSelectedSize}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <a
          href={telegramHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center border border-foreground bg-foreground text-background text-[11px] tracking-[0.25em] uppercase px-6 py-4 hover:bg-foreground/80 hover:border-foreground/80 transition-colors"
        >
          {t('order.telegram')}
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center border border-foreground/25 text-foreground/70 text-[11px] tracking-[0.25em] uppercase px-6 py-4 hover:border-foreground/50 hover:text-foreground transition-colors"
        >
          {t('order.whatsapp')}
        </a>
        <p
          className="text-center text-[11px] tracking-[0.2em] text-muted/60 pt-1"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {t('orderHint')}
        </p>
      </div>

      <WishlistToggle productId={product.id} productName={product.name[locale]} />
    </div>
  );
}
