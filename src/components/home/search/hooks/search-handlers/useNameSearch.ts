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
        // Enhanced credential validation with clear user guidance
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        const searchEngineId = import.meta.env.VITE_GOOGLE_CSE_ID;
        
        console.log("Google Search API - API Key configured:", apiKey ? `Yes (length: ${apiKey?.length})` : "No");
        console.log("Google Search API - Search Engine ID configured:", searchEngineId ? "Yes" : "No");
        
        // Validate API credentials strictly with clear user messages
        if (!apiKey || apiKey.length < 10) {
          const errorMsg = "Google Search API configuration error: Please configure a valid VITE_GOOGLE_API_KEY in your environment.";
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        if (!searchEngineId) {
          const errorMsg = "Google Search API configuration error: Please configure a valid VITE_GOOGLE_CSE_ID in your environment.";
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
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
        
        // Enhanced error handling with clearer messages for API configuration
        const errorMsg = error.message || "";
        
        if (errorMsg.includes('API key') || 
            errorMsg.includes('configuration') || 
            errorMsg.includes('Search Engine ID')) {
          setError("Google Search API configuration error: Please set up valid VITE_GOOGLE_API_KEY and VITE_GOOGLE_CSE_ID environment variables.");
          
          toast({
            title: "API Configuration Error",
            description: "Please configure valid Google Search API credentials in your environment variables.",
            variant: "destructive",
          });
        } else if (errorMsg.includes('unregistered callers') || 
            errorMsg.includes('without established identity')) {
          setError("API authentication error: Please ensure your Google API is properly configured with the correct permissions.");
          
          toast({
            title: "API Authentication Error",
            description: "Your Google API key is not properly authenticated. Ensure it has the correct permissions enabled.",
            variant: "destructive",
          });
        } else if (errorMsg.includes('API key not valid') || 
            errorMsg.includes('invalid key')) {
          setError("Invalid API Key: The Google API key is invalid. Please check your API key configuration.");
          
          toast({
            title: "Invalid API Key",
            description: "The Google API key you provided is not valid. Please check your configuration.",
            variant: "destructive",
          });
        } else {
          // For other errors, show the error message
          setError("There was a problem with your search. Please try again.");
        
          toast({
            title: "Search failed",
            description: error instanceof Error ? error.message : "There was a problem with your search. Please try again.",
            variant: "destructive",
          });
        }
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
