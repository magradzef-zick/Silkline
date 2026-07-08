import type { Collection } from '@/types';

export const collections: Collection[] = [
  {
    id: 'col-spring-summer-2026',
    slug: 'spring-summer-2026',
    name: { ru: 'Весна–Лето 2026', uz: 'Bahor–Yoz 2026' },
    story: {
      ru: 'Лёгкие ткани и яркие силуэты для тёплого сезона. Льняные костюмы, шифоновые платья и атласные комплекты из Кореи.',
      uz: "Iliq mavsumga mo'ljallangan yengil matolar va yorqin siluetlar. Koreyadagi zig'ir kostyumlar, shifon ko'ylaklar va atlas to'plamlar.",
    },
    heroImage: '/products/peplum-zip-pants-indigo/01.png',
    productIds: [
      'p-rhinestone-set',
      'p-tiedye-shorts-set',
      'p-vest-pants-set',
      'p-cardigan-pants-navy',
      'p-top-pants-navy',
      'p-shirt-maxi-skirt',
      'p-linen-set',
      'p-chiffon-dress',
      'p-peplum-indigo',
      'p-peplum-mocha',
      'p-polo-pants-set',
    ],
  },
  {
    id: 'col-winter-2025',
    slug: 'winter-2025',
    name: { ru: 'Зима 2025–2026', uz: 'Qish 2025–2026' },
    story: {
      ru: 'Тёплые пуховики и пальто для холодного сезона. Натуральный мех и объёмные силуэты из Кореи.',
      uz: "Sovuq mavsumga mo'ljallangan iliq пуховикlar va palto. Tabiiy mo'yna va hajmli siluetlar.",
    },
    heroImage: '/products/fur-hood-puffer-beige/01.png',
    productIds: [
      'p-fur-hood-beige',
      'p-oversized-fur-puffer',
      'p-fur-lined-puffer',
      'p-fur-hood-black',
      'p-wool-coat-scarf',
      'p-bicolor-hood-puffer',
    ],
  },
  {
    id: 'col-new-2026',
    slug: 'new-collection-2026',
    name: { ru: 'Новая Коллекция 2026', uz: 'Yangi Kolleksiya 2026' },
    story: {
      ru: 'Строгий корейский силуэт со скрытыми деталями. Модели со скрытым капюшоном для безупречного образа.',
      uz: "Yashirin tafsilotlar bilan qat'iy Koreya silueti. Benuqson ko'rinish uchun yashirin kapyushonli modeller.",
    },
    heroImage: '/products/hidden-hood-jacket/01.png',
    productIds: ['p-hidden-hood-jacket', 'p-hidden-hood-coat'],
  },
];
