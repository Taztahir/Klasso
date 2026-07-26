import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export interface LeaderboardEntry {
    user_id: string;
    total_xp: number;
    quizzes_completed: number;
    rank?: number;
    name?: string;
    avatar?: string;
    streak?: number;
    trend?: 'up' | 'down' | 'same';
}

export const userActivityService = {
    /**
     * Fetches the global leaderboard from Firestore.
     * Aggregates XP from quiz attempts and joins with user profiles.
     */
    async getGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
        try {
            // 1. Fetch all quizzes to aggregate XP (In a large app, this would be a pre-calculated collection)
            const quizzesSnap = await getDocs(collection(db, 'quizzes'));
            const userStats: Record<string, { total_xp: number, quizzes_completed: number }> = {};

            quizzesSnap.docs.forEach(doc => {
                const data = doc.data();
                const userId = data.user_id;
                const xp = (data.score || 0) * 10; // XP logic: 10 per correct answer

                if (!userStats[userId]) {
                    userStats[userId] = { total_xp: 0, quizzes_completed: 0 };
                }
                userStats[userId].total_xp += xp;
                userStats[userId].quizzes_completed += 1;
            });

            // 2. Fetch profiles to get names/avatars
            const profilesSnap = await getDocs(collection(db, 'profiles'));
            const profiles: Record<string, any> = {};
            profilesSnap.docs.forEach(doc => {
                profiles[doc.id] = doc.data();
            });

            // 3. Assemble leaderboard
            const leaderboard: LeaderboardEntry[] = Object.keys(userStats).map(userId => ({
                user_id: userId,
                total_xp: userStats[userId].total_xp,
                quizzes_completed: userStats[userId].quizzes_completed,
                name: profiles[userId]?.full_name || profiles[userId]?.username || 'Academic Scholar',
                avatar: profiles[userId]?.avatar_url || null,
                streak: Math.floor(Math.random() * 5) + 1, // Mock streak for now
                trend: 'same'
            }));

            // 4. Sort by XP
            return leaderboard.sort((a, b) => b.total_xp - a.total_xp);
        } catch (error) {
            console.error("Leaderboard Service Error:", error);
            return [];
        }
    },

    /**
     * Fetches the current user's study streak (consecutive active days).
     */
    async getUserStreak(): Promise<number> {
        // Note: Full implementation logic requires tracking consecutive daily study sessions.
        // Returning 0 for now until the backend aggregate is fully configured.
        return 0;
    }
};
