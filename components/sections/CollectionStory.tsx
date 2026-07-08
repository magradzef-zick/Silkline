import type { AppLocale, Collection } from '@/types';
import { Section } from '@/components/ui/Section';
import { PageContainer } from '@/components/ui/PageContainer';

interface CollectionStoryProps {
  collection: Collection;
  locale: AppLocale;
}

export function CollectionStory({ collection, locale }: CollectionStoryProps) {
  const story = collection.story[locale];

  // Character-count conditional: short stories render large; long stories render as prose
  const isShort = story.length < 100;
  const isMedium = story.length >= 100 && story.length < 400;

  const textClass = isShort
    ? 'text-3xl lg:text-4xl font-light leading-relaxed max-w-xl mx-auto text-center'
    : isMedium
    ? 'text-xl lg:text-2xl font-light leading-relaxed max-w-2xl mx-auto text-center'
    : 'text-base lg:text-lg leading-relaxed max-w-prose mx-auto';

  return (
    <Section as="div">
      <PageContainer>
        <p
          className={`text-foreground/80 ${textClass}`}
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {story}
        </p>
      </PageContainer>
    </Section>
  );
}
