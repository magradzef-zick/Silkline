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

// Canonical size order for display
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function collectSizes(products: Product[]): string[] {
  const found = new Set(products.flatMap(p => p.sizes));
  return SIZE_ORDER.filter(s => found.has(s));
}

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

  const sizes = useMemo(() => collectSizes(products), [products]);
  const filtered = useMemo(() => filterProducts(products, filters), [products, filters]);
  const sorted = useMemo(() => sortProducts(filtered, sortOrder), [filtered, sortOrder]);

  const countLabel = hasActiveFilters(filters)
    ? t('xOfY', { count: sorted.length, total: products.length })
    : t('total', { count: products.length });

  return (
    <div>
      <div className="mb-6">
        <ShopFilters
          filters={filters}
          onFiltersChange={setFilters}
          collections={collections}
          categories={categories}
          allSizes={sizes}
          locale={locale}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      </div>
      <p className="mb-6 text-[10px] tracking-[0.35em] uppercase text-muted">{countLabel}</p>

      {sorted.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-foreground/70">{t('noResults')}</p>
          <p className="mt-2 text-sm text-muted">{t('noResultsHint')}</p>
          <button
            type="button"
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="mt-6 text-sm underline text-muted hover:text-foreground transition-colors"
          >
            {t('clearFilters')}
          </button>
        </div>
      ) : (
        <ProductGrid products={sorted} locale={locale} columns={3} />
      )}
    </div>
  );
}
