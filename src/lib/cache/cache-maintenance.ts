import { cache, cacheStats, CACHE_TTL, GOOGLE_API_CACHE_TTL, CACHE_CLEANUP_INTERVAL } from './cache-store';
import { CacheEntry } from './types';

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
export const getCacheStats = () => {
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

// Set up periodic cache cleanup
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

export const startCacheCleanup = (): void => {
  if (!cleanupInterval) {
    cleanupInterval = setInterval(cleanupCache, CACHE_CLEANUP_INTERVAL);
    console.log(`Cache cleanup scheduled every ${CACHE_CLEANUP_INTERVAL/1000} seconds`);
  }
};

export const stopCacheCleanup = (): void => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    console.log('Cache cleanup stopped');
  }
};
