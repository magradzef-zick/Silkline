import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getCollectionBySlug, getAllCollections } from '@/lib/data-source/collections';
import { getProductsByCollectionId } from '@/lib/data-source/products';
import { CollectionStory } from '@/components/sections/CollectionStory';
import { RelatedCollections } from '@/components/sections/RelatedCollections';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { PageContainer } from '@/components/ui/PageContainer';
import { Section } from '@/components/ui/Section';
import { JsonLd } from '@/components/ui/JsonLd';
import { locales, type AppLocale } from '@/i18n/locales';

export async function generateStaticParams() {
  return locales.flatMap(locale =>
    getAllCollections().map(c => ({ locale, slug: c.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};
  const loc = locale as AppLocale;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  return {
    title: `${collection.name[loc]} — SilkLine`,
    description: collection.story[loc],
    alternates: {
      canonical: `${siteUrl}/ru/collections/${slug}`,
      languages: {
        ru: `${siteUrl}/ru/collections/${slug}`,
        uz: `${siteUrl}/uz/collections/${slug}`,
      },
    },
    openGraph: {
      images: [`${siteUrl}${collection.heroImage}`],
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as AppLocale)) notFound();
  const loc = locale as AppLocale;
  setRequestLocale(loc);

  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = getProductsByCollectionId(collection.id);
  const otherCollections = getAllCollections().filter(c => c.slug !== slug);
  const t = await getTranslations('collection');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SilkLine', item: siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: collection.name[loc],
        item: `${siteUrl}/${loc}/collections/${slug}`,
      },
    ],
  };

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name[loc],
    description: collection.story[loc],
    url: `${siteUrl}/${loc}/collections/${slug}`,
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={collectionPageSchema} />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-[#f0ece7]">
        <Image
          src={collection.heroImage}
          alt={collection.name[loc]}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute bottom-8 left-6 lg:left-12">
          <h1
            className="text-3xl lg:text-5xl font-light leading-tight text-white"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            {collection.name[loc]}
          </h1>
        </div>
      </section>

      {/* Story */}
      <CollectionStory collection={collection} locale={loc} />

      {/* Product grid — only rendered when products exist */}
      {products.length > 0 && (
        <Section>
          <PageContainer>
            <ProductGrid products={products} locale={loc} columns={3} />
          </PageContainer>
        </Section>
      )}

      {/* Related collections — excludes the current slug */}
      <RelatedCollections
        collections={otherCollections}
        locale={loc}
        heading={t('relatedHeading')}
      />
    </>
  );
}
