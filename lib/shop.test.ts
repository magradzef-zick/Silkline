import { describe, expect, it } from 'vitest';
import { filterProducts, sortProducts, hasActiveFilters, EMPTY_FILTERS } from './shop';
import type { Product } from '@/types';

function make(override: Partial<Product>): Product {
  return {
    id: 'p', slug: 'p',
    name: { ru: '', uz: '' }, description: { ru: '', uz: '' },
    collectionId: 'col-a', categoryId: 'cat-a',
    images: [], sizes: ['S', 'M'], price: 100,
    relatedProductIds: [],
    ...override,
  };
}

const products: Product[] = [
  make({ id: 'p1', collectionId: 'col-a', categoryId: 'cat-dress', price: 200 }),
  make({ id: 'p2', collectionId: 'col-b', categoryId: 'cat-coat',  price: 400 }),
  make({ id: 'p3', collectionId: 'col-a', categoryId: 'cat-dress', price: 100 }),
];

describe('filterProducts', () => {
  it('returns all products when no filters are active', () => {
    expect(filterProducts(products, EMPTY_FILTERS)).toHaveLength(3);
  });

  it('filters by collectionId', () => {
    const r = filterProducts(products, { ...EMPTY_FILTERS, collectionIds: ['col-a'] });
    expect(r.map(p => p.id)).toEqual(['p1', 'p3']);
  });

  it('filters by categoryId', () => {
    const r = filterProducts(products, { ...EMPTY_FILTERS, categoryIds: ['cat-coat'] });
    expect(r.map(p => p.id)).toEqual(['p2']);
  });

  it('combines collection and category filters with AND logic', () => {
    const r = filterProducts(products, {
      collectionIds: ['col-a'], categoryIds: ['cat-dress'],
    });
    expect(r.map(p => p.id)).toEqual(['p1', 'p3']);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterProducts(products, { ...EMPTY_FILTERS, categoryIds: ['cat-unknown'] })).toHaveLength(0);
  });
});

describe('sortProducts', () => {
  it('price-asc sorts ascending by price', () => {
    expect(sortProducts(products, 'price-asc').map(p => p.price)).toEqual([100, 200, 400]);
  });

  it('price-desc sorts descending by price', () => {
    expect(sortProducts(products, 'price-desc').map(p => p.price)).toEqual([400, 200, 100]);
  });

  it('featured preserves original order', () => {
    expect(sortProducts(products, 'featured').map(p => p.id)).toEqual(['p1', 'p2', 'p3']);
  });

  it('does not mutate the input array', () => {
    const copy = [...products];
    sortProducts(products, 'price-asc');
    expect(products.map(p => p.id)).toEqual(copy.map(p => p.id));
  });
});

describe('hasActiveFilters', () => {
  it('returns false for EMPTY_FILTERS', () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
  });
  it('returns true when collectionIds is non-empty', () => {
    expect(hasActiveFilters({ ...EMPTY_FILTERS, collectionIds: ['x'] })).toBe(true);
  });
  it('returns true when categoryIds is non-empty', () => {
    expect(hasActiveFilters({ ...EMPTY_FILTERS, categoryIds: ['cat-dress'] })).toBe(true);
  });
});
