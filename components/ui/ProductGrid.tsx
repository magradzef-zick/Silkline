import type { AppLocale, Product } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductSkeleton } from './ProductSkeleton';

const columnClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
} as const;

interface ProductGridProps {
  products: Product[];
  locale: AppLocale;
  columns?: 2 | 3;
  loading?: boolean;
  totalCount?: number;
}

export function ProductGrid({
  products,
  locale,
  columns = 3,
  loading = false,
  totalCount,
}: ProductGridProps) {
  return (
    <div className={`grid ${columnClasses[columns]} gap-6 lg:gap-8`}>
      {loading
        ? Array.from({ length: totalCount ?? 6 }).map((_, i) => <ProductSkeleton key={i} />)
        : products.map(p => <ProductCard key={p.id} product={p} locale={locale} />)
      }
    </div>
  );
}
