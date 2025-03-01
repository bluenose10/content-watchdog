
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { AccessLevel } from "@/hooks/useProtectedRoute";
import { 
  checkUserRateLimit, 
  getLimitExceededMessage 
} from "../RateLimitChecker";

type CommonHandlerProps = {
  user: User | null;
  accessLevel: AccessLevel;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  navigate: (path: string) => void;
};

/**
 * Shared handler for checking authentication and rate limits
 */
export const handlePreSearchChecks = (
  props: CommonHandlerProps,
  action: () => Promise<void>,
): Promise<void> => {
  const { user, accessLevel, setIsLoading, setError, navigate } = props;
  
  // If anonymous user, redirect to signup
  if (!user) {
    navigate('/signup');
    return Promise.resolve();
  }

  return new Promise<void>(async (resolve) => {
    try {
      // Check rate limits before proceeding
      const rateLimitResult = checkUserRateLimit(user?.id || null, accessLevel);
      if (!rateLimitResult.allowed) {
        const limitMessage = getLimitExceededMessage(rateLimitResult);
        
        toast({
          title: "Search limit reached",
          description: limitMessage,
          variant: "destructive",
        });
        
        setError(limitMessage);
        resolve();
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      await action();
    } catch (error) {
      console.error("Search error:", error);
      
      // Set the error message for display in the UI
      setError("There was a problem with your search. Please try again.");
      
      // Show toast notification
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "There was a problem with your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      resolve();
    }
  });
};

/**
 * Handle permission errors with popular_searches table
 */
export const handlePermissionError = (
  error: any,
  query: string,
  type: string,
  navigate: (path: string) => void
): boolean => {
  if (error.code === "42501" && error.message?.includes("popular_searches")) {
    // This is a permission error with the materialized view, but we can still proceed
    toast({
      title: "Search started",
      description: "Your search is being processed, but some features might be limited.",
      variant: "default",
    });
    
    // Generate a temporary search ID for this session
    const tempSearchId = `temp_${Date.now()}`;
    if (type === "image") {
      navigate(`/results?id=${tempSearchId}&type=image`);
    } else {
      navigate(`/results?id=${tempSearchId}&q=${encodeURIComponent(query)}`);
    }
    return true;
  }
  return false;
};
