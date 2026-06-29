import { categories } from '@/data/categories';
import type { Category } from '@/types';

export function getAllCategories(): Category[] {
  return categories;
}
