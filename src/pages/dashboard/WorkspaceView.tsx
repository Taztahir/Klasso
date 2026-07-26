import { Plus, MessageSquare, History, TrendingUp, Gamepad2, BookOpen, Clock, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { studyService, Project } from '../../services/studyService';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { quizService, studySessionService } from '../../services/quizService';

export const WorkspaceView = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [realtimeProjects, setRealtimeProjects] = useState<Project[]>([]);
    const [liveStats, setLiveStats] = useState({
        studyTime: '0.0h',
        quizzes: '0',
        avgScore: '0%',
        documents: '0'
    });

    useEffect(() => {
        if (!user) return;

        // 1. Listen to Projects
        const unsubProjects = studyService.subscribeToProjects((payload) => {
            if (payload.eventType === 'INSERT') {
                setRealtimeProjects(prev => [payload.new as Project, ...prev]);
            } else if (payload.eventType === 'DELETE') {
                setRealtimeProjects(prev => prev.filter(p => p.id !== payload.old.id));
            } else if (payload.eventType === 'UPDATE') {
                setRealtimeProjects(prev => prev.map(p => p.id === payload.new.id ? payload.new as Project : p));
            }
        });

        // 2. Listen to Stats (Quizzes)
        const quizzesUnsub = quizService.subscribeToStats((stats) => {
            setLiveStats(prev => ({
                ...prev,
                quizzes: stats.totalQuizzes.toString(),
                avgScore: `${stats.avgScore}%`
            }));
        });

        // 3. Listen to Study Time
        const studyUnsub = studySessionService.subscribeToTotalTime((seconds) => {
            const hours = (seconds / 3600).toFixed(1);
            setLiveStats(prev => ({
                ...prev,
                studyTime: `${hours}h`
            }));
        });

        // Update documents count whenever realtimeProjects changes
        setLiveStats(prev => ({ ...prev, documents: realtimeProjects.length.toString() }));

        return () => {
            unsubProjects.unsubscribe();
            quizzesUnsub.unsubscribe();
            studyUnsub.unsubscribe();
        };
    }, [user, realtimeProjects.length]);

    const stats = [
        { label: 'Study Time', value: liveStats.studyTime, sub: 'Total logging', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Quizzes', value: liveStats.quizzes, sub: `avg ${liveStats.avgScore} score`, icon: Gamepad2, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Documents', value: liveStats.documents, sub: 'In vault', icon: FileText, color: 'text-brandYellow', bg: 'bg-yellow-50' },
    ];

    const hubItems = [
        { name: 'AI Chat', desc: 'Tutor & Summary', icon: MessageSquare, path: '/dashboard/chat', color: 'bg-indigo-600', text: 'text-white' },
        { name: 'History', desc: 'Past Documents', icon: History, path: '/dashboard/history', color: 'bg-white', text: 'text-black' },
        { name: 'Performance', desc: 'Score & Analytics', icon: TrendingUp, path: '/dashboard/performance', color: 'bg-white', text: 'text-black' },
        { name: 'Quiz Mode', desc: 'Timed Challenges', icon: Gamepad2, path: '/dashboard/quiz', color: 'bg-brandPurple', text: 'text-white' },
    ];

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Row: Welcome & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-brandBlack rounded-2xl p-6 text-white relative overflow-hidden group shadow-2xl shadow-black/10">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter italic">Welcome Back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Scholar'}!</h1>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5 mb-6">You have {realtimeProjects.length} documents ready for review.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => showToast('New Scan', 'Opening camera...', 'info')}
                                className="bg-brandPurple text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <Plus size={14} /> New Study Doc
                            </button>
                            <Link
                                to="/dashboard/history"
                                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                            >
                                View Vault
                            </Link>
                        </div>
                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-brandPurple/20 rounded-full blur-[80px] group-hover:bg-brandPurple/30 transition-colors"></div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
                    {stats.map((s, i) => (
                        <div key={i} className="flex items-center gap-3.5 p-2.5 hover:bg-gray-50 rounded-xl transition-all cursor-default group">
                            <div className={`w-9 h-9 ${s.bg} ${s.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <s.icon size={18} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400">{s.label}</h4>
                                    <span className="text-[8px] font-bold text-gray-300">{s.sub}</span>
                                </div>
                                <p className="text-base font-black tracking-tight text-brandBlack">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4-Quadrant Hub Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {hubItems.map((item, i) => (
                    <Link
                        key={i}
                        to={item.path}
                        className={`group ${item.color} ${item.text} p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center justify-center aspect-square md:aspect-auto md:h-40`}
                    >
                        <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center group-hover:scale-110 transition-transform ${item.color === 'bg-white' ? 'bg-gray-50' : 'bg-white/10'}`}>
                            <item.icon size={22} />
                        </div>
                        <h3 className="text-lg font-black tracking-tight">{item.name}</h3>
                        <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${item.text === 'text-white' ? 'opacity-60' : 'text-gray-400'}`}>{item.desc}</p>
                    </Link>
                ))}
            </div>

            {/* Recent Documents Table/List */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black tracking-tight">Recent from Vault</h2>
                    <button className="text-[9px] font-black uppercase tracking-widest text-brandPurple hover:underline">See All</button>
                </div>

                <div className="space-y-4">
                    {realtimeProjects.length > 0 ? (
                        realtimeProjects.slice(0, 3).map((p) => (
                            <div key={p.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 bg-cream rounded-lg flex items-center justify-center border border-gray-200">
                                        <BookOpen className="w-5 h-5 text-brandPurple" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[13px] italic group-hover:text-brandPurple transition-colors">{p.name}</h4>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{p.file_type || 'PDF Document'} • {new Date(p.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:flex flex-col items-end px-4">
                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="w-full h-full bg-brandYellow"></div>
                                        </div>
                                        <span className="text-[9px] font-black text-gray-400 mt-1 uppercase tracking-widest">Mastery 100%</span>
                                    </div>
                                    <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-brandBlack hover:text-white transition-all">
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-xs font-black text-gray-300 uppercase tracking-widest italic">No documents in vault yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
