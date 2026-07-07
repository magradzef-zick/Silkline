import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { StoreCard } from './StoreCard';
import type { Store } from '@/types';

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
}));

const store: Store = {
  id: 'store-1',
  name: 'SilkLine — Test',
  address: { ru: 'ул. Тестовая, 1', uz: "Test ko'chasi, 1" },
  city: 'Tashkent',
  phone: '+998 90 000 00 00',
  mapUrl: 'https://maps.google.com/?q=test',
  hours: '10:00–22:00',
};

describe('StoreCard', () => {
  it('renders the store name', async () => {
    const { container } = render(await StoreCard({ store, locale: 'ru' }));
    expect(container.textContent).toContain('SilkLine — Test');
  });

  it('renders the localized address in ru', async () => {
    const { container } = render(await StoreCard({ store, locale: 'ru' }));
    expect(container.textContent).toContain('ул. Тестовая, 1');
  });

  it('renders the localized address in uz', async () => {
    const { container } = render(await StoreCard({ store, locale: 'uz' }));
    expect(container.textContent).toContain("Test ko'chasi, 1");
  });

  it('renders a tel: link when phone is provided', async () => {
    const { container } = render(await StoreCard({ store, locale: 'ru' }));
    const phoneLink = container.querySelector('a[href^="tel:"]');
    expect(phoneLink).not.toBeNull();
  });

  it('does not render a tel: link when phone is absent', async () => {
    const storeNoPhone: Store = { ...store, phone: undefined };
    const { container } = render(await StoreCard({ store: storeNoPhone, locale: 'ru' }));
    const phoneLink = container.querySelector('a[href^="tel:"]');
    expect(phoneLink).toBeNull();
  });

  it('renders hours when provided', async () => {
    const { container } = render(await StoreCard({ store, locale: 'ru' }));
    expect(container.textContent).toContain('10:00–22:00');
  });

  it('does not render hours row when hours is absent', async () => {
    const storeNoHours: Store = { ...store, hours: undefined };
    const { container } = render(await StoreCard({ store: storeNoHours, locale: 'ru' }));
    expect(container.textContent).not.toContain('10:00–22:00');
  });

  it('renders a link to the map', async () => {
    const { container } = render(await StoreCard({ store, locale: 'ru' }));
    const mapLink = container.querySelector(`a[href="${store.mapUrl}"]`);
    expect(mapLink).not.toBeNull();
  });
});
