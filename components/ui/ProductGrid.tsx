import type { AppLocale, Product } from '@/types';
import { ProductCard } from './ProductCard';

const columnClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
} as const;

interface ProductGridProps {
  products: Product[];
  locale: AppLocale;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, locale, columns = 3 }: ProductGridProps) {
  return (
    <div className={`grid ${columnClasses[columns]} gap-6 lg:gap-10`}>
      {products.map(p => <ProductCard key={p.id} product={p} locale={locale} />)}
    </div>
  );
}
