import { describe, expect, it } from 'vitest';
import { buildCollectionNavLinks, switchLocalePath } from './nav';
import type { Collection } from '@/types';

const collections: Collection[] = [
  {
    id: 'c1',
    slug: 'autumn-atelier',
    name: { ru: 'Осенний ателье', uz: 'Kuzgi atelye' },
    story: { ru: '', uz: '' },
    heroImage: '',
    productIds: []
  }
];

describe('buildCollectionNavLinks', () => {
  it('maps collections to localized nav links', () => {
    const links = buildCollectionNavLinks(collections, 'ru');
    expect(links).toEqual([
      { label: 'Осенний ателье', href: '/ru/collections/autumn-atelier' }
    ]);
  });

  it('uses the Uzbek name and prefix when locale is uz', () => {
    const links = buildCollectionNavLinks(collections, 'uz');
    expect(links[0]).toEqual({ label: 'Kuzgi atelye', href: '/uz/collections/autumn-atelier' });
  });
});

describe('switchLocalePath', () => {
  it('replaces the locale segment of a path', () => {
    expect(switchLocalePath('/ru/collections/autumn-atelier', 'uz')).toBe(
      '/uz/collections/autumn-atelier'
    );
  });

  it('handles the bare locale root', () => {
    expect(switchLocalePath('/ru', 'uz')).toBe('/uz');
  });
});
