
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { checkAdminStatus } from "./constants";

// Sign in with email and password
export const signIn = async (
  email: string, 
  password: string,
  setIsAdmin: (value: boolean) => void
) => {
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
export const signUp = async (
  email: string, 
  password: string, 
  options?: { data: any }
) => {
  try {
    console.log("Starting sign up process with options:", options);
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: options?.data,
        emailRedirectTo: window.location.origin + '/login'
      }
    });
    
    console.log("Sign up response:", data?.user?.email, error ? "Error: " + error.message : "Success");
    
    if (error) {
      console.error("Supabase signUp error details:", error);
    } else if (data.session === null) {
      console.log("Email confirmation required for this user");
    }
    
    return { data, error };
  } catch (error) {
    console.error("Sign up error:", error);
    return { data: null, error };
  }
};

// Logout functionality
export const signOut = async (
  setUser: (user: User | null) => void,
  setSession: (session: any) => void,
  setIsAdmin: (value: boolean) => void
) => {
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
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    return { error };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error };
  }
};
