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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';

const grade10Data = [
    { name: 'Grade 10A', value: 38, percentage: '26.8%', fill: '#1E3A5F' },
    { name: 'Grade 10B', value: 32, percentage: '22.5%', fill: '#2A8C8C' },
    { name: 'Grade 10C', value: 28, percentage: '19.7%', fill: '#E8704A' },
    { name: 'Grade 10D', value: 24, percentage: '16.9%', fill: '#E8A838' },
    { name: 'Grade 10E', value: 20, percentage: '14.1%', fill: '#A78BFA' },
];

export function OverviewPieChart() {
    return (
        <Card className="flex flex-col border border-gray-100 bg-white rounded-3xl shadow-sm h-full justify-between">
            {/* Card Header */}
            <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-gray-50">
                <div className="grid gap-1">
                    <CardTitle className="text-base font-extrabold text-brandBlack">Student Distribution</CardTitle>
                    <CardDescription className="text-xs font-semibold text-gray-400">By Grade / Level</CardDescription>
                </div>
                <Select defaultValue="grade10">
                    <SelectTrigger
                        className="ml-auto h-8 w-[110px] rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 focus:ring-1 focus:ring-brandPurple"
                        aria-label="Select Grade"
                    >
                        <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent align="end" className="rounded-xl border border-gray-200 bg-white">
                        <SelectItem value="grade9" className="text-xs font-bold text-gray-700">Grade 9</SelectItem>
                        <SelectItem value="grade10" className="text-xs font-bold text-gray-700">Grade 10</SelectItem>
                        <SelectItem value="grade11" className="text-xs font-bold text-gray-700">Grade 11</SelectItem>
                        <SelectItem value="grade12" className="text-xs font-bold text-gray-700">Grade 12</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            {/* Card Content with Donut chart and legend */}
            <CardContent className="pt-6 pb-2 flex-1 flex flex-col justify-between">
                <div className="flex flex-row items-center justify-between gap-4">
                    {/* Donut Chart */}
                    <div className="w-[130px] h-[130px] flex items-center justify-center shrink-0">
                        <PieChart width={130} height={130}>
                            <Pie
                                data={grade10Data}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={42}
                                outerRadius={58}
                                strokeWidth={2}
                                stroke="#FFFFFF"
                                paddingAngle={2}
                            >
                                {grade10Data.map((entry, index) => (
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
                                                        142
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

                    {/* Legend */}
                    <div className="flex-1 flex flex-col gap-1.5 min-w-0 pr-1">
                        {grade10Data.map((item, index) => (
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
                    </div>
                </div>

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
