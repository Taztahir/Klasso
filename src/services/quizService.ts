export interface QuizAttempt {
    id: string;
    user_id: string;
    topic: string;
    score: number;
    total_questions: number;
    time_spent: number;
    wrong_answers: any[];
    created_at: string;
}

export const quizService = {
    async saveQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'created_at' | 'user_id'>) {
        const historyStr = localStorage.getItem('klasso_quizzes') || '[]';
        const history = JSON.parse(historyStr) as QuizAttempt[];

        const newAttempt: QuizAttempt = {
            ...attempt,
            id: 'quiz-' + Math.random().toString(36).substr(2, 9),
            user_id: 'demo-user-id',
            created_at: new Date().toISOString()
        };

        history.unshift(newAttempt);
        localStorage.setItem('klasso_quizzes', JSON.stringify(history));
        return newAttempt;
    },

    async getQuizHistory() {
        const historyStr = localStorage.getItem('klasso_quizzes') || '[]';
        return JSON.parse(historyStr) as QuizAttempt[];
    },

    async getQuizById(id: string) {
        const history = await this.getQuizHistory();
        const found = history.find(q => q.id === id);
        if (!found) {
            throw new Error('Quiz not found');
        }
        return found;
    },

    async getStats() {
        const history = await this.getQuizHistory();
        if (history.length === 0) return { totalQuizzes: 0, avgScore: 0 };

        const totalScore = history.reduce((acc, curr) => acc + (curr.score / curr.total_questions), 0);
        return {
            totalQuizzes: history.length,
            avgScore: Math.round((totalScore / history.length) * 100)
        };
    },

    subscribeToStats(callback: (stats: { totalQuizzes: number, avgScore: number }) => void) {
        this.getStats().then(callback);
        return { unsubscribe: () => { } };
    }
};

export const studySessionService = {
    async logStudyTime(durationSeconds: number) {
        const sessionsStr = localStorage.getItem('klasso_study_sessions') || '[]';
        const sessions = JSON.parse(sessionsStr);

        sessions.push({
            user_id: 'demo-user-id',
            duration: durationSeconds,
            started_at: new Date().toISOString(),
            created_at: new Date().toISOString()
        });

        localStorage.setItem('klasso_study_sessions', JSON.stringify(sessions));
    },

    async getTotalStudyTime() {
        const sessionsStr = localStorage.getItem('klasso_study_sessions') || '[]';
        const sessions = JSON.parse(sessionsStr);
        return sessions.reduce((acc: number, curr: any) => acc + (curr.duration || 0), 0);
    },

    subscribeToTotalTime(callback: (seconds: number) => void) {
        this.getTotalStudyTime().then(callback);
        return { unsubscribe: () => { } };
    }
};
