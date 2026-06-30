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
    <Link href={href} className="group block relative aspect-[4/5] overflow-hidden bg-stone-100">
      <Image
        src={collection.heroImage}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
      <p className="absolute bottom-4 left-4 text-white text-sm font-medium tracking-wide uppercase">
        {name}
      </p>
    </Link>
  );
}
