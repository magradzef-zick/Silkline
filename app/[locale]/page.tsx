import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getAllCollections, getFeaturedCollection } from '@/lib/data-source/collections';
import { getSelectedProducts } from '@/lib/data-source/products';
import { EDITORIAL } from '@/lib/config/editorial';
import { HeroSection } from '@/components/sections/HeroSection';
import { CollectionsSection } from '@/components/sections/CollectionsSection';
import { EditorialProductSection } from '@/components/sections/EditorialProductSection';
import { EditorialDivider } from '@/components/sections/EditorialDivider';
import { BrandMoment } from '@/components/sections/BrandMoment';
import { FadeIn } from '@/components/ui/FadeIn';
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

  const allCollections = getAllCollections();
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

      {/* Chapter 1 — Campaign opening */}
      <HeroSection
        collection={collection}
        locale={locale as AppLocale}
        viewLabel={t('viewCollection')}
        heroImage={EDITORIAL.heroImage}
      />

      {/* Chapter 2 — The edit: curated selection */}
      <FadeIn delay={80}>
        <EditorialProductSection
          products={selected}
          locale={locale as AppLocale}
          heading={t('selectedHeading')}
        />
      </FadeIn>

      {/* Chapter 3 — Brand voice: pause and breathe */}
      <FadeIn><EditorialDivider text={t('editorialDivider')} /></FadeIn>

      {/* Chapter 4 — Navigate the collections */}
      <FadeIn>
        <CollectionsSection
          collections={allCollections}
          locale={locale as AppLocale}
          heading={t('collectionsHeading')}
          viewLabel={t('viewCollection')}
        />
      </FadeIn>

      {/* Chapter 5 — Brand close */}
      <FadeIn delay={40}><BrandMoment /></FadeIn>
    </>
  );
}
