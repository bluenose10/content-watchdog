
import { CacheEntry, CacheStats } from './cache-types';

// Cache configuration
export const CACHE_TTL = 30 * 60 * 1000; // 30 minutes for regular cache
export const GOOGLE_API_CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours for Google API cache
export const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

// In-memory cache with improved structure
export const cache: Record<string, CacheEntry> = {};

// Cache statistics
export const cacheStats: CacheStats = {
  hits: 0,
  misses: 0,
  size: 0,
  maxSize: 100, // Default max size
  keyAccess: {} as Record<string, number>,
  apiCalls: {
    google: 0,
    other: 0
  },
  estimatedCost: 0, // Track estimated API costs
};

/**
 * Generate a consistent cache key for a search query
 */
export const getCacheKey = (type: string, query: string, params: any = {}): string => {
  // Sort params to ensure consistent keys regardless of property order
  const sortedParams = params ? 
    JSON.stringify(params, Object.keys(params).sort()) : 
    '{}';
  
  return `${type}:${query.toLowerCase()}:${sortedParams}`;
};

/**
 * Set the maximum cache size
 */
export const setCacheMaxSize = (size: number): void => {
  cacheStats.maxSize = size;
};

/**
 * Clear the entire cache
 */
export const clearCache = (): void => {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
  
  // Reset stats
  cacheStats.size = 0;
  cacheStats.keyAccess = {};
  
  console.log('Search cache cleared');
};
