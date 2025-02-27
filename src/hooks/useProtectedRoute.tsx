
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Define an enum for access levels
export enum AccessLevel {
  ANONYMOUS = 'anonymous',  // Not logged in
  BASIC = 'basic',         // Logged in with free account
  PREMIUM = 'premium'      // Paid account
}

export const useProtectedRoute = (
  requiresAuth: boolean = true,
  requiresPremium: boolean = false
) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(AccessLevel.ANONYMOUS);
  const [isReady, setIsReady] = useState(false);

  // Add a debug log to see the auth state
  console.log("useProtectedRoute - Auth state:", { user: !!user, loading });

  useEffect(() => {
    const determineAccessLevel = async () => {
      if (loading) return;
      
      // If user is not logged in
      if (!user) {
        console.log("useProtectedRoute - Setting anonymous access level");
        setAccessLevel(AccessLevel.ANONYMOUS);
        
        // If route requires authentication, redirect to login
        if (requiresAuth) {
          toast({
            title: "Authentication required",
            description: "Please log in to access this page",
            variant: "destructive",
          });
          
          // Store the current path to redirect back after login
          const currentPath = window.location.pathname;
          if (currentPath !== '/login' && currentPath !== '/signup') {
            sessionStorage.setItem('redirectAfterLogin', currentPath);
          }
          
          navigate('/login');
          return;
        }
      } 
      // If user is logged in
      else {
        try {
          console.log("useProtectedRoute - User is authenticated");
          // Check if the user has a premium subscription
          // For demo purposes, we're assuming this logic will be implemented later
          // This would typically involve checking a subscription status in the database
          const isPremium = false; // Replace with actual subscription check
          
          setAccessLevel(isPremium ? AccessLevel.PREMIUM : AccessLevel.BASIC);
          
          // If route requires premium and user doesn't have it
          if (requiresPremium && !isPremium) {
            toast({
              title: "Premium access required",
              description: "Please upgrade your account to access this feature",
              variant: "destructive",
            });
            
            navigate('/dashboard');
            return;
          }
        } catch (error) {
          console.error("Error checking subscription status:", error);
          setAccessLevel(AccessLevel.BASIC); // Default to basic if there's an error
        }
      }
      
      setIsReady(true);
    };

    determineAccessLevel();
  }, [user, loading, navigate, toast, requiresAuth, requiresPremium]);

  return { user, loading, accessLevel, isReady };
};
