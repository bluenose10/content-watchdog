
import { SearchQuery } from "@/lib/db-types";
import { User } from "@supabase/supabase-js";
import { createSearchQuery, uploadSearchImage } from "@/lib/db-service";
import { optimizedSearch, getAvailableSearchEngines, getSearchEngineStats } from "@/lib/google-api-manager";
import { getCacheKey, getCachedResults, cacheResults } from "@/lib/search-cache";

// Helper function to sanitize search queries
export function sanitizeSearchQuery(query: string): string {
  // Remove excessive whitespace
  let sanitized = query.trim().replace(/\s+/g, ' ');
  
  // Remove potentially harmful characters
  sanitized = sanitized.replace(/[<>]/g, '');
  
  return sanitized;
}

// Helper function to validate image files
export function validateImageFile(file: File): void {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Please use JPEG, PNG, WebP, or GIF.`);
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    throw new Error(`File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size is 10MB.`);
  }
}

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
