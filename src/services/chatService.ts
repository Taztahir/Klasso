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
    getDoc
} from 'firebase/firestore';

export interface ChatMessage {
    id: string;
    session_id: string;
    user_id: string;
    role: 'user' | 'model';
    content: string;
    is_liked: boolean;
    created_at: any;
}

export interface ChatSession {
    id: string;
    user_id: string;
    title: string | null;
    created_at: any;
}

export const chatService = {
    async createSession(title?: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const docRef = await addDoc(collection(db, 'chatSessions'), {
            user_id: user.id,
            title: title || 'New Conversation',
            created_at: serverTimestamp()
        });

        return {
            id: docRef.id,
            user_id: user.id,
            title: title || 'New Conversation',
            created_at: new Date().toISOString()
        } as ChatSession;
    },

    async getSessions() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const q = query(
            collection(db, 'chatSessions'),
            where('user_id', '==', user.id),
            orderBy('created_at', 'desc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ChatSession[];
    },

    async getMessages(sessionId: string) {
        const q = query(
            collection(db, 'chatMessages'),
            where('session_id', '==', sessionId),
            orderBy('created_at', 'asc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate()?.toISOString() || new Date().toISOString()
        })) as ChatMessage[];
    },

    async saveMessage(sessionId: string, role: 'user' | 'model', content: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const docRef = await addDoc(collection(db, 'chatMessages'), {
            session_id: sessionId,
            user_id: user.id,
            role,
            content,
            is_liked: false,
            created_at: serverTimestamp()
        });

        const newDoc = await getDoc(docRef);
        return {
            id: docRef.id,
            ...newDoc.data()
        } as ChatMessage;
    },

    async updateMessage(messageId: string, content: string) {
        const docRef = doc(db, 'chatMessages', messageId);
        await updateDoc(docRef, { content });
        const updatedDoc = await getDoc(docRef);
        return {
            id: updatedDoc.id,
            ...updatedDoc.data()
        } as ChatMessage;
    },

    async toggleLike(messageId: string, isLiked: boolean) {
        const docRef = doc(db, 'chatMessages', messageId);
        await updateDoc(docRef, { is_liked: isLiked });
        const updatedDoc = await getDoc(docRef);
        return {
            id: updatedDoc.id,
            ...updatedDoc.data()
        } as ChatMessage;
    },

    async deleteSession(sessionId: string) {
        // Delete the session document
        await deleteDoc(doc(db, 'chatSessions', sessionId));

        // Note: In Firestore, you usually delete messages via a Cloud Function or batch
        // For now, we'll just delete the session. In a real app, you'd want to clean up messages too.
        const q = query(collection(db, 'chatMessages'), where('session_id', '==', sessionId));
        const messagesSnapshot = await getDocs(q);
        messagesSnapshot.forEach(async (messageDoc) => {
            await deleteDoc(doc(db, 'chatMessages', messageDoc.id));
        });
    }
};
