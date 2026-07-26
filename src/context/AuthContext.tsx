import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { useToast } from './ToastContext';

export interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (credentials: any) => Promise<{ error: any }>;
    signUp: (credentials: any) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<{ error: any }>;
    updateProfile: (data: {
        full_name?: string;
        first_name?: string;
        last_name?: string;
        username?: string;
        avatar_url?: string;
        is_premium?: boolean;
        private_profile?: boolean;
    }) => Promise<{ error: any }>;
    uploadAvatar: (file: File) => Promise<{ publicUrl: string | null; error: any }>;
    deleteAccount: () => Promise<{ error: any }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const checkUrlErrors = () => {
            const hash = window.location.hash;
            const params = new URLSearchParams(window.location.search);
            let error = params.get('error');
            let errorDescription = params.get('error_description');

            if (!error && hash.includes('error=')) {
                const hashParams = new URLSearchParams(hash.substring(1));
                error = hashParams.get('error');
                errorDescription = hashParams.get('error_description');
            }

            if (error || errorDescription) {
                console.error('Auth Error from URL:', error, errorDescription);
                let displayMessage = errorDescription || 'There was a problem signing you in. Please try again.';
                if (displayMessage.includes('registration is disabled')) {
                    displayMessage = 'Account not found. Please sign up to create a new account.';
                } else if (displayMessage.includes('OAuth-link error')) {
                    displayMessage = 'This Google account is already linked to another email. Try logging in with your email instead.';
                } else if (displayMessage.toLowerCase().includes('email not confirmed')) {
                    displayMessage = 'Please confirm your email address before logging in.';
                }
                showToast('Authentication Error', decodeURIComponent(displayMessage.replace(/\+/g, ' ')), 'error');
                window.history.replaceState(null, '', window.location.pathname);
            }
        };

        checkUrlErrors();

        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Helper for services to get current user ID without async overhead for listeners
        (supabase.auth as any).getLocalStorageSession = () => {
            const sessionStr = localStorage.getItem(`sb-${import.meta.env.VITE_SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`);
            if (!sessionStr) return null;
            return { data: { user: JSON.parse(sessionStr).user } };
        };

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setSession(session);
            setUser(currentUser);
            setLoading(false);

            // Ensure Firestore profile exists on login
            if (currentUser) {
                const initProfile = async () => {
                    try {
                        const profileRef = doc(db, 'profiles', currentUser.id);
                        const profileSnap = await getDoc(profileRef);
                        if (!profileSnap.exists()) {
                            await setDoc(profileRef, {
                                full_name: currentUser.user_metadata.full_name || '',
                                first_name: currentUser.user_metadata.first_name || '',
                                last_name: currentUser.user_metadata.last_name || '',
                                username: currentUser.user_metadata.username || currentUser.email?.split('@')[0] || 'Scholar',
                                avatar_url: currentUser.user_metadata.avatar_url || '',
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            });
                        }
                    } catch (err) {
                        console.error('Error auto-initializing profile:', err);
                    }
                };
                initProfile();
            }
        });

        return () => subscription.unsubscribe();
    }, [showToast]);

    const signIn = async (credentials: any) => {
        const { error } = await supabase.auth.signInWithPassword(credentials);
        return { error };
    };

    const signUp = async (credentials: any) => {
        const { error } = await supabase.auth.signUp(credentials);
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const signInWithGoogle = async () => {
        const siteUrl = window.location.origin;

        console.log('Initiating Google Auth Sign-in...');
        console.log('Redirect URI target:', `${siteUrl}/chat`);

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${siteUrl}/chat`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'select_account',
                    },
                }
            });

            if (error) {
                console.error('Supabase OAuth Error:', error.message);
                return { error };
            }

            console.log('OAuth Initiation Success:', data);
            return { error: null };
        } catch (err: any) {
            console.error('Unexpected Auth Error:', err);
            return { error: err };
        }
    };

    const updateProfile = async (data: {
        full_name?: string;
        first_name?: string;
        last_name?: string;
        username?: string;
        avatar_url?: string;
        is_premium?: boolean;
        private_profile?: boolean;
    }) => {
        const updateData: any = {};
        if (data.full_name) updateData.full_name = data.full_name;
        if (data.first_name) updateData.first_name = data.first_name;
        if (data.last_name) updateData.last_name = data.last_name;
        if (data.username) updateData.username = data.username;
        if (data.avatar_url) updateData.avatar_url = data.avatar_url;
        if (data.is_premium !== undefined) updateData.is_premium = data.is_premium;
        if (data.private_profile !== undefined) updateData.private_profile = data.private_profile;

        const { data: updatedUser, error } = await supabase.auth.updateUser({
            data: updateData
        });

        if (!error && updatedUser.user) {
            setUser(updatedUser.user);

            // Sync to Firestore profiles collection for leaderboard/public display
            try {
                await setDoc(doc(db, 'profiles', updatedUser.user.id), {
                    full_name: updateData.full_name || updatedUser.user.user_metadata.full_name || '',
                    first_name: updateData.first_name || updatedUser.user.user_metadata.first_name || '',
                    last_name: updateData.last_name || updatedUser.user.user_metadata.last_name || '',
                    username: updateData.username || updatedUser.user.user_metadata.username || '',
                    avatar_url: updateData.avatar_url || updatedUser.user.user_metadata.avatar_url || '',
                    private_profile: updateData.private_profile !== undefined ? updateData.private_profile : (updatedUser.user.user_metadata.private_profile || false),
                    updated_at: new Date().toISOString()
                }, { merge: true });
            } catch (fsError) {
                console.error('Error syncing profile to Firestore:', fsError);
            }
        }
        return { error };
    };

    const uploadAvatar = async (file: File) => {
        if (!user) return { publicUrl: null, error: 'Not authenticated' };

        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/avatar.${fileExt}`;

            // 1. Upload the file
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // 2. Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 3. Update profile metadata
            await updateProfile({ avatar_url: publicUrl });

            return { publicUrl, error: null };
        } catch (error: any) {
            return { publicUrl: null, error };
        }
    };

    const deleteAccount = async () => {
        if (!user) return { error: 'Not authenticated' };

        try {
            // 1. Wipe user data from all related Firestore collections
            const collectionsToDelete = ['projects', 'quizzes', 'chatSessions', 'studySessions', 'userSettings', 'profiles'];

            for (const colName of collectionsToDelete) {
                try {
                    const q = query(collection(db, colName), where('user_id', '==', user.id));
                    // Profiles is keyed by ID directly
                    if (colName === 'profiles' || colName === 'userSettings') {
                        await deleteDoc(doc(db, colName, user.id));
                    } else {
                        const snapshot = await getDocs(q);
                        const batch = writeBatch(db);
                        snapshot.docs.forEach((doc) => batch.delete(doc.ref));
                        await batch.commit();
                    }
                } catch (fsError) {
                    console.error(`Error deleting Firestore data for ${colName}:`, fsError);
                }
            }

            // 2. Clear Supabase data (legacy - optional but kept for safety)
            await supabase.from('quizzes').delete().eq('user_id', user.id);
            await supabase.from('study_sessions').delete().eq('user_id', user.id);
            await supabase.from('projects').delete().eq('user_id', user.id);

            // 2. Sign Out
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) throw signOutError;

            return { error: null };
        } catch (error: any) {
            console.error('Error deleting account:', error);
            return { error };
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, signInWithGoogle, updateProfile, uploadAvatar, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
};
