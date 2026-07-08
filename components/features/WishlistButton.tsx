'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { WishlistDrawer } from './WishlistDrawer';
import type { AppLocale } from '@/types';

interface WishlistButtonProps {
  locale: AppLocale;
}

export function WishlistButton({ locale }: WishlistButtonProps) {
  const t = useTranslations('wishlist');
  const { wishlist } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const count = wishlist.size;

  return (
    <>
      <button
        type="button"
        aria-label={t('open')}
        onClick={() => setIsOpen(true)}
        className="relative p-1 text-muted hover:text-accent transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        {count > 0 && (
          <span
            aria-label={t('count', { count })}
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white text-[10px] font-medium leading-none"
          >
            {count}
          </span>
        )}
      </button>

      <WishlistDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        locale={locale}
      />
    </>
  );
}
