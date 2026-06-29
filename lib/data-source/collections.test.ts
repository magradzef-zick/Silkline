import { describe, expect, it } from 'vitest';
import { getAllCollections, getCollectionBySlug } from './collections';

describe('collections data source', () => {
  it('returns all seeded collections', () => {
    expect(getAllCollections().length).toBeGreaterThanOrEqual(2);
  });

  it('finds a collection by slug', () => {
    const collection = getCollectionBySlug('autumn-atelier');
    expect(collection?.id).toBe('col-autumn-atelier');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getCollectionBySlug('does-not-exist')).toBeUndefined();
  });
});
