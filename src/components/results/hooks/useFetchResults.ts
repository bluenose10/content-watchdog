
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useResultProcessing } from "./useResultProcessing";
import { useTemporarySearch } from "./useTemporarySearch";
import { usePermanentSearch } from "./usePermanentSearch";
import { FALLBACK_RESULTS } from "./useFallbackResults";
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
      
      if (isTemporarySearch) {
        await handleTemporarySearch(id);
      } else {
        await handlePermanentSearch(id);
      }
      
      // Set a realistic search date
      const now = new Date();
      setSearchDate(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    } catch (error) {
      console.error("Error in fetchResults:", error);
      // Even if everything fails, show something to the user
      setResults(FALLBACK_RESULTS);
      setTotalResults(FALLBACK_RESULTS.length);
      setQuery("Your search");
      
      toast({
        title: "Warning",
        description: "We encountered an issue loading your full results, showing sample matches instead.",
        variant: "default",
      });
    } finally {
      // Reduced loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  return { fetchResults };
}
