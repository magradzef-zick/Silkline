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
      className="relative h-svh min-h-[500px] overflow-hidden"
      aria-label={collection.name[locale]}
    >
      <Image
        src={collection.heroImage}
        alt={collection.name[locale]}
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />
      {/* Darkening gradient on the lower third */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute bottom-12 left-6 lg:left-12 max-w-lg">
        <h1 className="text-3xl lg:text-5xl font-light tracking-widest text-white uppercase">
          {collection.name[locale]}
        </h1>
        <p className="mt-4 text-sm text-white/80 tracking-wide max-w-sm">
          {collection.story[locale]}
        </p>
        <Link
          href={href}
          className="mt-6 inline-block border border-white text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-white hover:text-stone-900 transition-colors"
        >
          {viewLabel}
        </Link>
      </div>
    </section>
  );
}
