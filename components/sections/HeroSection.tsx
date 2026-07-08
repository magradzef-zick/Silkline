import Image from 'next/image';
import Link from 'next/link';
import type { AppLocale, Collection } from '@/types';

interface HeroSectionProps {
  collection: Collection;
  locale: AppLocale;
  viewLabel: string;
}

export function HeroSection({ collection, locale, viewLabel }: HeroSectionProps) {
  const href = `/${locale}/collections/${collection.slug}`;

  return (
    <section
      className="relative h-svh min-h-[560px] max-h-[900px] overflow-hidden bg-[#f0ece7]"
      aria-label={collection.name[locale]}
    >
      <Image
        src={collection.heroImage}
        alt={collection.name[locale]}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Layered gradient: warm dark at bottom for legibility, subtle tint at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />

      <div className="absolute bottom-12 left-6 lg:left-14 right-6 lg:right-auto max-w-xl">
        <p className="text-[11px] tracking-[0.35em] uppercase text-white/60 mb-3">
          {collection.name[locale]}
        </p>
        <h1
          className="text-[28px] lg:text-6xl font-light leading-snug text-white line-clamp-4 lg:line-clamp-none"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {collection.story[locale]}
        </h1>
        <Link
          href={href}
          className="mt-8 inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-white border-b border-white/50 pb-0.5 hover:border-white transition-colors duration-200"
        >
          {viewLabel}
          <span aria-hidden="true" className="text-white/60">→</span>
        </Link>
      </div>
    </section>
  );
}
