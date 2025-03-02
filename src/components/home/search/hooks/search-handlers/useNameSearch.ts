
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
        // Enhanced credential validation
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        const searchEngineId = import.meta.env.VITE_GOOGLE_CSE_ID;
        
        console.log("Google Search API - API Key configured:", apiKey ? `Yes (length: ${apiKey?.length})` : "No");
        console.log("Google Search API - Search Engine ID configured:", searchEngineId ? "Yes" : "No");
        
        // Validate API credentials before proceeding
        if (!apiKey || apiKey.length < 10) {
          throw new Error("Invalid Google API Key: The API key is missing or appears to be invalid. Please check your environment configuration.");
        }
        
        if (!searchEngineId) {
          throw new Error("Missing Search Engine ID: The Google Custom Search Engine ID is required. Please configure VITE_GOOGLE_CSE_ID in your environment variables.");
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
        
        // Enhanced error handling for API key issues
        const errorMsg = error.message || "";
        
        // For authentication errors, provide clearer guidance
        if (errorMsg.includes('unregistered callers') || 
            errorMsg.includes('without established identity')) {
          
          setError("API authentication error: Please check your Google API configuration and ensure it has the proper permissions.");
          
          toast({
            title: "Authentication Error",
            description: "The search API is having trouble authenticating your request. Please ensure your Google API key has the proper permissions for Custom Search API.",
            variant: "destructive",
          });
          return;
        }
        
        // For invalid API key errors
        if (errorMsg.includes('API key not valid') || 
            errorMsg.includes('invalid key')) {
          
          setError("Invalid API Key: The Google API key appears to be invalid. Please check your configuration.");
          
          toast({
            title: "API Key Error",
            description: "The Google API key you are using appears to be invalid. Please verify the key in your environment configuration.",
            variant: "destructive",
          });
          return;
        }
        
        // For API configuration errors, be more informative
        if (errorMsg.includes('API key') || 
            errorMsg.includes('configuration') || 
            errorMsg.includes('Search Engine ID')) {
          
          setError("Search API configuration issue. Please check your environment variables and try again.");
          
          toast({
            title: "API Configuration Issue",
            description: "There's a problem with the Google Search API configuration. Please ensure your environment variables are set correctly.",
            variant: "destructive",
          });
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
