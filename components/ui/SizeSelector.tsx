'use client';

interface SizeSelectorProps {
  sizes: string[];
  selected: string | null;
  onChange: (size: string | null) => void;
}

export function SizeSelector({ sizes, selected, onChange }: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(size => (
        <button
          key={size}
          type="button"
          aria-pressed={size === selected}
          onClick={() => onChange(size === selected ? null : size)}
          className={`
            px-4 py-2 text-sm border transition-colors duration-150
            ${size === selected
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-stone-700 border-stone-300 hover:border-stone-700'
            }
          `.trim()}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
