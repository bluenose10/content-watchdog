
import { getSearchResults } from "@/lib/search-cache";
import { getSearchQueryById, performGoogleSearch, performImageSearch } from "@/lib/db-service";
import { FALLBACK_RESULTS } from "./useFallbackResults";

type PermanentSearchProps = {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setResults: React.Dispatch<React.SetStateAction<any[]>>;
  setTotalResults: React.Dispatch<React.SetStateAction<number>>;
  processSearchResponse: (searchResponse: any, queryText: string, queryType: string) => void;
  toast: any;
};

export function usePermanentSearch({
  setQuery,
  setResults,
  setTotalResults,
  processSearchResponse,
  toast
}: PermanentSearchProps) {
  
  const handlePermanentSearch = async (id: string) => {
    try {
      // Try to get cached results first
      const cachedData = await getSearchResults(id);
      
      if (cachedData && cachedData.results && cachedData.results.length > 0) {
        console.log("Using cached results:", cachedData);
        setResults(cachedData.results);
        setQuery(cachedData.query);
        setTotalResults(cachedData.results.length);
        return;
      }
      
      // If no cached results, fetch the search query from the database
      const searchQuery = await getSearchQueryById(id);
      
      if (!searchQuery) {
        console.error("Search query not found");
        // Use fallback results instead of throwing an error
        setResults(FALLBACK_RESULTS);
        setTotalResults(FALLBACK_RESULTS.length);
        setQuery("Sample Search");
        
        toast({
          title: "Search Not Found",
          description: "Using sample results instead. Try a new search for better results.",
          variant: "default",
        });
        return;
      }
      
      console.log("Found search query:", searchQuery);
      const queryText = searchQuery.query_text || "Unknown search";
      const queryType = searchQuery.query_type;
      setQuery(queryText);
      
      // Get search parameters if available
      const searchParams = searchQuery.search_params_json ? 
                          JSON.parse(searchQuery.search_params_json) : {};
      
      try {
        let searchResponse;
        
        // Check if we're in demo mode (using mock results)
        const useDemo = !import.meta.env.VITE_GOOGLE_API_KEY || 
                        import.meta.env.VITE_GOOGLE_API_KEY.length < 10 ||
                        !import.meta.env.VITE_GOOGLE_CSE_ID;
        
        if (useDemo) {
          console.log("Using demo mode with mock results due to missing API configuration");
          // Import mock generator dynamically
          const { generateMockResults } = await import('@/lib/services/search-service/text-search/mock-generator');
          searchResponse = generateMockResults(queryText, searchParams.maxResults || 20);
          searchResponse._source = 'mock';
        } else {
          // Perform actual API search based on query type
          if (queryType === 'image') {
            console.log("Performing image search");
            searchResponse = await performImageSearch(searchQuery.image_url, searchQuery.user_id, searchParams);
          } else {
            console.log("Performing Google search");
            searchResponse = await performGoogleSearch(queryText, searchQuery.user_id, searchParams);
          }
        }
        
        console.log("Search API response:", searchResponse);
        
        // Check if we got mock results as a fallback
        if (searchResponse?._source?.includes('mock')) {
          console.log("Received mock results instead of real search data");
          toast({
            title: "Using Demo Results",
            description: "The search API is not configured correctly. Showing sample results instead of real search data.",
            variant: "default",
          });
        }
        
        if (searchResponse && searchResponse.items && searchResponse.items.length > 0) {
          processSearchResponse(searchResponse, queryText, queryType);
        } else if (searchResponse && searchResponse.error) {
          // Handle API-reported errors
          console.error("API error:", searchResponse.error);
          // Fall back to sample results
          setResults(FALLBACK_RESULTS);
          setTotalResults(FALLBACK_RESULTS.length);
          
          toast({
            title: "Search API Error",
            description: "Using sample results due to an API error. Please try again later.",
            variant: "default",
          });
        } else {
          // Handle empty results
          setResults([]);
          setTotalResults(0);
          toast({
            title: "No Results Found",
            description: "Your search didn't return any results. Try different keywords or parameters.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error performing search:", error);
        
        // Fall back to sample results on error
        setResults(FALLBACK_RESULTS);
        setTotalResults(FALLBACK_RESULTS.length);
        
        toast({
          title: "Search Error",
          description: "Using sample results due to a search error. Please try again later.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error fetching search or results:", error);
      
      // Fall back to sample results on error
      setResults(FALLBACK_RESULTS);
      setTotalResults(FALLBACK_RESULTS.length);
      setQuery("Sample Results");
      
      toast({
        title: "Error Loading Results",
        description: "Using sample results due to an error. Please try again later.",
        variant: "default",
      });
    }
  };

  return { handlePermanentSearch };
}
