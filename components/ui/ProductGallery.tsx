'use client';
import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

const PLACEHOLDER = '/placeholders/product-placeholder.svg';

interface ProductGalleryProps {
  images: string[];
  name: string;
  priority?: boolean;
}

export function ProductGallery({ images, name, priority = false }: ProductGalleryProps) {
  const srcs = images.length > 0 ? images : [PLACEHOLDER];
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  const goTo = useCallback((i: number) => {
    if (i === activeIndex) return;
    setPrevIndex(activeIndex);
    setActiveIndex(i);
  }, [activeIndex]);

  // Clear prevIndex after transition completes
  useEffect(() => {
    if (prevIndex === null) return;
    const id = setTimeout(() => setPrevIndex(null), 400);
    return () => clearTimeout(id);
  }, [prevIndex]);

  useEffect(() => {
    if (srcs.length <= 1) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo((activeIndex - 1 + srcs.length) % srcs.length);
      if (e.key === 'ArrowRight') goTo((activeIndex + 1) % srcs.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex, srcs.length, goTo]);

  return (
    <div>
      <div
        className="relative aspect-[3/4] overflow-hidden bg-[#f0ece7]"
        aria-label={`${name} — фото ${activeIndex + 1} из ${srcs.length}`}
      >
        <Image
          key={srcs[activeIndex]}
          src={srcs[activeIndex]}
          alt={name}
          fill
          priority={priority && activeIndex === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-350 ease-out"
          style={{ opacity: 1 }}
        />

        {prevIndex !== null && (
          <Image
            key={`prev-${srcs[prevIndex]}`}
            src={srcs[prevIndex]}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-opacity duration-350 ease-out pointer-events-none"
            style={{ opacity: 0 }}
            aria-hidden="true"
          />
        )}

        {/* Prev/next arrows (hidden on mobile — thumbnails serve that purpose) */}
        {srcs.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Предыдущее фото"
              onClick={() => goTo((activeIndex - 1 + srcs.length) % srcs.length)}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center bg-background/70 backdrop-blur-sm hover:bg-background transition-colors duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              type="button"
              aria-label="Следующее фото"
              onClick={() => goTo((activeIndex + 1) % srcs.length)}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center bg-background/70 backdrop-blur-sm hover:bg-background transition-colors duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {srcs.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Выбрать фото">
          {srcs.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-label={`${name} — фото ${i + 1}`}
              aria-selected={i === activeIndex}
              onClick={() => goTo(i)}
              className={`relative shrink-0 aspect-square w-[72px] overflow-hidden bg-[#f0ece7] border-b-[1.5px] transition-all duration-200 ${
                i === activeIndex
                  ? 'border-foreground opacity-100'
                  : 'border-transparent opacity-55 hover:opacity-80'
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
