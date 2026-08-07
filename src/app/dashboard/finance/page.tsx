'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { FormModal } from '@/components/dashboard/FormModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AlertCircle, Calendar, CheckCircle2, ChevronDown, CreditCard, FileText, MoreVertical, Plus, Search, Wallet } from 'lucide-react';

type FeeStatus = 'Paid' | 'Unpaid' | 'Overdue';
type FeeRow = { id: string; studentName: string; className: string; amount: number; status: FeeStatus; dueDate: string; paidAt: string | null; description: string; createdAt: string };

const money = (value: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
const dateLabel = (value: string) => value ? new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(new Date(`${value}T00:00:00`)) : '—';
const today = () => new Date().toISOString().slice(0, 10);

function TableSkeleton() {
  return <div className="flex flex-col gap-4 p-6">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="flex items-center gap-4"><Skeleton className="size-9" /><Skeleton className="h-5 flex-1" /><Skeleton className="h-5 w-24" /><Skeleton className="h-5 w-24" /><Skeleton className="h-5 w-20" /></div>)}</div>;
}

function StatusBadge({ status }: { status: FeeStatus }) {
  const styles: Record<FeeStatus, string> = { Paid: 'bg-emerald-50 text-emerald-700 border-emerald-100', Unpaid: 'bg-amber-50 text-amber-700 border-amber-100', Overdue: 'bg-rose-50 text-rose-700 border-rose-100' };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black ${styles[status]}`}>{status}</span>;
}

export default function FinancePage() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const [records, setRecords] = React.useState<FeeRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [startDate, setStartDate] = React.useState(`${new Date().getFullYear()}-01-01`);
  const [endDate, setEndDate] = React.useState(today());
  const [statusFilter, setStatusFilter] = React.useState<'all' | FeeStatus>('all');
  const [search, setSearch] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [studentName, setStudentName] = React.useState('');
  const [className, setClassName] = React.useState('');
  const [description, setDescription] = React.useState('Tuition Fee');
  const [amount, setAmount] = React.useState('');
  const [dueDate, setDueDate] = React.useState(today());

  const fetchRecords = React.useCallback(async () => {
    if (!profile?.school_id) { setLoading(false); return; }
    setLoading(true); setFetchError(null);
    let query = supabase.from('fee_records').select('*').eq('school_id', profile.school_id).gte('due_date', startDate).lte('due_date', endDate).order('due_date', { ascending: false });
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    const { data, error } = await query;
    if (error) { setRecords([]); setFetchError(error.message || 'Failed to load fee records.'); }
    else setRecords((data ?? []).map((row: any) => ({ id: row.id, studentName: row.student_name ?? row.studentName ?? row.student?.name ?? 'Unknown student', className: row.class ?? row.class_grade ?? '—', amount: Number(row.amount ?? 0), status: (row.status ?? 'Unpaid') as FeeStatus, dueDate: row.due_date ?? row.dueDate ?? '', paidAt: row.paid_at ?? null, description: row.description ?? row.fee_type ?? 'Fee charge', createdAt: row.created_at ?? '' })));
    setLoading(false);
  }, [endDate, profile?.school_id, startDate, statusFilter, supabase]);

  React.useEffect(() => { void fetchRecords(); }, [fetchRecords]);

  const visibleRecords = React.useMemo(() => {
    const term = search.toLowerCase();
    return records.filter(record => `${record.studentName} ${record.className} ${record.description}`.toLowerCase().includes(term));
  }, [records, search]);
  const collected = records.filter(record => record.status === 'Paid').reduce((sum, record) => sum + record.amount, 0);
  const outstanding = records.filter(record => record.status !== 'Paid').reduce((sum, record) => sum + record.amount, 0);
  const overdue = records.filter(record => record.status === 'Overdue').reduce((sum, record) => sum + record.amount, 0);
  const total = collected + outstanding;
  const collectionRate = total ? Math.round((collected / total) * 1000) / 10 : 0;

  const resetForm = () => { setStudentName(''); setClassName(''); setDescription('Tuition Fee'); setAmount(''); setDueDate(today()); };
  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!profile?.school_id || !user) { toast.error('Your school session is not ready.'); return; }
    if (!studentName.trim() || !numericAmount || numericAmount <= 0 || !dueDate) { toast.error('Enter a student, positive amount, and due date.'); return; }
    setSaving(true);
    const { error } = await supabase.from('fee_records').insert({ school_id: profile.school_id, created_by: user.id, student_name: studentName.trim(), class: className.trim(), description: description.trim() || 'Fee charge', amount: numericAmount, due_date: dueDate, status: 'Unpaid', paid_at: null });
    if (error) toast.error('Failed to create fee record', { description: error.message });
    else { toast.success('Invoice created.'); setIsOpen(false); resetForm(); await fetchRecords(); }
    setSaving(false);
  };

  const recordPayment = async (record: FeeRow) => {
    if (!profile?.school_id) return;
    const { error } = await supabase.from('fee_records').update({ status: 'Paid', paid_at: new Date().toISOString() }).eq('id', record.id).eq('school_id', profile.school_id);
    if (error) toast.error('Failed to record payment', { description: error.message }); else { toast.success('Payment recorded.'); await fetchRecords(); }
  };

  const updateStatus = async (record: FeeRow, status: FeeStatus) => {
    if (!profile?.school_id) return;
    const { error } = await supabase.from('fee_records').update({ status, paid_at: status === 'Paid' ? new Date().toISOString() : null }).eq('id', record.id).eq('school_id', profile.school_id);
    if (error) toast.error('Failed to update status', { description: error.message }); else { toast.success(`Marked ${status}.`); await fetchRecords(); }
  };

  const metrics: { label: string; value: string; Icon: React.ElementType }[] = [
    { label: 'Collected', value: money(collected), Icon: CheckCircle2 },
    { label: 'Outstanding', value: money(outstanding), Icon: Wallet },
    { label: 'Overdue', value: money(overdue), Icon: AlertCircle },
    { label: 'Collection Rate', value: `${collectionRate}%`, Icon: CreditCard },
  ];

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-2xl bg-brandPurple/10 text-brandPurple"><Wallet className="size-5" /></div><div><h1 className="text-2xl font-black text-brandBlack">Finance</h1><p className="mt-1 text-xs font-bold text-gray-400">Track fee collection and outstanding school charges.</p></div></div><button onClick={() => { resetForm(); setIsOpen(true); }} className="flex items-center justify-center gap-2 rounded-2xl bg-brandPurple px-4 py-2.5 text-xs font-bold text-white shadow-sm"><Plus className="size-4" /> New Invoice</button></div>

    <div className="flex flex-col gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-end"><div className="flex flex-col gap-1.5"><label className="pl-1 text-[10px] font-black uppercase text-gray-400">From</label><div className="relative"><Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" /><input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} className="h-10 rounded-2xl border border-gray-200 pl-10 pr-3 text-xs font-bold text-gray-700" /></div></div><div className="flex flex-col gap-1.5"><label className="pl-1 text-[10px] font-black uppercase text-gray-400">To</label><div className="relative"><Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" /><input type="date" value={endDate} onChange={event => setEndDate(event.target.value)} className="h-10 rounded-2xl border border-gray-200 pl-10 pr-3 text-xs font-bold text-gray-700" /></div></div><div className="flex flex-col gap-1.5"><label className="pl-1 text-[10px] font-black uppercase text-gray-400">Status</label><select value={statusFilter} onChange={event => setStatusFilter(event.target.value as 'all' | FeeStatus)} className="h-10 rounded-2xl border border-gray-200 px-3 text-xs font-bold text-gray-700"><option value="all">All statuses</option><option value="Paid">Paid</option><option value="Unpaid">Unpaid</option><option value="Overdue">Overdue</option></select></div><div className="relative min-w-52 flex-1"><Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search student or fee..." className="h-10 w-full rounded-2xl border border-gray-200 px-3 pr-10 text-xs font-semibold" /></div></div>

    {fetchError && <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700"><span>{fetchError}</span><button onClick={() => void fetchRecords()} className="underline">Try again</button></div>}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(({ label, value, Icon }) => <div key={label} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-xs font-bold text-gray-400"><span className="rounded-xl bg-brandPurple/10 p-2 text-brandPurple"><Icon className="size-4" /></span>{label}</div><p className="mt-4 text-2xl font-black text-brandBlack">{value}</p><p className="mt-1 text-[10px] font-bold text-gray-400">{records.length} records in selected range</p></div>)}</div>

    <div className="rounded-3xl border border-gray-100 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-gray-50 p-6"><div><h2 className="text-base font-black text-brandBlack">Fee Records</h2><p className="mt-1 text-[10px] font-bold text-gray-400">Live invoices and manually recorded payments.</p></div><MoreVertical className="size-4 text-gray-400" /></div>{loading ? <TableSkeleton /> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-wider text-gray-400"><tr><th className="px-6 py-4">Student</th><th className="py-4">Description</th><th className="py-4">Due date</th><th className="py-4">Amount</th><th className="py-4">Status</th><th className="py-4 pr-6 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-600">{visibleRecords.length ? visibleRecords.map(record => <tr key={record.id} className="hover:bg-slate-50/40"><td className="px-6 py-4"><span className="text-brandBlack">{record.studentName}</span><span className="mt-1 block text-[10px] text-gray-400">{record.className || 'No class'}</span></td><td className="py-4">{record.description}</td><td className="py-4 text-gray-500">{dateLabel(record.dueDate)}</td><td className="py-4 text-brandBlack">{money(record.amount)}</td><td className="py-4"><StatusBadge status={record.status} /></td><td className="py-4 pr-6 text-right"><div className="flex justify-end gap-2">{record.status !== 'Paid' && <button onClick={() => void recordPayment(record)} className="rounded-xl border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-black text-emerald-700">Record payment</button>}<select aria-label={`Update status for ${record.studentName}`} value={record.status} onChange={event => void updateStatus(record, event.target.value as FeeStatus)} className="rounded-xl border border-gray-200 bg-white px-2 py-1.5 text-[10px] font-black"><option>Paid</option><option>Unpaid</option><option>Overdue</option></select></div></td></tr>) : <tr><td colSpan={6} className="px-6 py-14 text-center text-xs font-bold text-gray-400">No fee records match the selected filters.</td></tr>}</tbody></table></div>}</div>

    <FormModal isOpen={isOpen} onOpenChange={open => { setIsOpen(open); if (!open) resetForm(); }} title="Create invoice" description="Add a fee charge to this school’s ledger." onSubmit={handleCreate} submitText="Create invoice" loading={saving}><div className="flex flex-col gap-4"><div className="flex flex-col gap-2"><Label>Student name *</Label><Input value={studentName} onChange={event => setStudentName(event.target.value)} placeholder="e.g. Amina Bello" /></div><div className="grid grid-cols-2 gap-4"><div className="flex flex-col gap-2"><Label>Class</Label><Input value={className} onChange={event => setClassName(event.target.value)} placeholder="e.g. Grade 10-A" /></div><div className="flex flex-col gap-2"><Label>Amount *</Label><Input type="number" min="1" value={amount} onChange={event => setAmount(event.target.value)} placeholder="125000" /></div></div><div className="flex flex-col gap-2"><Label>Description</Label><Input value={description} onChange={event => setDescription(event.target.value)} /></div><div className="flex flex-col gap-2"><Label>Due date *</Label><Input type="date" value={dueDate} onChange={event => setDueDate(event.target.value)} /></div></div></FormModal>
  </div>;
}
