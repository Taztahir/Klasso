'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const data = [
    { name: 'Mon', attendance: 94 },
    { name: 'Tue', attendance: 92 },
    { name: 'Wed', attendance: 96 },
    { name: 'Thu', attendance: 95 },
    { name: 'Fri', attendance: 98 },
    { name: 'Sat', attendance: 88 },
    { name: 'Sun', attendance: 91 },
];

export function AttendanceOverviewChart() {
    return (
        <Card className="flex flex-col border border-gray-100 bg-white rounded-3xl shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between pb-4 border-b border-gray-50">
                <div className="grid gap-1">
                    <CardTitle className="text-base font-extrabold text-brandBlack">Attendance Overview</CardTitle>
                    <CardDescription className="text-xs font-semibold text-gray-400">This Week</CardDescription>
                </div>
                <Select defaultValue="this-week">
                    <SelectTrigger className="h-8 w-[110px] rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-gray-200 bg-white">
                        <SelectItem value="this-week" className="text-xs font-bold text-gray-700">This Week</SelectItem>
                        <SelectItem value="last-week" className="text-xs font-bold text-gray-700">Last Week</SelectItem>
                        <SelectItem value="this-month" className="text-xs font-bold text-gray-700">This Month</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="attendanceColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis 
                                dataKey="name" 
                                stroke="#94A3B8" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <YAxis 
                                stroke="#94A3B8" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                domain={[60, 100]}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    background: '#FFFFFF', 
                                    border: '1px solid #E2E8F0', 
                                    borderRadius: '12px', 
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    color: '#0D0E14'
                                }}
                                formatter={(value) => [`${value}%`, 'Attendance']}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="attendance" 
                                stroke="#1E3A5F" 
                                strokeWidth={2.5} 
                                fillOpacity={1} 
                                fill="url(#attendanceColor)"
                                activeDot={{ r: 6, fill: '#1E3A5F', strokeWidth: 0 }}
                                dot={{ r: 4, fill: '#1E3A5F', strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
