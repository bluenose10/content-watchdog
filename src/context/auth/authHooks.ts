
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { checkAdminStatus } from "./constants";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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

  return {
    user, 
    setUser,
    session, 
    setSession,
    loading, 
    setLoading,
    isAdmin, 
    setIsAdmin
  };
};
