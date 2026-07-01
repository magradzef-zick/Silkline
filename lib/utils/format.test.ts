import { describe, expect, it } from 'vitest';
import { formatPrice } from './format';

describe('formatPrice', () => {
  it('formats a round number with thousands separator', () => {
    // ru-RU uses non-breaking space as thousands separator — normalize for comparison
    expect(formatPrice(890000).replace(/\s/g, ' ')).toBe('890 000 сум');
  });

  it('formats a six-digit number correctly', () => {
    expect(formatPrice(480000).replace(/\s/g, ' ')).toBe('480 000 сум');
  });

  it('formats a seven-digit number correctly', () => {
    expect(formatPrice(1690000).replace(/\s/g, ' ')).toBe('1 690 000 сум');
  });
});
