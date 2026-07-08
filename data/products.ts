import type { Product } from '@/types';

const img = (slug: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => `/products/${slug}/${String(i + 1).padStart(2, '0')}.png`);

export const products: Product[] = [
  // ── Spring–Summer 2026 ────────────────────────────────────────────────────

  {
    id: 'p-rhinestone-set',
    slug: 'satin-rhinestone-set',
    name: { ru: 'Атласный костюм со стразами', uz: 'Strazli atlas kostyum' },
    description: {
      ru: 'Полу-спортивный костюм из атласа с декором из страз. Голубой и белый.',
      uz: "Straz bezakli atlas yarim-sport kostyum. Ko'k va oq rangda.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('satin-rhinestone-set', 4),
    sizes: ['M', 'L', 'XL', 'XXL'],
    price: 1699000,
    relatedProductIds: ['p-tiedye-shorts-set', 'p-vest-pants-set', 'p-linen-set'],
  },

  {
    id: 'p-tiedye-shorts-set',
    slug: 'tiedye-shirt-shorts-set',
    name: {
      ru: 'Костюм-двойка (рубашка + шорты)',
      uz: "Ikki qismli kostyum (ko'ylak + shortik)",
    },
    description: {
      ru: 'Рубашка и шорты из кружевной ткани в технике тай-дай, нежно-голубой.',
      uz: "Galstuk-bo'yoq texnikasidagi ko'ylak va shortik, och ko'k rangda.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('tiedye-shirt-shorts-set', 4),
    sizes: ['M', 'L', 'XL'],
    price: 1399000,
    relatedProductIds: ['p-rhinestone-set', 'p-shirt-maxi-skirt', 'p-vest-pants-set'],
  },

  {
    id: 'p-vest-pants-set',
    slug: 'vest-wide-pants-set',
    name: {
      ru: 'Костюм-двойка. Жилет + широкие брюки',
      uz: 'Ikki qismli kostyum. Jilet + keng shimlar',
    },
    description: {
      ru: 'Жилет и широкие брюки из лёгкой ткани. Небесный и белый.',
      uz: "Yengil matoli jilet va keng shimlar. Osmon ko'k va oq rangda.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('vest-wide-pants-set', 4),
    sizes: ['M', 'L', 'XL'],
    price: 1099000,
    relatedProductIds: ['p-linen-set', 'p-shirt-maxi-skirt', 'p-rhinestone-set'],
  },

  {
    id: 'p-cardigan-pants-navy',
    slug: 'cardigan-pants-set-navy',
    name: {
      ru: 'Костюм-двойка (кардиган + брюки)',
      uz: 'Ikki qismli kostyum (kardigan + shimlar)',
    },
    description: {
      ru: 'Кардиган и широкие брюки в тёмно-синем цвете.',
      uz: "To'q ko'k rangli kardigan va keng shimlar.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('cardigan-pants-set-navy', 4),
    sizes: ['M', 'L', 'XL', '2XL'],
    price: 1499000,
    relatedProductIds: ['p-top-pants-navy', 'p-peplum-indigo', 'p-polo-pants-set'],
  },

  {
    id: 'p-top-pants-navy',
    slug: 'top-pants-set-navy',
    name: {
      ru: 'Костюм-двойка (топ + брюки)',
      uz: 'Ikki qismli kostyum (top + shimlar)',
    },
    description: {
      ru: 'Топ и брюки в тёмно-синем цвете.',
      uz: "To'q ko'k rangli top va shimlar.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('top-pants-set-navy', 3),
    sizes: ['M', 'L', 'XL', '2XL'],
    price: 1499000,
    relatedProductIds: ['p-cardigan-pants-navy', 'p-peplum-indigo', 'p-polo-pants-set'],
  },

  {
    id: 'p-shirt-maxi-skirt',
    slug: 'shirt-maxi-skirt-set',
    name: {
      ru: 'Костюм-двойка. Рубашка + юбка макси',
      uz: "Ikki qismli kostyum. Ko'ylak + maxi yubka",
    },
    description: {
      ru: 'Свободная рубашка и юбка-макси в оттенке хаки.',
      uz: "Erkin ko'ylak va maxi yubka xaki rangda.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('shirt-maxi-skirt-set', 6),
    sizes: ['M', 'L', 'XL'],
    price: 1099000,
    relatedProductIds: ['p-linen-set', 'p-vest-pants-set', 'p-tiedye-shorts-set'],
  },

  {
    id: 'p-linen-set',
    slug: 'linen-two-piece-set',
    name: {
      ru: 'Льняной костюм-двойка',
      uz: "Zig'ir matoli ikki qismli kostyum",
    },
    description: {
      ru: 'Блуза и брюки из льняной ткани в молочном цвете с тонкой полоской.',
      uz: "Nozik chiziqli sut-oq rangli zig'ir matoli bluzka va shimlar.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('linen-two-piece-set', 4),
    sizes: ['M', 'L', 'XL'],
    price: 1099000,
    relatedProductIds: ['p-shirt-maxi-skirt', 'p-vest-pants-set', 'p-rhinestone-set'],
  },

  {
    id: 'p-chiffon-dress',
    slug: 'one-shoulder-chiffon-dress',
    name: {
      ru: 'Вечернее платье на одно плечо',
      uz: "Bir yelkali kechki ko'ylak",
    },
    description: {
      ru: 'Вечернее платье из шифона на одно плечо, шоколадный цвет.',
      uz: "Bir yelkali shifon kechki ko'ylak, shokolad rangi.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-dresses',
    images: img('one-shoulder-chiffon-dress', 3),
    sizes: ['S', 'M', 'L'],
    price: 1999000,
    relatedProductIds: ['p-peplum-indigo', 'p-peplum-mocha', 'p-rhinestone-set'],
  },

  {
    id: 'p-peplum-indigo',
    slug: 'peplum-zip-pants-indigo',
    name: {
      ru: 'Костюм-двойка. Жакет пеплум + брюки (индиго)',
      uz: 'Ikki qismli kostyum. Peplum jaketi + shimlar (indigo)',
    },
    description: {
      ru: 'Укороченный жакет с пеплумом на молнии и прямые брюки, индиго.',
      uz: "Fermuar yopqichli peplum jaketi va to'g'ri shimlar, indigo rangi.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('peplum-zip-pants-indigo', 4),
    sizes: ['M', 'L', 'XL', '2XL'],
    price: 1499000,
    relatedProductIds: ['p-peplum-mocha', 'p-polo-pants-set', 'p-chiffon-dress'],
  },

  {
    id: 'p-peplum-mocha',
    slug: 'peplum-zip-pants-mocha',
    name: {
      ru: 'Костюм-двойка. Жакет пеплум + брюки (мокко)',
      uz: 'Ikki qismli kostyum. Peplum jaketi + shimlar (mokko)',
    },
    description: {
      ru: 'Укороченный жакет с пеплумом на молнии и прямые брюки, мокко.',
      uz: "Fermuar yopqichli peplum jaketi va to'g'ri shimlar, mokko rangi.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('peplum-zip-pants-mocha', 4),
    sizes: ['M', 'L', 'XL', '2XL'],
    price: 1499000,
    relatedProductIds: ['p-peplum-indigo', 'p-polo-pants-set', 'p-chiffon-dress'],
  },

  {
    id: 'p-polo-pants-set',
    slug: 'polo-pants-set',
    name: {
      ru: 'Костюм-двойка. Поло + брюки',
      uz: 'Ikki qismli kostyum. Polo + shimlar',
    },
    description: {
      ru: 'Топ-поло с коротким рукавом и широкие брюки. Шалфей и чёрный.',
      uz: "Qisqa yengli polo-top va keng shimlar. Yalpiz va qora rangda.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('polo-pants-set', 4),
    sizes: ['M', 'L', 'XL', '2XL'],
    price: 1499000,
    relatedProductIds: ['p-peplum-indigo', 'p-peplum-mocha', 'p-cardigan-pants-navy'],
  },

  // ── Winter 2025–2026 ─────────────────────────────────────────────────────

  {
    id: 'p-fur-hood-beige',
    slug: 'fur-hood-puffer-beige',
    name: {
      ru: 'Пуховик с меховым капюшоном',
      uz: "Mo'ynali kapyushonli puxovik",
    },
    description: {
      ru: 'Пуховик укороченного силуэта с натуральным меховым капюшоном. Бежевый и шоколадный.',
      uz: "Tabiiy mo'ynali kapyushonli qisqa siluetli puxovik. Bej va shokolad rangda.",
    },
    collectionId: 'col-winter-2025',
    categoryId: 'cat-outerwear',
    images: img('fur-hood-puffer-beige', 5),
    sizes: [],
    price: 1650000,
    relatedProductIds: ['p-oversized-fur-puffer', 'p-fur-hood-black', 'p-wool-coat-scarf'],
  },

  {
    id: 'p-oversized-fur-puffer',
    slug: 'oversized-fur-hood-puffer',
    name: {
      ru: 'Пуховик оверсайз с меховым капюшоном',
      uz: "Mo'ynali kapyushonli oversized puxovik",
    },
    description: {
      ru: 'Пуховик оверсайз с объёмным меховым капюшоном. Шоколадный и чёрный.',
      uz: "Katta mo'ynali kapyushonli oversized puxovik. Shokolad va qora rangda.",
    },
    collectionId: 'col-winter-2025',
    categoryId: 'cat-outerwear',
    images: img('oversized-fur-hood-puffer', 5),
    sizes: [],
    price: 3499000,
    relatedProductIds: ['p-fur-hood-beige', 'p-fur-lined-puffer', 'p-fur-hood-black'],
  },

  {
    id: 'p-fur-lined-puffer',
    slug: 'fur-lined-hood-puffer',
    name: {
      ru: 'Пуховик с меховой подкладкой капюшона',
      uz: "Mo'yna bilan qoplangan kapyushonli puxovik",
    },
    description: {
      ru: 'Пуховик с капюшоном, отделанным мехом изнутри. Чёрный.',
      uz: "Ichki tomonida mo'yna bilan bezatilgan kapyushonli puxovik. Qora rangda.",
    },
    collectionId: 'col-winter-2025',
    categoryId: 'cat-outerwear',
    images: img('fur-lined-hood-puffer', 4),
    sizes: [],
    price: 3299000,
    relatedProductIds: ['p-oversized-fur-puffer', 'p-fur-hood-black', 'p-bicolor-hood-puffer'],
  },

  {
    id: 'p-fur-hood-black',
    slug: 'fur-hood-puffer-black',
    name: {
      ru: 'Пуховик с меховым капюшоном (чёрный)',
      uz: "Mo'ynali kapyushonli puxovik (qora)",
    },
    description: {
      ru: 'Пуховик с большим меховым капюшоном и манжетами в рубчик. Чёрный.',
      uz: "Katta mo'ynali kapyushon va qovurg'ali manjetli puxovik. Qora rangda.",
    },
    collectionId: 'col-winter-2025',
    categoryId: 'cat-outerwear',
    images: img('fur-hood-puffer-black', 6),
    sizes: [],
    price: 1999000,
    relatedProductIds: ['p-fur-hood-beige', 'p-oversized-fur-puffer', 'p-fur-lined-puffer'],
  },

  {
    id: 'p-wool-coat-scarf',
    slug: 'wool-coat-with-scarf',
    name: {
      ru: 'Пальто с шарфом',
      uz: 'Sharf bilan palto',
    },
    description: {
      ru: 'Шерстяное пальто с объёмным воротником-капюшоном и фирменным шарфом с бахромой. Серый и бежевый.',
      uz: "Hajmli kapyushon-yoqali va baxromli sharf bilan jun palto. Kulrang va bej rangda.",
    },
    collectionId: 'col-winter-2025',
    categoryId: 'cat-outerwear',
    images: img('wool-coat-with-scarf', 7),
    sizes: [],
    price: 2799000,
    relatedProductIds: ['p-hidden-hood-coat', 'p-fur-hood-beige', 'p-oversized-fur-puffer'],
  },

  {
    id: 'p-bicolor-hood-puffer',
    slug: 'puffer-bicolor-hood',
    name: {
      ru: 'Пуховик с двухтонным капюшоном',
      uz: 'Ikki rangli kapyushonli puxovik',
    },
    description: {
      ru: 'Пуховик оверсайз с капюшоном двухтонного окраса. Чёрный и тёмно-коричневый.',
      uz: "Ikki rangli kapyushonli oversized puxovik. Qora va to'q jigarrang rangda.",
    },
    collectionId: 'col-winter-2025',
    categoryId: 'cat-outerwear',
    images: img('puffer-bicolor-hood', 7),
    sizes: [],
    price: 2599000,
    relatedProductIds: ['p-fur-lined-puffer', 'p-fur-hood-black', 'p-hidden-hood-jacket'],
  },

  // ── New Collection 2026 ──────────────────────────────────────────────────

  {
    id: 'p-hidden-hood-jacket',
    slug: 'hidden-hood-jacket',
    name: {
      ru: 'Куртка со скрытым капюшоном',
      uz: 'Yashirin kapyushonli kurtka',
    },
    description: {
      ru: 'Стёганая куртка со скрытым капюшоном и рукавами-реглан. Чёрный и хаки.',
      uz: "Yashirin kapyushonli raglan yengli yo'rma kurtka. Qora va xaki rangda.",
    },
    collectionId: 'col-new-2026',
    categoryId: 'cat-outerwear',
    images: img('hidden-hood-jacket', 5),
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    price: 2399000,
    relatedProductIds: ['p-hidden-hood-coat', 'p-bicolor-hood-puffer', 'p-fur-lined-puffer'],
  },

  {
    id: 'p-hidden-hood-coat',
    slug: 'hidden-hood-coat',
    name: {
      ru: 'Пальто со скрытым капюшоном',
      uz: 'Yashirin kapyushonli palto',
    },
    description: {
      ru: 'Пальто широкого силуэта со скрытым капюшоном и поясным кольцом. Чёрный.',
      uz: "Yashirin kapyushonli va belbog' halqali keng siluetli palto. Qora rangda.",
    },
    collectionId: 'col-new-2026',
    categoryId: 'cat-outerwear',
    images: img('hidden-hood-coat', 5),
    sizes: ['S', 'M', 'L'],
    price: 2999000,
    relatedProductIds: ['p-hidden-hood-jacket', 'p-wool-coat-scarf', 'p-bicolor-hood-puffer'],
  },
];
