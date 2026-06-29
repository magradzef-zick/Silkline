import type { Store } from '@/types';

export const stores: Store[] = [
  {
    id: 'store-tashkent-city',
    name: 'SilkLine — Tashkent City',
    address: {
      ru: 'Ташкент Сити Молл, 2 этаж',
      uz: 'Tashkent City Mall, 2-qavat'
    },
    city: 'Tashkent',
    phone: '+998 90 000 00 00',
    mapUrl: 'https://maps.google.com/?q=Tashkent+City+Mall',
    hours: '10:00–22:00'
  },
  {
    id: 'store-yunusobod',
    name: 'SilkLine — Yunusobod',
    address: {
      ru: 'Юнусабадский район, ул. Амира Темура, 1',
      uz: 'Yunusobod tumani, Amir Temur ko\'chasi, 1'
    },
    city: 'Tashkent',
    phone: '+998 90 000 00 01',
    mapUrl: 'https://maps.google.com/?q=Yunusobod+Tashkent',
    hours: '10:00–22:00'
  }
];
