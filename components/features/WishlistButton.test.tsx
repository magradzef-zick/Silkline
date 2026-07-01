import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WishlistButton } from './WishlistButton';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/features/WishlistDrawer', () => ({
  WishlistDrawer: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? <div role="dialog"><button onClick={onClose}>close</button></div> : null,
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

beforeEach(() => { localStorage.clear(); });

describe('WishlistButton', () => {
  it('renders a button', () => {
    render(<WishlistButton locale="ru" />);
    expect(screen.getByRole('button', { name: 'open' })).toBeInTheDocument();
  });

  it('opens the wishlist drawer when clicked', async () => {
    const user = userEvent.setup();
    render(<WishlistButton locale="ru" />);
    await user.click(screen.getByRole('button', { name: 'open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes the drawer when onClose is called', async () => {
    const user = userEvent.setup();
    render(<WishlistButton locale="ru" />);
    await user.click(screen.getByRole('button', { name: 'open' }));
    await user.click(screen.getByRole('button', { name: 'close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
