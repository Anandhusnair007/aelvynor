/**
 * Metrics Card Component
 * Displays stats with icon,title, value, and optional change indicator
 */

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    subtitle?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    gradient?: 'purple' | 'blue' | 'green' | 'yellow' | 'red';
}

const gradientClasses = {
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30',
};

const iconBgClasses = {
    purple: 'bg-purple-500/20 text-purple-400',
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/20 text-red-400',
};

export default function MetricsCard({
    title,
    value,
    icon: Icon,
    subtitle,
    trend,
    gradient = 'purple',
}: MetricsCardProps) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-xl border backdrop-blur-xl p-6 transition-all hover:scale-[1.02] hover:shadow-lg',
                'bg-white/[0.05]',
                gradientClasses[gradient]
            )}
        >
            {/* Background Gradient */}
            <div className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-50 -z-10',
                gradientClasses[gradient].split(' ')[0] + ' ' + gradientClasses[gradient].split(' ')[1]
            )} />

            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-white/60 font-medium">{title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-white/40 mt-1">{subtitle}</p>
                    )}
                    {trend && (
                        <p className={cn(
                            'text-xs font-medium mt-2',
                            trend.isPositive ? 'text-green-400' : 'text-red-400'
                        )}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </p>
                    )}
                </div>

                <div className={cn(
                    'p-3 rounded-lg',
                    iconBgClasses[gradient]
                )}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
