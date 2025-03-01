
import { createSearchQuery } from "@/lib/db-service";
import { TextSearchParams, SearchQuery } from "@/lib/db-types";
import { User } from "@supabase/supabase-js";
import { optimizedSearch, getAvailableSearchEngines } from "@/lib/search";
import { checkSearchLimits, incrementSearchCount } from "./quota-manager";
import { processSearch } from "./search-utils";
import { 
  validateTextSearch, 
  formatHashtagQuery, 
  validateTextSearchParams 
} from "./validation";
import { 
  getCachedSearchId, 
  storeInCache 
} from "./cache-manager";

// Enhanced search parameters for text-based searches
export const DEFAULT_TEXT_PARAMS: TextSearchParams = {
  exactMatch: false,
  contentFilter: 'medium',
  sortBy: 'relevance',
  searchType: 'web',
  language: 'en',
  country: 'us',
  rights: undefined,
  dateRestrict: undefined,
  siteFilter: [],
  excludeSites: []
};

// Handles text-based searches (name or hashtag) with enhanced parameters
export async function handleTextSearch(
  query: string, 
  queryType: "name" | "hashtag", 
  user: User | null,
  searchParams?: Partial<TextSearchParams>
): Promise<string> {
  // Check if user is authenticated
  if (!user) {
    throw new Error("You must be signed in to perform searches");
  }

  // Validate and sanitize input
  const sanitizedQuery = validateTextSearch(query);
  
  // Check search limits for this user
  const isPro = true; // Mock function - in production should check subscription status
  const limitCheck = await checkSearchLimits(user.id, isPro, user.email);
  if (!limitCheck.isAllowed) {
    throw new Error(limitCheck.message);
  }

  // Format query appropriately (for hashtags)
  const formattedQuery = queryType === 'hashtag' 
    ? formatHashtagQuery(sanitizedQuery) 
    : sanitizedQuery;

  // Merge default parameters with user-provided parameters
  const mergedParams = validateTextSearchParams(searchParams, DEFAULT_TEXT_PARAMS);

  // Check cache first
  const cachedSearchId = getCachedSearchId(queryType, formattedQuery, mergedParams);
  if (cachedSearchId) {
    return cachedSearchId;
  }

  console.log(`Performing ${queryType} search with enhanced parameters:`, mergedParams);
  
  // Get available search engines
  const availableEngines = getAvailableSearchEngines();
  console.log(`Available search engines: ${availableEngines.join(', ')}`);
  
  const searchData: SearchQuery = {
    user_id: user.id,
    query_type: queryType,
    query_text: formattedQuery,
    search_params_json: JSON.stringify(mergedParams)
  };

  // Increment the user's search count
  incrementSearchCount(user.id, user.email);

  try {
    // Process the search
    const searchId = await processSearch(searchData, user);
    
    // Cache the results
    storeInCache(queryType, formattedQuery, mergedParams, { id: searchId });
    
    return searchId;
  } catch (error: any) {
    // If there's a permission error with popular_searches, continue with a temporary ID
    if (error.code === "42501" && error.message?.includes("popular_searches")) {
      console.warn("Permission error with popular_searches, using temporary search ID");
      // Generate a temporary ID for this session
      const tempId = `temp_${Date.now()}`;
      // Still cache the temporary ID
      storeInCache(queryType, formattedQuery, mergedParams, { id: tempId });
      return tempId;
    }
    
    // For other errors, rethrow
    throw error;
  }
}
