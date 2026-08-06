'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import * as Lucide from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: Lucide.LucideIcon | string;
    description?: string;
    color?: 'purple' | 'yellow' | 'green' | 'pink' | 'cream' | 'blue';
    trendText?: string;
    trendDirection?: 'up' | 'down';
    trendSubtext?: string;
}

export function StatCard({
    title,
    value,
    icon,
    description,
    color = 'cream',
    trendText,
    trendDirection = 'up',
    trendSubtext
}: StatCardProps) {
    // Resolve icon from string if needed (to support RSC serialization)
    const Icon = typeof icon === 'string'
        ? (Lucide[icon as keyof typeof Lucide] as Lucide.LucideIcon) || Lucide.HelpCircle
        : icon;
    // Brand color variants mapping matching mockups
    const colorClasses = {
        purple: {
            bg: 'bg-[#F4F4FF]',
            border: 'border-indigo-100/50',
            iconBg: 'bg-[#E0E0FF] text-brandPurple',
            text: 'text-brandPurple',
            trendBg: 'bg-[#E0E0FF]/60 text-brandPurple',
            watermark: 'text-brandPurple/5'
        },
        yellow: {
            bg: 'bg-[#FFFBEB]',
            border: 'border-amber-100/50',
            iconBg: 'bg-[#FEF3C7] text-brandYellow',
            text: 'text-[#B45309]',
            trendBg: 'bg-[#FEF3C7]/60 text-[#B45309]',
            watermark: 'text-brandYellow/5'
        },
        green: {
            bg: 'bg-[#ECFDF5]',
            border: 'border-emerald-100/50',
            iconBg: 'bg-[#D1FAE5] text-brandGreen',
            text: 'text-[#065F46]',
            trendBg: 'bg-[#D1FAE5]/60 text-[#065F46]',
            watermark: 'text-brandGreen/5'
        },
        pink: {
            bg: 'bg-[#FFF5F2]',
            border: 'border-rose-100/50',
            iconBg: 'bg-[#FFE4E6] text-brandPink',
            text: 'text-brandPink',
            trendBg: 'bg-[#FFE4E6]/60 text-brandPink',
            watermark: 'text-brandPink/5'
        },
        blue: {
            bg: 'bg-[#F0F7FF]',
            border: 'border-sky-100/50',
            iconBg: 'bg-[#E0F2FE] text-sky-700',
            text: 'text-sky-800',
            trendBg: 'bg-[#E0F2FE]/60 text-sky-800',
            watermark: 'text-sky-500/5'
        },
        cream: {
            bg: 'bg-white',
            border: 'border-gray-100',
            iconBg: 'bg-cream text-brandBlack',
            text: 'text-brandBlack',
            trendBg: 'bg-cream/60 text-brandBlack',
            watermark: 'text-brandBlack/5'
        }
    };

    const variant = colorClasses[color];

    return (
        <Card className={`relative overflow-hidden border ${variant.border} ${variant.bg} rounded-3xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between h-[175px]`}>
            {/* Faint Watermark Icon at background bottom-right */}
            <div className={`absolute -right-2 -bottom-2 pointer-events-none ${variant.watermark}`}>
                <Icon className="h-28 w-28 stroke-[1.2]" />
            </div>

            {/* Header info */}
            <div className="flex items-center justify-between z-10">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</span>
                <div className={`p-2 rounded-xl shrink-0 ${variant.iconBg}`}>
                    <Icon className="h-4.5 w-4.5" />
                </div>
            </div>

            {/* Content Value & Description */}
            <div className="mt-2 z-10">
                <div className="text-2xl font-semibold text-brandBlack tracking-tight leading-none">{value}</div>
                {description && (
                    <p className="text-[11px] font-semibold text-gray-400 mt-2 leading-none">{description}</p>
                )}
            </div>

            {/* Trend Badge & Subtext */}
            {trendText && (
                <div className="flex items-center gap-2 mt-3 z-10">
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${variant.trendBg}`}>
                        {trendDirection === 'up' ? (
                            <Lucide.TrendingUp className="h-3 w-3" />
                        ) : (
                            <Lucide.TrendingDown className="h-3 w-3" />
                        )}
                        {trendText}
                    </span>
                    {trendSubtext && (
                        <span className="text-[10px] font-medium text-gray-400">
                            {trendSubtext}
                        </span>
                    )}
                </div>
            )}
        </Card>
    );
}
