
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, options?: { data: any }) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize or update the user and session when auth state changes
  useEffect(() => {
    try {
      // Get the current session
      const fetchSession = async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error fetching session:", error);
            setSession(null);
            setUser(null);
          } else {
            setSession(data.session);
            setUser(data.session?.user || null);
          }
          
          setLoading(false);
        } catch (e) {
          console.error("Exception in fetching session:", e);
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      };

      fetchSession();

      // Listen for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user || null);
          setLoading(false);
        }
      );

      // Cleanup listener on unmount
      return () => {
        authListener?.subscription.unsubscribe();
      };
    } catch (e) {
      console.error("Exception in auth provider:", e);
      setLoading(false);
    }
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, options?: { data: any }) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: options?.data
        }
      });
      return { data, error };
    } catch (error) {
      console.error("Sign up error:", error);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      console.error("Reset password error:", error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
