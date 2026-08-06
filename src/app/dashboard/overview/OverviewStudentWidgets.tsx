import * as React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { OverviewPieChart } from '@/components/dashboard/OverviewPieChart';
import { Users } from 'lucide-react';
import { fetchStudentStats } from './OverviewStats';

/** Renders the "Total Students" stat card with a live count from Supabase. */
export async function OverviewStudentStatCard() {
    const { totalStudents, activeStudents, inactiveStudents } = await fetchStudentStats();

    return (
        <StatCard
            title="Total Students"
            value={totalStudents}
            icon="Users"
            description={`${activeStudents} active · ${inactiveStudents} inactive`}
            color="purple"
        />
    );
}

/** Renders the student class-distribution pie chart with live data from Supabase. */
export async function OverviewStudentPieChart() {
    const { classData, totalStudents } = await fetchStudentStats();

    return (
        <OverviewPieChart classData={classData} totalStudents={totalStudents} />
    );
}
