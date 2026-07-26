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
    updateDoc,
    deleteDoc,
    serverTimestamp,
    getDoc,
    setDoc,
    onSnapshot
} from 'firebase/firestore';

export interface Project {
    id: string;
    user_id: string;
    name: string;
    file_type: string;
    file_size: string;
    created_at: string;
    summary?: string;
    content_url?: string;
}

export const studyService = {
    async getProjects() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        console.log('[StudyService] Fetching projects for Supabase UID:', user.id);

        const q = query(
            collection(db, 'projects'),
            where('user_id', '==', user.id),
            orderBy('created_at', 'desc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate()?.toISOString() || new Date().toISOString()
        })) as Project[];
    },

    async createProject(project: Omit<Project, 'id' | 'created_at' | 'user_id'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const docRef = await addDoc(collection(db, 'projects'), {
            ...project,
            user_id: user.id,
            created_at: serverTimestamp()
        });

        const newDoc = await getDoc(docRef);
        return {
            id: docRef.id,
            ...newDoc.data(),
            created_at: new Date().toISOString()
        } as Project;
    },

    async deleteProject(id: string) {
        await deleteDoc(doc(db, 'projects', id));
    },

    async getSettings() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const docRef = doc(db, 'userSettings', user.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            const initialSettings = {
                user_id: user.id,
                recent_searches: [],
                theme: 'light',
                updated_at: serverTimestamp(),
                hapticsEnabled: true,
                isLowData: false,
                notifications: false,
                notificationsEnabled: true,
                privacyMode: false,
                privateProfile: false,
            };
            await setDoc(docRef, initialSettings);
            return initialSettings;
        }

        return docSnap.data();
    },

    async updateRecentSearches(term: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const docRef = doc(db, 'userSettings', user.id);
        const settings = await this.getSettings();

        const searches = settings?.recent_searches || [];
        if (searches.includes(term)) return searches;

        const updated = [term, ...searches.slice(0, 4)];

        await updateDoc(docRef, {
            recent_searches: updated,
            updated_at: serverTimestamp()
        });

        return updated;
    },

    subscribeToProjects(callback: (payload: any) => void) {
        const { data: { user } } = (supabase.auth as any).getLocalStorageSession() || { data: { user: null } };
        if (!user) return { unsubscribe: () => { } };

        const q = query(
            collection(db, 'projects'),
            where('user_id', '==', user.id),
            orderBy('created_at', 'desc')
        );

        const unsub = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const docData = { id: change.doc.id, ...change.doc.data() };
                if (change.type === 'added') {
                    callback({ eventType: 'INSERT', new: docData });
                } else if (change.type === 'modified') {
                    callback({ eventType: 'UPDATE', new: docData });
                } else if (change.type === 'removed') {
                    callback({ eventType: 'DELETE', old: docData });
                }
            });
        }, (error) => {
            console.error("Firestore Snapshot Error:", error);
        });

        return { unsubscribe: unsub };
    }
};
