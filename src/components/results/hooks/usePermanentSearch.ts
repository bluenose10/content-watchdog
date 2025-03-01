
import { getSearchResults } from "@/lib/search-cache";
import { getSearchQueryById, performGoogleSearch, performImageSearch } from "@/lib/db-service";

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
      } else {
        // If no cached results, fetch the search query from the database
        const searchQuery = await getSearchQueryById(id);
        
        if (searchQuery) {
          console.log("Found search query:", searchQuery);
          const queryText = searchQuery.query_text || "Unknown search";
          const queryType = searchQuery.query_type;
          setQuery(queryText);
          
          // Get search parameters if available
          const searchParams = searchQuery.search_params_json ? 
                              JSON.parse(searchQuery.search_params_json) : {};
          
          // Perform Google search
          try {
            let searchResponse;
            if (queryType === 'image') {
              console.log("Performing image search");
              searchResponse = await performImageSearch(searchQuery.image_url, searchQuery.user_id, searchParams);
            } else {
              console.log("Performing Google search");
              searchResponse = await performGoogleSearch(queryText, searchQuery.user_id, searchParams);
            }
            
            console.log("Google API response:", searchResponse);
            
            if (searchResponse && searchResponse.items && searchResponse.items.length > 0) {
              processSearchResponse(searchResponse, queryText, queryType);
            } else if (searchResponse && searchResponse.error) {
              // Handle API-reported errors
              console.error("API error:", searchResponse.error);
              throw new Error(searchResponse.error.message || "API error");
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
            throw error; // Let the parent handle this error
          }
        } else {
          console.error("Search query not found");
          throw new Error("Search query not found");
        }
      }
    } catch (error) {
      console.error("Error fetching search or results:", error);
      throw error; // Let the parent handle this error
    }
  };

  return { handlePermanentSearch };
}
