import Link from 'next/link';
import Image from 'next/image';
import type { AppLocale, Collection } from '@/types';
import { Section } from '@/components/ui/Section';
import { PageContainer } from '@/components/ui/PageContainer';

interface CollectionsSectionProps {
  collections: Collection[];
  locale: AppLocale;
  heading: string;
  viewLabel: string;
}

export function CollectionsSection({ collections, locale, heading, viewLabel }: CollectionsSectionProps) {
  if (collections.length === 0) return null;

  const [primary, ...rest] = collections;

  return (
    <Section>
      <PageContainer>
        <h2 className="text-[10px] tracking-[0.45em] uppercase text-muted mb-10">{heading}</h2>

        <div className="grid lg:grid-cols-[5fr_3fr] gap-4 lg:gap-6 lg:h-[700px]">
          <CollectionTile collection={primary} locale={locale} viewLabel={viewLabel} large />

          <div className="grid grid-rows-2 gap-4 lg:gap-6">
            {rest.slice(0, 2).map(col => (
              <CollectionTile key={col.id} collection={col} locale={locale} viewLabel={viewLabel} />
            ))}
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}

function CollectionTile({
  collection,
  locale,
  viewLabel,
  large = false,
}: {
  collection: Collection;
  locale: AppLocale;
  viewLabel: string;
  large?: boolean;
}) {
  const href = `/${locale}/collections/${collection.slug}`;
  const name = collection.name[locale];
  const story = collection.story[locale];

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden bg-[#f0ece7] block ${large ? 'aspect-[4/5] lg:aspect-auto lg:h-full' : 'aspect-[16/9] lg:aspect-auto'}`}
    >
      <Image
        src={collection.heroImage}
        alt={name}
        fill
        sizes={large ? '(max-width: 1024px) 100vw, 62vw' : '(max-width: 1024px) 100vw, 38vw'}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7 text-white">
        <p className="text-xs tracking-[0.25em] uppercase text-white/70 mb-1">{viewLabel}</p>
        <h3
          className={`font-light leading-tight ${large ? 'text-2xl lg:text-4xl' : 'text-lg lg:text-xl'}`}
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {name}
        </h3>
        {large && (
          <p className="mt-2 text-sm text-white/70 leading-relaxed max-w-sm hidden lg:block line-clamp-2">
            {story}
          </p>
        )}
      </div>
    </Link>
  );
}
