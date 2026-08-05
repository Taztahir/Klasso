'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from './ToastContext';

// Offline-friendly interface definitions
export interface User {
    id: string;
    email?: string;
    user_metadata: {
        full_name?: string;
        first_name?: string;
        last_name?: string;
        username?: string;
        avatar_url?: string;
        is_premium?: boolean;
        private_profile?: boolean;
    };
}

export interface Session {
    access_token: string;
    user: User;
}

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

    // Load session from localStorage on mount
    useEffect(() => {
        const localSession = localStorage.getItem('klasso_session');
        if (localSession) {
            try {
                const parsed = JSON.parse(localSession);
                setSession(parsed);
                setUser(parsed.user);
            } catch (e) {
                console.error('Error parsing local session', e);
            }
        } else {
            setSession(null);
            setUser(null);
        }
        setLoading(false);
    }, []);

    const signIn = async (credentials: any) => {
        const mockUser: User = {
            id: 'demo-user-id',
            email: credentials.email || 'demo@klasso.app',
            user_metadata: {
                full_name: 'Demo Principal',
                first_name: 'Demo',
                last_name: 'Principal',
                username: (credentials.email || 'demo').split('@')[0],
                avatar_url: '',
                is_premium: true,
                private_profile: false
            }
        };
        const newSession = { access_token: 'mock-jwt', user: mockUser };
        setSession(newSession);
        setUser(mockUser);
        localStorage.setItem('klasso_session', JSON.stringify(newSession));
        showToast('Success', 'Successfully signed in (Offline Mode)', 'success');
        return { error: null };
    };

    const signUp = async (credentials: any) => {
        const mockUser: User = {
            id: 'demo-user-id',
            email: credentials.email || 'demo@klasso.app',
            user_metadata: {
                full_name: credentials.fullName || 'Demo Principal',
                first_name: credentials.fullName?.split(' ')[0] || 'Demo',
                last_name: credentials.fullName?.split(' ')[1] || 'Principal',
                username: (credentials.email || 'demo').split('@')[0],
                avatar_url: '',
                is_premium: true,
                private_profile: false
            }
        };
        const newSession = { access_token: 'mock-jwt', user: mockUser };
        setSession(newSession);
        setUser(mockUser);
        localStorage.setItem('klasso_session', JSON.stringify(newSession));
        showToast('Success', 'Successfully created account (Offline Mode)', 'success');
        return { error: null };
    };

    const signOut = async () => {
        localStorage.removeItem('klasso_session');
        setSession(null);
        setUser(null);
        showToast('Info', 'Successfully signed out', 'info');
    };

    const signInWithGoogle = async () => {
        const mockUser: User = {
            id: 'demo-user-id',
            email: 'google-user@klasso.app',
            user_metadata: {
                full_name: 'Google Scholar',
                first_name: 'Google',
                last_name: 'Scholar',
                username: 'googlescholar',
                avatar_url: '',
                is_premium: true,
                private_profile: false
            }
        };
        const newSession = { access_token: 'mock-jwt-google', user: mockUser };
        setSession(newSession);
        setUser(mockUser);
        localStorage.setItem('klasso_session', JSON.stringify(newSession));
        showToast('Success', 'Successfully logged in with Google (Offline)', 'success');
        return { error: null };
    };

    const updateProfile = async (data: any) => {
        if (!user) return { error: 'No user session' };

        const updatedUser: User = {
            ...user,
            user_metadata: {
                ...user.user_metadata,
                ...data
            }
        };

        const updatedSession = { ...session!, user: updatedUser };
        setSession(updatedSession);
        setUser(updatedUser);
        localStorage.setItem('klasso_session', JSON.stringify(updatedSession));
        showToast('Success', 'Profile updated (Offline Mode)', 'success');
        return { error: null };
    };

    const uploadAvatar = async (file: File): Promise<{ publicUrl: string | null; error: any }> => {
        return new Promise<{ publicUrl: string | null; error: any }>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                resolve({ publicUrl: dataUrl, error: null });
            };
            reader.onerror = () => {
                resolve({ publicUrl: null, error: 'File read error' });
            };
            reader.readAsDataURL(file);
        });
    };

    const deleteAccount = async () => {
        localStorage.removeItem('klasso_session');
        setSession(null);
        setUser(null);
        showToast('Info', 'Account deleted (Offline Mode)', 'info');
        return { error: null };
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            loading,
            signIn,
            signUp,
            signOut,
            signInWithGoogle,
            updateProfile,
            uploadAvatar,
            deleteAccount
        }}>
            {children}
        </AuthContext.Provider>
    );
};
