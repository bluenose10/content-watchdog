
import React, { createContext, useContext } from "react";
import { useAuthState } from "./authHooks";
import { signIn, signUp, signOut, resetPassword } from "./authMethods";
import { AuthContextType } from "./types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, setUser,
    session, setSession,
    loading,
    isAdmin, setIsAdmin
  } = useAuthState();

  // Debug auth state
  React.useEffect(() => {
    console.log("Auth state changed:", { 
      user: user ? `${user.email} (${user.id})` : 'null', 
      loading, 
      isAdmin,
      sessionActive: !!session
    });
  }, [user, session, loading, isAdmin]);

  // Wrap auth methods with state setters
  const handleSignIn = (email: string, password: string) => {
    console.log("SignIn attempt for:", email);
    return signIn(email, password, setIsAdmin);
  };

  const handleSignUp = (email: string, password: string, options?: { data: any }) => {
    console.log("SignUp attempt for:", email, "with options:", options);
    return signUp(email, password, options);
  };

  const handleSignOut = () => {
    console.log("SignOut requested");
    return signOut(setUser, setSession, setIsAdmin);
  };

  const handleResetPassword = (email: string) => {
    console.log("Reset password requested for:", email);
    return resetPassword(email);
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
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
