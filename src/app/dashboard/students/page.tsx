'use client';

import * as React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
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
import {
    Plus,
    Search,
    Upload,
    Users,
    UserCheck,
    UserMinus,
    GraduationCap,
    Filter,
    Eye,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown
} from 'lucide-react';
import { toast } from 'sonner';

// Define Student Interface matching the mockup
interface StudentRecord {
    id: string;
    name: string;
    email: string;
    avatar: string;
    admissionNo: string;
    classGrade: string;
    classColor: string; // Tailwind class color for badge
    status: 'Active' | 'Inactive';
    parent: string;
    contact: string;
}

const initialStudents: StudentRecord[] = [
    {
        id: '1',
        name: 'Kamal Tahir',
        email: 'kamal.tahir@email.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
        admissionNo: 'KLA/24/001',
        classGrade: 'Grade 10A',
        classColor: 'bg-indigo-50 text-brandPurple border-indigo-100',
        status: 'Active',
        parent: 'Tahir Abdullahi',
        contact: '+234 806 123 4567'
    },
    {
        id: '2',
        name: 'Aisha Lawal',
        email: 'aisha.lawal@email.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
        admissionNo: 'KLA/24/002',
        classGrade: 'Grade 10B',
        classColor: 'bg-emerald-50 text-[#065F46] border-emerald-100',
        status: 'Active',
        parent: 'Zainab Lawal',
        contact: '+234 803 987 6543'
    },
    {
        id: '3',
        name: 'Chidi Okafor',
        email: 'chidi.okafor@email.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
        admissionNo: 'KLA/24/003',
        classGrade: 'Grade 9B',
        classColor: 'bg-[#F4F4FF] text-brandPurple border-indigo-100',
        status: 'Active',
        parent: 'Emeka Okafor',
        contact: '+234 809 234 5678'
    },
    {
        id: '4',
        name: 'Fatima Usman',
        email: 'fatima.usman@email.com',
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=80&h=80&q=80',
        admissionNo: 'KLA/24/004',
        classGrade: 'Grade 9A',
        classColor: 'bg-amber-50 text-[#B45309] border-amber-100',
        status: 'Inactive',
        parent: 'Usman Yusuf',
        contact: '+234 805 678 9012'
    },
    {
        id: '5',
        name: 'Daniel Johnson',
        email: 'daniel.johnson@email.com',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&h=80&q=80',
        admissionNo: 'KLA/24/005',
        classGrade: 'Grade 8B',
        classColor: 'bg-indigo-50 text-brandPurple border-indigo-100',
        status: 'Active',
        parent: 'Grace Johnson',
        contact: '+234 801 345 6789'
    },
    {
        id: '6',
        name: 'Maryam Bello',
        email: 'maryam.bello@email.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
        admissionNo: 'KLA/24/006',
        classGrade: 'Grade 8A',
        classColor: 'bg-emerald-50 text-[#065F46] border-emerald-100',
        status: 'Active',
        parent: 'Bello Ahmad',
        contact: '+234 802 456 7890'
    },
    {
        id: '7',
        name: 'Ibrahim Haruna',
        email: 'ibrahim.haruna@email.com',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80&q=80',
        admissionNo: 'KLA/24/007',
        classGrade: 'Grade 7B',
        classColor: 'bg-[#F4F4FF] text-brandPurple border-indigo-100',
        status: 'Inactive',
        parent: 'Hrauna Aliyu',
        contact: '+234 803 210 9876'
    }
];

