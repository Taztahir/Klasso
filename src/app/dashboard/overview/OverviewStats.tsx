import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

// Colour palette for pie chart slices — cycles for large class sets
const SLICE_COLOURS = [
    '#1E3A5F',
    '#2A8C8C',
    '#E8704A',
    '#E8A838',
    '#A78BFA',
    '#3B82F6',
    '#10B981',
    '#F43F5E',
];

export interface ClassSlice {
    name: string;
    value: number;
    percentage: string;
    fill: string;
}

export interface StudentStats {
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    classData: ClassSlice[];
}

/**
 * Cached data-fetcher — React's `cache()` deduplicates concurrent calls within
 * the same render pass so both OverviewStatCard and OverviewPieSection only
 * trigger one Supabase round-trip per request.
 *
 * force-dynamic on the page ensures Next.js never serves stale cached responses.
 */
export const fetchStudentStats = cache(async (): Promise<StudentStats> => {
    const supabase = await createClient();

    const { data: students, error } = await supabase
        .from('students')
        .select('status, class_grade');

    if (error) {
        console.error('[fetchStudentStats] Supabase error:', error.message);
    }

    const rows = students ?? [];

    const totalStudents = rows.length;
    const activeStudents = rows.filter((s) => s.status === 'Active').length;
    const inactiveStudents = rows.filter((s) => s.status === 'Inactive').length;

    // Group by class_grade for the pie chart
    const classMap = new Map<string, number>();
    for (const s of rows) {
        const grade = (s.class_grade as string | null) || 'Unassigned';
        classMap.set(grade, (classMap.get(grade) ?? 0) + 1);
    }

    const classData: ClassSlice[] = Array.from(classMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, value], i) => ({
            name,
            value,
            percentage:
                totalStudents > 0
                    ? `${((value / totalStudents) * 100).toFixed(1)}%`
                    : '0%',
            fill: SLICE_COLOURS[i % SLICE_COLOURS.length],
        }));

    return { totalStudents, activeStudents, inactiveStudents, classData };
});
