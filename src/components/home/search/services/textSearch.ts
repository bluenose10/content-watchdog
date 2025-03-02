
import { User } from "@supabase/supabase-js";
import { TextSearchParams, SearchQuery } from "@/lib/db-types";
import { sanitizeSearchQuery, processSearch } from './searchUtils';
import { DEFAULT_TEXT_PARAMS } from './searchParameters';
import { checkSearchLimits, incrementSearchCount } from './searchLimits';
import { getCacheKey, getCachedResults, cacheResults } from "@/lib/search-cache";

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
  const sanitizedQuery = sanitizeSearchQuery(query);
  if (!sanitizedQuery) {
    throw new Error("Search query cannot be empty");
  }

  // Check search limits for this user (simplified check - in production would query DB)
  const isPro = true; // Mock function - in production should check subscription status
  const limitCheck = await checkSearchLimits(user.id, isPro, user.email);
  if (!limitCheck.isAllowed) {
    throw new Error(limitCheck.message);
  }

  // Check cache first for this query
  const formattedQuery = queryType === 'hashtag' && !sanitizedQuery.startsWith('#') 
    ? `#${sanitizedQuery}` 
    : sanitizedQuery;

  // Merge default parameters with user-provided parameters
  const mergedParams: TextSearchParams = {
    ...DEFAULT_TEXT_PARAMS,
    ...searchParams
  };

  // Generate cache key
  const cacheKey = getCacheKey(queryType, formattedQuery, mergedParams);
  const cachedResults = getCachedResults(cacheKey);
  
  if (cachedResults) {
    console.log(`Using cached results for ${queryType} search: ${formattedQuery}`);
    return cachedResults.id || `cache_${crypto.randomUUID()}`;
  }

  console.log(`Performing ${queryType} search with enhanced parameters:`, mergedParams);
  
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
    // Note: In a real implementation, we would fetch the results and cache them here
    // For this mock implementation, we're just caching the search ID
    cacheResults(cacheKey, { id: searchId });
    
    return searchId;
  } catch (error: any) {
    // If there's a permission error with popular_searches, continue with a temporary ID
    if (error.code === "42501" && error.message?.includes("popular_searches")) {
      console.warn("Permission error with popular_searches, using temporary search ID");
      // Generate a temporary ID for this session
      const tempId = `temp_${Date.now()}`;
      // Still cache the temporary ID
      cacheResults(cacheKey, { id: tempId });
      return tempId;
    }
    
    // For other errors, rethrow
    throw error;
  }
}
