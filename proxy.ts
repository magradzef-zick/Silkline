import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/locales';

export default createMiddleware({
  locales,
  defaultLocale
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
