'use client';

import * as React from 'react';
import { FormModal } from '@/components/dashboard/FormModal';
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
import {
    Plus,
    Search,
    Upload,
    Eye,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Filter,
    Users,
    GraduationCap,
    Shield,
    Building2,
    BookOpen,
    FlaskConical,
    Calculator,
    Monitor,
    Library,
    Landmark,
} from 'lucide-react';
import { toast } from 'sonner';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type StaffStatus = 'Active' | 'On Leave' | 'Inactive';
type StaffRole = 'Administrator' | 'Teacher' | 'Support Staff';

interface StaffRecord {
    id: string;
    name: string;
    title: string;         // e.g. "Head of Mathematics"
    avatar: string;
    role: StaffRole;
    department: string;
    departmentIcon: React.ElementType;
    email: string;
    phone: string;
    status: StaffStatus;
}

/* ─────────────────────────────────────────────
   Mock data — 7 rows matching the mockup
───────────────────────────────────────────── */
const initialStaff: StaffRecord[] = [
    {
        id: 'STF001',
        name: 'Dr. Sarah Jenkins',
        title: 'Head of Mathematics',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
        role: 'Administrator',
        department: 'Administration',
        departmentIcon: Landmark,
        email: 's.jenkins@klasso.edu.ng',
        phone: '+234 806 123 4567',
        status: 'Active',
    },
    {
        id: 'STF002',
        name: 'Mr. Kamal Tahir',
        title: 'Mathematics Teacher',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
        role: 'Teacher',
        department: 'Mathematics',
        departmentIcon: Calculator,
        email: 'k.tahir@klasso.edu.ng',
        phone: '+234 803 987 6543',
        status: 'Active',
    },
    {
        id: 'STF003',
        name: 'Mrs. Aisha Lawal',
        title: 'English Teacher',
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&h=80&q=80',
        role: 'Teacher',
        department: 'English Language',
        departmentIcon: BookOpen,
        email: 'a.lawal@klasso.edu.ng',
        phone: '+234 809 234 5678',
        status: 'Active',
    },
    {
        id: 'STF004',
        name: 'Mr. Daniel Johnson',
        title: 'Physics Teacher',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&h=80&q=80',
        role: 'Teacher',
        department: 'Sciences',
        departmentIcon: FlaskConical,
        email: 'd.johnson@klasso.edu.ng',
        phone: '+234 801 345 6789',
        status: 'On Leave',
    },
    {
        id: 'STF005',
        name: 'Mrs. Grace Okafor',
        title: 'Primary School Teacher',
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=80&h=80&q=80',
        role: 'Teacher',
        department: 'Primary School',
        departmentIcon: GraduationCap,
        email: 'g.okafor@klasso.edu.ng',
        phone: '+234 802 456 7890',
        status: 'Active',
    },
    {
        id: 'STF006',
        name: 'Mr. Usman Yusuf',
        title: 'ICT Instructor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
        role: 'Support Staff',
        department: 'ICT',
        departmentIcon: Monitor,
        email: 'u.yusuf@klasso.edu.ng',
        phone: '+234 805 678 9012',
        status: 'Active',
    },
    {
        id: 'STF007',
        name: 'Mrs. Fatima Bello',
        title: 'Librarian',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
        role: 'Support Staff',
        department: 'Library',
        departmentIcon: Library,
        email: 'f.bello@klasso.edu.ng',
        phone: '+234 803 210 9876',
        status: 'Inactive',
    },
];

/* ─────────────────────────────────────────────
   Mini sparkline data for stat cards
───────────────────────────────────────────── */
const spark = (vals: number[]) => vals.map((v, i) => ({ i, v }));
const staffSpark = spark([30, 35, 32, 38, 40, 42, 48]);
const teacherSpark = spark([24, 26, 27, 29, 32, 35, 38]);
const adminSpark = spark([6, 7, 7, 8, 9, 10, 10]);
const deptSpark = spark([5, 5, 6, 6, 6, 7, 7]);

