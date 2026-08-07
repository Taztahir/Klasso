'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Assignment } from '@/lib/types';
import { FormModal } from '@/components/dashboard/FormModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Calendar, CheckSquare, Clock, BookOpen, Upload, Eye, Pencil, Trash2, Filter, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

type AsmStatus = Assignment['status'];
const subjects = ['Mathematics', 'Biology', 'Chemistry', 'Physics', 'English Literature', 'History', 'Computer Science'];
const classes = ['Grade 9-A', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B', 'Grade 12-C'];
const statuses: AsmStatus[] = ['Upcoming', 'Submitted', 'Graded'];
const spark = (vals: number[]) => vals.map((v, i) => ({ i, v }));

function StatCard({ title, value, sub, data, color }: { title: string; value: number; sub: string; data: { i: number; v: number }[]; color: string }) {
    return <div className="relative flex flex-col justify-between bg-white border border-gray-100 rounded-3xl shadow-sm p-5 overflow-hidden h-[152px]"><div className="flex items-start justify-between gap-2"><div className="flex flex-col gap-1 min-w-0"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</span><span className="text-3xl font-black text-brandBlack leading-none mt-1">{value}</span><span className="text-[11px] font-semibold text-gray-400 mt-1 truncate">{sub}</span></div><div className="h-12 w-20 shrink-0"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></div></div>;
}

function StatusBadge({ status }: { status: AsmStatus }) {
    const styles: Record<AsmStatus, string> = { Upcoming: 'bg-amber-50 text-amber-600 border-amber-100', Submitted: 'bg-[#F4F4FF] text-brandPurple border-indigo-100', Graded: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
    const icons: Record<AsmStatus, React.ElementType> = { Upcoming: Clock, Submitted: CheckSquare, Graded: BookOpen };
    const Icon = icons[status];
    return <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${styles[status]}`}><Icon className="h-3 w-3" />{status}</span>;
}

function AssignmentTableSkeleton() {
    return <div className="flex flex-col gap-3 p-6">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="flex items-center gap-4"><Skeleton className="size-8" /><Skeleton className="h-5 flex-1" /><Skeleton className="h-5 w-28" /><Skeleton className="h-5 w-24" /><Skeleton className="h-5 w-28" /><Skeleton className="h-5 w-20" /></div>)}</div>;
}

export default function AssignmentsPage() {
    const { user, profile } = useAuth();
    const supabase = createClient();
    const [assignments, setAssignments] = React.useState<Assignment[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [fetchError, setFetchError] = React.useState<string | null>(null);
    const [search, setSearch] = React.useState('');
    const [subjectFilter, setSubject] = React.useState('all');
    const [classFilter, setClass] = React.useState('all');
    const [statusFilter, setStatus] = React.useState('all');
    const [isOpen, setIsOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [fTitle, setFTitle] = React.useState('');
    const [fSubject, setFSubject] = React.useState('');
    const [fClass, setFClass] = React.useState('');
    const [fDue, setFDue] = React.useState('');
    const [fStatus, setFStatus] = React.useState<AsmStatus>('Upcoming');
    const [saving, setSaving] = React.useState(false);

    const fetchAssignments = React.useCallback(async () => {
        if (!profile?.school_id) { setLoading(false); return; }
        setLoading(true); setFetchError(null);
        const { data, error } = await supabase.from('assignments').select('*').eq('school_id', profile.school_id).order('due_date', { ascending: true });
        if (error) { setFetchError(error.message || 'Failed to load assignments.'); setAssignments([]); } else {
            setAssignments((data ?? []).map((row: any) => ({ id: row.id, title: row.title, subject: row.subject, class: row.class ?? row.class_grade ?? '', dueDate: row.due_date ?? row.dueDate, status: row.status as AsmStatus })));
        }
        setLoading(false);
    }, [profile?.school_id, supabase]);

    React.useEffect(() => { void fetchAssignments(); }, [fetchAssignments]);

    const resetForm = () => { setFTitle(''); setFSubject(''); setFClass(''); setFDue(''); setFStatus('Upcoming'); setEditingId(null); };
    const openCreate = () => { resetForm(); setIsOpen(true); };
    const openEdit = (assignment: Assignment) => { setEditingId(assignment.id); setFTitle(assignment.title); setFSubject(assignment.subject); setFClass(assignment.class); setFDue(assignment.dueDate); setFStatus(assignment.status); setIsOpen(true); };

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!fTitle || !fSubject || !fClass || !fDue) { toast.error('Fill in all required fields.'); return; }
        if (!profile?.school_id || !user) { toast.error('Your school session is not ready. Please sign in again.'); return; }
        setSaving(true);
        try {
            const payload = { title: fTitle.trim(), subject: fSubject, class: fClass, due_date: fDue, status: fStatus };
            const result = editingId
                ? await supabase.from('assignments').update(payload).eq('id', editingId).eq('school_id', profile.school_id)
                : await supabase.from('assignments').insert({ ...payload, school_id: profile.school_id, created_by: user.id });
            if (result.error) throw result.error;
            toast.success(editingId ? 'Assignment updated.' : 'Assignment created.');
            setIsOpen(false); resetForm(); await fetchAssignments();
        } catch (error: any) { toast.error('Failed to save assignment', { description: error.message || 'Please try again.' }); } finally { setSaving(false); }
    };

    const handleDelete = async (assignment: Assignment) => {
        if (!window.confirm(`Delete “${assignment.title}”?`)) return;
        const { error } = await supabase.from('assignments').delete().eq('id', assignment.id).eq('school_id', profile?.school_id ?? '');
        if (error) toast.error('Failed to delete assignment', { description: error.message });
        else { toast.success('Assignment deleted.'); await fetchAssignments(); }
    };

    const handleStatusToggle = async (assignment: Assignment) => {
        const nextStatus: AsmStatus = assignment.status === 'Upcoming' ? 'Submitted' : assignment.status === 'Submitted' ? 'Graded' : 'Upcoming';
        const { error } = await supabase.from('assignments').update({ status: nextStatus }).eq('id', assignment.id).eq('school_id', profile?.school_id ?? '');
        if (error) toast.error('Failed to update assignment status', { description: error.message });
        else { toast.success(`Marked as ${nextStatus}.`); await fetchAssignments(); }
    };

    const filtered = React.useMemo(() => assignments.filter(a => { const q = search.toLowerCase(); return (a.title?.toLowerCase().includes(q) || a.subject?.toLowerCase().includes(q) || a.class?.toLowerCase().includes(q)) && (subjectFilter === 'all' || a.subject === subjectFilter) && (classFilter === 'all' || a.class === classFilter) && (statusFilter === 'all' || a.status === statusFilter); }), [assignments, search, subjectFilter, classFilter, statusFilter]);
    const total = assignments.length, upcoming = assignments.filter(a => a.status === 'Upcoming').length, submitted = assignments.filter(a => a.status === 'Submitted').length, graded = assignments.filter(a => a.status === 'Graded').length;

    return <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-5"><div><h2 className="text-2xl font-black text-brandBlack tracking-tight">Assignments</h2><p className="text-xs font-bold text-gray-400 mt-1.5">Create and manage assignments across classes and subjects.</p></div><div className="flex items-center gap-3 self-start md:self-auto"><button onClick={() => toast.info('Export coming soon.')} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm cursor-pointer"><Upload className="h-4 w-4 text-gray-400 rotate-180" />Export</button><button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brandPurple text-white hover:bg-brandPurple/90 text-xs font-bold shadow-sm cursor-pointer"><Plus className="h-4 w-4" />Create Assignment</button></div></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><StatCard title="Total Assignments" value={total} sub="This term" data={spark([10, 12, 14, 16, 18, 20, total])} color="#7C3AED" /><StatCard title="Upcoming" value={upcoming} sub="Not yet due" data={spark([4, 5, 6, 7, 8, 9, upcoming])} color="#D97706" /><StatCard title="Submitted" value={submitted} sub="Awaiting grading" data={spark([2, 3, 4, 5, 5, 6, submitted])} color="#2563EB" /><StatCard title="Graded" value={graded} sub="Completed & scored" data={spark([1, 1, 2, 2, 3, 3, graded])} color="#059669" /></div>
        <div className="flex flex-col xl:flex-row items-stretch xl:items-end justify-between gap-4 p-4 border border-gray-100 bg-white rounded-3xl shadow-sm"><div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-end gap-4 flex-wrap"><div className="relative flex-1 min-w-[220px]"><input type="text" placeholder="Search assignments, class, subject..." value={search} onChange={e => setSearch(e.target.value)} className="h-10 w-full rounded-2xl border border-gray-200 pl-4 pr-10 text-xs font-semibold text-brandBlack placeholder-gray-400 bg-white outline-none focus:border-brandPurple" /><Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /></div>{[{ label: 'Subject', val: subjectFilter, set: setSubject, opts: subjects }, { label: 'Class', val: classFilter, set: setClass, opts: classes }, { label: 'Status', val: statusFilter, set: setStatus, opts: statuses }].map(f => <div key={f.label} className="flex flex-col gap-1.5"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide pl-1">{f.label}</span><select value={f.val} onChange={e => f.set(e.target.value)} className="h-10 min-w-[120px] px-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 bg-white outline-none focus:border-brandPurple"><option value="all">All {f.label}s</option>{f.opts.map(o => <option key={o}>{o}</option>)}</select></div>)}</div><button onClick={() => { setSearch(''); setSubject('all'); setClass('all'); setStatus('all'); }} className="h-10 px-4 rounded-2xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"><Filter className="h-4 w-4 text-gray-400" />Clear filters</button></div>
        <div className="border border-gray-100 bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col"><Table><TableHeader className="bg-slate-50/50 border-b border-gray-100"><TableRow><TableHead className="w-10 pl-6 py-4" /><TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Title</TableHead><TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Subject</TableHead><TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Class</TableHead><TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Due Date</TableHead><TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Status</TableHead><TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4 text-right pr-6">Actions</TableHead></TableRow></TableHeader><TableBody>{loading ? <TableRow><TableCell colSpan={7}><AssignmentTableSkeleton /></TableCell></TableRow> : fetchError ? <TableRow><TableCell colSpan={7} className="py-12 text-center"><p className="text-xs font-bold text-rose-600">{fetchError}</p><button onClick={() => void fetchAssignments()} className="mt-3 text-xs font-bold text-brandPurple underline">Try again</button></TableCell></TableRow> : filtered.length ? filtered.map(a => <TableRow key={a.id} className="border-b border-gray-100 hover:bg-slate-50/30"><TableCell className="pl-6 py-3.5"><input type="checkbox" className="rounded border-gray-300" aria-label={`Select ${a.title}`} /></TableCell><TableCell className="py-3.5"><div className="flex items-center gap-2.5"><div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0"><ClipboardList className="h-4 w-4 text-brandPurple" /></div><span className="text-xs font-bold text-brandBlack">{a.title}</span></div></TableCell><TableCell className="text-xs font-bold text-brandPurple py-3.5">{a.subject}</TableCell><TableCell className="py-3.5"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-50 border border-gray-100 text-[10px] font-bold text-gray-600">{a.class}</span></TableCell><TableCell className="py-3.5"><span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500"><Calendar className="h-3.5 w-3.5 text-gray-400" />{a.dueDate}</span></TableCell><TableCell className="py-3.5"><button onClick={() => void handleStatusToggle(a)} title="Advance status" className="cursor-pointer"><StatusBadge status={a.status} /></button></TableCell><TableCell className="py-3.5 text-right pr-6"><div className="inline-flex items-center gap-2"><button onClick={() => toast.info(`Viewing: ${a.title}`)} aria-label={`View ${a.title}`} className="p-1 rounded-lg border border-gray-200 hover:bg-slate-100 text-gray-500 cursor-pointer shadow-sm"><Eye className="h-3.5 w-3.5" /></button><button onClick={() => openEdit(a)} aria-label={`Edit ${a.title}`} className="p-1 rounded-lg border border-gray-200 hover:bg-slate-100 text-gray-500 cursor-pointer shadow-sm"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => void handleDelete(a)} aria-label={`Delete ${a.title}`} className="p-1 rounded-lg border border-gray-200 hover:bg-rose-50 text-gray-500 hover:text-rose-600 cursor-pointer shadow-sm"><Trash2 className="h-3.5 w-3.5" /></button></div></TableCell></TableRow>) : <TableRow><TableCell colSpan={7} className="text-center py-10 text-gray-400 font-bold text-xs">No assignments found.</TableCell></TableRow>}</TableBody></Table><div className="flex items-center justify-between gap-4 p-5 border-t border-gray-100"><span className="text-xs font-bold text-gray-400">Showing {filtered.length} of {total} assignments</span></div></div>
        <FormModal isOpen={isOpen} onOpenChange={open => { setIsOpen(open); if (!open) resetForm(); }} title={editingId ? 'Edit Assignment' : 'Create Assignment'} description="Assign tasks to a class or group." onSubmit={handleSave} submitText={editingId ? 'Save Changes' : 'Create Assignment'} loading={saving}><div className="space-y-4"><div className="space-y-2"><Label className="text-xs font-bold text-brandBlack">Title *</Label><Input placeholder="e.g. Periodic Table Essay" value={fTitle} onChange={e => setFTitle(e.target.value)} className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack" /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label className="text-xs font-bold text-brandBlack">Subject *</Label><select value={fSubject} onChange={e => setFSubject(e.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack outline-none"><option value="">Select Subject</option>{subjects.map(o => <option key={o}>{o}</option>)}</select></div><div className="space-y-2"><Label className="text-xs font-bold text-brandBlack">Class *</Label><select value={fClass} onChange={e => setFClass(e.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack outline-none"><option value="">Select Level</option>{classes.map(o => <option key={o}>{o}</option>)}</select></div></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label className="text-xs font-bold text-brandBlack">Due Date *</Label><Input type="date" value={fDue} onChange={e => setFDue(e.target.value)} className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack" /></div><div className="space-y-2"><Label className="text-xs font-bold text-brandBlack">Status</Label><select value={fStatus} onChange={e => setFStatus(e.target.value as AsmStatus)} className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack outline-none">{statuses.map(status => <option key={status}>{status}</option>)}</select></div></div></div></FormModal>
    </div>;
}
