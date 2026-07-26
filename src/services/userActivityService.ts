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
     * Fetches the global leaderboard.
     */
    async getGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
        // Return a realistic static leaderboard that represents users in the platform offline
        const mockLeaderboard: LeaderboardEntry[] = [
            { user_id: '1', total_xp: 3200, quizzes_completed: 45, name: 'Principal Kunle', streak: 12, trend: 'up' },
            { user_id: 'demo-user-id', total_xp: 1540, quizzes_completed: 18, name: 'Demo Principal', streak: 5, trend: 'same' },
            { user_id: '3', total_xp: 1200, quizzes_completed: 14, name: 'Amaka Eze', streak: 3, trend: 'down' },
            { user_id: '4', total_xp: 850, quizzes_completed: 9, name: 'Tunde Olatunji', streak: 2, trend: 'up' },
            { user_id: '5', total_xp: 500, quizzes_completed: 6, name: 'Fatima Musa', streak: 1, trend: 'same' },
        ];
        return mockLeaderboard.sort((a, b) => b.total_xp - a.total_xp);
    },

    /**
     * Fetches the current user's study streak.
     */
    async getUserStreak(): Promise<number> {
        return 5; // Static demo streak
    }
};
