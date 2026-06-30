import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocaleSwitcher } from './LocaleSwitcher';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ru/collections/autumn-atelier'
}));

describe('LocaleSwitcher', () => {
  it('renders a link for each locale with the current one marked', () => {
    render(<LocaleSwitcher currentLocale="ru" />);
    const ru = screen.getByRole('link', { name: 'ru' });
    const uz = screen.getByRole('link', { name: 'uz' });
    expect(ru).toHaveAttribute('aria-current', 'true');
    expect(uz).toHaveAttribute('href', '/uz/collections/autumn-atelier');
  });
});
