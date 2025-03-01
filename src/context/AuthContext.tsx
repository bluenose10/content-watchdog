
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, options?: { data: any }) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin emails list - in production, this would come from a database
const ADMIN_EMAILS = ['admin@influenceguard.com', 'test@example.com', 'mark.moran4@btinternet.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user email is in admin list
  const checkAdminStatus = (email: string | undefined) => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
  };

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
            setIsAdmin(false);
          } else {
            setSession(data.session);
            setUser(data.session?.user || null);
            setIsAdmin(checkAdminStatus(data.session?.user?.email));
          }
          
          setLoading(false);
        } catch (e) {
          console.error("Exception in fetching session:", e);
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      };

      fetchSession();

      // Listen for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log("Auth state changed:", event, newSession?.user?.email);
          
          if (event === 'SIGNED_OUT') {
            // Clear user and session on sign out
            setSession(null);
            setUser(null);
            setIsAdmin(false);
          } else if (newSession) {
            // Update user and session on sign in or session refresh
            setSession(newSession);
            setUser(newSession.user);
            setIsAdmin(checkAdminStatus(newSession.user?.email));
          }
          
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log("Sign in response:", data?.user?.email, error ? "Error: " + error.message : "Success");
      
      if (!error && data.user) {
        setIsAdmin(checkAdminStatus(data.user.email));
      }
      
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
      console.log("Sign up response:", data?.user?.email, error ? "Error: " + error.message : "Success");
      
      if (!error && data.user) {
        setIsAdmin(checkAdminStatus(data.user.email));
      }
      
      return { data, error };
    } catch (error) {
      console.error("Sign up error:", error);
      return { data: null, error };
    }
  };

  // Completely revamped signOut function with a cleaner approach
  const signOut = async () => {
    try {
      console.log("Executing clean logout process...");
      
      // 1. Clear React state first to update UI immediately
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      // 2. Clear local storage and cookies - done in a controlled, targeted manner
      // Clear all Supabase-related items from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // 3. Try Supabase signOut with options to maximize success
      await supabase.auth.signOut({ 
        scope: 'global', // Sign out from all tabs/windows
      });
      
      console.log("Logout completed successfully");
      return Promise.resolve();
    } catch (error) {
      console.error("Error during sign out:", error);
      // Still resolve the promise to not block UI
      return Promise.resolve();
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
    isAdmin,
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
