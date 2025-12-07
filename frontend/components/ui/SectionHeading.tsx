/**
 * SectionHeading Component
 * Consistent section headers inspired by Render.com's design
 * Clean typography with optional description
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  actions?: ReactNode;
}

export default function SectionHeading({
  title,
  description,
  align = 'left',
  className,
  actions,
}: SectionHeadingProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={cn('mb-8', alignClasses[align], className)}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">{title}</h2>
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl">{description}</p>
          )}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

