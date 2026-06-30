import { stores } from '@/data/stores';
import type { Store } from '@/types';

export function getAllStores(): Store[] {
  return stores;
}
