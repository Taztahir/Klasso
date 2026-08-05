'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function UpcomingEventsCard() {
    return (
        <Card className="flex flex-col border border-gray-100 bg-white rounded-3xl shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50">
                <CardTitle className="text-base font-extrabold text-brandBlack">Upcoming Events</CardTitle>
                <button 
                    onClick={() => toast.info('Calendar View is coming in a future update!')}
                    className="h-8 px-3 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-all shadow-sm"
                >
                    View Calendar
                </button>
            </CardHeader>
            <CardContent className="pt-5 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        {/* Calendar Icon Widget */}
                        <div className="flex flex-col h-14 w-12 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0">
                            {/* Top Month Header */}
                            <div className="bg-brandPurple text-white text-[9px] font-bold py-0.5 text-center uppercase tracking-wider">
                                May
                            </div>
                            {/* Day Number */}
                            <div className="bg-white flex-1 flex items-center justify-center text-lg font-black text-brandBlack leading-none">
                                20
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-brandBlack leading-tight">Parent-Teacher Meeting</span>
                            <span className="text-[10px] font-semibold text-gray-400 mt-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3 shrink-0" />
                                <span>May 20, 2025 • 10:00 AM</span>
                            </span>
                        </div>
                    </div>

                    {/* Upcoming Status Badge */}
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E0E0FF]/60 text-brandPurple shrink-0">
                        Upcoming
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
