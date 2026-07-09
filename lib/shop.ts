import type { Product } from '@/types';

export interface ShopFilters {
  collectionIds: string[];
  categoryIds: string[];
}

export type SortOrder = 'featured' | 'price-asc' | 'price-desc';

export const EMPTY_FILTERS: ShopFilters = {
  collectionIds: [],
  categoryIds: [],
};

export function filterProducts(products: Product[], filters: ShopFilters): Product[] {
  return products.filter(p => {
    if (filters.collectionIds.length > 0 && !filters.collectionIds.includes(p.collectionId)) return false;
    if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(p.categoryId)) return false;
    return true;
  });
}

export function sortProducts(products: Product[], order: SortOrder): Product[] {
  const copy = [...products];
  if (order === 'price-asc') return copy.sort((a, b) => a.price - b.price);
  if (order === 'price-desc') return copy.sort((a, b) => b.price - a.price);
  return copy; // 'featured' — preserve editorial order
}

export function hasActiveFilters(filters: ShopFilters): boolean {
  return filters.collectionIds.length > 0 || filters.categoryIds.length > 0;
}
