
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getUserSubscription } from '@/lib/db-service';
import { PROTECTED_ROUTES } from '@/lib/constants';

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
  const { user, loading, isAdmin: authIsAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(AccessLevel.ANONYMOUS);
  const [isReady, setIsReady] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [premiumFeaturesLoading, setPremiumFeaturesLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Add debug logs
  console.log("useProtectedRoute - Auth state:", { 
    user: !!user, 
    loading, 
    isAdmin: authIsAdmin,
    currentPath: location.pathname,
    requiresAuth
  });

  // Function to check if user has a specific premium feature
  const hasPremiumFeature = (feature: PremiumFeature): boolean => {
    // Admin users have access to all premium features
    if (isAdmin) return true;
    
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
        setIsReady(true);
        return;
      } 
      
      // If user is logged in
      try {
        console.log("useProtectedRoute - User is authenticated");
        
        // Check if user is admin from auth context
        const userIsAdmin = authIsAdmin;
        setIsAdmin(userIsAdmin);
        
        // Check if the user has a premium subscription (if not admin)
        setPremiumFeaturesLoading(true);
        
        if (!userIsAdmin) {
          const userSubscription = await getUserSubscription(user.id);
          setSubscription(userSubscription);
          
          // Determine access level based on subscription
          const isPremium = userSubscription?.plans?.price > 0 && 
                          userSubscription?.status === 'active';
          
          if (isPremium) {
            setAccessLevel(AccessLevel.PREMIUM);
          } else {
            setAccessLevel(AccessLevel.BASIC);
          }
        } else {
          // Admin users get the ADMIN access level
          setAccessLevel(AccessLevel.ADMIN);
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
        
        // If route requires premium and user doesn't have it (not applicable to admins)
        if (requiresPremium && !userIsAdmin && accessLevel !== AccessLevel.PREMIUM) {
          toast({
            title: "Premium access required",
            description: "Please upgrade your account to access this feature",
            variant: "destructive",
          });
          
          navigate('/dashboard');
          return;
        }
        
        // If route requires a specific premium feature (not applicable to admins)
        if (requiredFeature && !userIsAdmin && !hasPremiumFeature(requiredFeature)) {
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
      } finally {
        setPremiumFeaturesLoading(false);
        setIsReady(true);
      }
    };

    determineAccessLevel();
  }, [user, loading, navigate, toast, requiresAuth, requiresPremium, requiredFeature, requiresAdmin, authIsAdmin, location.pathname]);

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
