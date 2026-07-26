import { useEffect, useState } from 'react';
import {
    History as HistoryIcon,
    Search,
    FileBox,
    ExternalLink,
    Clock,
    BookOpen,
    Calendar,
    Layers
} from 'lucide-react';
import { studyService } from '../../services/studyService';
import { quizService } from '../../services/quizService';
import { format } from 'date-fns';

export const HistoryView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [vaultItems, setVaultItems] = useState<any[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [projects, quizzes, settings] = await Promise.all([
                    studyService.getProjects(),
                    quizService.getQuizHistory(),
                    studyService.getSettings()
                ]);

                if (settings?.recent_searches) {
                    setRecentSearches(settings.recent_searches);
                }

                // Merge and sort by date
                const items = [
                    ...projects.map(p => ({
                        id: p.id,
                        name: p.name,
                        date: p.created_at,
                        type: 'Project',
                        score: '-',
                        icon: FileBox,
                        color: 'bg-amber-50',
                        iconColor: 'text-amber-600'
                    })),
                    ...quizzes.map(q => ({
                        id: q.id,
                        name: q.topic,
                        date: q.created_at,
                        type: 'Quiz',
                        score: `${Math.round((q.score / q.total_questions) * 100)}%`,
                        icon: BookOpen,
                        color: 'bg-indigo-50',
                        iconColor: 'text-indigo-600'
                    }))
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setVaultItems(items);
            } catch (err) {
                console.error('Error fetching vault history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        if (term.trim()) {
            try {
                const updated = await studyService.updateRecentSearches(term);
                if (updated) setRecentSearches(updated);
            } catch (err) {
                console.error('Search Save Error:', err);
            }
        }
    };

    const filteredItems = vaultItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-brandBlack">Vault</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Your personal intelligence archive</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative group flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[var(--brand-purple)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your archive..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onBlur={() => handleSearch(searchTerm)}
                            className="w-full bg-white border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 font-bold text-xs focus:outline-none focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {recentSearches.length > 0 && (
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brandBlack/30">Recent Searches:</p>
                    <div className="flex gap-2">
                        {recentSearches.map((search, i) => (
                            <button
                                key={i}
                                onClick={() => setSearchTerm(search)}
                                className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[9px] font-bold text-brandBlack/60 hover:border-brandPurple hover:text-brandPurple transition-all"
                            >
                                {search}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-20 italic text-gray-400 animate-pulse font-bold">Accessing secure archives...</div>
                ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div key={item.id} className="bg-white p-4.5 rounded-2xl border border-[var(--border)] shadow-sm group hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black tracking-tight text-[var(--brand-black)] group-hover:text-[var(--brand-purple)] transition-colors leading-tight">{item.name}</h3>
                                    <div className="flex items-center gap-3 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5 bg-[var(--brand-cream-dark)] px-3 py-1 rounded-md"><Calendar size={10} /> {format(new Date(item.date), 'MMM d, yyyy')}</span>
                                        <span className="flex items-center gap-1.5 bg-[var(--brand-cream-dark)] px-3 py-1 rounded-md"><Clock size={10} /> {item.type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                {item.score !== '-' && (
                                    <div className="text-right">
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 whitespace-nowrap">Performance</p>
                                        <p className="text-lg font-black text-[var(--brand-purple)] tracking-tight">{item.score}</p>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <button className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-lg font-black text-[9px] uppercase tracking-widest text-brandBlack hover:bg-white hover:shadow-md transition-all active:scale-95 whitespace-nowrap">
                                        REVISIT
                                    </button>
                                    <button className="p-3.5 bg-brandBlack text-white rounded-lg hover:scale-105 transition-all active:scale-95 shadow-lg shadow-black/10">
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-[32px] p-20 border border-[var(--border)] border-dashed text-center space-y-4">
                        <div className="w-16 h-16 bg-[var(--brand-cream-dark)] rounded-full flex items-center justify-center mx-auto text-gray-300">
                            <Layers size={32} />
                        </div>
                        <p className="text-gray-400 font-bold italic">No records found matching your search.</p>
                    </div>
                )}
            </div>

            {/* Growth Card */}
            <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group shadow-xl">
                <div className="space-y-4 relative z-10 max-w-xl">
                    <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm group-hover:rotate-6 transition-transform">
                        <HistoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight leading-tight">Your cognitive growth is accelerating.</h2>
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest">
                        {vaultItems.length} sessions completed in your learning vault.
                    </p>
                    <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg hover:scale-105 transition-all">
                        VIEW PROGRESS
                    </button>
                </div>
                {/* Decorative circle */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            </div>
        </div>
    );
};