/* ─────────────────────────────────────────────
   Stat Card with embedded sparkline
───────────────────────────────────────────── */
function StaffStatCard({
    title,
    value,
    sub,
    trend,
    trendDir = 'up',
    trendSub,
    sparkData,
    color,
}: {
    title: string;
    value: string | number;
    sub: string;
    trend?: string;
    trendDir?: 'up' | 'down' | 'flat';
    trendSub?: string;
    sparkData: { i: number; v: number }[];
    color: string; // stroke colour for sparkline
}) {
    return (
        <div className="relative flex flex-col justify-between bg-white border border-gray-100 rounded-3xl shadow-sm p-5 overflow-hidden h-[160px]">
            <div className="flex items-start justify-between gap-2 z-10">
                <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">{title}</span>
                    <span className="text-3xl font-black text-brandBlack leading-none mt-1">{value}</span>
                    <span className="text-[11px] font-semibold text-gray-400 mt-1 truncate">{sub}</span>
                </div>
                {/* Mini Sparkline */}
                <div className="h-14 w-24 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparkData}>
                            <Line
                                type="monotone"
                                dataKey="v"
                                stroke={color}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Trend badge row */}
            {trend && (
                <div className="flex items-center gap-2 mt-2 z-10">
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${trendDir === 'up' ? 'bg-emerald-50 text-emerald-700' :
                        trendDir === 'down' ? 'bg-rose-50 text-rose-600' :
                            'bg-gray-50 text-gray-500'
                        }`}>
                        {trendDir === 'up' ? '↑' : trendDir === 'down' ? '↓' : '—'} {trend}
                    </span>
                    {trendSub && <span className="text-[10px] font-semibold text-gray-400">{trendSub}</span>}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Role badge
───────────────────────────────────────────── */
function RoleBadge({ role }: { role: StaffRole }) {
    const styles: Record<StaffRole, string> = {
        'Administrator': 'bg-[#F4F4FF] text-brandPurple border-indigo-100',
        'Teacher': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Support Staff': 'bg-[#FFF5F2] text-brandPink border-rose-100',
    };
    return (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${styles[role]}`}>
            {role}
        </span>
    );
}

