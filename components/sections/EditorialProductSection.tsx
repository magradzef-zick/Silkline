import type { AppLocale, Product } from '@/types';
import { Section } from '@/components/ui/Section';
import { PageContainer } from '@/components/ui/PageContainer';
import { ProductGrid } from '@/components/ui/ProductGrid';

interface EditorialProductSectionProps {
  products: Product[];
  locale: AppLocale;
  heading: string;
}

export function EditorialProductSection({
  products,
  locale,
  heading,
}: EditorialProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <Section>
      <PageContainer>
        <h2 className="text-[10px] tracking-[0.45em] uppercase text-muted mb-10">{heading}</h2>
        <ProductGrid products={products} locale={locale} columns={products.length === 4 ? 4 : 3} />
      </PageContainer>
    </Section>
  );
}
