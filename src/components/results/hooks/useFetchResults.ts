
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useResultProcessing } from "./useResultProcessing";
import { useTemporarySearch } from "./useTemporarySearch";
import { usePermanentSearch } from "./usePermanentSearch";
import { SearchStateActions } from "./useSearchState";

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
        
        // For API errors, provide a more helpful message without automatically using fallback results
        let errorMessage = "An error occurred while fetching your results.";
        
        if (error instanceof Error) {
          if (error.message.includes("API key") || error.message.includes("configuration missing")) {
            errorMessage = "Search API configuration error. Please contact support.";
          } else if (error.message.includes("quota") || error.message.includes("rate limit")) {
            errorMessage = "Search API quota exceeded. Please try again later.";
          } else if (error.message.includes("No search") || error.message.includes("not found")) {
            errorMessage = "Your search could not be found. Please try a new search.";
          }
        }
        
        toast({
          title: "Search Error",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Set empty results instead of fallback
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
