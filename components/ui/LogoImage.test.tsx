import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LogoImage } from './LogoImage';

describe('LogoImage', () => {
  it('renders an img element with the logo path', () => {
    render(<LogoImage />);
    const img = screen.getByRole('img', { name: 'SilkLine' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/logo.svg');
  });

  it('falls back to brand name text when the image fails to load', () => {
    render(<LogoImage />);
    const img = screen.getByRole('img', { name: 'SilkLine' });
    fireEvent.error(img);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('SilkLine')).toBeInTheDocument();
  });
});
