import type { Store } from '@/types';

export const stores: Store[] = [
  {
    id: 'store-next-mall',
    name: 'SilkLine — ТРК Next Mall',
    address: {
      ru: 'ул. Бабура, 6',
      uz: "Bobur ko'chasi, 6",
    },
    city: 'Tashkent',
    mapUrl: 'https://maps.google.com/?q=TRC+Next+Mall+Tashkent',
    hours: '10:00–22:00',
  },
  {
    id: 'store-poytaxt',
    name: 'SilkLine — ТЦ Poytaxt',
    address: {
      ru: 'ул. Сайилгох, 7',
      uz: "Sayilgoh ko'chasi, 7",
    },
    city: 'Tashkent',
    mapUrl: 'https://maps.google.com/?q=Poytaxt+Shopping+Center+Tashkent',
  },
  {
    id: 'store-high-town-city',
    name: 'SilkLine — ТЦ High Town City',
    address: {
      ru: 'ул. Янгишахар, 9, Юнусабадский район',
      uz: "Yangishah ko'chasi, 9, Yunusobod tumani",
    },
    city: 'Tashkent',
    mapUrl: 'https://maps.google.com/?q=High+Town+City+Tashkent',
    hours: '09:00–21:00',
  },
];
