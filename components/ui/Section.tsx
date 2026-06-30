import type { ElementType, ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function Section({ children, as: Tag = 'section', className = '' }: SectionProps) {
  return <Tag className={`py-16 lg:py-24 ${className}`}>{children}</Tag>;
}
