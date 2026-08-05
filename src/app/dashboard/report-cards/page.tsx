'use client';

import * as React from 'react';
import { initialStudents } from '@/lib/mock-data';
import { Student } from '@/lib/types';
import { DashboardTableWrapper } from '@/components/dashboard/DashboardTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Search, FileSpreadsheet, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportCardsPage() {
    const [students] = React.useState<Student[]>(initialStudents);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [generatingIds, setGeneratingIds] = React.useState<Record<string, boolean>>({});

    // Filter students
    const filteredStudents = React.useMemo(() => {
        return students.filter(student =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.class.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [students, searchQuery]);

    // Handle Report Card Generation for a specific student
    const handleGenerate = (studentId: string, studentName: string) => {
        // Mark as loading
        setGeneratingIds(prev => ({ ...prev, [studentId]: true }));

        toast.loading(`Compiling grades for ${studentName}...`, {
            id: `gen-${studentId}`
        });

        // Simulate report generation
        setTimeout(() => {
            setGeneratingIds(prev => ({ ...prev, [studentId]: false }));
            
            toast.success(`Report Card Generated!`, {
                id: `gen-${studentId}`,
                description: `Compiled report card for ${studentName} is ready to download.`
            });
        }, 1500);
    };

    return (
        <div className="space-y-6">
            {/* Header / Info box */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border-2 border-brandBlack rounded-2xl shadow-[4px_4px_0px_0px_rgba(13,14,20,1)]">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-brandBlack/40" />
                    <Input
                        type="text"
                        placeholder="Search student, class..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 pl-9 pr-4 rounded-xl border-2 border-brandBlack bg-cream font-bold text-xs"
                    />
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-brandBlack/60">
                    <Sparkles className="h-4.5 w-4.5 text-brandYellow shrink-0" />
                    Automatic GPA compilation enabled
                </div>
            </div>

            {/* Table */}
            <DashboardTableWrapper
                title="Academic Performance & Reports"
                description="Generate formal PDF report cards compiled from gradebook records."
            >
                <Table>
                    <TableHeader className="bg-cream/50 border-b border-brandBlack/15">
                        <TableRow>
                            <TableHead className="font-extrabold text-brandBlack py-4 pl-6">ID</TableHead>
                            <TableHead className="font-extrabold text-brandBlack py-4">Name</TableHead>
                            <TableHead className="font-extrabold text-brandBlack py-4">Class / Grade</TableHead>
                            <TableHead className="font-extrabold text-brandBlack py-4 pr-6 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => {
                                const isGenerating = !!generatingIds[student.id];
                                return (
                                    <TableRow key={student.id} className="border-b border-brandBlack/10 hover:bg-cream/10">
                                        <TableCell className="font-mono text-xs font-bold text-brandBlack/60 py-4 pl-6">{student.id}</TableCell>
                                        <TableCell className="font-black text-brandBlack py-4">{student.name}</TableCell>
                                        <TableCell className="font-bold text-brandPurple py-4">{student.class}</TableCell>
                                        <TableCell className="py-4 pr-6 text-right">
                                            <Button
                                                onClick={() => handleGenerate(student.id, student.name)}
                                                disabled={isGenerating}
                                                className={`h-9 px-4 border-2 border-brandBlack rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_rgba(13,14,20,1)] transition-all ${
                                                    isGenerating
                                                        ? 'bg-cream text-brandBlack/40'
                                                        : 'bg-brandYellow text-brandBlack hover:bg-brandYellow/90 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(13,14,20,1)]'
                                                }`}
                                            >
                                                {isGenerating ? (
                                                    <span className="flex items-center gap-1.5 justify-end">
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        Compiling...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 justify-end">
                                                        <FileSpreadsheet className="h-3.5 w-3.5" />
                                                        Generate Report
                                                    </span>
                                                )}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-brandBlack/40 font-bold">
                                    No students found matching "{searchQuery}"
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </DashboardTableWrapper>
        </div>
    );
}
