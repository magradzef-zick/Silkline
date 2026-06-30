'use client';

interface FilterChipProps {
  label: string;
  active: boolean;
  onToggle: () => void;
}

export function FilterChip({ label, active, onToggle }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={`
        px-3 py-1.5 text-xs font-medium tracking-wide uppercase rounded-full
        border transition-colors duration-150
        ${active
          ? 'bg-stone-900 text-white border-stone-900'
          : 'bg-white text-stone-600 border-stone-300 hover:border-stone-600'
        }
      `.trim()}
    >
      {label}
    </button>
  );
}
