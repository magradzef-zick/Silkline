'use client';
import { useState } from 'react';
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

  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f0ece7]">
        <Image
          src={srcs[activeIndex]}
          alt={name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {srcs.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5">
          {srcs.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`${name} — image ${i + 1}`}
              aria-pressed={i === activeIndex}
              onClick={() => setActiveIndex(i)}
              className={`relative shrink-0 aspect-square w-[60px] overflow-hidden bg-[#f0ece7] border-b-2 transition-colors ${
                i === activeIndex ? 'border-accent' : 'border-transparent'
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
