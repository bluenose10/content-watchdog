
import { 
  getCacheKey as getOriginalCacheKey, 
  getCachedResults as getOriginalCachedResults, 
  cacheResults as originalCacheResults 
} from "@/lib/search-cache";

/**
 * Generates a cache key for a search query
 * @param queryType The type of query (name, hashtag, image)
 * @param query The search query or image URL
 * @param params Search parameters
 * @returns Cache key
 */
export function generateCacheKey(queryType: string, query: string, params: any): string {
  return getOriginalCacheKey(queryType, query, params);
}

/**
 * Checks if there are cached results for a specific search
 * @param queryType The type of query
 * @param query The search query or image URL
 * @param params Search parameters
 * @returns Cached results or null if not found
 */
export function checkCache(queryType: string, query: string, params: any): any {
  const cacheKey = generateCacheKey(queryType, query, params);
  return getOriginalCachedResults(cacheKey);
}

/**
 * Stores search results in the cache
 * @param queryType The type of query
 * @param query The search query or image URL
 * @param params Search parameters
 * @param data The data to cache
 * @param source Optional source of the data
 * @param costEstimate Optional cost estimate for the search
 */
export function storeInCache(
  queryType: string, 
  query: string, 
  params: any, 
  data: any, 
  source?: string, 
  costEstimate?: number
): void {
  const cacheKey = generateCacheKey(queryType, query, params);
  originalCacheResults(cacheKey, data, source, costEstimate);
  console.log(`Cached results for ${queryType} search: ${query}`);
}

/**
 * Simplified cache check that returns either the cached ID or null
 * @param queryType The type of query
 * @param query The search query or image URL
 * @param params Search parameters
 * @returns Cached search ID or null
 */
export function getCachedSearchId(queryType: string, query: string, params: any): string | null {
  const cachedResults = checkCache(queryType, query, params);
  
  if (cachedResults) {
    console.log(`Using cached results for ${queryType} search: ${query}`);
    return cachedResults.id || null;
  }
  
  return null;
}
