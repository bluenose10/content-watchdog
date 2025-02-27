
/**
 * Simple in-memory cache for search results to prevent redundant API calls
 */
interface CacheItem {
  timestamp: number;
  results: any;
}

// Cache storage
const cache: Record<string, CacheItem> = {};

// Cache expiration time (10 minutes)
const CACHE_EXPIRATION = 10 * 60 * 1000;

/**
 * Generate a unique cache key based on search params
 */
export const getCacheKey = (queryType: string, query: string, params?: any): string => {
  return `${queryType}_${query}_${params ? JSON.stringify(params) : 'default'}`;
};

/**
 * Get cached search results if available and not expired
 */
export const getCachedResults = (key: string): any | null => {
  const item = cache[key];
  
  if (!item) return null;
  
  // Check if cache has expired
  if (Date.now() - item.timestamp > CACHE_EXPIRATION) {
    delete cache[key];
    return null;
  }
  
  console.log('Cache hit for key:', key);
  return item.results;
};

/**
 * Cache search results
 */
export const cacheResults = (key: string, results: any): void => {
  cache[key] = {
    timestamp: Date.now(),
    results
  };
  console.log('Cached results for key:', key);
};

/**
 * Clear the entire cache or specific keys
 */
export const clearCache = (key?: string): void => {
  if (key) {
    delete cache[key];
    console.log('Cleared cache for key:', key);
  } else {
    Object.keys(cache).forEach(k => delete cache[k]);
    console.log('Cleared entire cache');
  }
};
