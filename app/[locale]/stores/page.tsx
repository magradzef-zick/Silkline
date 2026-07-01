import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getAllStores } from '@/lib/data-source/stores';
import { StoreCard } from '@/components/ui/StoreCard';
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
  const t = await getTranslations({ locale: loc, namespace: 'stores' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silkline.uz';

  return {
    title: t('title'),
    alternates: {
      canonical: `${siteUrl}/ru/stores`,
      languages: {
        ru: `${siteUrl}/ru/stores`,
        uz: `${siteUrl}/uz/stores`,
      },
    },
  };
}

export default async function StoresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as AppLocale)) notFound();
  const loc = locale as AppLocale;
  setRequestLocale(loc);

  const t = await getTranslations('stores');
  const stores = getAllStores();

  return (
    <PageContainer>
      <Section>
        <h1 className="text-3xl lg:text-4xl font-light tracking-wide mb-10">
          {t('heading')}
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
          {stores.map(store => (
            <StoreCard key={store.id} store={store} locale={loc} />
          ))}
        </div>
      </Section>
    </PageContainer>
  );
}
