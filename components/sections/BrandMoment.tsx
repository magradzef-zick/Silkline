import { getTranslations } from 'next-intl/server';

export async function BrandMoment() {
  const t = await getTranslations('brand');
  const statement = t('statement');

  // Section is invisible when brand.statement is empty (not yet approved by client)
  if (!statement) return null;

  return (
    <section className="py-20 lg:py-28 bg-[#f0ece7]">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p
          className="text-2xl lg:text-4xl font-light leading-relaxed text-foreground/80"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {statement}
        </p>
      </div>
    </section>
  );
}
