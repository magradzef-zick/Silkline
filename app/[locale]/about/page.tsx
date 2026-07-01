import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getFeaturedCollection } from '@/lib/data-source/collections';
import { PageContainer } from '@/components/ui/PageContainer';
import { Section } from '@/components/ui/Section';
import { locales, type AppLocale } from '@/i18n/locales';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as AppLocale;
  const t = await getTranslations({ locale: loc, namespace: 'about' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  return {
    title: t('title'),
    alternates: {
      canonical: `${siteUrl}/ru/about`,
      languages: {
        ru: `${siteUrl}/ru/about`,
        uz: `${siteUrl}/uz/about`,
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as AppLocale)) notFound();
  const loc = locale as AppLocale;
  setRequestLocale(loc);

  const t = await getTranslations('about');
  const featuredCollection = getFeaturedCollection();

  return (
    <PageContainer>
      <Section>
        <div className="max-w-2xl">
          <h1 className="text-3xl lg:text-4xl font-light tracking-wide">
            {t('heading')}
          </h1>
          <p className="mt-8 text-base lg:text-lg text-stone-600 leading-relaxed">
            {t('story')}
          </p>
        </div>

        <div className="mt-16 border-t border-stone-200 pt-10 max-w-2xl">
          <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">
            {t('missionLabel')}
          </p>
          <p className="text-lg lg:text-xl font-light text-stone-700 leading-relaxed">
            {t('mission')}
          </p>
        </div>

        {featuredCollection && (
          <div className="mt-12">
            <Link
              href={`/${loc}/collections/${featuredCollection.slug}`}
              className="text-xs tracking-widest uppercase border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors"
            >
              {t('viewCollections')}
            </Link>
          </div>
        )}
      </Section>
    </PageContainer>
  );
}
