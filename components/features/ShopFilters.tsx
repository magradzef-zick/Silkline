'use client';
import { useTranslations } from 'next-intl';
import { FilterChip } from '@/components/ui/FilterChip';
import { type ShopFilters as Filters, type SortOrder, EMPTY_FILTERS, hasActiveFilters } from '@/lib/shop';
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

  const hasActive = hasActiveFilters(filters);

  return (
    <div className="space-y-3 lg:space-y-0 lg:flex lg:flex-wrap lg:items-center lg:gap-6">
      {/* Collections */}
      <fieldset className="flex flex-wrap gap-2">
        <legend className="text-[10px] tracking-[0.35em] uppercase text-muted w-full mb-2 lg:hidden">
          {t('collection')}
        </legend>
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

      {/* Separator — desktop only */}
      <span className="hidden lg:block w-px h-4 bg-border/60 self-center shrink-0" aria-hidden="true" />

      {/* Categories */}
      <fieldset className="flex flex-wrap gap-2">
        <legend className="text-[10px] tracking-[0.35em] uppercase text-muted w-full mb-2 lg:hidden">
          {t('category')}
        </legend>
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

      {/* Separator — desktop only */}
      <span className="hidden lg:block w-px h-4 bg-border/60 self-center shrink-0" aria-hidden="true" />

      {/* Sizes */}
      <fieldset className="flex flex-wrap gap-2">
        <legend className="text-[10px] tracking-[0.35em] uppercase text-muted w-full mb-2 lg:hidden">
          {t('size')}
        </legend>
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

      {/* Sort + clear */}
      <div className="lg:ml-auto flex items-center gap-4 pt-1 lg:pt-0">
        {hasActive && (
          <button
            type="button"
            onClick={() => onFiltersChange(EMPTY_FILTERS)}
            className="text-[10px] tracking-[0.3em] uppercase text-muted hover:text-foreground transition-colors"
          >
            {t('clearAll')}
          </button>
        )}
        <select
          value={sortOrder}
          onChange={e => onSortChange(e.target.value as SortOrder)}
          className="text-[11px] border-b border-border bg-transparent py-1 pr-4 focus:outline-none text-foreground/70 cursor-pointer"
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
