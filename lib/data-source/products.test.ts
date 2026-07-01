import { describe, expect, it } from 'vitest';
import {
  getAllProducts,
  getProductBySlug,
  getProductsByCollectionId,
  getProductsByCategoryId,
  getRelatedProducts,
  getSelectedProducts,
  getProductsByIds
} from './products';

describe('products data source', () => {
  it('returns all seeded products', () => {
    expect(getAllProducts().length).toBeGreaterThanOrEqual(6);
  });

  it('finds a product by slug', () => {
    expect(getProductBySlug('silk-wrap-dress')?.id).toBe('p-wrap-dress');
  });

  it('filters products by collection', () => {
    const result = getProductsByCollectionId('col-seoul-minimal');
    expect(result.every((p) => p.collectionId === 'col-seoul-minimal')).toBe(true);
    expect(result.length).toBe(3);
  });

  it('filters products by category', () => {
    const result = getProductsByCategoryId('cat-dresses');
    expect(result.every((p) => p.categoryId === 'cat-dresses')).toBe(true);
  });

  it('resolves related products by id, dropping unknown ids', () => {
    const product = getProductBySlug('silk-wrap-dress')!;
    const related = getRelatedProducts(product);
    expect(related.map((p) => p.id)).toEqual(product.relatedProductIds);
  });
});

describe('getSelectedProducts', () => {
  it('returns products in the order defined by the editorial config', () => {
    const selected = getSelectedProducts();
    expect(selected.map(p => p.slug)).toEqual([
      'silk-wrap-dress',
      'satin-slip-dress',
      'camel-wool-coat',
      'cropped-knit-cardigan',
    ]);
  });

  it('returns exactly 4 products matching the editorial config', () => {
    expect(getSelectedProducts()).toHaveLength(4);
  });
});

describe('getProductsByIds', () => {
  it('returns an empty array for empty input', () => {
    expect(getProductsByIds([])).toHaveLength(0);
  });

  it('returns matched products in input order', () => {
    const result = getProductsByIds(['p-wool-coat', 'p-wrap-dress']);
    expect(result.map(p => p.id)).toEqual(['p-wool-coat', 'p-wrap-dress']);
  });

  it('silently drops unknown ids', () => {
    const result = getProductsByIds(['p-wrap-dress', 'does-not-exist']);
    expect(result.map(p => p.id)).toEqual(['p-wrap-dress']);
  });
});
