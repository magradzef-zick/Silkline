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
  const hasSecondImage = product.images.length > 1;

  return (
    <article className="group relative">
      <Link href={href} className="block aspect-[3/4] overflow-hidden bg-[#f0ece7] relative">
        <Image
          src={product.images[0] ?? '/placeholders/product-placeholder.svg'}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover object-top transition-all duration-500 ${hasSecondImage ? 'group-hover:opacity-0' : 'group-hover:scale-[1.04]'}`}
        />
        {hasSecondImage && (
          <Image
            src={product.images[1]}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          />
        )}
      </Link>
      <div className="absolute top-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-10">
        <WishlistToggle productId={product.id} productName={name} />
      </div>
      <div className="mt-5 pr-8">
        <h3 className="text-[14px] leading-snug text-foreground">
          <Link href={href} className="hover:text-accent transition-colors duration-200">
            {name}
          </Link>
        </h3>
        <p className="mt-1.5 text-[12px] text-muted tracking-wide">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
