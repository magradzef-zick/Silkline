'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AppLocale } from '@/i18n/locales';
import { switchLocalePath } from '@/lib/nav';
import { locales } from '@/i18n/locales';

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  locale: AppLocale;
  collectionLinks: NavLink[];
  shopLabel: string;
  aboutLabel: string;
  storesLabel: string;
}

export function MobileMenu({ locale, collectionLinks, shopLabel, aboutLabel, storesLabel }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const id = setTimeout(() => close(), 0);
    return () => clearTimeout(id);
  }, [pathname, close]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [close]);

  const allLinks = [
    ...collectionLinks,
    { href: `/${locale}/shop`, label: shopLabel },
    { href: `/${locale}/about`, label: aboutLabel },
    { href: `/${locale}/stores`, label: storesLabel },
  ];

  return (
    <>
      {/* Hamburger — animates into × */}
      <button
        type="button"
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
        onClick={() => setIsOpen(o => !o)}
        className="lg:hidden relative w-10 h-10 -mr-2 flex items-center justify-center"
      >
        <span
          className={`absolute block h-px w-5 bg-foreground transition-all duration-400 ease-out ${
            isOpen ? 'rotate-45' : '-translate-y-[5px]'
          }`}
        />
        <span
          className={`absolute block h-px w-5 bg-foreground transition-all duration-400 ease-out ${
            isOpen ? 'scale-x-0 opacity-0' : 'opacity-100'
          }`}
        />
        <span
          className={`absolute block h-px w-5 bg-foreground transition-all duration-400 ease-out ${
            isOpen ? '-rotate-45' : 'translate-y-[5px]'
          }`}
        />
      </button>

      {/* Full-screen overlay */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Навигация"
        className={`lg:hidden fixed inset-0 z-50 bg-background flex flex-col transition-[opacity,visibility] duration-500 ease-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Menu header — mirrors main header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <Link
            href={`/${locale}`}
            onClick={close}
            className="flex flex-col items-start leading-none"
            aria-label="SilkLine — на главную"
          >
            <span
              className="block text-[13px] font-bold tracking-[0.45em] text-accent uppercase"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              SILK LINE
            </span>
            <span
              className="block text-[7.5px] font-light italic tracking-[0.35em] text-accent/80 mt-[3px]"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              korean fashion
            </span>
          </Link>

          <button
            type="button"
            aria-label="Закрыть меню"
            onClick={close}
            className="w-10 h-10 flex items-center justify-center"
          >
            <span className="relative block w-[18px] h-[18px]">
              <span className="absolute inset-0 m-auto block h-px w-full bg-foreground rotate-45" />
              <span className="absolute inset-0 m-auto block h-px w-full bg-foreground -rotate-45" />
            </span>
          </button>
        </div>

        {/* Nav links — large editorial type */}
        <nav className="flex-1 overflow-y-auto px-8 py-8 flex flex-col justify-center">
          <ul className="space-y-0">
            {allLinks.map((link, i) => (
              <li
                key={link.href}
                className="overflow-hidden border-b border-border/40 last:border-b-0"
              >
                <Link
                  href={link.href}
                  className={`block py-5 text-[30px] font-light text-foreground/80 hover:text-accent transition-all duration-300 transform ${
                    isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                  }`}
                  style={{
                    fontFamily: 'var(--font-serif), Georgia, serif',
                    transitionDelay: isOpen ? `${i * 55 + 80}ms` : '0ms',
                    transitionProperty: 'transform, opacity, color',
                    transitionDuration: '450ms',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer — locale switcher */}
        <div
          className={`shrink-0 px-8 py-6 border-t border-border transition-all duration-500 ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ transitionDelay: isOpen ? `${allLinks.length * 55 + 120}ms` : '0ms' }}
        >
          <div className="flex gap-5">
            {locales.map(l => (
              <Link
                key={l}
                href={switchLocalePath(pathname, l)}
                className={`text-[11px] tracking-[0.4em] uppercase transition-colors ${
                  l === locale ? 'text-accent' : 'text-muted hover:text-foreground'
                }`}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
