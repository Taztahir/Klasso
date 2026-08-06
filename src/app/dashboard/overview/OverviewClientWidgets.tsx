'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle2, BookOpen, ChevronDown, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const activities = [
    {
        id: 1,
        user: 'Dr. Sarah Jenkins',
        action: 'scheduled a new CBT examination:',
        target: 'Term 1 Algebra Examination',
        time: '10 minutes ago',
        icon: Clock,
        iconColor: 'text-[#E8A838] bg-[#FFFBEB] border-amber-100',
    },
    {
        id: 2,
        user: 'Kamal Tahir (Guardian)',
        action: 'made a payment of',
        target: '$1,200 for Zayd Tahir',
        time: '45 minutes ago',
        icon: CheckCircle2,
        iconColor: 'text-[#2A8C8C] bg-[#ECFDF5] border-emerald-100',
    },
    {
        id: 3,
        user: 'Chidi Okafor',
        action: 'submitted assignment:',
        target: 'JavaScript DOM Manipulation Lab',
        time: '2 hours ago',
        icon: BookOpen,
        iconColor: 'text-brandPurple bg-[#F4F4FF] border-indigo-100',
    },
    {
        id: 4,
        user: 'Miss Clara Oswald',
        action: 'marked attendance status to On Leave',
        target: 'for Grade 10 - A Algebra class',
        time: '4 hours ago',
        icon: Clock,
        iconColor: 'text-brandPink bg-[#FFF5F2] border-rose-100',
    },
];

/** Interactive term selector — toast on click */
export function TermSelector() {
    return (
        <div
            onClick={() => toast.info('Term Selection is disabled for your role.')}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-all shadow-sm w-fit self-start md:self-auto"
        >
            <Calendar className="h-4.5 w-4.5 text-gray-400" />
            <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-gray-400 uppercase leading-none">Current Term</span>
                <span className="text-xs font-extrabold text-brandBlack mt-1 leading-none">2024/2025 Second Term</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
        </div>
    );
}

/** Static activity feed — uses toast, so must be a Client Component */
export function ActivityFeed() {
    return (
        <Card className="h-full border border-gray-100 bg-white shadow-sm rounded-3xl flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-50">
                <div className="grid gap-1">
                    <CardTitle className="text-base font-extrabold text-brandBlack">Recent Activities</CardTitle>
                    <CardDescription className="text-xs font-semibold text-gray-400">Real-time school logs</CardDescription>
                </div>
                <button
                    onClick={() => toast.info('Activity Logs Portal is coming soon!')}
                    className="h-8 px-3 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-all shadow-sm"
                >
                    View All
                </button>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col justify-center">
                <ul className="space-y-3.5">
                    {activities.map((act) => (
                        <li
                            key={act.id}
                            className="flex items-start gap-3.5 p-2 rounded-xl border border-transparent hover:bg-slate-50/50 hover:border-slate-100 transition-all"
                        >
                            <div className={`p-2 rounded-xl border shrink-0 ${act.iconColor}`}>
                                <act.icon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <p className="text-[11px] font-bold text-gray-500 leading-normal">
                                    <span className="font-extrabold text-brandBlack">{act.user}</span>{' '}
                                    {act.action}{' '}
                                    <span className="font-extrabold text-brandBlack">{act.target}</span>
                                </p>
                                <span className="text-[9px] font-semibold text-gray-400 mt-1">{act.time}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
