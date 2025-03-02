
import { performGoogleSearch, performImageSearch } from "@/lib/db-service";
import { FALLBACK_RESULTS } from "./useFallbackResults";

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
    
    if (!tempSearchData) {
      console.error("No temporary search data found");
      toast({
        title: "Search Error",
        description: "No search data found. Please try a new search.",
        variant: "destructive",
      });
      throw new Error("No search data found. Please try a new search.");
    }
    
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
      console.log("Starting Google search with query:", queryText);
      console.log("API Key available:", import.meta.env.VITE_GOOGLE_API_KEY ? "Yes" : "No");
      console.log("Search Engine ID available:", import.meta.env.VITE_GOOGLE_CSE_ID ? "Yes" : "No");
      
      if (!import.meta.env.VITE_GOOGLE_API_KEY || !import.meta.env.VITE_GOOGLE_CSE_ID) {
        console.error("Missing Google API configuration");
        toast({
          title: "Search Configuration Error",
          description: "Google API configuration is missing. Please check your environment variables.",
          variant: "destructive",
        });
        throw new Error("Google API configuration missing. Please configure API keys.");
      }
      
      let searchResponse;
      if (queryType === 'image') {
        console.log("Performing image search with URL:", searchData.image_url);
        if (!searchData.image_url) {
          throw new Error("No image URL provided for image search");
        }
        searchResponse = await performImageSearch(searchData.image_url, 'anonymous', searchParams);
      } else {
        console.log("Performing Google search with text:", queryText);
        searchResponse = await performGoogleSearch(queryText, 'anonymous', searchParams);
      }
      
      console.log("Google API response:", searchResponse);
      
      if (searchResponse && searchResponse.items && searchResponse.items.length > 0) {
        console.log("Processing search response with items:", searchResponse.items.length);
        processSearchResponse(searchResponse, queryText, queryType);
      } else if (searchResponse && searchResponse.error) {
        // Handle API-reported errors
        console.error("API error:", searchResponse.error);
        const errorMessage = searchResponse.error.message || "API error";
        toast({
          title: "Search API Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      } else {
        // Handle empty results
        console.warn("No search results returned");
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
      // Store search data in session storage for debugging
      sessionStorage.setItem('last_failed_search', JSON.stringify({
        search_data: searchData,
        error: error instanceof Error ? error.message : String(error)
      }));
      throw error; // Let the parent handle this error
    }
  };

  return { handleTemporarySearch };
}
