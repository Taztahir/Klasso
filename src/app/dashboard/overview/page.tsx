import * as React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { OverviewRadialChart } from '@/components/dashboard/OverviewRadialChart';
import { AttendanceOverviewChart } from '@/components/dashboard/AttendanceOverviewChart';
import { UpcomingEventsCard } from '@/components/dashboard/UpcomingEventsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCheck, DollarSign, BookOpen } from 'lucide-react';
import { OverviewStudentStatCard, OverviewStudentPieChart } from './OverviewStudentWidgets';
import { TermSelector, ActivityFeed } from './OverviewClientWidgets';

// Ensure Next.js never serves a stale cached response for this page — every
// page-load hits Supabase for fresh student counts.
export const dynamic = 'force-dynamic';

export default function OverviewPage() {
    return (
        <div className="space-y-8">
            {/* ── Page Header ────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <TermSelector />
            </div>

            {/* ── Stat Cards Grid ──────────────────────────────────────────────
             *
             *  [Total Students — live] [Staff — mock] [Fees — mock] [Assignments — mock]
             *
             *  Suspense shows a rounded skeleton while the Supabase query for
             *  Total Students resolves. The three mock cards render immediately.
             */}
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                {/* Live */}
                <React.Suspense fallback={<Skeleton className="h-[175px] w-full rounded-3xl" />}>
                    <OverviewStudentStatCard />
                </React.Suspense>

                {/* Mock — tables not yet wired */}
                <StatCard
                    title="Total Staff"
                    value="48"
                    icon="UserCheck"
                    description="Teachers & administrators"
                    color="yellow"
                    trendText="5.2%"
                    trendDirection="up"
                    trendSubtext="vs last term"
                />
                <StatCard
                    title="Fees Collected"
                    value="$117,750"
                    icon="DollarSign"
                    description="78.5% of total budget goal"
                    color="green"
                    trendText="12.4%"
                    trendDirection="up"
                    trendSubtext="vs last week"
                />
                <StatCard
                    title="Pending Assignments"
                    value="12"
                    icon="BookOpen"
                    description="Awaiting grades or submission"
                    color="pink"
                    trendText="3.1%"
                    trendDirection="down"
                    trendSubtext="vs last week"
                />
            </div>

            {/* ── Charts & Activity Grid ───────────────────────────────────── */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Live: Student class-distribution pie chart */}
                <div className="lg:col-span-1">
                    <React.Suspense fallback={<Skeleton className="h-full min-h-[300px] w-full rounded-3xl" />}>
                        <OverviewStudentPieChart />
                    </React.Suspense>
                </div>

                {/* Mock: Fee Collection radial chart */}
                <div className="lg:col-span-1">
                    <OverviewRadialChart />
                </div>

                {/* Mock: Recent Activity Feed */}
                <div className="md:col-span-2 lg:col-span-1">
                    <ActivityFeed />
                </div>
            </div>

            {/* ── Attendance & Upcoming Events ─────────────────────────────── */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="md:col-span-1 lg:col-span-2">
                    <AttendanceOverviewChart />
                </div>
                <div className="md:col-span-1 lg:col-span-1">
                    <UpcomingEventsCard />
                </div>
            </div>
        </div>
    );
}
