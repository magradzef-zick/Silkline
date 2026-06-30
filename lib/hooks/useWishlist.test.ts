import { describe, expect, it, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWishlist } from './useWishlist';

beforeEach(() => { localStorage.clear(); });

describe('useWishlist', () => {
  it('starts empty when localStorage has nothing', () => {
    const { result } = renderHook(() => useWishlist());
    expect(result.current.isWishlisted('p1')).toBe(false);
  });

  it('toggle adds a product to the wishlist', () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggle('p1'));
    expect(result.current.isWishlisted('p1')).toBe(true);
  });

  it('toggle removes a product that is already wishlisted', () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggle('p1'));
    act(() => result.current.toggle('p1'));
    expect(result.current.isWishlisted('p1')).toBe(false);
  });

  it('persists the wishlist to localStorage', () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggle('p1'));
    const stored: string[] = JSON.parse(localStorage.getItem('silkline-wishlist') ?? '[]');
    expect(stored).toContain('p1');
  });

  it('reads initial state from localStorage', () => {
    localStorage.setItem('silkline-wishlist', JSON.stringify(['p-existing']));
    const { result } = renderHook(() => useWishlist());
    expect(result.current.isWishlisted('p-existing')).toBe(true);
  });

  it('handles corrupted localStorage without crashing', () => {
    localStorage.setItem('silkline-wishlist', 'not-valid-json');
    const { result } = renderHook(() => useWishlist());
    expect(result.current.isWishlisted('anything')).toBe(false);
  });
});
