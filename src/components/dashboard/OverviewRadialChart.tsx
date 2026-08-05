'use client';

import * as React from 'react';
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowRight, TrendingUp } from 'lucide-react';

const chartData = [
    { metric: 'fees', value: 78.5, fill: '#2A8C8C' },
];

export function OverviewRadialChart() {
    return (
        <Card className="flex flex-col border border-gray-100 bg-white rounded-3xl shadow-sm h-full justify-between">
            {/* Card Header */}
            <CardHeader className="pb-0 border-b border-gray-50 p-4">
                <div className="grid gap-1">
                    <CardTitle className="text-base font-extrabold text-brandBlack">Fee Collection Progress</CardTitle>
                    <CardDescription className="text-xs font-semibold text-gray-400">Current Term Target</CardDescription>
                </div>
            </CardHeader>

            {/* Radial Chart Content */}
            <CardContent className="pt-4 pb-2 flex-1 flex flex-col justify-between items-center">
                <div className="relative w-[130px] h-[130px] flex items-center justify-center">
                    <RadialBarChart
                        width={130}
                        height={130}
                        data={chartData}
                        startAngle={90}
                        endAngle={90 - (360 * 0.785)}
                        innerRadius={45}
                        outerRadius={60}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-slate-50 last:fill-white"
                            polarRadius={[52, 45]}
                        />
                        {/* Custom background track */}
                        <RadialBar 
                            dataKey="value" 
                            background={{ fill: '#F1F5F9' }} 
                            cornerRadius={10}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-brandBlack text-lg font-black"
                                                >
                                                    78.5%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 14}
                                                    className="fill-gray-400 text-[9px] font-bold"
                                                >
                                                    Of Target
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </div>

                {/* Growth and details */}
                <div className="flex flex-col items-center gap-1.5 text-center mt-3">
                    <div className="flex items-center gap-1 text-xs font-black text-brandGreen">
                        <span>Up 12.4% from last week</span>
                        <TrendingUp className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-[10px] font-semibold text-gray-400 leading-normal max-w-[200px]">
                        Total target is $150,000 for this school session.
                    </p>
                </div>

                {/* Footer Action Button */}
                <button
                    onClick={() => toast.info('Finance Portal is coming soon!')}
                    className="mt-4 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-gray-100 hover:bg-slate-50 text-xs font-bold text-brandPurple cursor-pointer transition-all shadow-sm"
                >
                    <span>View Finance Report</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </CardContent>
        </Card>
    );
}
