import type { AppLocale, Collection } from '@/types';
import { PageContainer } from '@/components/ui/PageContainer';

interface CollectionStoryProps {
  collection: Collection;
  locale: AppLocale;
}

export function CollectionStory({ collection, locale }: CollectionStoryProps) {
  const story = collection.story[locale];

  const isShort = story.length < 100;
  const isMedium = story.length >= 100 && story.length < 400;

  const textClass = isShort
    ? 'text-4xl lg:text-6xl font-light italic leading-relaxed max-w-2xl mx-auto text-center'
    : isMedium
    ? 'text-2xl lg:text-4xl font-light italic leading-relaxed max-w-3xl mx-auto text-center'
    : 'text-base lg:text-lg leading-relaxed max-w-prose mx-auto';

  return (
    <div className="py-16 lg:py-28">
      <PageContainer>
        <p
          className={`text-foreground/80 ${textClass}`}
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {story}
        </p>
      </PageContainer>
    </div>
  );
}
