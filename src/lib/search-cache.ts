
// Define a more structured cache entry type
interface CacheEntry {
  data: any;
  timestamp: number;
  hits: number;
  lastAccessed: number;
}

// In-memory cache with improved structure
const cache: Record<string, CacheEntry> = {};

// Cache statistics
const cacheStats = {
  hits: 0,
  misses: 0,
  size: 0,
  maxSize: 100, // Default max size
  keyAccess: {} as Record<string, number>,
};

// Cache configuration
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

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
  
  // Check if entry has expired
  if (now - entry.timestamp > CACHE_TTL) {
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
export const cacheResults = (key: string, data: any): void => {
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
  };
  
  cacheStats.size = Object.keys(cache).length;
  
  console.log(`Cached results for key: ${key}`);
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

/**
 * Cleanup the cache by removing expired or least used entries
 */
const cleanupCache = (): void => {
  const now = Date.now();
  const entries = Object.entries(cache);
  
  if (entries.length <= cacheStats.maxSize * 0.9) {
    // If we're under 90% capacity, only remove expired entries
    entries.forEach(([key, entry]) => {
      if (now - entry.timestamp > CACHE_TTL) {
        delete cache[key];
      }
    });
  } else {
    // If we're over 90% capacity, also remove least recently used entries
    const sortedEntries = entries.sort((a, b) => {
      // First sort by expiration
      const aExpired = now - a[1].timestamp > CACHE_TTL;
      const bExpired = now - b[1].timestamp > CACHE_TTL;
      
      if (aExpired && !bExpired) return -1;
      if (!aExpired && bExpired) return 1;
      
      // Then sort by hits (least used first)
      if (a[1].hits !== b[1].hits) {
        return a[1].hits - b[1].hits;
      }
      
      // Finally sort by last accessed time
      return a[1].lastAccessed - b[1].lastAccessed;
    });
    
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
  };
};

/**
 * Pre-warm the cache with results from recent searches
 */
export const getSearchResults = async (searchId: string): Promise<any[]> => {
  // This is a mock function that returns fake results for pre-fetching
  // In a real implementation, this would call your actual search API
  
  const mockResults = [];
  
  // Generate some mock results
  for (let i = 0; i < 5; i++) {
    mockResults.push({
      id: `result_${i}_${searchId}`,
      search_id: searchId,
      title: `Sample Result ${i}`,
      url: `https://example.com/result-${i}`,
      thumbnail: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/200/300`,
      source: ['instagram.com', 'twitter.com', 'facebook.com', 'linkedin.com'][Math.floor(Math.random() * 4)],
      match_level: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      found_at: new Date().toISOString(),
      similarity_score: Math.random()
    });
  }
  
  return mockResults;
};

// Set up periodic cache cleanup
setInterval(cleanupCache, CACHE_CLEANUP_INTERVAL);

// Initialize cache
console.log('Search cache initialized');
