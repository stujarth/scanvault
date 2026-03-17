'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/types/user';
import { getUserByEmail } from '@/data/users';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isSupabase: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: async () => {},
  isLoading: true,
  isSupabase: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check for existing session
  useEffect(() => {
    async function init() {
      if (isSupabaseConfigured) {
        // Try Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch profile from Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: profile.role,
              organisationId: profile.organisation_id,
              avatarUrl: profile.avatar_url,
              isDemo: false,
              createdAt: profile.created_at,
            });
          }
        } else {
          // Fall through to check localStorage for demo users
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
              setUser({
                id: profile.id,
                email: profile.email,
                name: profile.name,
                role: profile.role,
                organisationId: profile.organisation_id,
                avatarUrl: profile.avatar_url,
                isDemo: false,
                createdAt: profile.created_at,
              });
            }
          }
        }
      );

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Try Supabase auth first if configured
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        // Auth state change listener will update the user
        return true;
      }
      // If Supabase auth fails, fall through to demo login
    }

    // Demo login — match email against mock users
    const found = getUserByEmail(email);
    if (found) {
      setUser(found);
      localStorage.setItem('scanvault-user', JSON.stringify(found));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('scanvault-user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isSupabase: isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
