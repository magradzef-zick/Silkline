import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'p-wrap-dress',
    slug: 'silk-wrap-dress',
    name: { ru: 'Шёлковое платье на запах', uz: 'Ipak o\'ralma ko\'ylak' },
    description: {
      ru: 'Платье из натурального шёлка с запахом, прямая посадка.',
      uz: 'Tabiiy ipakdan tikilgan o\'ralma ko\'ylak, to\'g\'ri fasonda.'
    },
    collectionId: 'col-autumn-atelier',
    categoryId: 'cat-dresses',
    images: ['/placeholders/product-placeholder.svg'],
    sizes: ['XS', 'S', 'M', 'L'],
    price: 890000,
    isEditorsPick: true,
    isBestSeller: false,
    relatedProductIds: ['p-wool-coat', 'p-knit-sweater']
  },
  {
    id: 'p-wool-coat',
    slug: 'camel-wool-coat',
    name: { ru: 'Пальто из верблюжьей шерсти', uz: 'Tuya junidan palto' },
    description: {
      ru: 'Однобортное пальто прямого силуэта из шерсти верблюда.',
      uz: 'Tuya junidan tikilgan to\'g\'ri siluetli bir bortli palto.'
    },
    collectionId: 'col-autumn-atelier',
    categoryId: 'cat-outerwear',
    images: ['/placeholders/product-placeholder.svg'],
    sizes: ['S', 'M', 'L'],
    price: 1690000,
    isEditorsPick: false,
    isBestSeller: true,
    relatedProductIds: ['p-wrap-dress', 'p-knit-sweater']
  },
  {
    id: 'p-knit-sweater',
    slug: 'merino-knit-sweater',
    name: { ru: 'Свитер из мериносовой шерсти', uz: 'Merinos jundan sviter' },
    description: {
      ru: 'Тонкий свитер из мериносовой шерсти с округлым вырезом.',
      uz: 'Yumaloq yoqali, merinos jundan ingichka sviter.'
    },
    collectionId: 'col-autumn-atelier',
    categoryId: 'cat-knitwear',
    images: ['/placeholders/product-placeholder.svg'],
    sizes: ['XS', 'S', 'M'],
    price: 590000,
    isEditorsPick: false,
    isBestSeller: false,
    relatedProductIds: ['p-wrap-dress', 'p-wool-coat']
  },
  {
    id: 'p-slip-dress',
    slug: 'satin-slip-dress',
    name: { ru: 'Платье-комбинация из сатина', uz: 'Sateindan kombinatsiya ko\'ylak' },
    description: {
      ru: 'Платье-комбинация на тонких бретелях, цвет слоновой кости.',
      uz: 'Ingichka tasmali, fil suyagi rangidagi kombinatsiya ko\'ylak.'
    },
    collectionId: 'col-seoul-minimal',
    categoryId: 'cat-dresses',
    images: ['/placeholders/product-placeholder.svg'],
    sizes: ['XS', 'S', 'M'],
    price: 720000,
    isEditorsPick: true,
    isBestSeller: true,
    relatedProductIds: ['p-trench-coat', 'p-cropped-cardigan']
  },
  {
    id: 'p-trench-coat',
    slug: 'minimal-trench-coat',
    name: { ru: 'Минималистичный тренч', uz: 'Minimalistik trench' },
    description: {
      ru: 'Тренч прямого кроя из плотного хлопка, бежевый.',
      uz: 'Zich paxtadan tikilgan to\'g\'ri fasonli, bej rangli trench.'
    },
    collectionId: 'col-seoul-minimal',
    categoryId: 'cat-outerwear',
    images: ['/placeholders/product-placeholder.svg'],
    sizes: ['S', 'M', 'L'],
    price: 1450000,
    isEditorsPick: false,
    isBestSeller: false,
    relatedProductIds: ['p-slip-dress', 'p-cropped-cardigan']
  },
  {
    id: 'p-cropped-cardigan',
    slug: 'cropped-knit-cardigan',
    name: { ru: 'Укороченный кардиган', uz: 'Qisqartirilgan kardigan' },
    description: {
      ru: 'Короткий трикотажный кардиган на пуговицах.',
      uz: 'Tugmali, qisqa trikotaj kardigan.'
    },
    collectionId: 'col-seoul-minimal',
    categoryId: 'cat-knitwear',
    images: ['/placeholders/product-placeholder.svg'],
    sizes: ['XS', 'S', 'M', 'L'],
    price: 480000,
    isEditorsPick: false,
    isBestSeller: false,
    relatedProductIds: ['p-slip-dress', 'p-trench-coat']
  }
];
