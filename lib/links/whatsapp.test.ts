import { describe, expect, it } from 'vitest';
import { buildWhatsappOrderLink } from './whatsapp';
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

describe('buildWhatsappOrderLink', () => {
  it('encodes the product name and url into a wa.me deep link', () => {
    const link = buildWhatsappOrderLink(product, 'ru', 'https://silkline.uz');
    expect(link).toContain('https://wa.me/');
    expect(link).toContain(encodeURIComponent('Шёлковое платье'));
    expect(link).toContain(encodeURIComponent('https://silkline.uz/ru/product/silk-wrap-dress'));
  });

  it('includes size in the message when size is provided', () => {
    const link = buildWhatsappOrderLink(product, 'ru', 'https://silkline.uz', 'L');
    expect(link).toContain(encodeURIComponent('L'));
    expect(link).toContain(encodeURIComponent('Шёлковое платье'));
  });
});
