'use client';

import * as React from 'react';
import { 
    Download, 
    Plus, 
    ChevronDown, 
    ArrowUpRight, 
    ArrowDownRight, 
    TrendingUp, 
    Calendar,
    Wallet,
    Percent,
    AlertCircle,
    Bell,
    Users,
    FileText,
    ArrowRight,
    Search,
    CreditCard,
    DollarSign,
    CheckCircle2,
    MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';

/* ── Metric Types ── */
interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ElementType;
    color: 'purple' | 'green' | 'blue' | 'yellow';
    chartPoints: number[];
}

/* ── Mini Sparkline Chart ── */
const Sparkline: React.FC<{ points: number[]; color: string }> = ({ points, color }) => {
    const width = 100;
    const height = 30;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min === 0 ? 1 : max - min;
    
    const coordinates = points.map((p, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((p - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg className="w-24 h-8 shrink-0 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={coordinates}
            />
        </svg>
    );
};

/* ── Metric Card ── */
const MetricCard: React.FC<MetricCardProps> = ({ 
    title, 
    value, 
    change, 
    trend, 
    icon: Icon, 
    color,
    chartPoints 
}) => {
    const isUp = trend === 'up';
    const colorClasses = {
        purple: { stroke: 'var(--brand-purple)', bg: 'bg-[#F3E8FF] text-brand-purple' },
        green: { stroke: 'var(--brand-green)', bg: 'bg-[#ECFDF5] text-brand-green' },
        blue: { stroke: '#3B82F6', bg: 'bg-[#EFF6FF] text-[#2563EB]' },
        yellow: { stroke: 'var(--brand-yellow)', bg: 'bg-[#FEF3C7] text-[#D97706]' }
    }[color];

    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-5 flex items-center justify-between shadow-sm">
            <div className="space-y-3.5">
                <div className="flex items-center gap-2.5">
                    <div className={`p-2.5 rounded-2xl ${colorClasses.bg}`}>
                        <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-400">{title}</span>
                </div>
                <div>
                    <h3 className="text-2.5xl font-black text-brandBlack tracking-tight">{value}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <span className={`inline-flex items-center text-[10px] font-black ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isUp ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                            {change}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">vs last term</span>
                    </div>
                </div>
            </div>
            <Sparkline points={chartPoints} color={colorClasses.stroke} />
        </div>
    );
};

export default function FinancePage() {
    const [termFilter, setTermFilter] = React.useState('This Term');
    const [accountFilter, setAccountFilter] = React.useState('All Accounts');
    
    return (
        <div className="space-y-6">
            
            {/* Header Title Space */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-brandPurple/10 flex items-center justify-center text-brandPurple shrink-0">
                        <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2.5xl font-black text-brandBlack tracking-tight">Finance</h1>
                        <p className="text-xs font-bold text-gray-400 mt-1">Track income, expenses and school financial health.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                    <button 
                        onClick={() => toast.success('Report generation started')}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm cursor-pointer transition-all"
                    >
                        <Download className="h-4 w-4 text-gray-400" />
                        <span>Generate Report</span>
                    </button>
                    <button
                        onClick={() => toast.success('New Transaction triggered')}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-brandPurple text-white hover:bg-brandPurple/90 text-xs font-bold shadow-sm cursor-pointer transition-all"
                    >
                        <Plus className="h-4.5 w-4.5" />
                        <span>New Transaction</span>
                        <ChevronDown className="h-3.5 w-3.5 opacity-75" />
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Income"
                    value="₦117,750,000"
                    change="+12.4%"
                    trend="up"
                    icon={Wallet}
                    color="purple"
                    chartPoints={[30, 45, 38, 55, 48, 65, 75]}
                />
                <MetricCard
                    title="Total Expenses"
                    value="₦37,240,000"
                    change="+8.2%"
                    trend="up"
                    icon={Wallet}
                    color="green"
                    chartPoints={[20, 28, 25, 35, 30, 42, 38]}
                />
                <MetricCard
                    title="Net Balance"
                    value="₦80,510,000"
                    change="+15.7%"
                    trend="up"
                    icon={Wallet}
                    color="blue"
                    chartPoints={[10, 18, 14, 25, 22, 34, 45]}
                />
                <MetricCard
                    title="Collection Rate"
                    value="78.5%"
                    change="+9.3%"
                    trend="up"
                    icon={Percent}
                    color="yellow"
                    chartPoints={[60, 65, 62, 70, 68, 75, 78.5]}
                />
            </div>

            {/* Filter controls row */}
            <div className="flex gap-3 items-center">
                <div className="relative">
                    <select
                        value={termFilter}
                        onChange={(e) => setTermFilter(e.target.value)}
                        className="h-10 pl-10 pr-8 rounded-2xl border border-gray-250 bg-white text-xs font-bold text-gray-700 outline-none focus:border-brandPurple appearance-none cursor-pointer"
                    >
                        <option value="This Term">This Term — Apr 1 - Jul 31, 2025</option>
                        <option value="Last Term">Last Term — Jan 1 - Mar 31, 2025</option>
                    </select>
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                    <select
                        value={accountFilter}
                        onChange={(e) => setAccountFilter(e.target.value)}
                        className="h-10 pl-10 pr-8 rounded-2xl border border-gray-250 bg-white text-xs font-bold text-gray-700 outline-none focus:border-brandPurple appearance-none cursor-pointer"
                    >
                        <option value="All Accounts">All Accounts</option>
                        <option value="Main Account">Main School Account</option>
                        <option value="Project Account">Project & Dev Account</option>
                    </select>
                    <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Revenue Overview column bar chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                        <div>
                            <h3 className="text-base font-black text-brandBlack">Revenue Overview</h3>
                            <p className="text-[10px] font-bold text-gray-400 mt-1">Income vs Expenses</p>
                        </div>
                        <div className="flex gap-2">
                            <select className="h-8 px-2 rounded-xl border border-gray-200 text-[10px] font-bold text-gray-600 bg-white outline-none">
                                <option>Monthly</option>
                                <option>Weekly</option>
                            </select>
                            <button className="p-1 rounded-lg hover:bg-slate-50 text-gray-400"><MoreVertical className="h-4 w-4" /></button>
                        </div>
                    </div>

                    {/* Chart Legends */}
                    <div className="flex gap-4 text-[10px] font-bold text-gray-500 my-4">
                        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-brandPurple" /> Income</span>
                        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-slate-200" /> Expenses</span>
                    </div>

                    {/* Bar Chart Container */}
                    <div className="flex-1 flex flex-col justify-between h-[200px] mt-2 relative">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <div key={i} className="w-full border-t border-dashed border-gray-100" />
                            ))}
                        </div>

                        {/* Bar graphics */}
                        <div className="flex-1 flex items-end justify-around relative z-10 pt-4 px-4">
                            {/* April */}
                            <div className="flex flex-col items-center gap-2 w-12">
                                <div className="flex items-end gap-1.5 h-36">
                                    <div className="w-4 bg-brandPurple rounded-t-sm h-[35%]" title="₦41M" />
                                    <div className="w-4 bg-slate-200 rounded-t-sm h-[15%]" title="₦18M" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400">Apr</span>
                            </div>

                            {/* May */}
                            <div className="flex flex-col items-center gap-2 w-12">
                                <div className="flex items-end gap-1.5 h-36">
                                    <div className="w-4 bg-brandPurple rounded-t-sm h-[60%]" title="₦70M" />
                                    <div className="w-4 bg-slate-200 rounded-t-sm h-[25%]" title="₦30M" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400">May</span>
                            </div>

                            {/* June */}
                            <div className="flex flex-col items-center gap-2 w-12">
                                <div className="flex items-end gap-1.5 h-36">
                                    <div className="w-4 bg-brandPurple rounded-t-sm h-[75%]" title="₦88M" />
                                    <div className="w-4 bg-slate-200 rounded-t-sm h-[20%]" title="₦24M" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400">Jun</span>
                            </div>

                            {/* July */}
                            <div className="flex flex-col items-center gap-2 w-12">
                                <div className="flex items-end gap-1.5 h-36">
                                    <div className="w-4 bg-brandPurple rounded-t-sm h-[95%]" title="₦117M" />
                                    <div className="w-4 bg-slate-200 rounded-t-sm h-[30%]" title="₦37M" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400">Jul</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fee Collection Donuts */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                        <div>
                            <h3 className="text-base font-black text-brandBlack">Fee Collection</h3>
                            <p className="text-[10px] font-bold text-gray-400 mt-1">Overall collection status</p>
                        </div>
                        <div className="flex gap-2">
                            <select className="h-8 px-2 rounded-xl border border-gray-200 text-[10px] font-bold text-gray-600 bg-white outline-none">
                                <option>This Term</option>
                                <option>This Year</option>
                            </select>
                            <button className="p-1 rounded-lg hover:bg-slate-50 text-gray-400"><MoreVertical className="h-4 w-4" /></button>
                        </div>
                    </div>

                    {/* Donut graphic */}
                    <div className="flex items-center justify-center my-6 relative">
                        {/* Interactive custom Donut chart using SVG */}
                        <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                            {/* Base Gray Track */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                            {/* Collected Segment (78.5%) */}
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="transparent" 
                                stroke="var(--color-brandGreen)" 
                                strokeWidth="12" 
                                strokeDasharray={`${78.5 * 2.51} 251`}
                                strokeDashoffset="0"
                            />
                            {/* Pending Segment (15.6%) */}
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="transparent" 
                                stroke="var(--color-brandYellow)" 
                                strokeWidth="12" 
                                strokeDasharray={`${15.6 * 2.51} 251`}
                                strokeDashoffset={`-${78.5 * 2.51}`}
                            />
                            {/* Overdue Segment (5.9%) */}
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="transparent" 
                                stroke="var(--color-brandPink)" 
                                strokeWidth="12" 
                                strokeDasharray={`${5.9 * 2.51} 251`}
                                strokeDashoffset={`-${(78.5 + 15.6) * 2.51}`}
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-xl font-black text-brandBlack">78.5%</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Collected</span>
                        </div>
                    </div>

                    {/* Legends & numbers details */}
                    <div className="space-y-2.5 text-[11px] font-bold text-gray-500">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brandGreen" /> Collected</span>
                            <span className="text-brandBlack">₦117,750,000 (78.5%)</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brandYellow" /> Pending</span>
                            <span className="text-brandBlack">₦23,450,000 (15.6%)</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brandPink" /> Overdue</span>
                            <span className="text-brandBlack">₦9,800,000 (5.9%)</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => toast.info('Loading report details...')}
                        className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-gray-150 text-[10px] font-black text-brandPurple bg-white hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <span>View Detailed Report</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Alerts & Quick Actions Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Transactions List */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                        <div>
                            <h3 className="text-base font-black text-brandBlack">Recent Transactions</h3>
                            <p className="text-[10px] font-bold text-gray-400 mt-1">Latest billing ledgers</p>
                        </div>
                        <button 
                            onClick={() => toast.info('Navigating to full ledger')}
                            className="text-[10px] font-black text-brandPurple hover:underline cursor-pointer"
                        >
                            View all
                        </button>
                    </div>

                    <div className="overflow-x-auto mt-4">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-wider">
                                    <th className="pb-3">Type</th>
                                    <th className="pb-3">Description</th>
                                    <th className="pb-3">Reference</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Method</th>
                                    <th className="pb-3 pr-2 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs font-bold text-gray-600 divide-y divide-gray-50">
                                <tr>
                                    <td className="py-3.5">
                                        <span className="p-1.5 rounded-lg bg-emerald-50 text-brandGreen block w-max"><ArrowDownRight className="h-3.5 w-3.5 rotate-90" /></span>
                                    </td>
                                    <td className="py-3.5">
                                        <div className="flex flex-col">
                                            <span className="text-brandBlack">Fee Payment</span>
                                            <span className="text-[10px] font-semibold text-gray-400 mt-0.5">Kamal Tahir (Grade 10A)</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 font-mono text-[10px]">INV-2025-0001</td>
                                    <td className="py-3.5 text-gray-500">May 20, 2025</td>
                                    <td className="py-3.5 text-brandBlack">₦125,000</td>
                                    <td className="py-3.5 text-gray-500">Bank Transfer</td>
                                    <td className="py-3.5 text-right pr-2">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Completed</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3.5">
                                        <span className="p-1.5 rounded-lg bg-rose-50 text-rose-500 block w-max"><ArrowUpRight className="h-3.5 w-3.5 rotate-90" /></span>
                                    </td>
                                    <td className="py-3.5">
                                        <div className="flex flex-col">
                                            <span className="text-brandBlack">Staff Salary</span>
                                            <span className="text-[10px] font-semibold text-gray-400 mt-0.5">April 2025 Salary</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 font-mono text-[10px]">PAY-2025-0004</td>
                                    <td className="py-3.5 text-gray-500">May 19, 2025</td>
                                    <td className="py-3.5 text-brandBlack">₦2,100,000</td>
                                    <td className="py-3.5 text-gray-500">Bank Transfer</td>
                                    <td className="py-3.5 text-right pr-2">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Completed</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3.5">
                                        <span className="p-1.5 rounded-lg bg-emerald-50 text-brandGreen block w-max"><ArrowDownRight className="h-3.5 w-3.5 rotate-90" /></span>
                                    </td>
                                    <td className="py-3.5">
                                        <div className="flex flex-col">
                                            <span className="text-brandBlack">Resource Fee</span>
                                            <span className="text-[10px] font-semibold text-gray-400 mt-0.5">Maryam Bello (Grade 10A)</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 font-mono text-[10px]">INV-2025-0003</td>
                                    <td className="py-3.5 text-gray-500">May 18, 2025</td>
                                    <td className="py-3.5 text-brandBlack">₦25,000</td>
                                    <td className="py-3.5 text-gray-500 flex items-center gap-1 mt-1.5"><CreditCard className="h-3 w-3 text-gray-400" /> Card</td>
                                    <td className="py-3.5 text-right pr-2">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Completed</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3.5">
                                        <span className="p-1.5 rounded-lg bg-emerald-50 text-brandGreen block w-max"><ArrowDownRight className="h-3.5 w-3.5 rotate-90" /></span>
                                    </td>
                                    <td className="py-3.5">
                                        <div className="flex flex-col">
                                            <span className="text-brandBlack">Tuition Fee</span>
                                            <span className="text-[10px] font-semibold text-gray-400 mt-0.5">Aisha Lawal (Grade 9B)</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 font-mono text-[10px]">INV-2025-0002</td>
                                    <td className="py-3.5 text-gray-500">May 17, 2025</td>
                                    <td className="py-3.5 text-brandBlack">₦125,000</td>
                                    <td className="py-3.5 text-gray-500">Bank Transfer</td>
                                    <td className="py-3.5 text-right pr-2">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Completed</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3.5">
                                        <span className="p-1.5 rounded-lg bg-rose-50 text-rose-500 block w-max"><ArrowUpRight className="h-3.5 w-3.5 rotate-90" /></span>
                                    </td>
                                    <td className="py-3.5">
                                        <div className="flex flex-col">
                                            <span className="text-brandBlack">Utility Bill</span>
                                            <span className="text-[10px] font-semibold text-gray-400 mt-0.5">Electricity - May 2025</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 font-mono text-[10px]">EXP-2025-0017</td>
                                    <td className="py-3.5 text-gray-500">May 16, 2025</td>
                                    <td className="py-3.5 text-brandBlack">₦185,000</td>
                                    <td className="py-3.5 text-gray-500">Bank Transfer</td>
                                    <td className="py-3.5 text-right pr-2">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Completed</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Alerts Section */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                        <span className="text-xs font-black text-brandBlack">Alerts</span>
                        <button 
                            onClick={() => toast.info('Viewing all alerts')}
                            className="text-[10px] font-black text-brandPurple hover:underline cursor-pointer"
                        >
                            View all
                        </button>
                    </div>

                    <div className="space-y-3.5 mt-4">
                        <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50/50 border border-rose-100 hover:bg-rose-50 transition-colors cursor-pointer">
                            <span className="p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0"><AlertCircle className="h-4 w-4" /></span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-black text-brandBlack">₦9,800,000 in overdue fees</span>
                                <span className="text-[9px] font-bold text-gray-400 mt-1">From 156 students</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/50 border border-amber-100 hover:bg-amber-50 transition-colors cursor-pointer">
                            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0"><Bell className="h-4 w-4" /></span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-black text-brandBlack">12 pending staff salaries</span>
                                <span className="text-[9px] font-bold text-gray-400 mt-1">Total: ₦8,400,000</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-2xl bg-blue-50/50 border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer">
                            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0"><CreditCard className="h-4 w-4" /></span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-black text-brandBlack">3 upcoming recurring payments</span>
                                <span className="text-[9px] font-bold text-gray-400 mt-1">Next: Internet Subscription</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:bg-emerald-50 transition-colors cursor-pointer">
                            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0"><CheckCircle2 className="h-4 w-4" /></span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-black text-brandBlack">Term 2 fee structure is active</span>
                                <span className="text-[9px] font-bold text-gray-400 mt-1">Effective Apr 1 - Jul 31, 2025</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Top Fee Balances & Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Top Fee Balances */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                        <div>
                            <h3 className="text-base font-black text-brandBlack">Top Fee Balances</h3>
                            <p className="text-[10px] font-bold text-gray-400 mt-1">Students with outstanding fees</p>
                        </div>
                        <button 
                            onClick={() => toast.info('Viewing all balances')}
                            className="text-[10px] font-black text-brandPurple hover:underline cursor-pointer"
                        >
                            View all
                        </button>
                    </div>

                    <div className="space-y-3.5 mt-4 flex-1">
                        {/* Student 1 */}
                        <div className="flex items-center justify-between p-2 hover:bg-slate-50/50 rounded-xl transition-all">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-150 bg-slate-100 shrink-0">
                                    <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&h=80&q=80" alt="Daniel" className="h-full w-full object-cover" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-brandBlack truncate">Daniel Johnson</span>
                                    <span className="text-[10px] font-semibold text-gray-400 mt-0.5">Grade 10B</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-brandBlack">₦240,000</span>
                                <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">Overdue</span>
                            </div>
                        </div>

                        {/* Student 2 */}
                        <div className="flex items-center justify-between p-2 hover:bg-slate-50/50 rounded-xl transition-all">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-150 bg-slate-100 shrink-0">
                                    <img src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=80&h=80&q=80" alt="Fatima" className="h-full w-full object-cover" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-brandBlack truncate">Fatima Usman</span>
                                    <span className="text-[10px] font-semibold text-gray-400 mt-0.5">Grade 9A</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-brandBlack">₦195,000</span>
                                <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">Overdue</span>
                            </div>
                        </div>

                        {/* Student 3 */}
                        <div className="flex items-center justify-between p-2 hover:bg-slate-50/50 rounded-xl transition-all">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-150 bg-slate-100 shrink-0">
                                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80&q=80" alt="Ibrahim" className="h-full w-full object-cover" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-brandBlack truncate">Ibrahim Haruna</span>
                                    <span className="text-[10px] font-semibold text-gray-400 mt-0.5">Grade 8A</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-brandBlack">₦175,000</span>
                                <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">Overdue</span>
                            </div>
                        </div>

                        {/* Student 4 */}
                        <div className="flex items-center justify-between p-2 hover:bg-slate-50/50 rounded-xl transition-all">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-150 bg-slate-100 shrink-0">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" alt="Grace" className="h-full w-full object-cover" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-brandBlack truncate">Grace Okafor</span>
                                    <span className="text-[10px] font-semibold text-gray-400 mt-0.5">Grade 9B</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-brandBlack">₦150,000</span>
                                <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100">Due Soon</span>
                            </div>
                        </div>

                        {/* Student 5 */}
                        <div className="flex items-center justify-between p-2 hover:bg-slate-50/50 rounded-xl transition-all">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-150 bg-slate-100 shrink-0">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" alt="Usman" className="h-full w-full object-cover" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-brandBlack truncate">Usman Yusuf</span>
                                    <span className="text-[10px] font-semibold text-gray-400 mt-0.5">Grade 7B</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-brandBlack">₦125,000</span>
                                <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100">Due Soon</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => toast.info('Loading balances report')}
                        className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-gray-150 text-[10px] font-black text-brandPurple bg-white hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <span>View All Balances</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </div>

                {/* Quick Actions List */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                        <span className="text-xs font-black text-brandBlack">Quick Actions</span>
                    </div>

                    <div className="space-y-2 mt-4 flex-1">
                        <button 
                            onClick={() => toast.success('Record Income modal opened')}
                            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:bg-slate-50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="p-2 rounded-xl bg-emerald-50 text-brandGreen shrink-0"><Wallet className="h-4 w-4" /></span>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] font-black text-brandBlack">Record Income</span>
                                    <span className="text-[9px] font-bold text-gray-400 mt-0.5">Add a new income entry</span>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-300" />
                        </button>

                        <button 
                            onClick={() => toast.success('Record Expense modal opened')}
                            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:bg-slate-50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0"><DollarSign className="h-4 w-4" /></span>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] font-black text-brandBlack">Record Expense</span>
                                    <span className="text-[9px] font-bold text-gray-400 mt-0.5">Add a new expense entry</span>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-300" />
                        </button>

                        <button 
                            onClick={() => toast.success('Generate Invoice dialog opened')}
                            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:bg-slate-50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="p-2 rounded-xl bg-indigo-50 text-brandPurple shrink-0"><FileText className="h-4 w-4" /></span>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] font-black text-brandBlack">Generate Invoice</span>
                                    <span className="text-[9px] font-bold text-gray-400 mt-0.5">Create invoice for student fees</span>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-300" />
                        </button>

                        <button 
                            onClick={() => toast.success('Fee Structure settings opened')}
                            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:bg-slate-50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0"><Percent className="h-4 w-4" /></span>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] font-black text-brandBlack">Fee Structure</span>
                                    <span className="text-[9px] font-bold text-gray-400 mt-0.5">Manage fee categories</span>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-300" />
                        </button>

                        <button 
                            onClick={() => toast.success('Financial Reports page opened')}
                            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:bg-slate-50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0"><Calendar className="h-4 w-4" /></span>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] font-black text-brandBlack">Financial Reports</span>
                                    <span className="text-[9px] font-bold text-gray-400 mt-0.5">View and export reports</span>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-300" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
