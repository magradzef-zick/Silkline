import Image from 'next/image';
import Link from 'next/link';
import type { AppLocale, Collection } from '@/types';

interface HeroSectionProps {
  collection: Collection;
  locale: AppLocale;
  viewLabel: string;
  heroImage?: string;
}

export function HeroSection({ collection, locale, viewLabel, heroImage }: HeroSectionProps) {
  const href = `/${locale}/collections/${collection.slug}`;
  const name = collection.name[locale];

  const story = collection.story[locale];
  const subline = story.split('.')[0];

  const imageSrc = heroImage ?? collection.heroImage;

  return (
    <section
      className="relative h-[85vh] min-h-[540px] overflow-hidden bg-[#f0ece7]"
      aria-label={name}
    >
      <Image
        src={imageSrc}
        alt={name}
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

      <div className="absolute bottom-10 left-6 lg:bottom-16 lg:left-14 right-6 lg:right-auto max-w-2xl">
        <p
          className="hero-animate text-[10px] tracking-[0.5em] uppercase text-white/45 mb-5 lg:mb-6"
          style={{ animationDelay: '0.1s' }}
        >
          {name}
        </p>

        <h1
          className="hero-animate text-[34px] lg:text-[58px] xl:text-[72px] font-light italic leading-[1.05] text-white"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif', animationDelay: '0.25s' }}
        >
          {subline}.
        </h1>

        <Link
          href={href}
          className="hero-animate mt-8 lg:mt-11 inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-white/70 border-b border-white/25 pb-0.5 hover:text-white hover:border-white/55 transition-all duration-300"
          style={{ animationDelay: '0.5s' }}
        >
          {viewLabel}
          <span aria-hidden="true" className="text-white/50">→</span>
        </Link>
      </div>
    </section>
  );
}
