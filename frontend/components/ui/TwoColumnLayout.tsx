/**
 * TwoColumnLayout Component
 * Responsive two-column layout inspired by Render.com's design
 * Clean spacing and responsive breakpoints
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TwoColumnLayoutProps {
  left: ReactNode;
  right: ReactNode;
  reverse?: boolean;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
}

export default function TwoColumnLayout({
  left,
  right,
  reverse = false,
  gap = 'md',
  className,
  leftClassName,
  rightClassName,
}: TwoColumnLayoutProps) {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-8',
    lg: 'gap-12',
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1 lg:grid-cols-2',
        gapClasses[gap],
        className
      )}
    >
      <div
        className={cn(
          reverse && 'lg:order-2',
          leftClassName
        )}
      >
        {left}
      </div>
      <div
        className={cn(
          reverse && 'lg:order-1',
          rightClassName
        )}
      >
        {right}
      </div>
    </div>
  );
}

