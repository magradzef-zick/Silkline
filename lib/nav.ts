import type { AppLocale, Collection } from '@/types';

export interface NavLink {
  label: string;
  href: string;
}

export function buildCollectionNavLinks(
  collections: Collection[],
  locale: AppLocale
): NavLink[] {
  return collections.map((collection) => ({
    label: collection.name[locale],
    href: `/${locale}/collections/${collection.slug}`
  }));
}

export function switchLocalePath(pathname: string, locale: AppLocale): string {
  const segments = pathname.split('/');
  segments[1] = locale;
  return segments.join('/');
}
