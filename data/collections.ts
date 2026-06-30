import type { Collection } from '@/types';

export const collections: Collection[] = [
  {
    id: 'col-autumn-atelier',
    slug: 'autumn-atelier',
    name: { ru: 'Осенний ателье', uz: 'Kuzgi atelye' },
    story: {
      ru: 'Тёплые тона и мягкие силуэты для прохладных дней.',
      uz: 'Salqin kunlar uchun iliq ranglar va yumshoq siluetlar.'
    },
    heroImage: '/placeholders/collection-placeholder.svg',
    productIds: ['p-wrap-dress', 'p-wool-coat', 'p-knit-sweater']
  },
  {
    id: 'col-seoul-minimal',
    slug: 'seoul-minimal',
    name: { ru: 'Сеульский минимализм', uz: 'Seul minimalizmi' },
    story: {
      ru: 'Чистые линии и сдержанная палитра, вдохновлённые улицами Сеула.',
      uz: 'Seul ko\'chalaridan ilhomlangan toza chiziqlar va jim ranglar.'
    },
    heroImage: '/placeholders/collection-placeholder.svg',
    productIds: ['p-slip-dress', 'p-trench-coat', 'p-cropped-cardigan']
  }
];
