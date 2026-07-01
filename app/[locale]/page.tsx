import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getFeaturedCollection } from '@/lib/data-source/collections';
import { getSelectedProducts } from '@/lib/data-source/products';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedCollectionSection } from '@/components/sections/FeaturedCollectionSection';
import { EditorialProductSection } from '@/components/sections/EditorialProductSection';
import { BrandMoment } from '@/components/sections/BrandMoment';
import { JsonLd } from '@/components/ui/JsonLd';
import { locales, type AppLocale } from '@/i18n/locales';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  const titles: Record<AppLocale, string> = {
    ru: 'SilkLine — Корейская мода в Ташкенте',
    uz: 'SilkLine — Toshkentda Koreys modasi',
  };
  const descriptions: Record<AppLocale, string> = {
    ru: 'Кураторская коллекция корейской женской одежды. Платья, пальто, трикотаж.',
    uz: "Koreys ayollar kiyimlarining tanlov to'plami. Ko'ylaklar, paltolar, trikotaj.",
  };

  return {
    title: titles[locale as AppLocale] ?? titles.ru,
    description: descriptions[locale as AppLocale] ?? descriptions.ru,
    alternates: {
      canonical: `${siteUrl}/ru`,
      languages: {
        ru: `${siteUrl}/ru`,
        uz: `${siteUrl}/uz`,
      },
    },
    openGraph: {
      images: [`${siteUrl}${process.env.NEXT_PUBLIC_OG_IMAGE ?? '/og-default.svg'}`],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as AppLocale)) notFound();
  setRequestLocale(locale as AppLocale);

  const collection = getFeaturedCollection();
  if (!collection) notFound();

  const selected = getSelectedProducts();
  const t = await getTranslations('homepage');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SilkLine',
    url: siteUrl,
  };
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SilkLine',
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tashkent',
      addressCountry: 'UZ',
    },
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={orgSchema} />
      <HeroSection
        collection={collection}
        locale={locale as AppLocale}
        viewLabel={t('viewCollection')}
      />
      <FeaturedCollectionSection
        collection={collection}
        locale={locale as AppLocale}
        viewLabel={t('viewCollection')}
      />
      <EditorialProductSection
        products={selected}
        locale={locale as AppLocale}
        heading={t('selectedHeading')}
      />
      <BrandMoment />
    </>
  );
}
