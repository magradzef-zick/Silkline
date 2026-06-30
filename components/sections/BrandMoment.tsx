import { getTranslations } from 'next-intl/server';

export async function BrandMoment() {
  const t = await getTranslations('brand');
  const statement = t('statement');

  // Section is invisible when brand.statement is empty (not yet approved by client)
  if (!statement) return null;

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-2xl lg:text-4xl font-light leading-relaxed text-stone-800">
          {statement}
        </p>
      </div>
    </section>
  );
}
