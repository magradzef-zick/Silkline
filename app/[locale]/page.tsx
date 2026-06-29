import { setRequestLocale } from 'next-intl/server';
import type { AppLocale } from '@/i18n/locales';

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  return (
    <section className="px-6 py-16">
      <h1 className="text-3xl font-semibold">SilkLine</h1>
      <p className="mt-4 text-stone-600 max-w-md">
        The Digital Flagship Store foundation is live. Homepage editorial
        sections (Featured Collection, Editor&apos;s Picks, Best Sellers)
        ship in the next plan.
      </p>
    </section>
  );
}
