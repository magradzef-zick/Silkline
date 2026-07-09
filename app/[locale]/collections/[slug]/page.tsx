import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getCollectionBySlug, getAllCollections } from '@/lib/data-source/collections';
import { getProductsByCollectionId } from '@/lib/data-source/products';
import { CollectionStory } from '@/components/sections/CollectionStory';
import { RelatedCollections } from '@/components/sections/RelatedCollections';
import { ProductCard } from '@/components/ui/ProductCard';
import { PageContainer } from '@/components/ui/PageContainer';
import { Section } from '@/components/ui/Section';
import { FadeIn } from '@/components/ui/FadeIn';
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
      <section className="relative h-[62vh] min-h-[420px] overflow-hidden bg-[#f0ece7]">
        <Image
          src={collection.heroImage}
          alt={collection.name[loc]}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
        <div className="absolute bottom-10 left-6 lg:left-12 max-w-xl">
          <p
            className="hero-animate text-[10px] tracking-[0.5em] uppercase text-white/40 mb-4"
            style={{ animationDelay: '0.1s' }}
          >
            SILK LINE
          </p>
          <h1
            className="hero-animate text-[36px] lg:text-[62px] font-light italic leading-[1.05] text-white"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif', animationDelay: '0.25s' }}
          >
            {collection.name[loc]}
          </h1>
        </div>
      </section>

      {/* Story */}
      <FadeIn><CollectionStory collection={collection} locale={loc} /></FadeIn>

      {/* Products — editorial 2-up grid */}
      {products.length > 0 && (
        <FadeIn delay={60}>
          <Section>
            <PageContainer>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-14">
                {products.map(p => <ProductCard key={p.id} product={p} locale={loc} />)}
              </div>
            </PageContainer>
          </Section>
        </FadeIn>
      )}

      {/* Related collections — excludes the current slug */}
      <FadeIn delay={40}>
        <RelatedCollections
          collections={otherCollections}
          locale={loc}
          heading={t('relatedHeading')}
        />
      </FadeIn>
    </>
  );
}
