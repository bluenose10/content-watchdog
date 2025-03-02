
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { handleImageSearch } from "../../services";
import { getLimitExceededMessage } from "../../components/RateLimitMessage";
import { AccessLevel } from "@/hooks/useProtectedRoute";
import { useRateLimit } from "../useRateLimit";
import { useSearchState } from "./useSearchState";

export function useImageSearch(user: User | null, accessLevel: AccessLevel) {
  const navigate = useNavigate();
  const { checkUserRateLimit } = useRateLimit();
  const { isLoading, setIsLoading, error, setError, toast } = useSearchState();

  const handleImageSearchSubmit = async (file: File, params?: any) => {
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
      console.log("Image search with file:", file.name, "and params:", params);
      
      try {
        // Convert file to data URL for temporary storage
        const fileReader = new FileReader();
        
        // Wrap FileReader in a promise
        const fileDataUrl = await new Promise<string>((resolve, reject) => {
          fileReader.onload = () => resolve(fileReader.result as string);
          fileReader.onerror = reject;
          fileReader.readAsDataURL(file);
        });
        
        const searchId = await handleImageSearch(file, user, params);
        
        // Store query data in session storage for temporary searches
        const tempSearchData = {
          query_type: "image",
          user_id: user.id,
          image_url: fileDataUrl,
          search_params_json: params ? JSON.stringify(params) : null
        };
        sessionStorage.setItem(`temp_search_${searchId}`, JSON.stringify(tempSearchData));
        
        // Use the searchId directly in the URL for results
        navigate(`/results?id=${searchId}`);
      } catch (error: any) {
        console.error("Image search error:", error);
        
        // Handle permission errors more gracefully
        if (error.code === "42501" && error.message?.includes("popular_searches")) {
          // This is a permission error with the materialized view, but we can still proceed
          toast({
            title: "Image search started",
            description: "Your image search is being processed, but some features might be limited.",
            variant: "default",
          });
          
          // Generate a temporary search ID for this session
          const tempSearchId = `temp_${Date.now()}`;
          
          // Convert file to data URL for temporary storage
          const fileReader = new FileReader();
          
          // Wrap FileReader in a promise
          const fileDataUrl = await new Promise<string>((resolve, reject) => {
            fileReader.onload = () => resolve(fileReader.result as string);
            fileReader.onerror = reject;
            fileReader.readAsDataURL(file);
          });
          
          // Store query data in session storage for temporary searches
          const tempSearchData = {
            query_type: "image",
            user_id: user.id,
            image_url: fileDataUrl,
            search_params_json: params ? JSON.stringify(params) : null
          };
          sessionStorage.setItem(`temp_search_${tempSearchId}`, JSON.stringify(tempSearchData));
          
          navigate(`/results?id=${tempSearchId}&type=image`);
          return;
        }
        
        // For other errors, show the error message
        setError("There was a problem with your image search. Please try again.");
        
        toast({
          title: "Search failed",
          description: error instanceof Error ? error.message : "There was a problem with your search. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Image search error:", error);
      
      // Set the error message for display in the UI
      setError("There was a problem with your image search. Please try again.");
      
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
    handleImageSearchSubmit,
    isLoading,
    error
  };
}
