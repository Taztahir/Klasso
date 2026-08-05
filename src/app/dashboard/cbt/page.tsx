'use client';

import * as React from 'react';
import { initialCBTTests } from '@/lib/mock-data';
import { CBTTest } from '@/lib/types';
import { DashboardTableWrapper } from '@/components/dashboard/DashboardTable';
import { FormModal } from '@/components/dashboard/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Search, Calendar, ShieldCheck, Lock, Unlock, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function CBTPage() {
    const [tests, setTests] = React.useState<CBTTest[]>(initialCBTTests);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

    // Form state
    const [formTitle, setFormTitle] = React.useState('');
    const [formSubject, setFormSubject] = React.useState('');
    const [formDate, setFormDate] = React.useState('');
    const [formStatus, setFormStatus] = React.useState<CBTTest['status']>('Draft');
    const [formIsSecure, setFormIsSecure] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // Filter tests
    const filteredTests = React.useMemo(() => {
        return tests.filter(test =>
            test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            test.subject.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [tests, searchQuery]);

    // Handle Create Test
    const handleCreateTest = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formTitle || !formSubject || !formDate) {
            toast.error('Validation Failed', {
                description: 'Please fill in all required fields.'
            });
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const newTest: CBTTest = {
                id: `CBT${String(tests.length + 1).padStart(3, '0')}`,
                title: formTitle,
                subject: formSubject,
                date: formDate,
                status: formStatus,
                isSecure: formIsSecure
            };

            setTests([newTest, ...tests]);
            setLoading(false);
            setIsCreateModalOpen(false);

            // Reset
            setFormTitle('');
            setFormSubject('');
            setFormDate('');
            setFormStatus('Draft');
            setFormIsSecure(false);

            toast.success('CBT Exam Created!', {
                description: `"${formTitle}" is now added under the ${formIsSecure ? 'SECURE' : 'STANDARD'} profile.`
            });
        }, 800);
    };

    // Helper for Status Badge styling
    const getStatusStyle = (status: CBTTest['status']) => {
        switch (status) {
            case 'Draft':
                return 'bg-cream text-brandBlack/60 border-brandBlack/20';
            case 'Scheduled':
                return 'bg-brandYellow/15 text-brandYellow border-brandYellow/35';
            case 'Live':
                return 'bg-brandPink/15 text-brandPink border-brandPink/35 animate-pulse';
            case 'Completed':
                return 'bg-brandGreen/10 text-brandGreen border-brandGreen/35';
        }
    };

    // Toggle secure mode in form
    const toggleSecureForm = () => {
        setFormIsSecure(!formIsSecure);
        if (!formIsSecure) {
            toast.warning('Secure Mode Enabled', {
                description: 'This test will run with lock-screen security and proctor monitoring enabled.'
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Secure Area Info Banner */}
            <div className="flex items-center gap-3 bg-brandPurple text-white p-4 border-2 border-brandBlack rounded-2xl shadow-[4px_4px_0px_0px_rgba(13,14,20,1)]">
                <div className="p-2 rounded-xl bg-brandYellow border border-brandBlack text-brandBlack shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                    <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                        Proctored Exam Space
                        <span className="text-[9px] font-black text-brandBlack bg-brandYellow px-2 py-0.5 rounded border border-brandBlack uppercase">
                            Secure Core
                        </span>
                    </h3>
                    <p className="text-[10px] font-bold text-cream/80 mt-0.5">
                        Exams marked with the Secure Lock icon require proctor PIN activation and enforce automated full-screen tab locking.
                    </p>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border-2 border-brandBlack rounded-2xl shadow-[4px_4px_0px_0px_rgba(13,14,20,1)]">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-brandBlack/40" />
                    <Input
                        type="text"
                        placeholder="Search exam papers, subjects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 pl-9 pr-4 rounded-xl border-2 border-brandBlack bg-cream font-bold text-xs"
                    />
                </div>

                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full sm:w-auto h-10 border-2 border-brandBlack bg-brandPurple text-white font-black rounded-xl shadow-[2px_2px_0px_0px_rgba(13,14,20,1)] hover:bg-brandPurple/90 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(13,14,20,1)] flex items-center justify-center gap-2"
                >
                    <Plus className="h-4.5 w-4.5" />
                    Create Test Paper
                </Button>
            </div>

            {/* Table */}
            <DashboardTableWrapper
                title="CBT Examination Log"
                description={`Showing ${filteredTests.length} of ${tests.length} examinations.`}
            >
                <Table>
                    <TableHeader className="bg-cream/50 border-b border-brandBlack/15">
                        <TableRow>
                            <TableHead className="font-extrabold text-brandBlack py-4 pl-6">Paper ID</TableHead>
                            <TableHead className="font-extrabold text-brandBlack py-4">Test Title</TableHead>
                            <TableHead className="font-extrabold text-brandBlack py-4">Subject</TableHead>
                            <TableHead className="font-extrabold text-brandBlack py-4">Exam Date</TableHead>
                            <TableHead className="font-extrabold text-brandBlack py-4">Security Mode</TableHead>
                            <TableHead className="font-extrabold text-brandBlack py-4 pr-6">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTests.length > 0 ? (
                            filteredTests.map((test) => (
                                <TableRow key={test.id} className="border-b border-brandBlack/10 hover:bg-cream/10">
                                    <TableCell className="font-mono text-xs font-bold text-brandBlack/60 py-4 pl-6">{test.id}</TableCell>
                                    <TableCell className="font-black text-brandBlack py-4">{test.title}</TableCell>
                                    <TableCell className="font-bold text-brandPurple py-4">{test.subject}</TableCell>
                                    <TableCell className="font-bold text-brandBlack/60 py-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {test.date}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        {test.isSecure ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-brandPink/30 bg-brandPink/10 text-brandPink text-xs font-black">
                                                <Lock className="h-3 w-3 shrink-0" />
                                                Lockdown Mode
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-brandBlack/10 bg-cream text-brandBlack/50 text-xs font-bold">
                                                <Unlock className="h-3 w-3 shrink-0" />
                                                Standard Mode
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-4 pr-6">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${getStatusStyle(test.status)}`}>
                                            {test.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-brandBlack/40 font-bold">
                                    No examinations found matching "{searchQuery}"
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </DashboardTableWrapper>

            {/* Create Test Modal */}
            <FormModal
                isOpen={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                title="Create CBT Exam Paper"
                description="Draft and schedule a computer-based examination for students."
                onSubmit={handleCreateTest}
                submitText="Schedule Exam"
                loading={loading}
            >
                <div className="space-y-2">
                    <Label htmlFor="test-title" className="text-xs font-black text-brandBlack">Exam Title *</Label>
                    <Input
                        id="test-title"
                        required
                        placeholder="e.g. Mid-term Biology Paper"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="h-10 border-2 border-brandBlack rounded-xl text-xs font-bold bg-cream"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="test-subject" className="text-xs font-black text-brandBlack">Subject *</Label>
                    <select
                        id="test-subject"
                        required
                        value={formSubject}
                        onChange={(e) => setFormSubject(e.target.value)}
                        className="w-full h-10 px-3 border-2 border-brandBlack rounded-xl text-xs font-bold bg-cream outline-none"
                    >
                        <option value="">Select Subject</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Biology">Biology</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Physics">Physics</option>
                        <option value="English Literature">English Literature</option>
                        <option value="History">History</option>
                        <option value="Computer Science">Computer Science</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="test-date" className="text-xs font-black text-brandBlack">Exam Date *</Label>
                        <Input
                            id="test-date"
                            required
                            type="date"
                            value={formDate}
                            onChange={(e) => setFormDate(e.target.value)}
                            className="h-10 border-2 border-brandBlack rounded-xl text-xs font-bold bg-cream"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="test-status" className="text-xs font-black text-brandBlack">Initial Status</Label>
                        <select
                            id="test-status"
                            value={formStatus}
                            onChange={(e) => setFormStatus(e.target.value as any)}
                            className="w-full h-10 px-3 border-2 border-brandBlack rounded-xl text-xs font-bold bg-cream outline-none"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Live">Live</option>
                        </select>
                    </div>
                </div>

                {/* Secure Mode Toggle */}
                <div className="p-4 border-2 border-brandBlack rounded-xl bg-cream flex items-center justify-between gap-4 mt-2">
                    <div className="flex items-start gap-2.5">
                        <Lock className={`h-4.5 w-4.5 mt-0.5 ${formIsSecure ? 'text-brandPink' : 'text-brandBlack/40'}`} />
                        <div>
                            <Label htmlFor="test-secure" className="text-xs font-black text-brandBlack block cursor-pointer">
                                Enable Secure Lockdown Mode
                            </Label>
                            <span className="text-[9px] font-bold text-brandBlack/50 block mt-0.5">
                                Block screen changes, proctor review, tab locking.
                            </span>
                        </div>
                    </div>
                    
                    <button
                        type="button"
                        id="test-secure"
                        onClick={toggleSecureForm}
                        className={`w-11 h-6 rounded-full border-2 border-brandBlack transition-all flex items-center px-0.5 ${
                            formIsSecure ? 'bg-brandPink justify-end' : 'bg-white justify-start'
                        }`}
                    >
                        <span className="w-4.5 h-4.5 rounded-full border border-brandBlack bg-white shadow-xs" />
                    </button>
                </div>
            </FormModal>
        </div>
    );
}
