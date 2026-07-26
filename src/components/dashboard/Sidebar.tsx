import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    MessageSquare,
    Settings,
    Gamepad2,
    Menu,
    FileBox,
    BookOpen,
    Clock,
    ChevronRight,
    Plus,
    Edit2,
} from 'lucide-react';



import { studyService } from '../../services/studyService';
import { quizService } from '../../services/quizService';
import { format } from 'date-fns';

interface SidebarProps {
    isExpanded: boolean;
    onToggle: () => void;
}

interface HistoryItem {
    id: string;
    name: string;
    date: string;
    type: 'Project' | 'Quiz';
}

const navItems = [
    { name: 'AI Tutor', path: '/dashboard/chat', icon: MessageSquare },
    { name: 'Quiz Center', path: '/dashboard/quiz', icon: Gamepad2 },
];

import { useNavigate } from 'react-router-dom';


export const Sidebar = ({ isExpanded, onToggle }: SidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();


    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        if (!isExpanded) return;
        setHistoryLoading(true);
        Promise.all([studyService.getProjects(), quizService.getQuizHistory()])
            .then(([projects, quizzes]) => {
                const items: HistoryItem[] = [
                    ...projects.map(p => ({
                        id: p.id,
                        name: p.name,
                        date: p.created_at,
                        type: 'Project' as const,
                    })),
                    ...quizzes.map(q => ({
                        id: q.id,
                        name: q.topic,
                        date: q.created_at,
                        type: 'Quiz' as const,
                    })),
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20);
                setHistory(items);
            })
            .catch(err => console.error('History load error:', err))
            .finally(() => setHistoryLoading(false));
    }, [isExpanded]);

    return (
        <>
            {/* Mobile backdrop */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onToggle}
                    aria-hidden="true"
                />
            )}

            <aside
                aria-label="Sidebar Navigation"
                className={`
                    fixed inset-y-0 left-0 z-50 flex flex-col
                    bg-[#0d0d0d] border-r border-[#1e1f20]
                    transition-[width] duration-300 ease-in-out overflow-hidden
                    ${isExpanded ? 'w-72' : 'w-[68px]'}
                `}
            >
                {/* Top bar: toggle */}
                <div className={`flex items-center h-16 flex-shrink-0 ${isExpanded ? 'px-4' : 'justify-center'}`}>
                    <button
                        onClick={onToggle}
                        className="w-10 h-10 flex items-center justify-center rounded-full text-[#e3e3e3] hover:bg-white/10 transition-all flex-shrink-0"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className={`mt-2 mb-2 px-3`}>
                    <button
                        onClick={() => navigate('/dashboard/chat')}
                        className={`
                            flex items-center gap-3 transition-all duration-300 group relative
                            ${isExpanded
                                ? 'w-full px-4 py-3 bg-[#1e1f20] hover:bg-[#2b2c2d] text-[#e3e3e3] rounded-full text-sm font-medium'
                                : 'w-10 h-10 mx-auto justify-center text-[#e3e3e3] hover:bg-white/10 rounded-full'
                            }
                        `}
                    >
                        {isExpanded ? <Plus size={20} /> : <Edit2 size={18} />}
                        {isExpanded && <span className="text-sm font-medium">New Chat</span>}
                    </button>
                </div>

                {/* Primary Nav */}
                <nav
                    aria-label="Main Navigation"
                    className={`flex flex-col gap-1 pt-4 flex-shrink-0 ${isExpanded ? 'px-3' : 'px-2'}`}
                >
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={!isExpanded ? item.name : undefined}
                                className={`
                                    flex items-center gap-3 rounded-xl transition-all relative group
                                    ${isExpanded ? 'px-3 py-2.5' : 'w-10 h-10 mx-auto justify-center'}
                                    ${isActive
                                        ? 'bg-[var(--brand-purple)] text-white shadow-md shadow-[var(--brand-purple)]/20'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5'
                                    }
                                `}
                            >
                                <item.icon size={18} className="flex-shrink-0" />
                                {isExpanded && (
                                    <span className="text-sm font-semibold whitespace-nowrap">{item.name}</span>
                                )}

                                {/* Icon-mode tooltip */}
                                {!isExpanded && (
                                    <span
                                        role="tooltip"
                                        className="absolute left-[calc(100%+10px)] px-2.5 py-1.5 bg-[var(--brand-black)] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl"
                                    >
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* History Panel — only when expanded */}
                {isExpanded && (
                    <div className="flex-1 overflow-hidden flex flex-col mt-6 px-3 min-h-0">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 px-1 flex-shrink-0">
                            Recent History
                        </p>
                        <div className="flex-1 overflow-y-auto space-y-0.5 scrollbar-hide">
                            {historyLoading ? (
                                <div className="space-y-2 pt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="h-9 rounded-xl skeleton" />
                                    ))}
                                </div>
                            ) : history.length > 0 ? (
                                history.map((item) => (
                                    <button
                                        key={item.id}
                                        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-black/5 transition-colors group text-left"
                                        title={item.name}
                                    >
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === 'Quiz' ? 'bg-indigo-100' : 'bg-amber-100'}`}>
                                            {item.type === 'Quiz'
                                                ? <BookOpen size={11} className="text-indigo-500" />
                                                : <FileBox size={11} className="text-amber-500" />
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-[var(--text-primary)] truncate leading-tight">
                                                {item.name}
                                            </p>
                                            <p className="text-[9px] font-medium text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                                                <Clock size={8} />
                                                {format(new Date(item.date), 'MMM d')}
                                            </p>
                                        </div>
                                        <ChevronRight size={12} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" />
                                    </button>
                                ))
                            ) : (
                                <p className="text-[10px] font-medium text-[var(--text-muted)] text-center py-8 px-2">
                                    No history yet. Start studying!
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Bottom: Settings */}
                <div className={`mt-auto border-t border-[var(--border)] pt-3 pb-4 flex-shrink-0 ${isExpanded ? 'px-3' : 'px-2'}`}>
                    {(() => {
                        const isActive = location.pathname === '/dashboard/settings';
                        return (
                            <Link
                                to="/dashboard/settings"
                                aria-label="Settings"
                                title={!isExpanded ? 'Settings' : undefined}
                                className={`
                                    flex items-center gap-3 rounded-xl transition-all relative group
                                    ${isExpanded ? 'w-full px-3 py-2.5' : 'w-10 h-10 mx-auto justify-center'}
                                    ${isActive
                                        ? 'bg-[var(--brand-purple)] text-white shadow-md shadow-[var(--brand-purple)]/20'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5'
                                    }
                                `}
                            >
                                <Settings size={18} className="flex-shrink-0" />
                                {isExpanded && <span className="text-sm font-semibold">Settings</span>}

                                {!isExpanded && (
                                    <span
                                        role="tooltip"
                                        className="absolute left-[calc(100%+10px)] px-2.5 py-1.5 bg-[var(--brand-black)] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl"
                                    >
                                        Settings
                                    </span>
                                )}
                            </Link>
                        );
                    })()}
                </div>
            </aside>
        </>
    );
};
