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
            px-4 py-2 text-[13px] border transition-colors duration-150
            ${size === selected
              ? 'bg-foreground text-background border-foreground'
              : 'bg-background text-foreground/70 border-border hover:border-foreground/50'
            }
          `.trim()}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
