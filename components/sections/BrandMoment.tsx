import { getTranslations } from 'next-intl/server';

export async function BrandMoment() {
  const t = await getTranslations('brand');
  const statement = t('statement');

  if (!statement) return null;

  return (
    <section className="py-24 lg:py-36 bg-[#f0ece7]">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 text-center">

        {/* Brand signature */}
        <p
          className="text-[9px] tracking-[0.7em] uppercase text-accent/60 mb-10 lg:mb-14"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          SILK LINE
        </p>

        {/* Editorial statement — large italic serif */}
        <p
          className="text-4xl lg:text-5xl xl:text-7xl font-light italic text-foreground/75 leading-snug max-w-4xl mx-auto"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {statement}
        </p>

        {/* City anchor */}
        <p className="text-[10px] tracking-[0.5em] uppercase text-muted/60 mt-10 lg:mt-14">
          {t('city')}
        </p>

      </div>
    </section>
  );
}
