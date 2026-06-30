'use client';
import { useTranslations } from 'next-intl';
import { FilterChip } from '@/components/ui/FilterChip';
import { type ShopFilters as Filters, type SortOrder, EMPTY_FILTERS } from '@/lib/shop';
import type { AppLocale, Category, Collection } from '@/types';

interface ShopFiltersProps {
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  collections: Collection[];
  categories: Category[];
  allSizes: string[];
  locale: AppLocale;
  sortOrder: SortOrder;
  onSortChange: (o: SortOrder) => void;
}

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
}

export function ShopFilters({
  filters,
  onFiltersChange,
  collections,
  categories,
  allSizes,
  locale,
  sortOrder,
  onSortChange,
}: ShopFiltersProps) {
  const t = useTranslations('filters');
  const ts = useTranslations('sort');

  const hasActive =
    filters.collectionIds.length > 0 ||
    filters.categoryIds.length > 0 ||
    filters.sizes.length > 0;

  return (
    <div className="flex flex-wrap items-start gap-6">
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">{t('collection')}</legend>
        {collections.map(c => (
          <FilterChip
            key={c.id}
            label={c.name[locale]}
            active={filters.collectionIds.includes(c.id)}
            onToggle={() =>
              onFiltersChange({
                ...filters,
                collectionIds: toggle(filters.collectionIds, c.id),
              })
            }
          />
        ))}
      </fieldset>

      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">{t('category')}</legend>
        {categories.map(c => (
          <FilterChip
            key={c.id}
            label={c.name[locale]}
            active={filters.categoryIds.includes(c.id)}
            onToggle={() =>
              onFiltersChange({
                ...filters,
                categoryIds: toggle(filters.categoryIds, c.id),
              })
            }
          />
        ))}
      </fieldset>

      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">{t('size')}</legend>
        {allSizes.map(size => (
          <FilterChip
            key={size}
            label={size}
            active={filters.sizes.includes(size)}
            onToggle={() =>
              onFiltersChange({
                ...filters,
                sizes: toggle(filters.sizes, size),
              })
            }
          />
        ))}
      </fieldset>

      <div className="ml-auto flex items-center gap-3">
        {hasActive && (
          <button
            type="button"
            onClick={() => onFiltersChange(EMPTY_FILTERS)}
            className="text-xs text-stone-500 hover:text-stone-900 underline"
          >
            {t('clearAll')}
          </button>
        )}
        <select
          value={sortOrder}
          onChange={e => onSortChange(e.target.value as SortOrder)}
          className="text-xs border-b border-stone-300 bg-transparent py-1 pr-4 focus:outline-none"
          aria-label={ts('label')}
        >
          <option value="featured">{ts('featured')}</option>
          <option value="price-asc">{ts('priceAsc')}</option>
          <option value="price-desc">{ts('priceDesc')}</option>
        </select>
      </div>
    </div>
  );
}
