/**
 * EmptyState Component
 * Empty state display for tables and lists
 */

'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { Inbox, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon,
  title = 'No items found',
  description = 'Get started by creating a new item.',
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        {icon || <Inbox className="w-8 h-8 text-white/40" />}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/60 text-center max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

