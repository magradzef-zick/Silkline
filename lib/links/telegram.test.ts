import { describe, expect, it } from 'vitest';
import { buildTelegramOrderLink } from './telegram';
import type { Product } from '@/types';

const product: Product = {
  id: 'p1',
  slug: 'silk-wrap-dress',
  name: { ru: 'Шёлковое платье', uz: 'Ipak ko\'ylak' },
  description: { ru: '', uz: '' },
  collectionId: 'c1',
  categoryId: 'cat1',
  images: [],
  sizes: ['S', 'M'],
  price: 890000,
  relatedProductIds: []
};

describe('buildTelegramOrderLink', () => {
  it('encodes the product name and url into a t.me deep link', () => {
    const link = buildTelegramOrderLink(product, 'ru', 'https://silkline.uz');
    expect(link).toContain('https://t.me/');
    expect(link).toContain(encodeURIComponent('Шёлковое платье'));
    expect(link).toContain(encodeURIComponent('https://silkline.uz/ru/product/silk-wrap-dress'));
  });

  it('uses the Uzbek name when locale is uz', () => {
    const link = buildTelegramOrderLink(product, 'uz', 'https://silkline.uz');
    expect(link).toContain(encodeURIComponent('Ipak ko\'ylak'));
  });

  it('includes size in the message when size is provided', () => {
    const link = buildTelegramOrderLink(product, 'ru', 'https://silkline.uz', 'M');
    expect(link).toContain(encodeURIComponent('M'));
    expect(link).toContain(encodeURIComponent('Шёлковое платье'));
  });

  it('does not change the message when size is undefined', () => {
    const withUndefined = buildTelegramOrderLink(product, 'ru', 'https://silkline.uz', undefined);
    const withoutSize = buildTelegramOrderLink(product, 'ru', 'https://silkline.uz');
    expect(withUndefined).toBe(withoutSize);
  });
});
