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

  return (
    <Section>
      <PageContainer>
        <h2 className="text-[10px] tracking-[0.45em] uppercase text-muted mb-10">{heading}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
          {collections.slice(0, 3).map(col => (
            <CollectionTile key={col.id} collection={col} locale={locale} viewLabel={viewLabel} />
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}

function CollectionTile({
  collection,
  locale,
  viewLabel,
}: {
  collection: Collection;
  locale: AppLocale;
  viewLabel: string;
}) {
  const href = `/${locale}/collections/${collection.slug}`;
  const name = collection.name[locale];

  return (
    <Link
      href={href}
      className="group relative overflow-hidden bg-[#f0ece7] block aspect-[3/4]"
    >
      <Image
        src={collection.heroImage}
        alt={name}
        fill
        sizes="(max-width: 640px) 100vw, 33vw"
        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7 text-white">
        <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-2">{viewLabel}</p>
        <h3
          className="text-xl lg:text-2xl font-light leading-tight"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {name}
        </h3>
      </div>
    </Link>
  );
}
