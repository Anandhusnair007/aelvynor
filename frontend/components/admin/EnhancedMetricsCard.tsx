/**
 * Enhanced Metrics Card Component
 * Enterprise SaaS design with Indigo theme and animated counters
 */

'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedCounter from './AnimatedCounter';

interface EnhancedMetricsCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    subtitle?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    variant?: 'indigo' | 'green' | 'yellow' | 'red' | 'blue';
    loading?: boolean;
}

const variantClasses = {
    indigo: {
        card: 'glass-card hover:bg-white/10',
        icon: 'bg-indigo-500/20 text-indigo-400',
        title: 'text-white/60',
        value: 'text-white',
        trendPositive: 'text-green-400',
        trendNegative: 'text-red-400',
    },
    green: {
        card: 'glass-card hover:bg-white/10',
        icon: 'bg-green-500/20 text-green-400',
        title: 'text-white/60',
        value: 'text-white',
        trendPositive: 'text-green-400',
        trendNegative: 'text-red-400',
    },
    yellow: {
        card: 'glass-card hover:bg-white/10',
        icon: 'bg-yellow-500/20 text-yellow-400',
        title: 'text-white/60',
        value: 'text-white',
        trendPositive: 'text-green-400',
        trendNegative: 'text-red-400',
    },
    red: {
        card: 'glass-card hover:bg-white/10',
        icon: 'bg-red-500/20 text-red-400',
        title: 'text-white/60',
        value: 'text-white',
        trendPositive: 'text-green-400',
        trendNegative: 'text-red-400',
    },
    blue: {
        card: 'glass-card hover:bg-white/10',
        icon: 'bg-blue-500/20 text-blue-400',
        title: 'text-white/60',
        value: 'text-white',
        trendPositive: 'text-green-400',
        trendNegative: 'text-red-400',
    },
};

export default function EnhancedMetricsCard({
    title,
    value,
    icon: Icon,
    subtitle,
    trend,
    variant = 'indigo',
    loading = false,
}: EnhancedMetricsCardProps) {
    const classes = variantClasses[variant];

    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-card border p-6 transition-all duration-200',
                classes.card
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className={cn('text-sm font-medium mb-2', classes.title)}>
                        {title}
                    </p>
                    {loading ? (
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                    ) : (
                        <div className={cn('text-3xl font-bold font-display', classes.value)}>
                            <AnimatedCounter value={value} duration={1000} />
                        </div>
                    )}
                    {subtitle && (
                        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                    )}
                    {trend && !loading && (
                        <div className={cn(
                            'flex items-center gap-1 text-xs font-medium mt-2',
                            trend.isPositive ? classes.trendPositive : classes.trendNegative
                        )}>
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span>{Math.abs(trend.value)}%</span>
                            <span className="text-gray-500">from last month</span>
                        </div>
                    )}
                </div>

                <div className={cn('p-3 rounded-lg', classes.icon)}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}

