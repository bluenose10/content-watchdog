
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getUserSubscription } from '@/lib/db-service';
import { PROTECTED_ROUTES } from '@/lib/constants';
import { AccessLevel, PremiumFeature, ProtectedRouteResult } from './types/authTypes';
import { checkFeatureAccess } from './utils/featureUtils';

export { AccessLevel, PremiumFeature };
export type { ProtectedRouteResult };

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
    return checkFeatureAccess(feature, isAdmin, subscription);
  };

  useEffect(() => {
    const determineAccessLevel = async () => {
      if (loading) return;
           
      // If user is not logged in
      if (!user) {
        console.log("useProtectedRoute - Setting anonymous access level");
        setAccessLevel(AccessLevel.ANONYMOUS);
        setIsAdmin(false);
        
        // If this is a protected route, redirect to login
        if (requiresAuth && PROTECTED_ROUTES.some(route => 
          location.pathname === route || location.pathname.startsWith(route + '/'))) {
          console.log("Protected route detected - redirecting to login");
          toast({
            title: "Authentication required",
            description: "Please log in to access this page",
            variant: "destructive",
          });
          navigate('/login', { state: { from: location.pathname } });
          return;
        }
        
        setIsReady(true);
        return;
      } 
      
      // If user is logged in
      try {
        console.log("useProtectedRoute - User is authenticated");
        
        // Check if user is admin from auth context
        const userIsAdmin = authIsAdmin;
        setIsAdmin(userIsAdmin);
        
        // If user is admin, set admin access level immediately
        if (userIsAdmin) {
          console.log("Admin user detected - setting ADMIN access level");
          setAccessLevel(AccessLevel.ADMIN);
          setIsReady(true);
          return;
        }
        
        // For non-admin users, check subscription
        setPremiumFeaturesLoading(true);
        
        const userSubscription = await getUserSubscription(user.id);
        console.log("User subscription data:", userSubscription);
        setSubscription(userSubscription);
        
        // Determine access level based on subscription
        const isPremium = userSubscription?.plans?.price > 0 && 
                          userSubscription?.status === 'active';
        
        if (isPremium) {
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
