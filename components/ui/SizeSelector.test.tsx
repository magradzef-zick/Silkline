import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SizeSelector } from './SizeSelector';

describe('SizeSelector', () => {
  it('renders a button for each size', () => {
    render(<SizeSelector sizes={['S', 'M', 'L']} selected={null} onChange={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('has aria-pressed=false on unselected chips', () => {
    render(<SizeSelector sizes={['S', 'M']} selected={null} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'S' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('has aria-pressed=true on the selected chip', () => {
    render(<SizeSelector sizes={['S', 'M']} selected="M" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'M' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onChange with the size when an unselected chip is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SizeSelector sizes={['S', 'M']} selected={null} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'S' }));
    expect(onChange).toHaveBeenCalledWith('S');
  });

  it('calls onChange with null when the selected chip is clicked (deselect)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SizeSelector sizes={['S', 'M']} selected="S" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'S' }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
