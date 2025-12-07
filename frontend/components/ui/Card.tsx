/**
 * Card Component
 * Clean card component inspired by Render.com's design
 * Subtle shadows, clean borders, and modern spacing
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'elevated';
}

export default function Card({
  children,
  className,
  hover = false,
  padding = 'md',
  variant = 'default',
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'glass-card',
    outlined: 'glass-card border-2 border-white/10',
    elevated: 'glass-card shadow-lg',
  };

  return (
    <div
      className={cn(
        'rounded-card transition-all duration-150',
        variantClasses[variant],
        paddingClasses[padding],
        hover && 'hover:shadow-md hover:border-indigo-300 hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  );
}

