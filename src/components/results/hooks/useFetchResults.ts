
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useResultProcessing } from "./useResultProcessing";
import { useTemporarySearch } from "./useTemporarySearch";
import { usePermanentSearch } from "./usePermanentSearch";
import { SearchStateActions } from "./useSearchState";
import { FALLBACK_RESULTS } from "./useFallbackResults";

interface FetchResultsProps {
  id: string | null;
  isReady: boolean;
  stateActions: SearchStateActions;
}

export function useFetchResults({ id, isReady, stateActions }: FetchResultsProps) {
  const { setIsLoading, setResults, setQuery, setSearchDate, setTotalResults } = stateActions;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Import helper hooks
  const { processSearchResponse } = useResultProcessing({ setResults, setTotalResults });
  const { handleTemporarySearch } = useTemporarySearch({ 
    setQuery, 
    setResults, 
    setTotalResults, 
    processSearchResponse, 
    toast
  });
  const { handlePermanentSearch } = usePermanentSearch({
    setQuery,
    setResults,
    setTotalResults,
    processSearchResponse,
    toast
  });

  const fetchResults = async () => {
    if (!id) {
      toast({
        title: "Error",
        description: "No search ID provided. Please try your search again.",
        variant: "destructive",
      });
      navigate("/search");
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Fetching results for search ID:", id);
      
      // Check if it's a temporary search ID (for anonymous users)
      const isTemporarySearch = id.startsWith('temp_');
      
      try {
        if (isTemporarySearch) {
          await handleTemporarySearch(id);
        } else {
          await handlePermanentSearch(id);
        }
        
        // Set a realistic search date
        const now = new Date();
        setSearchDate(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      } catch (error) {
        console.error("Search API error:", error);
        
        // For new users or when API keys aren't set up, provide a more helpful message
        // and use fallback results
        let errorMessage = "An unexpected error occurred while fetching your results.";
        let useFallbackResults = false;
        
        if (error instanceof Error) {
          if (error.message.includes("API key") || error.message.includes("configuration missing")) {
            errorMessage = "API keys not configured. Using demonstration results instead.";
            useFallbackResults = true;
          } else if (error.message.includes("quota") || error.message.includes("rate limit")) {
            errorMessage = "Search API quota exceeded. Using demonstration results instead.";
            useFallbackResults = true;
          } else if (error.message.includes("No search") || error.message.includes("not found")) {
            errorMessage = "Your search could not be found. Please try a new search.";
          }
        }
        
        toast({
          title: "Search Information",
          description: errorMessage,
          variant: useFallbackResults ? "default" : "destructive",
        });
        
        if (useFallbackResults) {
          console.log("Using fallback results due to API error");
          // Use fallback results for a better user experience
          setResults(FALLBACK_RESULTS);
          setTotalResults(FALLBACK_RESULTS.length);
          setQuery("Sample Search");
          
          // Set search date for fallback results
          const now = new Date();
          setSearchDate(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
          return;
        }
        
        // Only navigate back to search page if we're not using fallback results
        setResults([]);
        setTotalResults(0);
        setQuery("Search error");
        
        // Navigate back to search page after a delay
        setTimeout(() => {
          navigate("/search");
        }, 2000);
      }
    } catch (error) {
      console.error("Error in fetchResults:", error);
      
      // Handle any other unexpected errors
      toast({
        title: "Search Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      
      // Navigate back to search page
      setTimeout(() => {
        navigate("/search");
      }, 2000);
    } finally {
      // Reduced loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  return { fetchResults };
}
