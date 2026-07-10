'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { ShopFilters } from './ShopFilters';
import {
  filterProducts,
  sortProducts,
  hasActiveFilters,
  EMPTY_FILTERS,
  type ShopFilters as Filters,
  type SortOrder,
} from '@/lib/shop';
import type { AppLocale, Category, Collection, Product } from '@/types';

interface ShopAllClientProps {
  products: Product[];
  collections: Collection[];
  categories: Category[];
  locale: AppLocale;
}

export function ShopAllClient({
  products,
  collections,
  categories,
  locale,
}: ShopAllClientProps) {
  const t = useTranslations('shop');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sortOrder, setSortOrder] = useState<SortOrder>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = useMemo(() => filterProducts(products, filters), [products, filters]);

  const searched = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return filtered;
    return filtered.filter(p =>
      p.name.ru.toLowerCase().includes(q) || p.name.uz.toLowerCase().includes(q)
    );
  }, [filtered, searchQuery]);

  const sorted = useMemo(() => sortProducts(searched, sortOrder), [searched, sortOrder]);

  const isFiltered = hasActiveFilters(filters) || searchQuery.trim().length > 0;
  const countLabel = isFiltered
    ? t('xOfY', { count: sorted.length, total: products.length })
    : t('total', { count: products.length });

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  const handleFilterChange = (f: Filters) => { setFilters(f); setVisibleCount(12); };
  const handleSortChange = (s: SortOrder) => { setSortOrder(s); setVisibleCount(12); };
  const handleSearchChange = (q: string) => { setSearchQuery(q); setVisibleCount(12); };

  return (
    <div>
      {/* Search */}
      <div className="relative mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full bg-transparent border-b border-border py-3 text-[14px] text-foreground placeholder:text-muted/50 focus:outline-none focus:border-foreground/50 transition-colors pr-8"
        />
        {searchQuery && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => handleSearchChange('')}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-lg leading-none transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <ShopFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
          collections={collections}
          categories={categories}
          locale={locale}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      <p className="mb-6 text-[10px] tracking-[0.35em] uppercase text-muted">{countLabel}</p>

      {sorted.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-foreground/70">{t('noResults')}</p>
          <p className="mt-2 text-sm text-muted">{t('noResultsHint')}</p>
          <button
            type="button"
            onClick={() => { setFilters(EMPTY_FILTERS); setSearchQuery(''); }}
            className="mt-6 text-sm underline text-muted hover:text-foreground transition-colors"
          >
            {t('clearFilters')}
          </button>
        </div>
      ) : (
        <>
          <ProductGrid products={visible} locale={locale} columns={3} />
          {hasMore && (
            <div className="mt-16 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount(c => Math.min(c + 12, sorted.length))}
                className="text-[11px] tracking-[0.35em] uppercase border-b border-foreground pb-0.5 hover:text-muted hover:border-muted transition-colors"
              >
                {t('showMore')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
