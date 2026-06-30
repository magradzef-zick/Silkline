import { collections } from '@/data/collections';
import type { Collection } from '@/types';
import { EDITORIAL } from '@/lib/config/editorial';

export function getAllCollections(): Collection[] {
  return collections;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

export function getFeaturedCollection(): Collection | undefined {
  return collections.find(c => c.slug === EDITORIAL.featuredCollectionSlug);
}
