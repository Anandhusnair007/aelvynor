/**
 * Button Component
 * Clean button component inspired by Render.com's design
 * Multiple variants and sizes with smooth transitions
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-400 disabled:text-gray-200 shadow-sm hover:shadow-md',
    secondary:
      'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 active:bg-indigo-300 disabled:bg-gray-100 disabled:text-gray-400',
    outline:
      'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 disabled:border-gray-300 disabled:text-gray-400',
    ghost:
      'text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 disabled:text-gray-400',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 disabled:text-gray-200',
  };

  return (
    <button
      className={cn(
        'font-medium rounded-input transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed active:scale-95',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

