import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [k: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />
  ),
}));

vi.mock('@/components/ui/WishlistToggle', () => ({
  WishlistToggle: () => <button aria-label="wishlist" />,
}));

const product: Product = {
  id: 'p1',
  slug: 'test-product',
  name: { ru: 'Тестовое платье', uz: "Test ko'ylak" },
  description: { ru: 'Описание', uz: 'Tavsif' },
  collectionId: 'col-a',
  categoryId: 'cat-a',
  images: ['/test.jpg'],
  sizes: ['S', 'M'],
  price: 890000,
  relatedProductIds: [],
};

describe('ProductCard', () => {
  it('renders the localized product name in ru', () => {
    render(<ProductCard product={product} locale="ru" />);
    expect(screen.getByText('Тестовое платье')).toBeInTheDocument();
  });

  it('renders the localized product name in uz', () => {
    render(<ProductCard product={product} locale="uz" />);
    expect(screen.getByText("Test ko'ylak")).toBeInTheDocument();
  });

  it('renders the price', () => {
    render(<ProductCard product={product} locale="ru" />);
    expect(screen.getByText(/890/)).toBeInTheDocument();
  });

  it('links to the product detail page', () => {
    render(<ProductCard product={product} locale="ru" />);
    const links = screen.getAllByRole('link');
    expect(links.some(l => l.getAttribute('href')?.includes('test-product'))).toBe(true);
  });

  it('renders the product image with alt text', () => {
    render(<ProductCard product={product} locale="ru" />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Тестовое платье');
  });
});
