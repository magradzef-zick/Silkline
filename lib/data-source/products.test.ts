import { describe, expect, it } from 'vitest';
import {
  getAllProducts,
  getProductBySlug,
  getProductsByCollectionId,
  getProductsByCategoryId,
  getRelatedProducts
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
