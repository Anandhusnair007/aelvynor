/**
 * Simple Pie Chart Component
 * Displays data in pie chart format using SVG
 */

'use client';

import { cn } from '@/lib/utils';

interface PieChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimplePieChartProps {
  data: PieChartData[];
  title?: string;
  size?: number;
  className?: string;
}

const defaultColors = [
  '#4F46E5', // Indigo 600
  '#10B981', // Green 500
  '#F59E0B', // Yellow 500
  '#EF4444', // Red 500
  '#3B82F6', // Blue 500
  '#8B5CF6', // Purple 500
];

export default function SimplePieChart({
  data,
  title,
  size = 200,
  className,
}: SimplePieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return (
      <div className={cn('w-full', className)}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        )}
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const radius = size / 2 - 10;
  const center = size / 2;
  let currentAngle = -90; // Start from top

  const paths: Array<{
    path: string;
    color: string;
    percentage: number;
    label: string;
  }> = [];

  data.forEach((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    paths.push({
      path,
      color: item.color || defaultColors[index % defaultColors.length],
      percentage,
      label: item.label,
    });

    currentAngle = endAngle;
  });

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <svg width={size} height={size} className="flex-shrink-0">
          {paths.map((item, index) => (
            <path
              key={index}
              d={item.path}
              fill={item.color}
              stroke="#fff"
              strokeWidth="2"
              className="transition-all duration-300 hover:opacity-80 cursor-pointer"
            />
          ))}
        </svg>
        <div className="flex-1 space-y-2">
          {paths.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

