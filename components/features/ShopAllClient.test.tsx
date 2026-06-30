import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShopAllClient } from './ShopAllClient';
import type { Category, Collection, Product } from '@/types';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, string | number>) => {
    if (key === 'total') return `${params?.count} items`;
    if (key === 'xOfY') return `${params?.count} of ${params?.total}`;
    return key;
  },
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('@/components/ui/WishlistToggle', () => ({
  WishlistToggle: () => null,
}));

function makeProduct(id: string, collectionId: string, sizes: string[]): Product {
  return {
    id,
    slug: id,
    name: { ru: `Product ${id}`, uz: `Product ${id}` },
    description: { ru: '', uz: '' },
    collectionId,
    categoryId: 'cat-a',
    images: [],
    sizes,
    price: 100,
    relatedProductIds: [],
  };
}

const products: Product[] = [
  makeProduct('p1', 'col-a', ['S', 'M']),
  makeProduct('p2', 'col-b', ['L']),
  makeProduct('p3', 'col-a', ['M']),
];

const collections: Collection[] = [
  {
    id: 'col-a',
    slug: 'col-a',
    name: { ru: 'A', uz: 'A' },
    story: { ru: '', uz: '' },
    heroImage: '',
    productIds: ['p1', 'p3'],
  },
];

const categories: Category[] = [
  { id: 'cat-a', slug: 'cat-a', name: { ru: 'Cat A', uz: 'Cat A' } },
];

beforeEach(() => { localStorage.clear(); });

describe('ShopAllClient', () => {
  it('renders all products initially', () => {
    render(
      <ShopAllClient
        products={products}
        collections={collections}
        categories={categories}
        locale="ru"
      />
    );
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('filters products by collection when a collection chip is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ShopAllClient
        products={products}
        collections={collections}
        categories={categories}
        locale="ru"
      />
    );
    await user.click(screen.getByRole('button', { name: 'A' }));
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('shows empty state when no products match filters', () => {
    render(
      <ShopAllClient
        products={[]}
        collections={collections}
        categories={categories}
        locale="ru"
      />
    );
    expect(screen.getByText('noResults')).toBeInTheDocument();
  });
});
