import Image from 'next/image';
import Link from 'next/link';
import type { AppLocale, Collection } from '@/types';
import { Section } from '@/components/ui/Section';
import { PageContainer } from '@/components/ui/PageContainer';

interface FeaturedCollectionSectionProps {
  collection: Collection;
  locale: AppLocale;
  viewLabel: string;
}

export function FeaturedCollectionSection({
  collection,
  locale,
  viewLabel,
}: FeaturedCollectionSectionProps) {
  const href = `/${locale}/collections/${collection.slug}`;
  const story = collection.story[locale];
  const isShort = story.length < 100;

  return (
    <Section>
      <PageContainer>
        <div className="grid lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
            <Image
              src={collection.heroImage}
              alt={collection.name[locale]}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl lg:text-3xl font-light tracking-wide uppercase">
              {collection.name[locale]}
            </h2>
            <p
              className={
                isShort
                  ? 'text-2xl lg:text-3xl font-light leading-relaxed text-stone-600'
                  : 'text-base lg:text-lg leading-relaxed text-stone-600'
              }
            >
              {story}
            </p>
            <Link
              href={href}
              className="self-start text-xs tracking-widest uppercase border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors"
            >
              {viewLabel}
            </Link>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