export default function StudentsPage() {
    const [students, setStudents] = React.useState<StudentRecord[]>(initialStudents);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [classFilter, setClassFilter] = React.useState('all');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [genderFilter, setGenderFilter] = React.useState('all');
    const [sortBy, setSortBy] = React.useState('newest');

    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

    // Form modal state
    const [formName, setFormName] = React.useState('');
    const [formEmail, setFormEmail] = React.useState('');
    const [formClass, setFormClass] = React.useState('Grade 10A');
    const [formParent, setFormParent] = React.useState('');
    const [formContact, setFormContact] = React.useState('');
    const [formStatus, setFormStatus] = React.useState<'Active' | 'Inactive'>('Active');
    const [saving, setSaving] = React.useState(false);

    // Filter students record list
    const filteredStudents = React.useMemo(() => {
        return students.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesClass = classFilter === 'all' || s.classGrade === classFilter;
            const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

            // Simulating gender filtering for mock values (Kamal, Chidi, Daniel, Ibrahim -> Male, Aisha, Fatima, Maryam -> Female)
            const isMale = ['Kamal Tahir', 'Chidi Okafor', 'Daniel Johnson', 'Ibrahim Haruna'].includes(s.name);
            const matchesGender = genderFilter === 'all' ||
                (genderFilter === 'male' && isMale) ||
                (genderFilter === 'female' && !isMale);

            return matchesSearch && matchesClass && matchesStatus && matchesGender;
        });
    }, [students, searchQuery, classFilter, statusFilter, genderFilter]);

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName || !formEmail || !formParent || !formContact) {
            toast.error('Validation Failed', { description: 'Please fill in all fields.' });
            return;
        }

        setSaving(true);
        setTimeout(() => {
            const nextId = String(students.length + 1);
            const newRecord: StudentRecord = {
                id: nextId,
                name: formName,
                email: formEmail,
                avatar: `https://images.unsplash.com/photo-${1500000000000 + (students.length * 10000)}?auto=format&fit=crop&w=80&h=80&q=80`,
                admissionNo: `KLA/24/00${nextId}`,
                classGrade: formClass,
                classColor: formClass.includes('10A') || formClass.includes('8B')
                    ? 'bg-indigo-50 text-brandPurple border-indigo-100'
                    : formClass.includes('10B') || formClass.includes('8A')
                        ? 'bg-emerald-50 text-[#065F46] border-emerald-100'
                        : 'bg-[#F4F4FF] text-brandPurple border-indigo-100',
                status: formStatus,
                parent: formParent,
                contact: formContact
            };

            setStudents([newRecord, ...students]);
            setSaving(false);
            setIsAddModalOpen(false);

            // Reset inputs
            setFormName('');
            setFormEmail('');
            setFormParent('');
            setFormContact('');
            setFormStatus('Active');

            toast.success('Registration Complete', {
                description: `${formName} has been enrolled in ${formClass}.`
            });
        }, 600);
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-5">
                {/* <div>
                    <h2 className="text-2.5xl font-black text-brandBlack tracking-tight">Students</h2>
                    <p className="text-xs font-bold text-gray-400 mt-1.5">Manage student records, view details and track academic progress.</p>
                </div> */}
                <div className="flex items-center gap-3 self-start md:self-auto">
                    <button
                        onClick={() => toast.info('Importing is currently offline.')}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-xs font-bold text-gray-700 shadow-sm cursor-pointer"
                    >
                        <Upload className="h-4 w-4 text-gray-400 rotate-180" />
                        <span>Import Students</span>
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-brandPurple text-white hover:bg-brandPurple/90 transition-all text-xs font-bold shadow-sm cursor-pointer"
                    >
                        <Plus className="h-4.5 w-4.5" />
                        <span>Add New Student</span>
                    </button>
                </div>
            </div>

            {/* Stat Cards Grid (6 columns) */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                <StatCard
                    title="Total Students"
                    value="542"
                    icon={Users}
                    description="Active enrollments this term"
                    color="purple"
                    trendText="8.5%"
                    trendDirection="up"
                    trendSubtext="vs last term"
                />
                <StatCard
                    title="Active Students"
                    value="518"
                    icon={UserCheck}
                    description="Active enrollments this term"
                    color="green"
                    trendText="6.2%"
                    trendDirection="up"
                    trendSubtext="vs last term"
                />
                <StatCard
                    title="Inactive Students"
                    value="24"
                    icon={UserMinus}
                    description="Suspended or withdrawn"
                    color="yellow"
                    trendText="2.1%"
                    trendDirection="down"
                    trendSubtext="vs last term"
                />
                <StatCard
                    title="Graduated"
                    value="18"
                    icon={GraduationCap}
                    description="Completed studies"
                    color="blue"
                    trendText="3.0%"
                    trendDirection="up"
                    trendSubtext="vs last term"
                />
                <StatCard
                    title="Female Students"
                    value="276"
                    icon={Users}
                    description="51% of total students"
                    color="pink"
                />
                <StatCard
                    title="Male Students"
                    value="266"
                    icon={Users}
                    description="49% of total students"
                    color="blue"
                />
            </div>

            {/* Filter Row */}
            <div className="flex flex-col xl:flex-row items-stretch xl:items-end justify-between gap-4 p-4 border border-gray-100 bg-white rounded-3xl shadow-sm">
                <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-4 flex-wrap">
                    {/* Search Field */}
                    <div className="relative flex-1 min-w-[240px]">
                        <input
                            type="text"
                            placeholder="Search by name, admission no. or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 w-full rounded-2xl border border-gray-200 pl-4 pr-10 text-xs font-semibold text-brandBlack placeholder-gray-400 bg-white outline-none focus:border-brandPurple focus:ring-1 focus:ring-brandPurple"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>

                    {/* Class Selector */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none pl-1">Class/Grade</span>
                        <select
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                            className="h-10 min-w-[120px] px-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 bg-white outline-none focus:border-brandPurple focus:ring-1 focus:ring-brandPurple"
                        >
                            <option value="all">All Classes</option>
                            <option value="Grade 10A">Grade 10A</option>
                            <option value="Grade 10B">Grade 10B</option>
                            <option value="Grade 9B">Grade 9B</option>
                            <option value="Grade 9A">Grade 9A</option>
                            <option value="Grade 8B">Grade 8B</option>
                            <option value="Grade 8A">Grade 8A</option>
                            <option value="Grade 7B">Grade 7B</option>
                        </select>
                    </div>

                    {/* Status Selector */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none pl-1">Status</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-10 min-w-[110px] px-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 bg-white outline-none focus:border-brandPurple focus:ring-1 focus:ring-brandPurple"
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Gender Selector */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none pl-1">Gender</span>
                        <select
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            className="h-10 min-w-[110px] px-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 bg-white outline-none focus:border-brandPurple focus:ring-1 focus:ring-brandPurple"
                        >
                            <option value="all">All Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    {/* Sort Selector */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none pl-1 flex items-center gap-1">
                            <ArrowUpDown className="h-3 w-3" />
                            <span>Sort By</span>
                        </span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="h-10 min-w-[120px] px-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 bg-white outline-none focus:border-brandPurple focus:ring-1 focus:ring-brandPurple"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name A-Z</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setClassFilter('all');
                        setStatusFilter('all');
                        setGenderFilter('all');
                        setSortBy('newest');
                        setSearchQuery('');
                        toast.success('Filters cleared.');
                    }}
                    className="h-10 px-4 rounded-2xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-3 xl:mt-0"
                >
                    <Filter className="h-4 w-4 text-gray-400" />
                    <span>Filter</span>
                </button>
            </div>

            {/* Students Table */}
            <div className="border border-gray-100 bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
                <Table>
                    <TableHeader className="bg-slate-50/50 border-b border-gray-100">
                        <TableRow>
                            <TableHead className="w-12 pl-6 py-4">
                                <input type="checkbox" className="rounded border-gray-300 text-brandPurple focus:ring-brandPurple" />
                            </TableHead>
                            <TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Student</TableHead>
                            <TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Admission No.</TableHead>
                            <TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Class / Grade</TableHead>
                            <TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Status</TableHead>
                            <TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Parent / Guardian</TableHead>
                            <TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4">Contact</TableHead>
                            <TableHead className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider py-4 text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((record) => (
                                <TableRow key={record.id} className="border-b border-gray-100 hover:bg-slate-50/30">
                                    <TableCell className="pl-6 py-3.5">
                                        <input type="checkbox" className="rounded border-gray-300 text-brandPurple focus:ring-brandPurple" />
                                    </TableCell>
                                    <TableCell className="py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-200 bg-slate-100 shrink-0 shadow-sm">
                                                <img
                                                    src={record.avatar}
                                                    alt={record.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-bold text-brandBlack truncate leading-none">{record.name}</span>
                                                <span className="text-[10px] font-semibold text-gray-400 mt-1 truncate leading-none">{record.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-bold text-gray-500 py-3.5">{record.admissionNo}</TableCell>
                                    <TableCell className="py-3.5">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${record.classColor}`}>
                                            {record.classGrade}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3.5">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold">
                                            <span className={`h-1.5 w-1.5 rounded-full ${record.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            <span className={record.status === 'Active' ? 'text-emerald-700' : 'text-rose-600'}>
                                                {record.status}
                                            </span>
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-xs font-bold text-gray-500 py-3.5">{record.parent}</TableCell>
                                    <TableCell className="text-xs font-bold text-gray-500 py-3.5">{record.contact}</TableCell>
                                    <TableCell className="py-3.5 text-right pr-6 shrink-0">
                                        <div className="inline-flex items-center gap-2 justify-end">
                                            <button
                                                onClick={() => toast.info(`Viewing records for ${record.name}`)}
                                                className="p-1 rounded-lg border border-gray-200 hover:bg-slate-100 text-gray-500 cursor-pointer shadow-sm"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => toast.info('Actions drawer is coming soon')}
                                                className="p-1 rounded-lg border border-gray-200 hover:bg-slate-100 text-gray-500 cursor-pointer shadow-sm"
                                            >
                                                <MoreVertical className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-400 font-bold text-xs">
                                    No students found matching your criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Table Footer / Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-gray-100 bg-white">
                    <span className="text-xs font-bold text-gray-400">
                        Showing 1 to {filteredStudents.length} of 542 students
                    </span>

                    <div className="flex items-center gap-5">
                        {/* Items per page dropdown */}
                        <div className="flex items-center gap-2">
                            <select
                                defaultValue="10"
                                className="h-8 px-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 bg-white outline-none"
                            >
                                <option value="10">10 per page</option>
                                <option value="25">25 per page</option>
                                <option value="50">50 per page</option>
                            </select>
                        </div>

                        {/* Pagination Links */}
                        <div className="flex items-center gap-1.5">
                            <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-slate-50 text-gray-400 cursor-pointer shadow-sm">
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <button className="h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center bg-brandPurple text-white shadow-sm">
                                1
                            </button>
                            <button className="h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center border border-gray-200 hover:bg-slate-50 text-gray-600 cursor-pointer shadow-sm">
                                2
                            </button>
                            <button className="h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center border border-gray-200 hover:bg-slate-50 text-gray-600 cursor-pointer shadow-sm">
                                3
                            </button>
                            <span className="text-xs font-bold text-gray-400 px-1">...</span>
                            <button className="h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center border border-gray-200 hover:bg-slate-50 text-gray-600 cursor-pointer shadow-sm">
                                55
                            </button>
                            <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-slate-50 text-gray-400 cursor-pointer shadow-sm">
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Student Modal */}
            <FormModal
                isOpen={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                title="Add New Student"
                description="Enter student and guardian profile to register them in the school database."
                onSubmit={handleAddStudent}
                submitText="Register Student"
                loading={saving}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="student-name" className="text-xs font-bold text-brandBlack">Full Name *</Label>
                        <Input
                            id="student-name"
                            required
                            placeholder="e.g. John Doe"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white focus:ring-1 focus:ring-brandPurple text-brandBlack"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="student-email" className="text-xs font-bold text-brandBlack">Email Address *</Label>
                        <Input
                            id="student-email"
                            required
                            type="email"
                            placeholder="e.g. john.doe@email.com"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white focus:ring-1 focus:ring-brandPurple text-brandBlack"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="student-class" className="text-xs font-bold text-brandBlack">Class / Grade *</Label>
                        <select
                            id="student-class"
                            required
                            value={formClass}
                            onChange={(e) => setFormClass(e.target.value)}
                            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack outline-none focus:border-brandPurple focus:ring-1 focus:ring-brandPurple"
                        >
                            <option value="Grade 10A">Grade 10A</option>
                            <option value="Grade 10B">Grade 10B</option>
                            <option value="Grade 9B">Grade 9B</option>
                            <option value="Grade 9A">Grade 9A</option>
                            <option value="Grade 8B">Grade 8B</option>
                            <option value="Grade 8A">Grade 8A</option>
                            <option value="Grade 7B">Grade 7B</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="guardian" className="text-xs font-bold text-brandBlack">Guardian Name *</Label>
                        <Input
                            id="guardian"
                            required
                            placeholder="e.g. Mary Doe"
                            value={formParent}
                            onChange={(e) => setFormParent(e.target.value)}
                            className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white focus:ring-1 focus:ring-brandPurple text-brandBlack"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact" className="text-xs font-bold text-brandBlack">Contact Phone *</Label>
                        <Input
                            id="contact"
                            required
                            placeholder="e.g. +234 806 123 4567"
                            value={formContact}
                            onChange={(e) => setFormContact(e.target.value)}
                            className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white focus:ring-1 focus:ring-brandPurple text-brandBlack"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-xs font-bold text-brandBlack">Initial Status</Label>
                        <select
                            id="status"
                            value={formStatus}
                            onChange={(e) => setFormStatus(e.target.value as any)}
                            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack outline-none focus:border-brandPurple focus:ring-1 focus:ring-brandPurple"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </FormModal>
        </div>
    );
}
