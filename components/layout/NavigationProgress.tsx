'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function NavigationProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // When pathname changes, the navigation completed — advance to 100% then hide.
  useEffect(() => {
    if (visible) {
      clearInterval(intervalRef.current);
      setWidth(100);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 400);
    }
    return () => {
      clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Listen for clicks on internal links to start the bar.
  useEffect(() => {
    const start = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href') ?? '';
      // Ignore: fragment-only, external, mailto/tel
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      clearInterval(intervalRef.current);
      clearTimeout(timerRef.current);
      setVisible(true);
      setWidth(0);
      let w = 0;
      intervalRef.current = setInterval(() => {
        w = Math.min(w + Math.random() * 10 + 5, 80);
        setWidth(w);
        if (w >= 80) clearInterval(intervalRef.current);
      }, 100);
    };

    document.addEventListener('click', start);
    return () => {
      document.removeEventListener('click', start);
      clearInterval(intervalRef.current);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      aria-valuenow={Math.round(width)}
      className="fixed top-0 left-0 z-[9999] h-[3px] bg-accent"
      style={{ width: `${width}%`, transition: 'width 150ms ease-out' }}
    />
  );
}
