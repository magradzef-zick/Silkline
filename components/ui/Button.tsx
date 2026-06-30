import type { ButtonHTMLAttributes } from 'react';

const variants = {
  primary: 'bg-accent text-white hover:opacity-90',
  secondary: 'border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white',
  ghost: 'text-stone-700 hover:text-stone-900 underline-offset-4 hover:underline',
} as const;

const sizes = {
  sm: 'px-4 py-2 text-xs tracking-widest',
  md: 'px-6 py-3 text-sm tracking-widest',
  lg: 'px-8 py-4 text-base tracking-widest',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center font-medium uppercase
        transition-colors duration-150 focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
