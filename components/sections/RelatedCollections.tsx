import type { AppLocale, Collection } from '@/types';
import { CollectionCard } from '@/components/ui/CollectionCard';
import { Section } from '@/components/ui/Section';
import { PageContainer } from '@/components/ui/PageContainer';

interface RelatedCollectionsProps {
  collections: Collection[];
  locale: AppLocale;
  heading: string;
}

export function RelatedCollections({
  collections,
  locale,
  heading,
}: RelatedCollectionsProps) {
  if (collections.length === 0) return null;

  return (
    <Section>
      <PageContainer>
        <h2 className="text-xs tracking-[0.3em] uppercase text-stone-500 mb-8">{heading}</h2>
        <div
          className={
            collections.length === 1
              ? 'max-w-sm mx-auto'
              : 'grid grid-cols-1 sm:grid-cols-2 gap-6'
          }
        >
          {collections.map(c => (
            <CollectionCard key={c.id} collection={c} locale={locale} />
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
