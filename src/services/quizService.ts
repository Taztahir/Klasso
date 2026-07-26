import { supabase } from '../lib/supabase';
import { db } from '../lib/firebase';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    doc,
    getDoc,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore';

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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const docRef = await addDoc(collection(db, 'quizzes'), {
            ...attempt,
            user_id: user.id,
            created_at: serverTimestamp()
        });

        const newDoc = await getDoc(docRef);
        return {
            id: docRef.id,
            ...newDoc.data(),
            created_at: new Date().toISOString()
        } as QuizAttempt;
    },

    async getQuizHistory() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const q = query(
            collection(db, 'quizzes'),
            where('user_id', '==', user.id),
            orderBy('created_at', 'desc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate()?.toISOString() || new Date().toISOString()
        })) as QuizAttempt[];
    },

    async getQuizById(id: string) {
        const docRef = doc(db, 'quizzes', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Quiz not found');
        }

        return {
            id: docSnap.id,
            ...docSnap.data(),
            created_at: docSnap.data().created_at?.toDate()?.toISOString() || new Date().toISOString()
        } as QuizAttempt;
    },

    async getStats() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { totalQuizzes: 0, avgScore: 0 };

        const q = query(collection(db, 'quizzes'), where('user_id', '==', user.id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return { totalQuizzes: 0, avgScore: 0 };

        const data = querySnapshot.docs.map(doc => doc.data());
        const totalScore = data.reduce((acc, curr) => acc + (curr.score / curr.total_questions), 0);

        return {
            totalQuizzes: data.length,
            avgScore: Math.round((totalScore / data.length) * 100)
        };
    },

    subscribeToStats(callback: (stats: { totalQuizzes: number, avgScore: number }) => void) {
        const { data: { user } } = (supabase.auth as any).getLocalStorageSession() || { data: { user: null } };
        if (!user) return { unsubscribe: () => { } };

        const q = query(collection(db, 'quizzes'), where('user_id', '==', user.id));

        const unsub = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                callback({ totalQuizzes: 0, avgScore: 0 });
                return;
            }

            const data = snapshot.docs.map(doc => doc.data());
            const totalScore = data.reduce((acc, curr) => acc + (curr.score / curr.total_questions), 0);

            callback({
                totalQuizzes: data.length,
                avgScore: Math.round((totalScore / data.length) * 100)
            });
        });

        return { unsubscribe: unsub };
    }
};

export const studySessionService = {
    async logStudyTime(durationSeconds: number) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await addDoc(collection(db, 'studySessions'), {
            user_id: user.id,
            duration: durationSeconds,
            started_at: serverTimestamp(),
            created_at: serverTimestamp()
        });
    },

    async getTotalStudyTime() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return 0;

        const q = query(collection(db, 'studySessions'), where('user_id', '==', user.id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return 0;

        return querySnapshot.docs.reduce((acc, curr) => acc + (curr.data().duration || 0), 0);
    },

    subscribeToTotalTime(callback: (seconds: number) => void) {
        const { data: { user } } = (supabase.auth as any).getLocalStorageSession() || { data: { user: null } };
        if (!user) return { unsubscribe: () => { } };

        const q = query(collection(db, 'studySessions'), where('user_id', '==', user.id));

        const unsub = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                callback(0);
                return;
            }

            const total = snapshot.docs.reduce((acc, curr) => acc + (curr.data().duration || 0), 0);
            callback(total);
        });

        return { unsubscribe: unsub };
    }
};
