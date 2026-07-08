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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
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
      <button
        type="button"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(o => !o)}
        className="lg:hidden flex flex-col justify-center gap-[5px] w-10 h-10 -mr-2 text-foreground"
      >
        <span className={`block h-px bg-current transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
        <span className={`block h-px bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`block h-px bg-current transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
          onClick={close}
        />
      )}

      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-50 w-72 bg-background flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <span className="text-xs tracking-[0.3em] uppercase text-muted">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="w-8 h-8 flex items-center justify-center text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.25"/>
              <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.25"/>
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-8">
          <ul className="space-y-1">
            {allLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-3 text-sm tracking-wide border-b border-border/50 text-foreground hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-6 py-6 border-t border-border">
          <div className="flex gap-4">
            {locales.map(l => (
              <Link
                key={l}
                href={switchLocalePath(pathname, l)}
                className={`text-xs uppercase tracking-widest transition-colors ${
                  l === locale ? 'text-accent font-semibold' : 'text-muted hover:text-foreground'
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
