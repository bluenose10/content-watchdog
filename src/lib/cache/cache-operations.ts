import { CacheEntry, CacheStatsResult } from './cache-types';
import { 
  cache, 
  cacheStats, 
  CACHE_TTL, 
  GOOGLE_API_CACHE_TTL,
  setCacheMaxSize
} from './cache-store';

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
 * Prioritize which cached items to keep or remove
 * This helps with optimizing Google API usage by keeping valuable cached results longer
 */
export const prioritizeCacheEntries = (entries: [string, CacheEntry][]): [string, CacheEntry][] => {
  return entries.sort((a, b) => {
    const aEntry = a[1];
    const bEntry = b[1];
    
    // Always keep Google API results longer if possible (higher priority)
    if (aEntry.source === 'google' && bEntry.source !== 'google') return 1;
    if (aEntry.source !== 'google' && bEntry.source === 'google') return -1;
    
    // Then consider frequency of access (hits)
    if (aEntry.hits !== bEntry.hits) {
      return aEntry.hits - bEntry.hits;
    }
    
    // Finally sort by last accessed time
    return aEntry.lastAccessed - bEntry.lastAccessed;
  });
};

/**
 * Cleanup the cache by removing expired or least used entries
 */
export const cleanupCache = (): void => {
  const now = Date.now();
  const entries = Object.entries(cache);
  
  if (entries.length <= cacheStats.maxSize * 0.9) {
    // If we're under 90% capacity, only remove expired entries
    entries.forEach(([key, entry]) => {
      const ttl = entry.source === 'google' ? GOOGLE_API_CACHE_TTL : CACHE_TTL;
      if (now - entry.timestamp > ttl) {
        delete cache[key];
      }
    });
  } else {
    // If we're over 90% capacity, also remove least recently used entries
    const sortedEntries = prioritizeCacheEntries(entries);
    
    // Remove entries until we're at 80% capacity
    const targetSize = Math.floor(cacheStats.maxSize * 0.8);
    const entriesToRemove = sortedEntries.slice(0, sortedEntries.length - targetSize);
    
    entriesToRemove.forEach(([key]) => {
      delete cache[key];
      if (cacheStats.keyAccess[key]) {
        delete cacheStats.keyAccess[key];
      }
    });
  }
  
  cacheStats.size = Object.keys(cache).length;
  console.log(`Cache cleanup complete. New size: ${cacheStats.size}`);
};

/**
 * Get cache statistics for monitoring
 */
export const getCacheStats = (): CacheStatsResult => {
  const totalRequests = cacheStats.hits + cacheStats.misses;
  const hitRate = totalRequests > 0 ? cacheStats.hits / totalRequests : 0;
  
  // Get most popular queries
  const popularQueries = Object.entries(cacheStats.keyAccess)
    .map(([key, hits]) => ({ key, hits }))
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 10);
  
  // Calculate average hit count
  const totalHits = Object.values(cache).reduce((sum, entry) => sum + entry.hits, 0);
  const averageHitCount = Object.keys(cache).length > 0 ? totalHits / Object.keys(cache).length : 0;
  
  return {
    size: cacheStats.size,
    maxSize: cacheStats.maxSize,
    hits: cacheStats.hits,
    misses: cacheStats.misses,
    hitRate,
    popularQueries,
    averageHitCount,
    apiCalls: cacheStats.apiCalls,
    estimatedCost: cacheStats.estimatedCost
  };
};

// Set up initial configuration
console.log('Search cache operations initialized');
