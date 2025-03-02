// Define a more structured cache entry type
interface CacheEntry {
  data: any;
  timestamp: number;
  hits: number;
  lastAccessed: number;
  source?: string; // Track if this came from Google API
  costEstimate?: number; // Estimate API cost for budget tracking
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
  apiCalls: {
    google: 0,
    other: 0
  },
  estimatedCost: 0, // Track estimated API costs
};

// Cache configuration - Longer TTL for Google API responses
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes for regular cache
const GOOGLE_API_CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours for Google API cache
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
const cleanupCache = (): void => {
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

/**
 * Batch multiple Google API requests to optimize quotas
 * @param searchIds Array of search IDs to pre-fetch
 * @returns Object containing all fetched results mapped by ID
 */
export const batchGetSearchResults = async (searchIds: string[]): Promise<Record<string, { query: string, results: any[] }>> => {
  // This would batch requests to Google API in a real implementation
  // For mock purposes, we'll just call getSearchResults for each ID
  
  console.log(`Batch fetching ${searchIds.length} search results`);
  
  const resultMap: Record<string, { query: string, results: any[] }> = {};
  
  // Process in smaller batches to avoid overwhelming APIs
  const batchSize = 5;
  for (let i = 0; i < searchIds.length; i += batchSize) {
    const batch = searchIds.slice(i, i + batchSize);
    
    // Process each batch in parallel
    const batchResults = await Promise.all(
      batch.map(id => getSearchResults(id))
    );
    
    // Map results to IDs
    batch.forEach((id, index) => {
      resultMap[id] = batchResults[index];
    });
    
    // Small delay between batches
    if (i + batchSize < searchIds.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return resultMap;
};

/**
 * Pre-warm the cache with results from recent searches
 */
export const getSearchResults = async (searchId: string): Promise<{ query: string, results: any[] }> => {
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
  
  return {
    query: `Search ${searchId}`,
    results: mockResults
  };
};

/**
 * Query with selective fields to reduce payload size
 * @param query The search query
 * @param fields Optional specific fields to request
 * @returns Search results with only requested fields
 */
export const queryWithSelectiveFields = async (
  query: string, 
  fields: string[] = ['id', 'title', 'url']
): Promise<{ query: string, results: any[] }> => {
  // This would actually call Google API with field restrictions
  // For mock purposes, we'll just simulate it
  
  const fullResults = await getSearchResults('selective_' + query);
  
  // Filter to only include requested fields
  const filteredResults = fullResults.results.map(item => {
    const filtered: Record<string, any> = {};
    fields.forEach(field => {
      if (item.hasOwnProperty(field)) {
        filtered[field] = item[field];
      }
    });
    return filtered;
  });
  
  return {
    query: fullResults.query,
    results: filteredResults
  };
};

// Set up periodic cache cleanup
setInterval(cleanupCache, CACHE_CLEANUP_INTERVAL);

// Initialize cache
console.log('Search cache initialized with Google API optimizations');
