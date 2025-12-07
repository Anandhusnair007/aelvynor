/**
 * LoadingSkeleton Component
 * Skeleton loader for loading states
 */

'use client';

import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export default function LoadingSkeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines,
}: LoadingSkeletonProps) {
  if (lines) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 bg-white/10 rounded animate-pulse',
              i === lines - 1 && 'w-3/4'
            )}
          />
        ))}
      </div>
    );
  }

  const baseClasses = 'bg-white/10 rounded animate-pulse';
  const variantClasses = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'h-20',
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{
        width: width || (variant === 'circular' ? '40px' : '100%'),
        height: height || (variant === 'circular' ? '40px' : undefined),
      }}
    />
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <LoadingSkeleton variant="text" height="16px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-white/5">
              {Array.from({ length: columns }).map((_, j) => (
                <td key={j} className="px-4 py-3">
                  <LoadingSkeleton variant="text" height="16px" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

