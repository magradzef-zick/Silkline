'use client';
import { useTranslations } from 'next-intl';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { getAllProducts } from '@/lib/data-source/products';
import { ProductCard } from '@/components/ui/ProductCard';
import type { AppLocale } from '@/types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: AppLocale;
}

export function WishlistDrawer({ isOpen, onClose, locale }: WishlistDrawerProps) {
  const t = useTranslations('wishlist');
  const { wishlist } = useWishlist();

  const wishlisted = getAllProducts().filter(p => wishlist.has(p.id));

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('heading')}
        className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-xl"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
          <h2 className="text-sm font-medium tracking-wide uppercase">{t('heading')}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="text-stone-400 hover:text-stone-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {wishlisted.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-600">{t('empty')}</p>
              <p className="mt-2 text-sm text-stone-400">{t('emptyHint')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {wishlisted.map(product => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
