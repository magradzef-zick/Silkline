import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/data-source/products';
import { getAllCollections } from '@/lib/data-source/collections';
import { getAllCategories } from '@/lib/data-source/categories';
import { ShopAllClient } from '@/components/features/ShopAllClient';
import { PageContainer } from '@/components/ui/PageContainer';
import { locales, type AppLocale } from '@/i18n/locales';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as AppLocale;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  const titles: Record<AppLocale, string> = {
    ru: 'Каталог — SilkLine',
    uz: 'Katalog — SilkLine',
  };
  const descriptions: Record<AppLocale, string> = {
    ru: 'Весь ассортимент: платья, пальто, трикотаж.',
    uz: "Barcha assortiment: ko'ylaklar, paltolar, trikotaj.",
  };

  return {
    title: titles[loc] ?? titles.ru,
    description: descriptions[loc] ?? descriptions.ru,
    alternates: {
      canonical: `${siteUrl}/ru/shop`,
      languages: {
        ru: `${siteUrl}/ru/shop`,
        uz: `${siteUrl}/uz/shop`,
      },
    },
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as AppLocale)) notFound();
  const loc = locale as AppLocale;
  setRequestLocale(loc);

  const products = getAllProducts();
  const collections = getAllCollections();
  const categories = getAllCategories();

  return (
    <PageContainer>
      <div className="py-12">
        <ShopAllClient
          products={products}
          collections={collections}
          categories={categories}
          locale={loc}
        />
      </div>
    </PageContainer>
  );
}
