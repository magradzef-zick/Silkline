import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductOrderActions } from './ProductOrderActions';
import type { Product } from '@/types';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/ui/WishlistToggle', () => ({
  WishlistToggle: ({ productName }: { productName: string }) => (
    <button aria-label={`wishlist-${productName}`} />
  ),
}));

vi.mock('@/components/ui/SizeSelector', () => ({
  SizeSelector: ({
    sizes,
    onChange,
  }: {
    sizes: string[];
    selected: string | null;
    onChange: (s: string | null) => void;
  }) => (
    <div>
      {sizes.map(s => (
        <button key={s} onClick={() => onChange(s)}>
          {s}
        </button>
      ))}
    </div>
  ),
}));

beforeEach(() => { localStorage.clear(); });

const product: Product = {
  id: 'p1',
  slug: 'test-product',
  name: { ru: 'Тест', uz: 'Test' },
  description: { ru: '', uz: '' },
  collectionId: 'col-a',
  categoryId: 'cat-a',
  images: [],
  sizes: ['S', 'M', 'L'],
  price: 500000,
  relatedProductIds: [],
};

describe('ProductOrderActions', () => {
  it('renders size chips for every size on the product', () => {
    render(<ProductOrderActions product={product} locale="ru" />);
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('renders the Telegram CTA link', () => {
    render(<ProductOrderActions product={product} locale="ru" />);
    const link = screen.getByRole('link', { name: 'order.telegram' });
    expect(link.getAttribute('href')).toContain('t.me');
  });

  it('renders the WhatsApp CTA link', () => {
    render(<ProductOrderActions product={product} locale="ru" />);
    const link = screen.getByRole('link', { name: 'order.whatsapp' });
    expect(link.getAttribute('href')).toContain('wa.me');
  });

  it('renders the wishlist toggle', () => {
    render(<ProductOrderActions product={product} locale="ru" />);
    expect(screen.getByLabelText('wishlist-Тест')).toBeInTheDocument();
  });

  it('includes the selected size in the order link after selection', async () => {
    const user = userEvent.setup();
    render(<ProductOrderActions product={product} locale="ru" />);
    await user.click(screen.getByText('M'));
    const telegramLink = screen.getByRole('link', { name: 'order.telegram' });
    expect(telegramLink.getAttribute('href')).toContain(encodeURIComponent('M'));
  });
});
