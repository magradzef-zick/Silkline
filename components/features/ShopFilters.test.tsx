import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShopFilters } from './ShopFilters';
import { EMPTY_FILTERS } from '@/lib/shop';
import type { Category, Collection } from '@/types';

vi.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

const collections: Collection[] = [
  {
    id: 'c1',
    slug: 'col-a',
    name: { ru: 'Осенний', uz: 'Kuzgi' },
    story: { ru: '', uz: '' },
    heroImage: '',
    productIds: [],
  },
];

const categories: Category[] = [
  { id: 'cat1', slug: 'dresses', name: { ru: 'Платья', uz: "Ko'ylaklar" } },
];

describe('ShopFilters', () => {
  it('renders collection filter chips', () => {
    render(
      <ShopFilters
        filters={EMPTY_FILTERS}
        onFiltersChange={() => {}}
        collections={collections}
        categories={categories}
        locale="ru"
        sortOrder="featured"
        onSortChange={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Осенний' })).toBeInTheDocument();
  });

  it('renders category filter chips', () => {
    render(
      <ShopFilters
        filters={EMPTY_FILTERS}
        onFiltersChange={() => {}}
        collections={collections}
        categories={categories}
        locale="ru"
        sortOrder="featured"
        onSortChange={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Платья' })).toBeInTheDocument();
  });

  it('calls onFiltersChange with updated collectionIds when a chip is toggled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ShopFilters
        filters={EMPTY_FILTERS}
        onFiltersChange={onChange}
        collections={collections}
        categories={categories}
        locale="ru"
        sortOrder="featured"
        onSortChange={() => {}}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Осенний' }));
    expect(onChange).toHaveBeenCalledWith({
      ...EMPTY_FILTERS,
      collectionIds: ['c1'],
    });
  });

  it('uses fieldset + legend for each filter group', () => {
    render(
      <ShopFilters
        filters={EMPTY_FILTERS}
        onFiltersChange={() => {}}
        collections={collections}
        categories={categories}
        locale="ru"
        sortOrder="featured"
        onSortChange={() => {}}
      />
    );
    expect(screen.getAllByRole('group')).toHaveLength(2);
  });
});
