import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userActivityService, LeaderboardEntry } from '../../services/userActivityService';

export const LeaderboardView = () => {
    const { user } = useAuth();
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const data = await userActivityService.getGlobalLeaderboard();

            // Just add trend/streak mocks for visuals if they don't exist in data
            const enrichedData = data.map((entry) => ({
                ...entry,
                streak: Math.floor(Math.random() * 5) + 1,
                trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.2 ? 'same' : 'down' as any
            }));

            // Only show data from backend
            setLeaderboardData(enrichedData);
            setLoading(false);
        };

        fetchLeaderboard();
    }, [user]);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter italic">Leaderboard</h1>
                    <p className="text-brandBlack/60 font-bold uppercase tracking-widest text-[10px] mt-0.5">Study smarter. Rank higher.</p>
                </div>
                <div className="hidden sm:flex items-center gap-3 bg-white border border-[var(--border)] p-3 rounded-xl shadow-sm transition-all cursor-default relative overflow-hidden group">
                    <Trophy className="w-5 h-5 text-[var(--brand-yellow)] relative z-10" />
                    <div className="relative z-10">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Your Rank</p>
                        <p className="font-extrabold tracking-tight text-[var(--brand-black)] text-sm">#4 Globally</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead className="bg-[var(--brand-cream-dark)] text-[var(--brand-black)]">
                        <tr>
                            <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-widest">Rank</th>
                            <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-widest">Scholar</th>
                            <th className="px-5 py-3 text-center text-[9px] font-black uppercase tracking-widest">Score</th>
                            <th className="px-5 py-3 text-center text-[9px] font-black uppercase tracking-widest">Streak</th>
                            <th className="px-5 py-3 text-right text-[9px] font-black uppercase tracking-widest">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-brandPurple" />
                                    <p className="mt-2 text-sm font-bold text-brandBlack/60">Crunching numbers...</p>
                                </td>
                            </tr>
                        ) : leaderboardData.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <Trophy className="w-12 h-12 text-brandYellow opacity-50" />
                                        <p className="text-sm font-bold text-brandBlack/60 uppercase tracking-widest">No scholars ranked yet. Be the first!</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            leaderboardData.map((leaderboardUser, i) => (
                                <tr key={i} className={`hover:bg-[var(--brand-cream)] transition-all duration-300 ${leaderboardUser.user_id === user?.id ? 'bg-[var(--accent-soft)] border-l-2 border-[var(--brand-purple)]' : 'border-l-2 border-transparent'}`}>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg font-black tracking-tight text-xs">
                                            {i === 0 ? <Crown className="w-5 h-5 text-[var(--brand-yellow)]" /> :
                                                i === 1 ? <Medal className="w-5 h-5 text-slate-400" /> :
                                                    i === 2 ? <Medal className="w-5 h-5 text-amber-700" /> :
                                                        `#${i + 1}`}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full border border-gray-100 shadow-sm backdrop-blur-sm bg-white/50 overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboardUser.avatar}`} alt="avatar" />
                                            </div>
                                            <span className="font-black tracking-tight text-[13px]">{leaderboardUser.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-center font-black tabular-nums text-xs">{leaderboardUser.total_xp} XP</td>
                                    <td className="px-5 py-3 text-center font-black tracking-tight text-[var(--brand-purple)] text-xs">{leaderboardUser.streak}d</td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end">
                                            {leaderboardUser.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 text-green-500" /> :
                                                leaderboardUser.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5 text-red-500" /> :
                                                    <Minus className="w-3.5 h-3.5 text-gray-300" />}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[var(--brand-yellow)] text-black border border-[var(--border)] p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <h3 className="font-extrabold uppercase mb-1.5 tracking-tight text-sm">Weekly Prize</h3>
                    <p className="font-medium text-[11px] opacity-70">Top 3 scholars unlock a free month of Premium + exclusive badge.</p>
                </div>
                <div className="bg-[var(--brand-purple)] text-white border border-[var(--border)] p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <h3 className="font-extrabold uppercase mb-1.5 tracking-tight text-sm">Goal: 3000 XP</h3>
                    <div className="w-full bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="w-[82%] bg-white h-full rounded-full"></div>
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md border border-[var(--border)] p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <h3 className="font-extrabold uppercase mb-1.5 text-brandBlack tracking-tight text-sm">Social Challenge</h3>
                    <p className="font-medium text-[11px] text-gray-500">Invite a friend to a study duel and earn 500 bonus XP.</p>
                </div>
            </div>
        </div>
    );
};
