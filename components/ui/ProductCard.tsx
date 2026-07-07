import Image from 'next/image';
import Link from 'next/link';
import type { AppLocale, Product } from '@/types';
import { WishlistToggle } from './WishlistToggle';
import { formatPrice } from '@/lib/utils/format';

interface ProductCardProps {
  product: Product;
  locale: AppLocale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const href = `/${locale}/product/${product.slug}`;
  const name = product.name[locale];

  return (
    <article className="group relative">
      <Link href={href} className="block aspect-[3/4] overflow-hidden bg-stone-100 relative">
        <Image
          src={product.images[0] ?? '/placeholders/product-placeholder.svg'}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="absolute top-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
        <WishlistToggle productId={product.id} productName={name} />
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium leading-snug">
          <Link href={href} className="hover:underline underline-offset-2">
            {name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-stone-500">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
