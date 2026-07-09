import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getAllStores } from '@/lib/data-source/stores';
import { StoreCard } from '@/components/ui/StoreCard';
import { PageContainer } from '@/components/ui/PageContainer';
import { Section } from '@/components/ui/Section';
import { FadeIn } from '@/components/ui/FadeIn';
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
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <h1
            className="text-3xl lg:text-5xl font-light leading-tight"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            {t('heading')}
          </h1>
          <p className="text-[13px] text-muted sm:max-w-xs sm:text-right leading-relaxed">
            {t('intro')}
          </p>
        </div>

        <div className="space-y-0">
          {stores.map((store, index) => (
            <FadeIn key={store.id} delay={index * 60}>
              <StoreCard
                store={store}
                locale={loc}
                index={index + 1}
              />
            </FadeIn>
          ))}
        </div>
      </Section>
    </PageContainer>
  );
}
