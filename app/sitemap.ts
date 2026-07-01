import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/data-source/products';
import { getAllCollections } from '@/lib/data-source/collections';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';
const locales = ['ru', 'uz'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/shop', '/about', '/stores'].flatMap(route =>
    locales.map(locale => ({
      url: `${siteUrl}/${locale}${route}`,
      lastModified: new Date(),
    }))
  );

  const collectionRoutes = getAllCollections().flatMap(c =>
    locales.map(locale => ({
      url: `${siteUrl}/${locale}/collections/${c.slug}`,
      lastModified: new Date(),
    }))
  );

  const productRoutes = getAllProducts().flatMap(p =>
    locales.map(locale => ({
      url: `${siteUrl}/${locale}/product/${p.slug}`,
      lastModified: new Date(),
    }))
  );

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
