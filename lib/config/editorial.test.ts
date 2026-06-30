import { describe, expect, it } from 'vitest';
import { EDITORIAL } from './editorial';
import { getAllProducts } from '@/lib/data-source/products';
import { getAllCollections } from '@/lib/data-source/collections';

describe('editorial config integrity', () => {
  it('featuredCollectionSlug resolves to a real collection', () => {
    const found = getAllCollections().some(c => c.slug === EDITORIAL.featuredCollectionSlug);
    expect(found).toBe(true);
  });

  it('every selectedProductSlug resolves to a real product', () => {
    const slugs = new Set(getAllProducts().map(p => p.slug));
    for (const slug of EDITORIAL.selectedProductSlugs) {
      expect(slugs.has(slug), `"${slug}" not found in products`).toBe(true);
    }
  });

  it('selectedProductSlugs contains no duplicates', () => {
    const arr = EDITORIAL.selectedProductSlugs;
    expect(new Set(arr).size).toBe(arr.length);
  });
});
