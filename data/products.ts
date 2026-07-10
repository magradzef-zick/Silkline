import type { Product } from '@/types';

const img = (slug: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => `/products/${slug}/${String(i + 1).padStart(2, '0')}.png`);

export const products: Product[] = [

  // ── ROWS 1–4: Statement pieces — set the brand expectation ────────────────
  // Each row mixes outerwear / dress / set and spans multiple collections.
  // A customer who only sees the first 12 products should understand the full
  // range: editorial outerwear, occasion dresses, and polished sets.

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
    images: img('hidden-hood-coat', 4),
    sizes: ['S', 'M', 'L'],
    price: 2999000,
    relatedProductIds: ['p-hidden-hood-jacket', 'p-bicolor-hood-puffer', 'p-cinched-puffer-mocha'],
  },

  {
    id: 'p-cape-maxi-dress',
    slug: 'cape-chiffon-maxi-dress-sand',
    name: {
      ru: 'Макси-платье со шлейфами-накидками',
      uz: "Yenglari sharf shaklida maxi ko'ylak",
    },
    description: {
      ru: 'Воздушное макси-платье из мерцающего шифона цвета песок с драматичными шлейфами-накидками.',
      uz: "Qum rangli yaltiroq shifon matosidan dramatik yengli sharf bilan maxi ko'ylak.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-dresses',
    images: img('cape-chiffon-maxi-dress-sand', 4),
    sizes: [],
    price: 1999000,
    relatedProductIds: ['p-chiffon-dress', 'p-lace-corset-dress', 'p-amethyst-chiffon-dress'],
  },

  {
    id: 'p-puffer-cream-fur',
    slug: 'puffer-black-cream-fur-collar',
    name: {
      ru: 'Чёрный пуховик с кремовым меховым воротником',
      uz: "Krem mo'ynali qora puxovik",
    },
    description: {
      ru: 'Чёрный пуховик с широким кремовым меховым воротником — яркий контраст и роскошная зимняя эстетика.',
      uz: "Keng krem mo'ynali yoqa bilan qora puxovik — yorqin kontrast va hashamatli qishki ko'rinish.",
    },
    collectionId: 'col-winter-2025',
    categoryId: 'cat-outerwear',
    images: img('puffer-black-cream-fur-collar', 5),
    sizes: [],
    price: 3100000,
    relatedProductIds: ['p-cinched-puffer-mocha', 'p-cinched-puffer-lavender', 'p-fur-hood-black'],
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
    id: 'p-blazer-midi-dress',
    slug: 'belted-blazer-midi-dress',
    name: {
      ru: 'Платье-пиджак с поясом',
      uz: "Kamarli blazer ko'ylak",
    },
    description: {
      ru: 'Строгое платье-пиджак без рукавов с лацканами и кольцевой пряжкой — для офиса и вечера.',
      uz: "Yoqa-lapelli, halqa toqali yengsiz blazer ko'ylak — ofis va kechki tadbirlar uchun.",
    },
    collectionId: 'col-new-2026',
    categoryId: 'cat-dresses',
    images: img('belted-blazer-midi-dress', 5),
    sizes: [],
    price: 1499000,
    relatedProductIds: ['p-structured-vest-set', 'p-chiffon-dress', 'p-hidden-hood-coat'],
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
    images: img('wool-coat-with-scarf', 6),
    sizes: [],
    price: 2799000,
    relatedProductIds: ['p-hidden-hood-coat', 'p-fur-hood-beige', 'p-oversized-fur-puffer'],
  },

  {
    id: 'p-lace-corset-dress',
    slug: 'lace-corset-tulle-dress',
    name: {
      ru: 'Платье с гипюровым корсетом',
      uz: "Gipyor korsetli ko'ylak",
    },
    description: {
      ru: 'Изысканное платье с гипюровым корсетом и плиссированной тюлевой юбкой.',
      uz: "Nafis gipyor korsetli va plirovka qilingan tyul yubkali ko'ylak.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-dresses',
    images: img('lace-corset-tulle-dress', 3),
    sizes: ['S', 'M', 'L', 'XL'],
    price: 1999000,
    relatedProductIds: ['p-chiffon-dress', 'p-amethyst-chiffon-dress', 'p-pleated-dress-cape'],
  },

  {
    id: 'p-structured-vest-set',
    slug: 'structured-vest-flared-pants-set',
    name: {
      ru: 'Костюм: жилет с поясом и широкие брюки',
      uz: "Kamarli jiletli va keng shimli kostyum",
    },
    description: {
      ru: 'Стильный костюм: жилет с асимметричной застёжкой и широким поясом + широкие брюки.',
      uz: "Assimetrik tugmali, keng kamarli jilet va keng shimdan iborat zamonaviy kostyum.",
    },
    collectionId: 'col-new-2026',
    categoryId: 'cat-sets',
    images: img('structured-vest-flared-pants-set', 3),
    sizes: [],
    price: 2099000,
    relatedProductIds: ['p-blazer-midi-dress', 'p-knit-lace-set-navy', 'p-cardigan-pants-navy'],
  },

  {
    id: 'p-cinched-puffer-mocha',
    slug: 'cinched-puffer-fur-collar-mocha',
    name: {
      ru: 'Пуховик с меховым воротником (мокко)',
      uz: "Mo'ynali yoqali puxovik (mokko)",
    },
    description: {
      ru: 'Пуховик мокко с тёмным меховым воротником и акцентом на талии — элегантный зимний силуэт.',
      uz: "To'q mo'ynali yoqa va bel aksenti bilan mokko rangli nafis qishki puxovik.",
    },
    collectionId: 'col-winter-2025',
    categoryId: 'cat-outerwear',
    images: img('cinched-puffer-fur-collar-mocha', 5),
    sizes: [],
    price: 3100000,
    relatedProductIds: ['p-cinched-puffer-lavender', 'p-puffer-cream-fur', 'p-fur-hood-beige'],
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
    images: img('hidden-hood-jacket', 4),
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    price: 2399000,
    relatedProductIds: ['p-hidden-hood-coat', 'p-bicolor-hood-puffer', 'p-fur-lined-puffer'],
  },

  {
    id: 'p-amethyst-chiffon-dress',
    slug: 'chiffon-pleated-dress-amethyst',
    name: {
      ru: 'Шифоновое платье — тёмный аметист',
      uz: "Shifon ko'ylak — to'q ametist",
    },
    description: {
      ru: 'Плиссированное миди из тёмно-фиолетового шифона с серебристым цветочным принтом и рукавами 3/4.',
      uz: "To'q binafsha shifon matosidan tikilgan, kumush gul naqshli va 3/4 yengli plissr midi ko'ylak.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-dresses',
    images: img('chiffon-pleated-dress-amethyst', 3),
    sizes: [],
    price: 1899000,
    relatedProductIds: ['p-pleated-dress-cape', 'p-lace-corset-dress', 'p-chiffon-dress'],
  },

  // ── ROWS 5–10: Aspirational core — wearable, desirable ───────────────────

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
    images: ['/products/satin-rhinestone-set/01.png', '/products/satin-rhinestone-set/03.png', '/products/satin-rhinestone-set/04.png', '/products/satin-rhinestone-set/05.png', '/products/satin-rhinestone-set/06.png'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    price: 1699000,
    relatedProductIds: ['p-tiedye-shorts-set', 'p-vest-pants-set', 'p-linen-set'],
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
    images: img('peplum-zip-pants-indigo', 7),
    sizes: ['M', 'L', 'XL', '2XL'],
    price: 1499000,
    relatedProductIds: ['p-peplum-mocha', 'p-polo-pants-set', 'p-chiffon-dress'],
  },

  {
    id: 'p-knit-zip-hoodie-set',
    slug: 'knit-zip-hoodie-set',
    name: {
      ru: 'Трикотажный костюм с худи на молнии',
      uz: "Fermuarli kapyushonli trikotaj ikki qismli kostyum",
    },
    description: {
      ru: 'Спортивно-элегантный трикотажный костюм: топ-худи с коротким рукавом на молнии и широкие прямые брюки.',
      uz: "Qisqa yengli fermuarli kapyushonli trikotaj top va keng to'g'ri shimdan iborat sport-nafis kostyum.",
    },
    collectionId: 'col-new-2026',
    categoryId: 'cat-sets',
    images: img('knit-zip-hoodie-set', 2),
    sizes: ['M', 'L', 'XL', 'XXL'],
    price: 1699000,
    relatedProductIds: ['p-knit-lace-set-navy', 'p-sporty-tracksuit', 'p-cardigan-pants-navy'],
  },

  {
    id: 'p-cinched-puffer-lavender',
    slug: 'cinched-puffer-jacket-lavender',
    name: {
      ru: 'Пуховик со стяжкой (лавандовый)',
      uz: "Toraytirilgan bellı puxovik (lavanda)",
    },
    description: {
      ru: 'Укороченный пуховик с акцентом на талии и большими карманами в нежном лавандовом цвете.',
      uz: "Bel qismida toraytirilgan va katta cho'ntakli qisqa puxovik — nozik lavanda rangda.",
    },
    collectionId: 'col-winter-2025',
    categoryId: 'cat-outerwear',
    images: img('cinched-puffer-jacket-lavender', 5),
    sizes: [],
    price: 2700000,
    relatedProductIds: ['p-cinched-puffer-mocha', 'p-fur-hood-beige', 'p-fur-hood-black'],
  },

  {
    id: 'p-pleated-dress-cape',
    slug: 'chiffon-pleated-dress-cape-set',
    name: {
      ru: 'Шифоновое платье с накидкой',
      uz: "Shifon ko'ylak nakidka bilan",
    },
    description: {
      ru: 'Плиссированное миди-платье с принтом в комплекте с шифоновой накидкой.',
      uz: "Naqshli plissr midi ko'ylak va shifon nakidka bilan to'plam.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-dresses',
    images: img('chiffon-pleated-dress-cape-set', 4),
    sizes: [],
    price: 1699000,
    relatedProductIds: ['p-amethyst-chiffon-dress', 'p-lace-corset-dress', 'p-cape-maxi-dress'],
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
    images: img('peplum-zip-pants-mocha', 3),
    sizes: ['M', 'L', 'XL', '2XL'],
    price: 1499000,
    relatedProductIds: ['p-peplum-indigo', 'p-polo-pants-set', 'p-chiffon-dress'],
  },

  {
    id: 'p-knit-lace-set-navy',
    slug: 'knit-lace-hem-set-navy',
    name: {
      ru: 'Трикотажный костюм с кружевом (тёмно-синий)',
      uz: "Trikotajli gipur bezakli kostyum (to'q ko'k)",
    },
    description: {
      ru: 'Трикотажный двойка: укороченный топ с кружевной отделкой по низу и широкие прямые брюки.',
      uz: "Pastki qismi keng gipur bezakli qisqa top va keng to'g'ri shimdan iborat trikotaj kostyum.",
    },
    collectionId: 'col-new-2026',
    categoryId: 'cat-sets',
    images: img('knit-lace-hem-set-navy', 2),
    sizes: ['M', 'L', 'XL', 'XXL'],
    price: 1699000,
    relatedProductIds: ['p-knit-zip-hoodie-set', 'p-cardigan-pants-navy', 'p-top-pants-navy'],
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
    images: img('fur-hood-puffer-black', 7),
    sizes: [],
    price: 1999000,
    relatedProductIds: ['p-fur-hood-beige', 'p-oversized-fur-puffer', 'p-fur-lined-puffer'],
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
    images: img('cardigan-pants-set-navy', 6),
    sizes: ['M', 'L', 'XL', '2XL'],
    price: 1499000,
    relatedProductIds: ['p-top-pants-navy', 'p-peplum-indigo', 'p-polo-pants-set'],
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

  {
    id: 'p-sporty-tracksuit',
    slug: 'sporty-print-zip-tracksuit-set',
    name: {
      ru: 'Спортивный костюм с принтом',
      uz: "Printli sport kostyumi",
    },
    description: {
      ru: 'Корейский спортивный костюм: куртка на молнии с принтом и широкие брюки на кулиске.',
      uz: "Printli fermuarli ko'ylakcha va keng shimlardan iborat zamonaviy koreys sport kostyumi.",
    },
    collectionId: 'col-new-2026',
    categoryId: 'cat-sets',
    images: img('sporty-print-zip-tracksuit-set', 4),
    sizes: [],
    price: 1599000,
    relatedProductIds: ['p-knit-zip-hoodie-set', 'p-graphic-zip-set', 'p-plaid-zip-set'],
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
    images: img('polo-pants-set', 6),
    sizes: ['M', 'L', 'XL', '2XL'],
    price: 1499000,
    relatedProductIds: ['p-peplum-indigo', 'p-peplum-mocha', 'p-cardigan-pants-navy'],
  },

  {
    id: 'p-long-puffer-vest',
    slug: 'long-puffer-vest-taupe',
    name: {
      ru: 'Длинный пуховый жилет (тёмный беж)',
      uz: "Uzun puxovik jilet (to'q bej)",
    },
    description: {
      ru: 'Длинный утеплённый жилет с меховой подкладкой и вместительными карманами.',
      uz: "Mo'yna astarli va keng cho'ntakli uzun puxovik jilet.",
    },
    collectionId: 'col-winter-2025',
    categoryId: 'cat-outerwear',
    images: img('long-puffer-vest-taupe', 2),
    sizes: [],
    price: 2499000,
    relatedProductIds: ['p-quilted-cocoon-coat', 'p-cinched-puffer-mocha', 'p-hidden-hood-coat'],
  },

  {
    id: 'p-toile-zip-set',
    slug: 'toile-print-zip-top-set',
    name: {
      ru: 'Костюм с принтом «Туаль де Жуи»',
      uz: "Toile de Jouy printli ikki qismli kostyum",
    },
    description: {
      ru: 'Кремовая ткань с синим пейзажным принтом: укороченный топ на молнии и широкие брюки с полосой.',
      uz: "Ko'k toile de Jouy naqshli krem rangli matоdan fermuarli top va keng shimli kostyum.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('toile-print-zip-top-set', 3),
    sizes: ['M', 'L', 'XL', '2XL'],
    price: 1499000,
    relatedProductIds: ['p-graphic-zip-set', 'p-solid-zip-set', 'p-plaid-zip-set'],
  },

  {
    id: 'p-plaid-zip-set',
    slug: 'plaid-collar-zip-wide-pants-set',
    name: {
      ru: 'Костюм с клетчатым воротником и вышивкой',
      uz: "Katakli yoqali va kashtali ikki qismli kostyum",
    },
    description: {
      ru: 'Топ на молнии с контрастным клетчатым воротником и вышивкой + широкие брюки в оттенках бордо, синего и горчичного.',
      uz: "Qarama-qarshi katakli yoqa va kashta bilan bezatilgan fermuarli top va keng shimli kundalik kostyum.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('plaid-collar-zip-wide-pants-set', 8),
    sizes: ['M', 'L', 'XL', '2XL'],
    price: 1499000,
    relatedProductIds: ['p-solid-zip-set', 'p-toile-zip-set', 'p-graphic-zip-set'],
  },

  {
    id: 'p-quilted-cocoon-coat',
    slug: 'quilted-cocoon-coat-gray',
    name: {
      ru: 'Стёганое пальто-кокон (серый)',
      uz: "Tikma palto-kokoon (kulrang)",
    },
    description: {
      ru: 'Объёмное оверсайз пальто-кокон из стёганой ткани с молнией и большими карманами. Серый.',
      uz: "Katta cho'ntakli va fermuarli tikma matoli oversized kokoon palto. Kulrang.",
    },
    collectionId: 'col-winter-2025',
    categoryId: 'cat-outerwear',
    images: img('quilted-cocoon-coat-gray', 4),
    sizes: [],
    price: 2499000,
    relatedProductIds: ['p-long-puffer-vest', 'p-cinched-puffer-mocha', 'p-hidden-hood-coat'],
  },

  {
    id: 'p-swirl-print-sundress',
    slug: 'swirl-print-sundress',
    name: {
      ru: 'Сарафан с абстрактным принтом',
      uz: 'Abstrak naqshli sarafan',
    },
    description: {
      ru: 'Лёгкий сарафан на тонких бретелях с V-образным вырезом и контрастным вихревым принтом.',
      uz: "V-yoqali ingichka belbog'li yengil sarafan, kontrast aylanma naqsh bilan.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-dresses',
    images: img('swirl-print-sundress', 1),
    sizes: ['M', 'L', 'XL'],
    price: 1199000,
    relatedProductIds: ['p-lace-corset-dress', 'p-cape-maxi-dress', 'p-chiffon-dress'],
  },

  // ── ROWS 11–16: Complete the range — discovery zone ──────────────────────

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
    images: img('top-pants-set-navy', 6),
    sizes: ['M', 'L', 'XL', '2XL'],
    price: 1499000,
    relatedProductIds: ['p-cardigan-pants-navy', 'p-peplum-indigo', 'p-polo-pants-set'],
  },

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
    images: img('fur-hood-puffer-beige', 4),
    sizes: [],
    price: 1650000,
    relatedProductIds: ['p-oversized-fur-puffer', 'p-fur-hood-black', 'p-cinched-puffer-mocha'],
  },

  {
    id: 'p-solid-zip-set',
    slug: 'solid-zip-collar-wide-pants-set',
    name: {
      ru: 'Однотонный костюм на молнии (воротник-стойка)',
      uz: "Yoqa-stojkali bir rangli fermuarli kostyum",
    },
    description: {
      ru: 'Топ на молнии с воротником-стойкой и мелкой вышивкой + широкие брюки в пастельных тонах.',
      uz: "Yoqa-stojkali, mayda kashtali fermuarli top va keng shimdan iborat minimalistik koreys kostyumi.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('solid-zip-collar-wide-pants-set', 4),
    sizes: ['M', 'L', 'XL', '2XL'],
    price: 1499000,
    relatedProductIds: ['p-plaid-zip-set', 'p-graphic-zip-set', 'p-toile-zip-set'],
  },

  {
    id: 'p-botanical-print-set',
    slug: 'botanical-print-shirt-shorts-set',
    name: {
      ru: 'Костюм с ботаническим принтом',
      uz: "Botanik naqshli kostyum",
    },
    description: {
      ru: 'Двойка с ботаническим принтом: свободная рубашка с отложным воротником и шорты.',
      uz: "Botanik naqshli ikki qismli kostyum: keng yoqali bo'sh ko'ylak va shorts.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('botanical-print-shirt-shorts-set', 2),
    sizes: ['M', 'L', 'XL'],
    price: 1399000,
    relatedProductIds: ['p-tiedye-shorts-set', 'p-floral-embroidered-set', 'p-blue-lace-set'],
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
    images: img('shirt-maxi-skirt-set', 9),
    sizes: ['M', 'L', 'XL'],
    price: 1099000,
    relatedProductIds: ['p-linen-set', 'p-vest-pants-set', 'p-tiedye-shorts-set'],
  },

  {
    id: 'p-graphic-zip-set',
    slug: 'graphic-print-zip-jacket-set',
    name: {
      ru: 'Костюм с жакетом в буквенном принте',
      uz: "Harf printli jaketkali ikki qismli kostyum",
    },
    description: {
      ru: 'Жакет с коротким рукавом на молнии в буквенном принте на чёрном фоне и широкие брюки с полоской.',
      uz: "Qora fonda harf printli, qisqa yengli fermuarli jacket va yoni chiziqli keng shimdan iborat yorqin kostyum.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('graphic-print-zip-jacket-set', 2),
    sizes: ['M', 'L', 'XL', '2XL'],
    price: 1499000,
    relatedProductIds: ['p-toile-zip-set', 'p-solid-zip-set', 'p-plaid-zip-set'],
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
    id: 'p-floral-embroidered-set',
    slug: 'floral-embroidered-shirt-shorts-set',
    name: {
      ru: 'Костюм с цветочной вышивкой',
      uz: "Gullar kashtalari bilan ikki qismli kostyum",
    },
    description: {
      ru: 'Комплект из рубашки и шорт с объёмной розовой цветочной вышивкой на лёгкой белой ткани.',
      uz: "Yengil oq matoga tikilgan hajmli pushti gul kashtalari bilan ko'ylak va shorts kostyumi.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('floral-embroidered-shirt-shorts-set', 2),
    sizes: ['M', 'L', 'XL'],
    price: 1399000,
    relatedProductIds: ['p-botanical-print-set', 'p-tiedye-shorts-set', 'p-blue-lace-set'],
  },

  {
    id: 'p-blue-lace-set',
    slug: 'blue-lace-panel-puff-sleeve-set',
    name: {
      ru: 'Костюм с кружевными вставками (голубой)',
      uz: "Ko'k rangli krujvali ikki qismli kostyum",
    },
    description: {
      ru: 'Нежный голубой комплект с акварельным принтом, кружевными вставками и пышными рукавами.',
      uz: "Akvarell naqshli, krujva qo'shimchalari va pufli yengli ko'k kostyum.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('blue-lace-panel-puff-sleeve-set', 2),
    sizes: ['M', 'L', 'XL'],
    price: 1399000,
    relatedProductIds: ['p-floral-embroidered-set', 'p-botanical-print-set', 'p-tiedye-shorts-set'],
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
    images: ['/products/vest-wide-pants-set/02.png', '/products/vest-wide-pants-set/03.png', '/products/vest-wide-pants-set/04.png', '/products/vest-wide-pants-set/05.png', '/products/vest-wide-pants-set/06.png'],
    sizes: ['M', 'L', 'XL'],
    price: 1099000,
    relatedProductIds: ['p-linen-set', 'p-shirt-maxi-skirt', 'p-rhinestone-set'],
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
    images: ['/products/tiedye-shirt-shorts-set/01.png', '/products/tiedye-shirt-shorts-set/03.png', '/products/tiedye-shirt-shorts-set/04.png'],
    sizes: ['M', 'L', 'XL'],
    price: 1399000,
    relatedProductIds: ['p-rhinestone-set', 'p-shirt-maxi-skirt', 'p-vest-pants-set'],
  },

  {
    id: 'p-cotton-palazzo-trousers',
    slug: 'cotton-palazzo-trousers',
    name: {
      ru: 'Хлопковые брюки-палаццо',
      uz: 'Paxtadan palazzo shimlar',
    },
    description: {
      ru: 'Широкие хлопковые брюки-палаццо с кулиской в палитре из 8 цветов — от оливы до тёмного шоколада.',
      uz: "Ipli bel bilan 8 ta rang tanlovida mavjud keng paxtali palazzo shimlar.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-pants',
    images: img('cotton-palazzo-trousers', 10),
    sizes: ['42', '44', '46', '48', '50', '52', '54'],
    price: 849000,
    relatedProductIds: ['p-cotton-straight-trousers', 'p-satin-halter-top', 'p-linen-set'],
  },

  {
    id: 'p-cotton-straight-trousers',
    slug: 'cotton-straight-trousers',
    name: {
      ru: 'Хлопковые брюки прямого кроя',
      uz: "To'g'ri kesimli paxtali shimlar",
    },
    description: {
      ru: 'Прямые хлопковые брюки с цветной кулиской в пяти насыщенных оттенках: розовый, бордо, чёрный, голубой, тёмно-синий.',
      uz: "Rangli ipli bel bilan to'g'ri kesimli paxtali shimlar — besh to'yingan rangda.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-pants',
    images: img('cotton-straight-trousers', 5),
    sizes: ['42', '44', '46', '48', '50', '52', '54'],
    price: 849000,
    relatedProductIds: ['p-cotton-palazzo-trousers', 'p-satin-halter-top', 'p-linen-set'],
  },

  {
    id: 'p-lace-illusion-shirt',
    slug: 'lace-illusion-long-shirt',
    name: {
      ru: 'Рубашка с кружевной вставкой',
      uz: "Krujvali qo'shimchali ko'ylak",
    },
    description: {
      ru: 'Свободная рубашка с длинным рукавом и имитацией кружевного топа — эффект двойного образа.',
      uz: "Uzun yengli, ichida krujvali top illuziyasini yaratuvchi erkin kesimli ko'ylak.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-tops',
    images: img('lace-illusion-long-shirt', 4),
    sizes: ['S', 'M', 'L'],
    price: 849000,
    relatedProductIds: ['p-pastel-oversized-shirt', 'p-satin-halter-top', 'p-botanical-print-set'],
  },

  {
    id: 'p-ruffle-halter-set',
    slug: 'ruffle-halter-wide-pants-set',
    name: {
      ru: 'Костюм с топом-халтер с оборками',
      uz: "Volanli halter topli ikki qismli kostyum",
    },
    description: {
      ru: 'Элегантный костюм: топ-халтер с каскадными оборками и широкие брюки на резинке.',
      uz: "Kaskad volanli halter top va keng elastikli shimdan iborat nafis kostyum.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-sets',
    images: img('ruffle-halter-wide-pants-set', 2),
    sizes: [],
    price: 999000,
    relatedProductIds: ['p-satin-halter-top', 'p-vest-pants-set', 'p-linen-set'],
  },

  {
    id: 'p-satin-halter-top',
    slug: 'satin-tiedye-halter-top',
    name: {
      ru: 'Атласный топ на завязках с принтом',
      uz: "Bog'ichli atlas top naqsh bilan",
    },
    description: {
      ru: 'Атласный топ-халтер с открытой спиной в акварельном принте тай-дай.',
      uz: "Akvarell tie-dye naqshli, orqasi ochiq atlas halter top.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-tops',
    images: img('satin-tiedye-halter-top', 4),
    sizes: ['M', 'L'],
    price: 650000,
    relatedProductIds: ['p-cotton-palazzo-trousers', 'p-pastel-oversized-shirt', 'p-lace-illusion-shirt'],
  },

  {
    id: 'p-pastel-oversized-shirt',
    slug: 'oversized-pastel-shirt',
    name: {
      ru: 'Рубашка оверсайз — пастельные оттенки',
      uz: "Pastel tusli oversize ko'ylak",
    },
    description: {
      ru: 'Лёгкая рубашка оверсайз с коротким рукавом в белом, розовом, жёлтом и голубом.',
      uz: "Qisqa yengli oversize ko'ylak — oq, pushti, sariq va ko'k ranglarda.",
    },
    collectionId: 'col-spring-summer-2026',
    categoryId: 'cat-tops',
    images: img('oversized-pastel-shirt', 3),
    sizes: ['S', 'M', 'L'],
    price: 599000,
    relatedProductIds: ['p-lace-illusion-shirt', 'p-botanical-print-set', 'p-satin-halter-top'],
  },

  {
    id: 'p-woolen-shorts',
    slug: 'woolen-bandana-shorts',
    name: {
      ru: 'Шерстяные шорты с банданой',
      uz: 'Junli bandanali shim-shorts',
    },
    description: {
      ru: 'Зимние высокие шорты из шерстяной ткани с декоративной банданой — в сочетании с пальто и сапогами.',
      uz: "Palto va baland etiklar bilan uyg'un keladigan bandana bilan bezatilgan qishki jun shim-shorts.",
    },
    collectionId: 'col-winter-2025',
    categoryId: 'cat-sets',
    images: img('woolen-bandana-shorts', 2),
    sizes: ['M', 'L', 'XL'],
    price: 499000,
    relatedProductIds: ['p-hidden-hood-coat', 'p-cinched-puffer-mocha', 'p-hidden-hood-jacket'],
  },
];
