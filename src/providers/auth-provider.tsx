'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/types/user';
import { getUserByEmail } from '@/data/users';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: string, orgName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  isSupabase: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  signup: async () => ({ success: false }),
  logout: async () => {},
  resetPassword: async () => ({ success: false }),
  isLoading: true,
  isSupabase: false,
});

function profileToUser(profile: any, isDemo: boolean = false): User {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    organisationId: profile.organisation_id,
    avatarUrl: profile.avatar_url,
    isDemo,
    createdAt: profile.created_at,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check for existing session
  useEffect(() => {
    async function init() {
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser(profileToUser(profile));
          }
        } else {
          checkDemoSession();
        }
      } else {
        checkDemoSession();
      }
      setIsLoading(false);
    }

    function checkDemoSession() {
      const stored = localStorage.getItem('scanvault-user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem('scanvault-user');
        }
      }
    }

    init();

    // Listen for Supabase auth changes
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_OUT') {
            setUser(null);
          } else if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profileToUser(profile));
            }
          }
        }
      );

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.user) return true;
    }

    // Demo login fallback
    const found = getUserByEmail(email);
    if (found) {
      setUser(found);
      localStorage.setItem('scanvault-user', JSON.stringify(found));
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(async (
    email: string,
    password: string,
    name: string,
    role: string,
    orgName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Registration unavailable in demo mode' };
    }

    // Sign up with Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Signup failed — please try again' };
    }

    // Create organisation if company name provided
    if (orgName && role !== 'individual') {
      const { error: rpcError } = await supabase.rpc('create_org_for_user', {
        org_name: orgName,
        org_type: role,
      });

      if (rpcError) {
        console.error('Org creation error:', rpcError.message);
        // Non-fatal — user is still created, org can be added later
      }
    }

    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('scanvault-user');
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Password reset unavailable in demo mode' };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, resetPassword, isLoading, isSupabase: isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
