'use client';

import * as React from 'react';
import { Cell, Label, Pie, PieChart } from 'recharts';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export interface ClassSlice {
    name: string;
    value: number;
    percentage: string;
    fill: string;
}

interface OverviewPieChartProps {
    /** Live data passed from the server component. Falls back to empty state when omitted. */
    classData?: ClassSlice[];
    totalStudents?: number;
}

export function OverviewPieChart({ classData, totalStudents }: OverviewPieChartProps) {
    const data = classData && classData.length > 0 ? classData : [];
    const total = totalStudents ?? data.reduce((s, d) => s + d.value, 0);
    const isEmpty = data.length === 0;

    return (
        <Card className="flex flex-col border border-gray-100 bg-white rounded-3xl shadow-sm h-full justify-between">
            {/* Card Header */}
            <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-gray-50">
                <div className="grid gap-1">
                    <CardTitle className="text-base font-extrabold text-brandBlack">Student Distribution</CardTitle>
                    <CardDescription className="text-xs font-semibold text-gray-400">By Class / Grade</CardDescription>
                </div>
            </CardHeader>

            {/* Card Content with Donut chart and legend */}
            <CardContent className="pt-6 pb-2 flex-1 flex flex-col justify-between">
                {isEmpty ? (
                    <div className="flex-1 flex items-center justify-center text-xs font-semibold text-gray-400 py-8">
                        No student data yet.
                    </div>
                ) : (
                    <div className="flex flex-row items-center justify-between gap-4">
                        {/* Donut Chart */}
                        <div className="w-[130px] h-[130px] flex items-center justify-center shrink-0">
                            <PieChart width={130} height={130}>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={42}
                                    outerRadius={58}
                                    strokeWidth={2}
                                    stroke="#FFFFFF"
                                    paddingAngle={2}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
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
                                                            {total}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 14}
                                                            className="fill-gray-400 text-[9px] font-bold"
                                                        >
                                                            Students
                                                        </tspan>
                                                    </text>
                                                );
                                            }
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </div>

                        {/* Legend — show up to 5 entries, collapse the rest */}
                        <div className="flex-1 flex flex-col gap-1.5 min-w-0 pr-1">
                            {data.slice(0, 5).map((item) => (
                                <div key={item.name} className="flex items-center justify-between text-xs min-w-0">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span
                                            className="h-2 w-2 rounded-full shrink-0"
                                            style={{ backgroundColor: item.fill }}
                                        />
                                        <span className="font-bold text-gray-500 truncate text-[11px]">{item.name}</span>
                                    </div>
                                    <span className="font-extrabold text-brandBlack shrink-0 text-[11px]">
                                        {item.value} <span className="font-medium text-gray-400">({item.percentage})</span>
                                    </span>
                                </div>
                            ))}
                            {data.length > 5 && (
                                <span className="text-[10px] font-semibold text-gray-400 pl-4">
                                    +{data.length - 5} more classes
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer Action Button */}
                <button
                    onClick={() => toast.info('Detailed Student Breakdown is coming soon!')}
                    className="mt-6 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-gray-100 hover:bg-slate-50 text-xs font-bold text-brandPurple cursor-pointer transition-all shadow-sm"
                >
                    <span>View Full Breakdown</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </CardContent>
        </Card>
    );
}
