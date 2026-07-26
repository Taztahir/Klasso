import { useEffect, useState } from 'react';
import {
    Trophy,
    Zap,
    Target,
    TrendingUp,
    BrainCircuit,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { quizService, studySessionService } from '../../services/quizService';
import { studyService } from '../../services/studyService';

export const PerformanceView = () => {
    const [stats, setStats] = useState({
        studyHours: '0h',
        quizzesTaken: '0',
        avgScore: '0%',
        efficiency: '0%',
        documents: 0
    });

    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const qStats = await quizService.getStats();
                const totalSeconds = await studySessionService.getTotalStudyTime();
                const projects = await studyService.getProjects();
                const quizHistory = await quizService.getQuizHistory();

                setStats({
                    studyHours: `${(totalSeconds / 3600).toFixed(1)}h`,
                    quizzesTaken: qStats.totalQuizzes.toString(),
                    avgScore: `${qStats.avgScore}%`,
                    efficiency: qStats.totalQuizzes > 0 ? 'Optimal' : '-',
                    documents: projects.length
                });

                setHistory(quizHistory.slice(0, 5));
            } catch (err) {
                console.error('Error fetching performance stats:', err);
            }
        };
        fetchStats();
    }, []);

    const mainStats = [
        { label: 'Avg Retention', val: stats.avgScore, icon: BrainCircuit, color: 'bg-indigo-50', text: 'text-indigo-600' },
        { label: 'Study Hours', val: stats.studyHours, icon: Clock, color: 'bg-amber-50', text: 'text-amber-600' },
        { label: 'Quizzes Taken', val: stats.quizzesTaken, icon: Target, color: 'bg-rose-50', text: 'text-rose-600' },
        { label: 'Vault Items', val: stats.documents, icon: TrendingUp, color: 'bg-emerald-50', text: 'text-emerald-600' }
    ];

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-brandBlack">Performance</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Real-time statistics & cognitive insights</p>
                </div>
                <div className="bg-white p-1.5 rounded-xl border border-[var(--border)] shadow-sm flex items-center gap-1">
                    <div className="flex items-center gap-3 px-4 py-2 bg-[var(--brand-cream-dark)] rounded-lg">
                        <Trophy className="w-4 h-4 text-[var(--brand-yellow)]" />
                        <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">Status</p>
                            <p className="text-xs font-black text-[var(--brand-black)] uppercase">Active Scholar</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2">
                        <Zap className="w-4 h-4 text-[var(--brand-purple)]" />
                        <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">Mastery</p>
                            <p className="text-xs font-black text-[var(--brand-black)] uppercase">{stats.avgScore}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {mainStats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm group hover:shadow-md transition-all duration-300">
                        <div className={`w-11 h-11 ${stat.color} ${stat.text} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={22} />
                        </div>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-[var(--brand-black)] italic tracking-tight">{stat.val}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Recent Mastery Breakdown */}
                <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-[var(--border)] shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black tracking-tight text-brandBlack flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-brandPurple" />
                            Retention Velocity
                        </h3>
                        <span className="text-[9px] font-black uppercase tracking-widest text-brandPurple">Last 5 Quizzes</span>
                    </div>

                    <div className="space-y-6">
                        {history.length > 0 ? (
                            history.map((quiz, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-[13px] text-[var(--brand-black)] italic">{quiz.topic}</p>
                                        <p className="font-black text-[11px] text-[var(--brand-purple)] tracking-tight">{Math.round((quiz.score / quiz.total_questions) * 100)}%</p>
                                    </div>
                                    <div className="h-1.5 bg-[var(--brand-cream-dark)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--brand-purple)] rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${(quiz.score / quiz.total_questions) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-300 italic text-sm">
                                Complete your first quiz to see performance analytics.
                            </div>
                        )}
                    </div>
                </div>

                {/* Achievement Tracker */}
                <div className="lg:col-span-2 bg-[var(--brand-black)] rounded-2xl p-6 shadow-xl text-white relative overflow-hidden group">
                    <h3 className="text-lg font-black tracking-tight mb-8 text-white flex items-center gap-3 relative z-10">
                        <Target className="w-5 h-5 text-[var(--brand-yellow)]" />
                        Milestones
                    </h3>

                    <div className="space-y-3 relative z-10">
                        {[
                            { title: 'Upload Doc', progress: stats.documents > 0 ? '100%' : '0%', done: stats.documents > 0 },
                            { title: 'First Quiz', progress: history.length > 0 ? '100%' : '0%', done: history.length > 0 },
                            { title: 'Study 1 Hour', progress: parseFloat(stats.studyHours) >= 1 ? '100%' : `${(parseFloat(stats.studyHours) * 100).toFixed(0)}%`, done: parseFloat(stats.studyHours) >= 1 },
                            { title: 'Take 10 Quizzes', progress: `${Math.min(100, (parseInt(stats.quizzesTaken) / 10) * 100).toFixed(0)}%`, done: parseInt(stats.quizzesTaken) >= 10 }
                        ].map((m, i) => (
                            <div key={i} className={`p-4 rounded-xl border transition-all duration-300 ${m.done ? 'bg-white/10 border-white/10' : 'bg-transparent border-white/5 opacity-40'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${m.done ? 'bg-[var(--brand-yellow)] text-black' : 'bg-white/5 text-white/20'}`}>
                                            {m.done ? <CheckCircle2 size={18} /> : <div className="w-3 h-3 rounded-full border border-white/20" />}
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-black uppercase tracking-tight italic">{m.title}</h4>
                                            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-0.5">{m.progress} PROGRESS</p>
                                        </div>
                                    </div>
                                    {!m.done && <div className="w-1.5 h-1.5 bg-[var(--brand-yellow)] rounded-full animate-pulse"></div>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Decorative element */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};
