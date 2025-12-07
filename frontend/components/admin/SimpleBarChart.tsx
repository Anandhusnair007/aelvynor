/**
 * Simple Bar Chart Component
 * Displays data in bar chart format
 */

'use client';

import { cn } from '@/lib/utils';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
  className?: string;
}

export default function SimpleBarChart({
  data,
  title,
  height = 200,
  className,
}: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-24 text-sm text-gray-600 font-medium truncate">
              {item.label}
            </div>
            <div className="flex-1 relative">
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2',
                    item.color || 'bg-indigo-500'
                  )}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                >
                  <span className="text-xs font-medium text-white">
                    {item.value}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
}

