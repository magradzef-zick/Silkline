'use client';
import { useState, useEffect, useCallback } from 'react';

const KEY = 'silkline-wishlist';

function read(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]);
  } catch {
    return new Set();
  }
}

export function useWishlist() {
  const [ids, setIds] = useState<Set<string>>(() => read());

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const toggle = useCallback((id: string) => {
    setIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      localStorage.setItem(KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isWishlisted = useCallback((id: string) => ids.has(id), [ids]);

  return { toggle, isWishlisted };
}
