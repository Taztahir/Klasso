'use client';

import * as React from 'react';
import { initialFeeRecords } from '@/lib/mock-data';
import { FeeRecord } from '@/lib/types';
import { DashboardTableWrapper } from '@/components/dashboard/DashboardTable';
import { OverviewRadialChart } from '@/components/dashboard/OverviewRadialChart';
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
import { Plus, Search, Calendar, DollarSign, CreditCard, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function FinancePage() {
    const [records, setRecords] = React.useState<FeeRecord[]>(initialFeeRecords);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isRecordModalOpen, setIsRecordModalOpen] = React.useState(false);

    // Form state
    const [formStudent, setFormStudent] = React.useState('');
    const [formClass, setFormClass] = React.useState('');
    const [formAmount, setFormAmount] = React.useState('');
    const [formStatus, setFormStatus] = React.useState<FeeRecord['status']>('Unpaid');
    const [formDueDate, setFormDueDate] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    // Filter records
    const filteredRecords = React.useMemo(() => {
        return records.filter(rec =>
            rec.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.class.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [records, searchQuery]);

    // Handle Record Payment
    const handleRecordPayment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formStudent || !formClass || !formAmount || !formDueDate) {
            toast.error('Validation Failed', {
                description: 'Please fill in all required fields.'
            });
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const newRecord: FeeRecord = {
                id: `FEE${String(records.length + 1).padStart(3, '0')}`,
                studentName: formStudent,
                class: formClass,
                amount: parseFloat(formAmount),
                status: formStatus,
                dueDate: formDueDate
            };

            setRecords([newRecord, ...records]);
            setLoading(false);
            setIsRecordModalOpen(false);

            // Reset
            setFormStudent('');
            setFormClass('');
            setFormAmount('');
            setFormStatus('Unpaid');
            setFormDueDate('');

            toast.success('Payment Record Updated!', {
                description: `Invoice for ${formStudent} (${formClass}) of $${formAmount} has been registered.`
            });
        }, 800);
    };

    // Helper for Status Badge styling
    const getStatusStyle = (status: FeeRecord['status']) => {
        switch (status) {
            case 'Paid':
                return 'bg-brandGreen/10 text-brandGreen border-brandGreen/35';
            case 'Unpaid':
                return 'bg-brandYellow/15 text-brandYellow border-brandYellow/35';
            case 'Overdue':
                return 'bg-brandPink/15 text-brandPink border-brandPink/35';
            default:
                return 'bg-cream text-brandBlack/60 border-brandBlack/20';
        }
    };

    return (
        <div className="space-y-6">
            {/* Top row with charts and stats summary */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Radial Chart */}
                <div className="md:col-span-1">
                    <OverviewRadialChart />
                </div>

                {/* Financial Summary Stat Card */}
                <div className="md:col-span-2 flex flex-col justify-between bg-white border-2 border-brandBlack rounded-2xl shadow-[4px_4px_0px_0px_rgba(13,14,20,1)] p-6">
                    <div>
                        <h3 className="text-base font-black text-brandBlack">Revenue Summary</h3>
                        <p className="text-[10px] font-bold text-brandBlack/50">Accounting metrics for this term</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 my-4">
                        <div className="p-3 border-2 border-brandBlack rounded-xl bg-brandGreen/5">
                            <span className="text-[10px] font-bold text-brandBlack/60 block">Fees Invoiced</span>
                            <span className="text-2xl font-black text-brandBlack block mt-1">$150,000</span>
                        </div>
                        <div className="p-3 border-2 border-brandBlack rounded-xl bg-brandPurple/5">
                            <span className="text-[10px] font-bold text-brandBlack/60 block">Actually Collected</span>
                            <span className="text-2xl font-black text-brandGreen block mt-1">$117,750</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-brandBlack/60 border-t border-brandBlack/10 pt-3">
                        <ShieldCheck className="h-4.5 w-4.5 text-brandGreen shrink-0" />
                        PCI-DSS compliant accounting space
                    </div>
                </div>
            </div>

            {/* Action controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border-2 border-brandBlack rounded-2xl shadow-[4px_4px_0px_0px_rgba(13,14,20,1)]">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-brandBlack/40" />
                    <Input
                        type="text"
                        placeholder="Search student Name, class..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 pl-9 pr-4 rounded-xl border-2 border-brandBlack bg-cream font-bold text-xs"
                    />
                </div>

                <Button
                    onClick={() => setIsRecordModalOpen(true)}
                    className="w-full sm:w-auto h-10 border-2 border-brandBlack bg-brandPurple text-white font-black rounded-xl shadow-[2px_2px_0px_0px_rgba(13,14,20,1)] hover:bg-brandPurple/90 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(13,14,20,1)] flex items-center justify-center gap-2"
                >
                    <Plus className="h-4.5 w-4.5" />
                    Record Payment
                </Button>
            </div>

            {/* Table */}
            <DashboardTableWrapper
                title="School Fees Ledger"
                description={`Showing ${filteredRecords.length} of ${records.length} billing rows.`}
            >
                <Table>
                    <TableHeader className="bg-cream/50 border-b border-brandBlack/15">
                        <TableRow>
                            <TableHead className="font-extrabold text-brandBlack py-4 pl-6">Receipt</TableHead>
                            <TableHead className="font-extrabold text-brandBlack py-4">Student Name</TableHead>
                            <TableHead className="font-extrabold text-brandBlack py-4">Class</TableHead>
                            <TableHead className="font-extrabold text-brandBlack py-4">Amount</TableHead>
                            <TableHead className="font-extrabold text-brandBlack py-4">Due Date</TableHead>
                            <TableHead className="font-extrabold text-brandBlack py-4 pr-6">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRecords.length > 0 ? (
                            filteredRecords.map((rec) => (
                                <TableRow key={rec.id} className="border-b border-brandBlack/10 hover:bg-cream/10">
                                    <TableCell className="font-mono text-xs font-bold text-brandBlack/60 py-4 pl-6">{rec.id}</TableCell>
                                    <TableCell className="font-black text-brandBlack py-4">{rec.studentName}</TableCell>
                                    <TableCell className="font-bold text-brandPurple py-4">{rec.class}</TableCell>
                                    <TableCell className="font-extrabold text-brandBlack py-4">${rec.amount.toLocaleString()}</TableCell>
                                    <TableCell className="font-bold text-brandBlack/60 py-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {rec.dueDate}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-4 pr-6">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${getStatusStyle(rec.status)}`}>
                                            {rec.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-brandBlack/40 font-bold">
                                    No records found matching "{searchQuery}"
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </DashboardTableWrapper>

            {/* Record Payment Modal */}
            <FormModal
                isOpen={isRecordModalOpen}
                onOpenChange={setIsRecordModalOpen}
                title="Record Fee Payment"
                description="Register a fee payment or allocate new tuition invoice."
                onSubmit={handleRecordPayment}
                submitText="Register Payment"
                loading={loading}
            >
                <div className="space-y-2">
                    <Label htmlFor="pay-name" className="text-xs font-black text-brandBlack">Student Full Name *</Label>
                    <Input
                        id="pay-name"
                        required
                        placeholder="e.g. Amina Bello"
                        value={formStudent}
                        onChange={(e) => setFormStudent(e.target.value)}
                        className="h-10 border-2 border-brandBlack rounded-xl text-xs font-bold bg-cream"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pay-class" className="text-xs font-black text-brandBlack">Class *</Label>
                        <select
                            id="pay-class"
                            required
                            value={formClass}
                            onChange={(e) => setFormClass(e.target.value)}
                            className="w-full h-10 px-3 border-2 border-brandBlack rounded-xl text-xs font-bold bg-cream outline-none"
                        >
                            <option value="">Select Level</option>
                            <option value="Grade 9-A">Grade 9-A</option>
                            <option value="Grade 10-A">Grade 10-A</option>
                            <option value="Grade 10-B">Grade 10-B</option>
                            <option value="Grade 11-A">Grade 11-A</option>
                            <option value="Grade 11-B">Grade 11-B</option>
                            <option value="Grade 12-A">Grade 12-A</option>
                            <option value="Grade 12-B">Grade 12-B</option>
                            <option value="Grade 12-C">Grade 12-C</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pay-amount" className="text-xs font-black text-brandBlack">Amount ($) *</Label>
                        <Input
                            id="pay-amount"
                            required
                            type="number"
                            placeholder="e.g. 1200"
                            value={formAmount}
                            onChange={(e) => setFormAmount(e.target.value)}
                            className="h-10 border-2 border-brandBlack rounded-xl text-xs font-bold bg-cream"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pay-due" className="text-xs font-black text-brandBlack">Due Date *</Label>
                        <Input
                            id="pay-due"
                            required
                            type="date"
                            value={formDueDate}
                            onChange={(e) => setFormDueDate(e.target.value)}
                            className="h-10 border-2 border-brandBlack rounded-xl text-xs font-bold bg-cream"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pay-status" className="text-xs font-black text-brandBlack">Status</Label>
                        <select
                            id="pay-status"
                            value={formStatus}
                            onChange={(e) => setFormStatus(e.target.value as any)}
                            className="w-full h-10 px-3 border-2 border-brandBlack rounded-xl text-xs font-bold bg-cream outline-none"
                        >
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                </div>
            </FormModal>
        </div>
    );
}
