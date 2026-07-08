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
      <Link href={href} className="block aspect-[3/4] overflow-hidden bg-[#f0ece7] relative">
        <Image
          src={product.images[0] ?? '/placeholders/product-placeholder.svg'}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </Link>
      <div className="absolute top-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-10">
        <WishlistToggle productId={product.id} productName={name} />
      </div>
      <div className="mt-3 pr-8">
        <h3 className="text-[13px] leading-snug text-foreground/90">
          <Link href={href} className="hover:text-accent transition-colors duration-200">
            {name}
          </Link>
        </h3>
        <p className="mt-1 text-[13px] text-muted">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
