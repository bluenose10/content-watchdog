
import { cache, cacheStats, CACHE_TTL, GOOGLE_API_CACHE_TTL } from './cache-store';
import { cleanupCache } from './cache-maintenance';

/**
 * Set the maximum cache size
 */
export const setCacheMaxSize = (size: number): void => {
  cacheStats.maxSize = size;
  cleanupCache();
};

/**
 * Get cached search results if available
 */
export const getCachedResults = (key: string): any | null => {
  const entry = cache[key];
  
  if (!entry) {
    cacheStats.misses++;
    return null;
  }
  
  const now = Date.now();
  
  // Check if entry has expired - use longer TTL for Google API responses
  const ttl = entry.source === 'google' ? GOOGLE_API_CACHE_TTL : CACHE_TTL;
  if (now - entry.timestamp > ttl) {
    delete cache[key];
    cacheStats.size = Object.keys(cache).length;
    cacheStats.misses++;
    return null;
  }
  
  // Update hit count and last access time
  entry.hits++;
  entry.lastAccessed = now;
  
  // Update access stats
  cacheStats.hits++;
  cacheStats.keyAccess[key] = (cacheStats.keyAccess[key] || 0) + 1;
  
  return entry.data;
};

/**
 * Store search results in cache
 */
export const cacheResults = (key: string, data: any, source?: string, costEstimate?: number): void => {
  // Before adding new entry, check if we need to cleanup
  if (Object.keys(cache).length >= cacheStats.maxSize) {
    cleanupCache();
  }
  
  // Store the data
  cache[key] = {
    data,
    timestamp: Date.now(),
    hits: 0,
    lastAccessed: Date.now(),
    source,
    costEstimate
  };
  
  // Track API usage statistics
  if (source === 'google') {
    cacheStats.apiCalls.google++;
    if (costEstimate) {
      cacheStats.estimatedCost += costEstimate;
    }
  } else if (source) {
    cacheStats.apiCalls.other++;
  }
  
  cacheStats.size = Object.keys(cache).length;
  
  console.log(`Cached results for key: ${key} from source: ${source || 'unknown'}`);
};

/**
 * Remove specific entry from cache
 */
export const invalidateCache = (key: string): boolean => {
  if (cache[key]) {
    delete cache[key];
    cacheStats.size = Object.keys(cache).length;
    
    // Also remove from access stats
    if (cacheStats.keyAccess[key]) {
      delete cacheStats.keyAccess[key];
    }
    
    return true;
  }
  return false;
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
