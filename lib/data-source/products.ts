import { products } from '@/data/products';
import type { Product } from '@/types';

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCollectionId(collectionId: string): Product[] {
  return products.filter((product) => product.collectionId === collectionId);
}

export function getProductsByCategoryId(categoryId: string): Product[] {
  return products.filter((product) => product.categoryId === categoryId);
}

export function getRelatedProducts(product: Product): Product[] {
  return product.relatedProductIds
    .map((id) => products.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is Product => candidate !== undefined);
}
