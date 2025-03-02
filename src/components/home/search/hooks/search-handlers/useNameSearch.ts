
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { handleTextSearch } from "../../services";
import { getLimitExceededMessage } from "../../components/RateLimitMessage";
import { AccessLevel } from "@/hooks/useProtectedRoute";
import { useRateLimit } from "../useRateLimit";
import { useSearchState } from "./useSearchState";

export function useNameSearch(user: User | null, accessLevel: AccessLevel) {
  const navigate = useNavigate();
  const { checkUserRateLimit } = useRateLimit();
  const { isLoading, setIsLoading, error, setError, toast } = useSearchState();

  const handleNameSearch = async (query: string, params?: any) => {
    // If anonymous user, redirect to signup
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to perform searches.",
        variant: "default",
      });
      navigate('/signup');
      return;
    }

    try {
      // Check rate limits before proceeding
      const rateLimitResult = checkUserRateLimit(user, accessLevel);
      if (!rateLimitResult.allowed) {
        const limitMessage = getLimitExceededMessage(rateLimitResult);
        
        toast({
          title: "Search limit reached",
          description: limitMessage,
          variant: "destructive",
        });
        
        setError(limitMessage);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      console.log("Name search with query:", query, "params:", params, "user:", user.id);
      
      try {
        // Check for API credentials but don't block if they're missing
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        const searchEngineId = import.meta.env.VITE_GOOGLE_CSE_ID;
        
        console.log("Google Search API - API Key configured:", apiKey ? `Yes (length: ${apiKey?.length})` : "No");
        console.log("Google Search API - Search Engine ID configured:", searchEngineId ? "Yes" : "No");
        
        // Don't validate API credentials strictly - let the search function handle fallbacks
        
        // Pass user authentication details with the request
        const enhancedParams = {
          ...params,
          authenticated: true,
          accessLevel: accessLevel,
          userId: user.id // Explicitly include user ID to help with authentication
        };
        
        const searchId = await handleTextSearch(query, "name", user, enhancedParams);
        
        // Store query data in session storage for temporary searches
        const tempSearchData = {
          query_text: query,
          query_type: "name",
          user_id: user.id,
          search_params_json: enhancedParams ? JSON.stringify(enhancedParams) : null
        };
        sessionStorage.setItem(`temp_search_${searchId}`, JSON.stringify(tempSearchData));
        
        // Use the searchId directly in the URL for results
        navigate(`/results?id=${searchId}`);
      } catch (error: any) {
        console.error("Name search error:", error);
        
        // Provide a generic error message - don't focus on API configuration issues
        setError("There was a problem with your search. Please try again.");
        
        toast({
          title: "Search failed",
          description: error instanceof Error ? error.message : "There was a problem with your search. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Name search error:", error);
      
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
    }
  };

  return {
    handleNameSearch,
    isLoading,
    error
  };
}
