import type { AppLocale } from '@/types';

export const locales = ['ru', 'uz'] as const satisfies readonly AppLocale[];
export const defaultLocale: AppLocale = 'ru';
export type { AppLocale };