/* ─────────────────────────────────────────────
   Status badge
───────────────────────────────────────────── */
function StatusBadge({ status }: { status: StaffStatus }) {
    const dot: Record<StaffStatus, string> = {
        'Active': 'bg-emerald-500',
        'On Leave': 'bg-amber-400',
        'Inactive': 'bg-rose-500',
    };
    const txt: Record<StaffStatus, string> = {
        'Active': 'text-emerald-700',
        'On Leave': 'text-amber-600',
        'Inactive': 'text-rose-600',
    };
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${txt[status]}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dot[status]}`} />
            {status}
        </span>
    );
}

/* ─────────────────────────────────────────────
   Page Component
───────────────────────────────────────────── */
export default function StaffPage() {
    const [staff, setStaff] = React.useState<StaffRecord[]>(initialStaff);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [deptFilter, setDeptFilter] = React.useState('all');
    const [roleFilter, setRoleFilter] = React.useState('all');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

    // Form state
    const [formName, setFormName] = React.useState('');
    const [formTitle, setFormTitle] = React.useState('');
    const [formRole, setFormRole] = React.useState<StaffRole>('Teacher');
    const [formDept, setFormDept] = React.useState('Mathematics');
    const [formEmail, setFormEmail] = React.useState('');
    const [formPhone, setFormPhone] = React.useState('');
    const [formStatus, setFormStatus] = React.useState<StaffStatus>('Active');
    const [saving, setSaving] = React.useState(false);

    /* Filter */
    const filtered = React.useMemo(() => {
        return staff.filter(m => {
            const q = searchQuery.toLowerCase();
            const matchSearch =
                m.name.toLowerCase().includes(q) ||
                m.email.toLowerCase().includes(q) ||
                m.phone.toLowerCase().includes(q);
            const matchDept = deptFilter === 'all' || m.department === deptFilter;
            const matchRole = roleFilter === 'all' || m.role === roleFilter;
            const matchStatus = statusFilter === 'all' || m.status === statusFilter;
            return matchSearch && matchDept && matchRole && matchStatus;
        });
    }, [staff, searchQuery, deptFilter, roleFilter, statusFilter]);

    /* Add staff handler */
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName || !formEmail || !formPhone) {
            toast.error('Fill in all required fields.');
            return;
        }
        setSaving(true);
        setTimeout(() => {
            const rec: StaffRecord = {
                id: `STF${String(staff.length + 1).padStart(3, '0')}`,
                name: formName,
                title: formTitle || formRole,
                avatar: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80`,
                role: formRole,
                department: formDept,
                departmentIcon: Building2,
                email: formEmail,
                phone: formPhone,
                status: formStatus,
            };
            setStaff([rec, ...staff]);
            setSaving(false);
            setIsAddModalOpen(false);
            setFormName(''); setFormTitle(''); setFormEmail(''); setFormPhone('');
            toast.success('Staff member registered!', { description: `${formName} added as ${formRole}.` });
        }, 600);
    };

    return (
        <div className="space-y-8">

            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-5">
                {/* <div>
                    <h2 className="text-2xl font-black text-brandBlack tracking-tight">Staff / Teachers</h2>
                    <p className="text-xs font-bold text-gray-400 mt-1.5">Manage school staff, view details, roles and performance.</p>
                </div> */}
                <div className="flex items-center gap-3 self-start md:self-auto">
                    <button
                        onClick={() => toast.info('Export functionality is coming soon.')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-xs font-bold text-gray-700 shadow-sm cursor-pointer"
                    >
                        <Upload className="h-4 w-4 text-gray-400 rotate-180" />
                        Export Staff
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brandPurple text-white hover:bg-brandPurple/90 transition-all text-xs font-bold shadow-sm cursor-pointer"
                    >
                        <Plus className="h-4.5 w-4.5" />
                        Add New Staff
                    </button>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <StaffStatCard
                    title="Total Staff"
                    value="48"
                    sub="All staff members"
                    trend="6.7%"
                    trendDir="up"
                    trendSub="vs last term"
                    sparkData={staffSpark}
                    color="#1E3A5F"
                />
                <StaffStatCard
                    title="Teachers"
                    value="38"
                    sub="Teaching staff"
                    trend="5.3%"
                    trendDir="up"
                    trendSub="vs last term"
                    sparkData={teacherSpark}
                    color="#2A8C8C"
                />
                <StaffStatCard
                    title="Administrators"
                    value="10"
                    sub="Admin & management"
                    trend="3.1%"
                    trendDir="up"
                    trendSub="vs last term"
                    sparkData={adminSpark}
                    color="#E8A838"
                />
                <StaffStatCard
                    title="Departments"
                    value="7"
                    sub="Active departments"
                    trendSub="— No change"
                    sparkData={deptSpark}
                    color="#A78BFA"
                />
            </div>

            {/* ── Filter Bar ── */}
            <div className="flex flex-col xl:flex-row items-stretch xl:items-end justify-between gap-4 p-4 border border-gray-100 bg-white rounded-3xl shadow-sm">
                <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-end gap-4 flex-wrap">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[240px]">
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="h-10 w-full rounded-2xl border border-gray-200 pl-4 pr-10 text-xs font-semibold text-brandBlack placeholder-gray-400 bg-white outline-none focus:border-brandPurple focus:ring-1 focus:ring-brandPurple"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>

                    {/* Department */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide pl-1">Department</span>
                        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
                            className="h-10 min-w-[140px] px-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 bg-white outline-none focus:border-brandPurple">
                            <option value="all">All Departments</option>
                            <option value="Administration">Administration</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="English Language">English Language</option>
                            <option value="Sciences">Sciences</option>
                            <option value="Primary School">Primary School</option>
                            <option value="ICT">ICT</option>
                            <option value="Library">Library</option>
                        </select>
                    </div>

                    {/* Role */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide pl-1">Role</span>
                        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                            className="h-10 min-w-[120px] px-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 bg-white outline-none focus:border-brandPurple">
                            <option value="all">All Roles</option>
                            <option value="Administrator">Administrator</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Support Staff">Support Staff</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide pl-1">Status</span>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="h-10 min-w-[110px] px-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 bg-white outline-none focus:border-brandPurple">
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={() => { setDeptFilter('all'); setRoleFilter('all'); setStatusFilter('all'); setSearchQuery(''); toast.success('Filters cleared.'); }}
                    className="h-10 px-4 rounded-2xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-3 xl:mt-0 xl:self-end"
                >
                    <Filter className="h-4 w-4 text-gray-400" />
                    Filter
                </button>
            </div>

            {/* ── Staff Table ── */}
            <div className="border border-gray-100 bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col">
                <Table>
                    <TableHeader className="bg-slate-50/50 border-b border-gray-100">
                        <TableRow>
                            <TableHead className="w-10 pl-6 py-4">
                                <input type="checkbox" className="rounded border-gray-300" />
                            </TableHead>
                            <TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Staff Member</TableHead>
                            <TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Role</TableHead>
                            <TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Department</TableHead>
                            <TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Email</TableHead>
                            <TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Phone</TableHead>
                            <TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Status</TableHead>
                            <TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4 text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length > 0 ? (
                            filtered.map(member => {
                                const DeptIcon = member.departmentIcon;
                                return (
                                    <TableRow key={member.id} className="border-b border-gray-100 hover:bg-slate-50/30">
                                        <TableCell className="pl-6 py-3.5">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </TableCell>

                                        {/* Staff Member cell — avatar + name + title */}
                                        <TableCell className="py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-200 bg-slate-100 shrink-0 shadow-sm">
                                                    <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-xs font-bold text-brandBlack truncate leading-none">{member.name}</span>
                                                    <span className="text-[10px] font-semibold text-gray-400 mt-1 leading-none truncate">{member.title}</span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Role badge */}
                                        <TableCell className="py-3.5"><RoleBadge role={member.role} /></TableCell>

                                        {/* Department with icon */}
                                        <TableCell className="py-3.5">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600">
                                                <DeptIcon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                                {member.department}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-xs font-bold text-gray-500 py-3.5">{member.email}</TableCell>
                                        <TableCell className="text-xs font-bold text-gray-500 py-3.5">{member.phone}</TableCell>

                                        {/* Status */}
                                        <TableCell className="py-3.5"><StatusBadge status={member.status} /></TableCell>

                                        {/* Actions */}
                                        <TableCell className="py-3.5 text-right pr-6">
                                            <div className="inline-flex items-center gap-2 justify-end">
                                                <button onClick={() => toast.info(`Viewing profile for ${member.name}`)}
                                                    className="p-1 rounded-lg border border-gray-200 hover:bg-slate-100 text-gray-500 cursor-pointer shadow-sm">
                                                    <Eye className="h-3.5 w-3.5" />
                                                </button>
                                                <button onClick={() => toast.info('Staff actions drawer coming soon.')}
                                                    className="p-1 rounded-lg border border-gray-200 hover:bg-slate-100 text-gray-500 cursor-pointer shadow-sm">
                                                    <MoreVertical className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-gray-400 font-bold text-xs">
                                    No staff members found matching your criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* ── Pagination Footer ── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-400">
                        Showing 1 to {filtered.length} of 48 staff members
                    </span>
                    <div className="flex items-center gap-5">
                        <select defaultValue="10"
                            className="h-8 px-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 bg-white outline-none">
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                        </select>
                        <div className="flex items-center gap-1.5">
                            <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-slate-50 text-gray-400 cursor-pointer shadow-sm">
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            {[1, 2, 3, 4, 5].map(n => (
                                <button key={n}
                                    className={`h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center shadow-sm ${n === 1
                                        ? 'bg-brandPurple text-white'
                                        : 'border border-gray-200 hover:bg-slate-50 text-gray-600 cursor-pointer'
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                            <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-slate-50 text-gray-400 cursor-pointer shadow-sm">
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Add Staff Modal ── */}
            <FormModal
                isOpen={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                title="Add New Staff Member"
                description="Register a new teaching or administrative employee."
                onSubmit={handleAdd}
                submitText="Register Staff"
                loading={saving}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-brandBlack">Full Name *</Label>
                            <Input placeholder="e.g. Mrs. Grace Okafor" value={formName} onChange={e => setFormName(e.target.value)}
                                className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-brandBlack">Job Title</Label>
                            <Input placeholder="e.g. Physics Teacher" value={formTitle} onChange={e => setFormTitle(e.target.value)}
                                className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-brandBlack">Role *</Label>
                            <select value={formRole} onChange={e => setFormRole(e.target.value as StaffRole)}
                                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack outline-none">
                                <option value="Teacher">Teacher</option>
                                <option value="Administrator">Administrator</option>
                                <option value="Support Staff">Support Staff</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-brandBlack">Department *</Label>
                            <select value={formDept} onChange={e => setFormDept(e.target.value)}
                                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack outline-none">
                                <option>Administration</option>
                                <option>Mathematics</option>
                                <option>English Language</option>
                                <option>Sciences</option>
                                <option>Primary School</option>
                                <option>ICT</option>
                                <option>Library</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-brandBlack">Email *</Label>
                            <Input type="email" placeholder="name@klasso.edu.ng" value={formEmail} onChange={e => setFormEmail(e.target.value)}
                                className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-brandBlack">Phone *</Label>
                            <Input placeholder="+234 800 000 0000" value={formPhone} onChange={e => setFormPhone(e.target.value)}
                                className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-brandBlack">Status</Label>
                        <select value={formStatus} onChange={e => setFormStatus(e.target.value as StaffStatus)}
                            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack outline-none">
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </FormModal>
        </div>
    );
}
