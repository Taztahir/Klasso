'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Search, User } from 'lucide-react';
import { toast } from 'sonner';

export function DashboardHeader() {
    const pathname = usePathname();

    // Map pathname to display title
    const getPageTitle = () => {
        const segment = pathname.split('/').pop();
        switch (segment) {
            case 'overview':
                return 'Dashboard Overview';
            case 'students':
                return 'Students';
            case 'notes':
                return 'Notes';
            case 'assignments':
                return 'Assignments';
            case 'cbt':
                return 'CBT / CBE';
            case 'report-cards':
                return 'Report Cards';
            case 'finance':
                return 'Finance';
            case 'staff':
                return 'Staff / Teachers';
            case 'settings':
                return 'Settings';
            default:
                return 'Klasso';
        }
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-4 md:px-6">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="h-9 w-9 rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer" />
                <h1 className="text-xs font-extrabold text-brandBlack tracking-tight">
                    {getPageTitle()}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Search Bar Input */}
                <div className="relative hidden max-w-sm md:flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search students, staff, classes..."
                        onClick={() => toast.info('Global Search is coming in a future update!')}
                        className="h-9 w-64 rounded-xl border border-gray-200 bg-slate-50/50 pl-9 pr-12 text-xs font-medium text-brandBlack placeholder-gray-400 outline-none transition-all focus:w-72 focus:bg-white focus:border-brandPurple focus:ring-1 focus:ring-brandPurple"
                    />
                    <div className="absolute right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] text-gray-400 font-mono shadow-sm">
                        <span>⌘</span>
                        <span>K</span>
                    </div>
                </div>

                {/* Notifications Button */}
                <button
                    onClick={() => toast.success('You have 3 new notifications.', {
                        description: 'Check academic reminders and billing updates.'
                    })}
                    className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
                >
                    <Bell className="h-4.5 w-4.5" />
                    {/* Notification Badge */}
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brandPink text-[9px] font-bold text-white">
                        3
                    </span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-100">
                    <div className="flex flex-col text-right hidden sm:block">
                        <span className="text-xs font-bold text-brandBlack block leading-none">Zayd Tahir</span>
                        <span className="text-[10px] font-semibold text-brandPurple block mt-1 leading-none">Super Admin</span>
                    </div>
                    {/* User Profile Avatar Image */}
                    <div
                        onClick={() => toast.info('User Profile Modal is coming soon!')}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-slate-100 overflow-hidden"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=256&h=256&q=80"
                            alt="Zayd Tahir Avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
