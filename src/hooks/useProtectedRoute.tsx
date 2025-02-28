
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getUserSubscription } from '@/lib/db-service';

// Define an enum for access levels
export enum AccessLevel {
  ANONYMOUS = 'anonymous',  // Not logged in
  BASIC = 'basic',         // Logged in with free account
  PREMIUM = 'premium',     // Paid account
  ADMIN = 'admin'          // Admin user
}

export enum PremiumFeature {
  UNLIMITED_RESULTS = 'unlimited_results',
  SCHEDULED_SEARCHES = 'scheduled_searches',
  ADVANCED_MONITORING = 'advanced_monitoring',
  EXPORT_RESULTS = 'export_results'
}

export interface ProtectedRouteResult {
  user: any;
  loading: boolean;
  accessLevel: AccessLevel;
  isReady: boolean;
  hasPremiumFeature: (feature: PremiumFeature) => boolean;
  premiumFeaturesLoading: boolean;
  isAdmin: boolean;
}

export const useProtectedRoute = (
  requiresAuth: boolean = true,
  requiresPremium: boolean = false,
  requiredFeature?: PremiumFeature,
  requiresAdmin: boolean = false
): ProtectedRouteResult => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(AccessLevel.ANONYMOUS);
  const [isReady, setIsReady] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [premiumFeaturesLoading, setPremiumFeaturesLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Add a debug log to see the auth state
  console.log("useProtectedRoute - Auth state:", { user: !!user, loading });

  // Function to check if user has a specific premium feature
  const hasPremiumFeature = (feature: PremiumFeature): boolean => {
    if (accessLevel !== AccessLevel.PREMIUM && accessLevel !== AccessLevel.ADMIN) return false;

    switch (feature) {
      case PremiumFeature.UNLIMITED_RESULTS:
        return subscription?.plans?.result_limit === -1;
      case PremiumFeature.SCHEDULED_SEARCHES:
        return (subscription?.plans?.scheduled_search_limit || 0) > 0;
      case PremiumFeature.ADVANCED_MONITORING:
        return subscription?.plans?.monitoring_limit > 0;
      case PremiumFeature.EXPORT_RESULTS:
        return true; // Assuming all premium plans have export capability
      default:
        return false;
    }
  };

  useEffect(() => {
    const determineAccessLevel = async () => {
      if (loading) return;
      
      // If user is not logged in
      if (!user) {
        console.log("useProtectedRoute - Setting anonymous access level");
        setAccessLevel(AccessLevel.ANONYMOUS);
        setIsAdmin(false);
        
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
          setPremiumFeaturesLoading(true);
          const userSubscription = await getUserSubscription(user.id);
          setSubscription(userSubscription);
          
          // Check if user is admin (hard-coded list of admin emails for now)
          // In a real app, you'd have an admin flag in your user database
          const adminEmails = ['admin@example.com', user.email]; // Add your email here
          const userIsAdmin = adminEmails.includes(user.email);
          setIsAdmin(userIsAdmin);
          
          // Determine access level based on subscription and admin status
          const isPremium = userSubscription?.plans?.price > 0 && 
                            userSubscription?.status === 'active';
          
          if (userIsAdmin) {
            setAccessLevel(AccessLevel.ADMIN);
          } else if (isPremium) {
            setAccessLevel(AccessLevel.PREMIUM);
          } else {
            setAccessLevel(AccessLevel.BASIC);
          }
          
          // If route requires admin and user is not admin
          if (requiresAdmin && !userIsAdmin) {
            toast({
              title: "Admin access required",
              description: "You don't have permission to access this page",
              variant: "destructive",
            });
            
            navigate('/dashboard');
            return;
          }
          
          // If route requires premium and user doesn't have it
          if (requiresPremium && !isPremium && !userIsAdmin) {
            toast({
              title: "Premium access required",
              description: "Please upgrade your account to access this feature",
              variant: "destructive",
            });
            
            navigate('/dashboard');
            return;
          }
          
          // If route requires a specific premium feature
          if (requiredFeature && !hasPremiumFeature(requiredFeature) && !userIsAdmin) {
            toast({
              title: "Feature not available",
              description: "This feature requires a higher tier subscription",
              variant: "destructive",
            });
            
            navigate('/dashboard');
            return;
          }
          
        } catch (error) {
          console.error("Error checking subscription status:", error);
          setAccessLevel(AccessLevel.BASIC); // Default to basic if there's an error
          setIsAdmin(false);
        } finally {
          setPremiumFeaturesLoading(false);
        }
      }
      
      setIsReady(true);
    };

    determineAccessLevel();
  }, [user, loading, navigate, toast, requiresAuth, requiresPremium, requiredFeature, requiresAdmin]);

  return { 
    user, 
    loading, 
    accessLevel, 
    isReady, 
    hasPremiumFeature,
    premiumFeaturesLoading,
    isAdmin
  };
};
