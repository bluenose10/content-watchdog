
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
      console.log("Name search with query:", query, "and params:", params);
      
      try {
        const searchId = await handleTextSearch(query, "name", user, params);
        
        // Store query data in session storage for temporary searches
        const tempSearchData = {
          query_text: query,
          query_type: "name",
          user_id: user.id,
          search_params_json: params ? JSON.stringify(params) : null
        };
        sessionStorage.setItem(`temp_search_${searchId}`, JSON.stringify(tempSearchData));
        
        // Use the searchId directly in the URL for results
        navigate(`/results?id=${searchId}`);
      } catch (error: any) {
        console.error("Name search error:", error);
        
        // Handle permission errors more gracefully
        if (error.code === "42501" && error.message?.includes("popular_searches")) {
          // This is a permission error with the materialized view, but we can still proceed
          toast({
            title: "Search started",
            description: "Your search is being processed, but some features might be limited.",
            variant: "default",
          });
          
          // Generate a temporary search ID for this session
          const tempSearchId = `temp_${Date.now()}`;
          
          // Store query data in session storage for temporary searches
          const tempSearchData = {
            query_text: query,
            query_type: "name",
            user_id: user.id,
            search_params_json: params ? JSON.stringify(params) : null
          };
          sessionStorage.setItem(`temp_search_${tempSearchId}`, JSON.stringify(tempSearchData));
          
          navigate(`/results?id=${tempSearchId}&q=${encodeURIComponent(query)}`);
          return;
        }
        
        // For other errors, show the error message
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
