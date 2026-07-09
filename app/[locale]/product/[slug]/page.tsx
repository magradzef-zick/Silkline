import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import {
  getProductBySlug,
  getRelatedProducts,
  getAllProducts,
} from '@/lib/data-source/products';
import { ProductGallery } from '@/components/ui/ProductGallery';
import { ProductOrderActions } from '@/components/features/ProductOrderActions';
import { EditorialProductSection } from '@/components/sections/EditorialProductSection';
import { JsonLd } from '@/components/ui/JsonLd';
import { PageContainer } from '@/components/ui/PageContainer';
import { formatPrice } from '@/lib/utils/format';
import { locales, type AppLocale } from '@/i18n/locales';

export async function generateStaticParams() {
  return locales.flatMap(locale =>
    getAllProducts().map(p => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const loc = locale as AppLocale;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  return {
    title: `${product.name[loc]} — SilkLine`,
    description: product.description[loc],
    alternates: {
      canonical: `${siteUrl}/ru/product/${slug}`,
      languages: {
        ru: `${siteUrl}/ru/product/${slug}`,
        uz: `${siteUrl}/uz/product/${slug}`,
      },
    },
    openGraph: {
      images: [
        `${siteUrl}${product.images[0] ?? '/placeholders/product-placeholder.svg'}`,
      ],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as AppLocale)) notFound();
  const loc = locale as AppLocale;
  setRequestLocale(loc);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product);
  const t = await getTranslations('product');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[loc],
    description: product.description[loc],
    image: `${siteUrl}${product.images[0] ?? '/placeholders/product-placeholder.svg'}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'UZS',
      price: product.price,
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/${loc}/product/${slug}`,
    },
  };

  return (
    <>
      <JsonLd data={productSchema} />

      <PageContainer>
        <div className="py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left: gallery */}
            <ProductGallery
              images={product.images}
              name={product.name[loc]}
              priority
            />

            {/* Right: product info + order actions */}
            <div className="flex flex-col gap-6 lg:self-start lg:sticky lg:top-8">
              <div>
                <h1
                  className="text-[26px] lg:text-[34px] font-light leading-tight text-foreground"
                  style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                >
                  {product.name[loc]}
                </h1>
                <p className="mt-2 text-base text-accent">
                  {formatPrice(product.price)}
                </p>
              </div>

              {product.description[loc] && (
                <div>
                  <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3">
                    {t('details')}
                  </p>
                  <p
                    className="text-base italic text-foreground/65 leading-relaxed"
                    style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  >
                    {product.description[loc]}
                  </p>
                </div>
              )}

              <ProductOrderActions product={product} locale={loc} />
            </div>
          </div>
        </div>
      </PageContainer>

      {relatedProducts.length > 0 && (
        <EditorialProductSection
          products={relatedProducts}
          locale={loc}
          heading={t('completeTheLook')}
        />
      )}
    </>
  );
}
