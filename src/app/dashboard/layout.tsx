import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="theme-dashboard min-h-screen bg-cream text-brandBlack font-sans antialiased">
            <SidebarProvider
                style={
                    {
                        '--sidebar-width': '240px',
                        '--sidebar-width-icon': '3.5rem',
                        '--header-height': '64px',
                    } as React.CSSProperties
                }
            >
                <DashboardSidebar />
                <SidebarInset className="flex flex-col bg-cream min-h-screen">
                    <DashboardHeader />
                    <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
