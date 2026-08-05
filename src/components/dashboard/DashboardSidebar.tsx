'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    UserCheck,
    BookOpen,
    ClipboardList,
    GraduationCap,
    FileText,
    FileSpreadsheet,
    DollarSign,
    Library,
    MessageSquare,
    Settings,
    LogOut,
    CalendarDays,
    ChevronDown
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar';

const menuItems = [
    { title: 'Overview', url: '/dashboard/overview', icon: LayoutDashboard },
    { title: 'Students', url: '/dashboard/students', icon: Users },
    { title: 'Staff / Teachers', url: '/dashboard/staff', icon: UserCheck },
    { title: 'Classes', url: '#', icon: BookOpen },
    { title: 'Assignments', url: '/dashboard/assignments', icon: ClipboardList },
    { title: 'CBT / CBE', url: '/dashboard/cbt', icon: GraduationCap },
    { title: 'Notes', url: '/dashboard/notes', icon: FileText },
    { title: 'Report Cards', url: '/dashboard/report-cards', icon: FileSpreadsheet },
    { title: 'Finance', url: '/dashboard/finance', icon: DollarSign },
    { title: 'Library', url: '#', icon: Library },
    { title: 'Messages', url: '/dashboard/messages', icon: MessageSquare, badge: '12' },
    { title: 'Settings', url: '/dashboard/settings', icon: Settings },
];

export function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar className="border-r border-white/5 bg-[#0B1521] text-white" collapsible="icon">
            {/* Header / Logo */}
            <SidebarHeader className="p-5 border-b border-white/5 bg-[#0B1521]">
                <div className="flex items-center gap-3">
                    {/* Brand Logo */}
                    <img 
                        src="/logo.svg" 
                        alt="KLASSO Logo" 
                        className="h-9 w-9 shrink-0 rounded-xl"
                    />
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="font-black text-sm tracking-wide text-white leading-none">KLASSO</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Admin Portal</span>
                    </div>
                </div>
            </SidebarHeader>

            {/* Sidebar Navigation items */}
            <SidebarContent className="p-3 bg-[#0B1521] gap-1 overflow-y-auto scrollbar-hide">
                <SidebarMenu className="gap-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.url || (item.url !== '#' && pathname.startsWith(item.url + '/'));
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    render={<Link href={item.url} />}
                                    className={`w-full transition-all duration-200 py-5.5 px-4 rounded-xl flex items-center justify-between gap-3 ${
                                        isActive
                                            ? 'bg-brandPurple text-white font-bold shadow-sm'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium animate-none'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                        <span className="group-data-[collapsible=icon]:hidden text-xs">{item.title}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="group-data-[collapsible=icon]:hidden flex items-center justify-center h-5 px-1.5 text-[10px] font-bold text-white bg-brandPurple rounded-full min-w-[20px]">
                                            {item.badge}
                                        </span>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            {/* Sidebar Footer */}
            <SidebarFooter className="p-4 border-t border-white/5 bg-[#0B1521] gap-3">
                {/* Switch Term Button */}
                <div className="group-data-[collapsible=icon]:hidden">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-xs font-bold">
                        <CalendarDays className="h-4.5 w-4.5 shrink-0 text-slate-400" />
                        <span>Switch Term</span>
                    </button>
                </div>

                {/* Profile Card */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 group-data-[collapsible=icon]:hidden">
                    <div className="flex items-center gap-2 min-w-0">
                        {/* ZT Initials Avatar */}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brandYellow text-[#0B1521] font-black text-xs">
                            ZT
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-white truncate leading-none">Zayd Tahir</span>
                            <span className="text-[9px] font-medium text-slate-400 mt-1 leading-none">Super Admin</span>
                        </div>
                    </div>
                    {/* Status Dot and Arrow */}
                    <div className="flex items-center gap-1 shrink-0 text-slate-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <ChevronDown className="h-4 w-4" />
                    </div>
                </div>

                {/* Log Out Button */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            render={<Link href="/" />}
                            className="w-full py-5 px-4 rounded-xl flex items-center gap-3 text-slate-400 hover:bg-white/5 hover:text-white font-bold transition-all duration-200"
                        >
                            <LogOut className="h-4.5 w-4.5 shrink-0 text-slate-400" />
                            <span className="group-data-[collapsible=icon]:hidden text-xs">Log Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
