
import { performGoogleSearch, performImageSearch } from "@/lib/db-service";

type TemporarySearchProps = {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setResults: React.Dispatch<React.SetStateAction<any[]>>;
  setTotalResults: React.Dispatch<React.SetStateAction<number>>;
  processSearchResponse: (searchResponse: any, queryText: string, queryType: string) => void;
  toast: any;
};

export function useTemporarySearch({ 
  setQuery, 
  setResults, 
  setTotalResults, 
  processSearchResponse, 
  toast 
}: TemporarySearchProps) {
  
  const handleTemporarySearch = async (id: string) => {
    // For temporary searches, try to get stored search data from session storage
    const tempSearchData = sessionStorage.getItem(`temp_search_${id}`);
    
    if (tempSearchData) {
      const searchData = JSON.parse(tempSearchData);
      const queryText = searchData.query_text || "Unknown search";
      const queryType = searchData.query_type;
      
      console.log("Processing temporary search:", queryText, "of type", queryType);
      setQuery(queryText);
      
      // Get search parameters if available
      const searchParams = searchData.search_params_json ? 
                          JSON.parse(searchData.search_params_json) : {};
      
      // Perform Google search directly for temporary searches
      try {
        let searchResponse;
        if (queryType === 'image') {
          console.log("Performing image search");
          searchResponse = await performImageSearch(searchData.image_url, 'anonymous', searchParams);
        } else {
          console.log("Performing Google search");
          searchResponse = await performGoogleSearch(queryText, 'anonymous', searchParams);
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
        console.error("Error performing direct search:", error);
        throw error; // Let the parent handle this error
      }
    } else {
      console.error("No temporary search data found");
      throw new Error("No temporary search data found");
    }
  };

  return { handleTemporarySearch };
}
