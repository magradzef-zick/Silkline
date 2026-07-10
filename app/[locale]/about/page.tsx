import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getFeaturedCollection } from '@/lib/data-source/collections';
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

  const principles = [
    { num: '01', title: t('principle1Title'), body: t('principle1Body') },
    { num: '02', title: t('principle2Title'), body: t('principle2Body') },
    { num: '03', title: t('principle3Title'), body: t('principle3Body') },
  ];

  return (
    <PageContainer>
      {/* Intro — 2-col on desktop: heading left, text right */}
      <Section>
        <div className="grid lg:grid-cols-2 lg:gap-20 items-start">
          <FadeIn>
            <h1
              className="text-[32px] lg:text-[52px] font-light leading-[1.1]"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              {t('heading')}
            </h1>
          </FadeIn>
          <FadeIn delay={120}>
            <p className="mt-6 lg:mt-2 text-base lg:text-lg text-muted leading-relaxed max-w-prose">
              {t('story')}
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* Mission pull-quote */}
      <FadeIn>
        <div className="border-t border-border bg-[#f5f2ee]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
            <p className="text-[11px] tracking-[0.35em] uppercase text-muted mb-6">
              {t('missionLabel')}
            </p>
            <p
              className="text-2xl lg:text-4xl font-light text-foreground/80 leading-snug max-w-4xl italic"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              {t('mission')}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Principles */}
      <FadeIn>
        <Section>
          <div className="max-w-screen-xl">
            <h2 className="text-[11px] tracking-[0.35em] uppercase text-muted mb-12">
              {t('principlesHeading')}
            </h2>
            <div className="grid gap-0 sm:grid-cols-3">
              {principles.map((p, i) => (
                <div
                  key={p.num}
                  className={`border-t border-border pt-8 pb-8 ${i < principles.length - 1 ? 'sm:pr-10' : ''}`}
                >
                  <span
                    className="block text-[11px] tracking-[0.3em] text-muted/40 mb-6"
                    style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  >
                    {p.num}
                  </span>
                  <h3
                    className="text-lg font-light text-foreground leading-snug mb-4"
                    style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-[13px] text-muted leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </FadeIn>

      {/* Curation philosophy */}
      <FadeIn>
        <Section>
          <div className="max-w-screen-xl">
            <div className="grid lg:grid-cols-2 lg:gap-20 border-t border-border pt-12 lg:pt-16">
              <div>
                <h2 className="text-[11px] tracking-[0.35em] uppercase text-muted mb-8">
                  {t('curationHeading')}
                </h2>
                <p className="text-base text-foreground/80 leading-relaxed mb-5">
                  {t('curationBody1')}
                </p>
                <p className="text-base text-foreground/80 leading-relaxed">
                  {t('curationBody2')}
                </p>
              </div>
              <div className="mt-12 lg:mt-0 border-t lg:border-t-0 lg:border-l border-border pt-12 lg:pt-0 lg:pl-20">
                <h2 className="text-[11px] tracking-[0.35em] uppercase text-muted mb-8">
                  {t('focusHeading')}
                </h2>
                <p className="text-base text-foreground/80 leading-relaxed mb-10">
                  {t('focusBody')}
                </p>
                <h2 className="text-[11px] tracking-[0.35em] uppercase text-muted mb-4">
                  {t('visitHeading')}
                </h2>
                <p className="text-base text-foreground/80 leading-relaxed">
                  {t('visitBody')}
                </p>
              </div>
            </div>
          </div>
        </Section>
      </FadeIn>

      {/* Closing CTA row */}
      <div className="border-t border-border">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {featuredCollection && (
            <Link
              href={`/${loc}/collections/${featuredCollection.slug}`}
              className="text-[11px] tracking-widest uppercase border-b border-foreground pb-0.5 hover:text-muted hover:border-muted transition-colors"
            >
              {t('viewCollections')}
            </Link>
          )}
          <Link
            href={`/${loc}/stores`}
            className="text-[11px] tracking-widest uppercase border-b border-foreground pb-0.5 hover:text-muted hover:border-muted transition-colors"
          >
            {t('storesLabel')} →
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
