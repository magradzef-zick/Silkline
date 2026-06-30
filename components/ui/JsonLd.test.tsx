import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { JsonLd } from './JsonLd';

describe('JsonLd', () => {
  it('renders a script tag with type application/ld+json', () => {
    const { container } = render(<JsonLd data={{ '@type': 'WebSite', name: 'SilkLine' }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
  });

  it('serializes the data object as JSON', () => {
    const data = { '@type': 'Organization', name: 'SilkLine' };
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script');
    expect(script?.textContent).toBe(JSON.stringify(data));
  });
});
