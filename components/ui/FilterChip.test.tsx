import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterChip } from './FilterChip';

describe('FilterChip', () => {
  it('renders the label', () => {
    render(<FilterChip label="Платья" active={false} onToggle={() => {}} />);
    expect(screen.getByRole('button', { name: 'Платья' })).toBeInTheDocument();
  });

  it('has aria-pressed=false when inactive', () => {
    render(<FilterChip label="X" active={false} onToggle={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('has aria-pressed=true when active', () => {
    render(<FilterChip label="X" active={true} onToggle={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<FilterChip label="X" active={false} onToggle={onToggle} />);
    await user.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
