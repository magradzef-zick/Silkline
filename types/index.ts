export type AppLocale = 'ru' | 'uz';

export interface LocalizedText {
  ru: string;
  uz: string;
}

export interface Category {
  id: string;
  slug: string;
  name: LocalizedText;
}

export interface Store {
  id: string;
  name: string;
  address: LocalizedText;
  city: string;
  phone: string;
  mapUrl: string;
  hours: string;
}

export interface Product {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  collectionId: string;
  categoryId: string;
  images: string[];
  sizes: string[];
  price: number;
  relatedProductIds: string[];
}

export interface Collection {
  id: string;
  slug: string;
  name: LocalizedText;
  story: LocalizedText;
  heroImage: string;
  productIds: string[];
}
