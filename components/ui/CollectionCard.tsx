import Image from 'next/image';
import Link from 'next/link';
import type { AppLocale, Collection } from '@/types';

interface CollectionCardProps {
  collection: Collection;
  locale: AppLocale;
}

export function CollectionCard({ collection, locale }: CollectionCardProps) {
  const href = `/${locale}/collections/${collection.slug}`;
  const name = collection.name[locale];

  return (
    <Link href={href} className="group block relative aspect-[4/5] overflow-hidden bg-[#f0ece7]">
      <Image
        src={collection.heroImage}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      <p
        className="absolute bottom-5 left-5 text-white text-lg font-light leading-tight"
        style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
      >
        {name}
      </p>
    </Link>
  );
}
