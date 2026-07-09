import { describe, expect, it } from 'vitest';
import {
  getAllProducts,
  getProductBySlug,
  getProductsByCollectionId,
  getRelatedProducts,
  getSelectedProducts,
} from './products';

describe('products data source', () => {
  it('returns all seeded products', () => {
    expect(getAllProducts().length).toBeGreaterThanOrEqual(6);
  });

  it('finds a product by slug', () => {
    expect(getProductBySlug('satin-rhinestone-set')?.id).toBe('p-rhinestone-set');
  });

  it('filters products by collection', () => {
    const result = getProductsByCollectionId('col-winter-2025');
    expect(result.every((p) => p.collectionId === 'col-winter-2025')).toBe(true);
    expect(result.length).toBe(12);
  });

  it('resolves related products by id, dropping unknown ids', () => {
    const product = getProductBySlug('satin-rhinestone-set')!;
    const related = getRelatedProducts(product);
    expect(related.map((p) => p.id)).toEqual(product.relatedProductIds);
  });
});

describe('getSelectedProducts', () => {
  it('returns products in the order defined by the editorial config', () => {
    const selected = getSelectedProducts();
    expect(selected.map(p => p.slug)).toEqual([
      'satin-rhinestone-set',
      'one-shoulder-chiffon-dress',
      'peplum-zip-pants-indigo',
      'hidden-hood-coat',
    ]);
  });

  it('returns exactly 4 products matching the editorial config', () => {
    expect(getSelectedProducts()).toHaveLength(4);
  });
});
