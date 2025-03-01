import { createSearchQuery } from "@/lib/db-service";
import { SearchQuery } from "@/lib/db-types";
import { User } from "@supabase/supabase-js";
import { optimizedSearch, getSearchEngineStats } from "@/lib/search";

// Common processing for all search types
export async function processSearch(
  searchData: SearchQuery, 
  user: User | null
): Promise<string> {
  if (!user) {
    throw new Error("User must be signed in to perform searches");
  }
  
  // Show search engine stats for debugging
  const engineStats = getSearchEngineStats();
  console.log("Current search engine stats:", engineStats);
  
  try {
    // For registered users, create a permanent search query
    const newSearch = await createSearchQuery(searchData);
    if (!newSearch || !newSearch.id) {
      throw new Error("Failed to create search");
    }
    
    // Run the search across multiple engines
    try {
      if (searchData.query_type === "image") {
        // For image searches, we'll use a specific search type
        await optimizedSearch("image", searchData.image_url || "", JSON.parse(searchData.search_params_json || "{}"));
      } else {
        // For text searches
        await optimizedSearch(
          searchData.query_type || "web", 
          searchData.query_text || "", 
          JSON.parse(searchData.search_params_json || "{}")
        );
      }
    } catch (error) {
      console.error("Error during multi-engine search:", error);
      // Continue despite errors - we'll still return the search ID
    }
    
    return newSearch.id;
  } catch (error: any) {
    console.error("Error creating search:", error);
    
    // Check if it's a permission error with the materialized view
    if (error.code === "42501" && error.message?.includes("popular_searches")) {
      throw error; // Propagate this specific error to be handled in the calling function
    }
    
    throw new Error(`Failed to create search: ${error.message || "Unknown error"}`);
  }
}

// Add compatibility exports for the refactored code
export const createTextSearchQuery = async ({ 
  query, 
  type, 
  user, 
  params 
}: { 
  query: string; 
  type: string; 
  user: User | null; 
  params?: any 
}): Promise<string> => {
  const searchData: SearchQuery = {
    user_id: user?.id,
    query_type: type,
    query_text: query,
    search_params_json: JSON.stringify(params || {})
  };
  
  return processSearch(searchData, user);
};

// Add a saveSearch function if needed by other components
export const saveSearch = async (data: any): Promise<any> => {
  console.log("Saving search:", data);
  // Implementation would depend on what saveSearch was supposed to do
  // For now, returning a simple object since this function isn't actually used
  return { id: "temp_" + Date.now() };
};
