'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  school_id: string | null;
  role: 'super_admin' | 'school_admin' | 'teacher' | 'staff';
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

export interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (credentials: any) => Promise<{ error: any }>;
  signUp: (credentials: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: any }>;
  updateProfile: (data: {
    full_name?: string;
    avatar_url?: string;
    phone?: string;
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
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Load active session and set up profile subscriptions
  useEffect(() => {
    let profileSubscription: any = null;

    const fetchProfile = async (uid: string) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', uid)
          .single();

        if (error) throw error;
        setProfile(data as UserProfile);
      } catch (err) {
        console.error('Error loading user profile:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (credentials: any) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUp = async (credentials: any) => {
    try {
      // 1. Sign up the user via Supabase Auth (includes meta-data)
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.options?.data?.full_name || '',
            role: 'school_admin',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // 2. If school name is provided and user is successfully created (auto-sign in / profile already created by DB trigger)
      if (credentials.schoolName && data.user) {
        // Trigger school setup API route
        const setupResponse = await fetch('/api/auth/setup-school', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ schoolName: credentials.schoolName }),
        });

        if (!setupResponse.ok) {
          const setupData = await setupResponse.json();
          throw new Error(setupData.error || 'User registered, but school setup failed.');
        }
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const updateProfile = async (data: any) => {
    if (!user) return { error: new Error('No user session active') };
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          phone: data.phone,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh in-memory profile
      const { data: updatedProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (updatedProfile) {
        setProfile(updatedProfile as UserProfile);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const uploadAvatar = async (file: File): Promise<{ publicUrl: string | null; error: any }> => {
    if (!user) return { publicUrl: null, error: new Error('No user session active') };
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      // Upload file to avatars bucket (must be created in Supabase storage)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return { publicUrl: data.publicUrl, error: null };
    } catch (err: any) {
      return { publicUrl: null, error: err };
    }
  };

  const deleteAccount = async () => {
    // Rely on backend API/edge function (if built) to trigger user deletion.
    // For now, sign out user and trigger client deletion mock.
    try {
      const { error } = await supabase.rpc('delete_user_self'); // optional database RPC function
      if (error) throw error;
      await signOut();
      return { error: null };
    } catch (err: any) {
      // Fallback: simply sign out
      await signOut();
      return { error: null };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
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
