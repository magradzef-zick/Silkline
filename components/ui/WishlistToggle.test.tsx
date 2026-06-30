import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WishlistToggle } from './WishlistToggle';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, string>) => {
    if (key === 'addToWishlist') return `Add ${params?.name}`;
    if (key === 'removeFromWishlist') return `Remove ${params?.name}`;
    return key;
  },
}));

beforeEach(() => { localStorage.clear(); });

describe('WishlistToggle', () => {
  it('renders a button', () => {
    render(<WishlistToggle productId="p1" productName="Dress" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('aria-label includes product name when not wishlisted', () => {
    render(<WishlistToggle productId="p1" productName="Dress" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Add Dress');
  });

  it('aria-pressed is false initially', () => {
    render(<WishlistToggle productId="p1" productName="Dress" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggling sets aria-pressed to true', async () => {
    const user = userEvent.setup();
    render(<WishlistToggle productId="p1" productName="Dress" />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });
});
