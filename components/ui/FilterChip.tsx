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
        px-3 py-1.5 text-[11px] tracking-[0.1em] uppercase
        border transition-colors duration-150
        ${active
          ? 'bg-foreground text-background border-foreground'
          : 'bg-background text-muted border-border hover:border-foreground/40 hover:text-foreground'
        }
      `.trim()}
    >
      {label}
    </button>
  );
}
