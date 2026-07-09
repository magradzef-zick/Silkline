import type { ElementType, ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function Section({ children, as: Tag = 'section', className = '' }: SectionProps) {
  return <Tag className={`py-20 lg:py-32 ${className}`}>{children}</Tag>;
}
