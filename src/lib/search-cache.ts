
/**
 * Enhanced in-memory cache for search results to prevent redundant API calls
 */
interface CacheItem {
  timestamp: number;
  results: any;
  hitCount: number;     // Track how often this cache entry is accessed
  lastAccessed: number; // When was this entry last accessed
}

// Cache storage
const cache: Record<string, CacheItem> = {};

// Import cache expiration time from constants
import { SEARCH_CACHE_EXPIRATION } from "./constants";

/**
 * Generate a unique cache key based on search params
 */
export const getCacheKey = (queryType: string, query: string, params?: any): string => {
  // Normalize the query to improve cache hit rate
  const normalizedQuery = query.trim().toLowerCase();
  
  // Handle different parameter formats consistently
  const normalizedParams = params ? JSON.stringify(sortObjectKeys(params)) : 'default';
  
  return `${queryType}_${normalizedQuery}_${normalizedParams}`;
};

/**
 * Sort object keys to ensure consistent cache keys regardless of parameter order
 */
const sortObjectKeys = (obj: Record<string, any>): Record<string, any> => {
  return Object.keys(obj).sort().reduce((result, key) => {
    result[key] = obj[key];
    return result;
  }, {} as Record<string, any>);
};

/**
 * Get cached search results if available and not expired
 * Returns null if cache miss or expired
 */
export const getCachedResults = (key: string): any | null => {
  const item = cache[key];
  
  if (!item) {
    console.log('Cache miss for key:', key);
    return null;
  }
  
  const now = Date.now();
  
  // Check if cache has expired (with dynamic expiration based on popularity)
  const adjustedExpiration = getAdjustedExpiration(item);
  if (now - item.timestamp > adjustedExpiration) {
    console.log('Cache expired for key:', key);
    delete cache[key];
    return null;
  }
  
  // Update hit count and last accessed time
  item.hitCount += 1;
  item.lastAccessed = now;
  
  console.log(`Cache hit for key: ${key} (hit count: ${item.hitCount})`);
  return item.results;
};

/**
 * Calculate adjusted expiration time based on item popularity
 * Popular items get longer expiration times
 */
const getAdjustedExpiration = (item: CacheItem): number => {
  // Base expiration from constants
  let expiration = SEARCH_CACHE_EXPIRATION;
  
  // Items with more hits stay in cache longer (up to 3x longer for very popular items)
  if (item.hitCount > 10) {
    expiration = expiration * 3;
  } else if (item.hitCount > 5) {
    expiration = expiration * 2;
  } else if (item.hitCount > 2) {
    expiration = expiration * 1.5;
  }
  
  return expiration;
};

/**
 * Cache search results with additional metadata
 */
export const cacheResults = (key: string, results: any): void => {
  cache[key] = {
    timestamp: Date.now(),
    results,
    hitCount: 1,
    lastAccessed: Date.now()
  };
  
  console.log('Cached results for key:', key);
  
  // Perform smart cache cleanup if it's getting too large
  if (Object.keys(cache).length > 100) {
    performSmartCacheCleanup();
  }
};

/**
 * Smart cache cleanup that considers both age and usage patterns
 */
const performSmartCacheCleanup = (): void => {
  const keys = Object.keys(cache);
  if (keys.length <= 50) return; // Don't clean up if we're under 50 items
  
  // Score each cache entry based on age, hit count, and recency of access
  const scoredEntries = keys.map(key => {
    const item = cache[key];
    const now = Date.now();
    
    // Calculate age score (older items get higher scores = more likely to be removed)
    const ageScore = (now - item.timestamp) / SEARCH_CACHE_EXPIRATION;
    
    // Calculate popularity score (less popular items get higher scores = more likely to be removed)
    const popularityScore = 1 / (Math.max(item.hitCount, 1));
    
    // Calculate recency score (less recently accessed items get higher scores = more likely to be removed)
    const recencyScore = (now - item.lastAccessed) / SEARCH_CACHE_EXPIRATION;
    
    // Combined score with different weights for each factor
    const combinedScore = (ageScore * 0.4) + (popularityScore * 0.4) + (recencyScore * 0.2);
    
    return { key, score: combinedScore };
  });
  
  // Sort by score (highest first = most likely to be removed)
  scoredEntries.sort((a, b) => b.score - a.score);
  
  // Remove the top 20% of entries with highest scores
  const removeCount = Math.ceil(keys.length * 0.2);
  for (let i = 0; i < removeCount; i++) {
    if (scoredEntries[i]) {
      delete cache[scoredEntries[i].key];
    }
  }
  
  console.log(`Smart cache cleanup: removed ${removeCount} entries based on age, popularity, and recency`);
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

/**
 * Pre-warm the cache with frequently used searches
 */
export const preWarmCache = async (commonQueries: Array<{type: string, query: string, params?: any}>): Promise<void> => {
  console.log('Pre-warming cache with common queries...');
  
  for (const entry of commonQueries) {
    const key = getCacheKey(entry.type, entry.query, entry.params);
    
    // Only fetch if not already in cache
    if (!cache[key]) {
      try {
        // Simulate API call to get results (replace with actual implementation)
        const results = await getSearchResults(entry.query);
        
        // Cache the results
        cacheResults(key, results);
      } catch (error) {
        console.error(`Error pre-warming cache for query "${entry.query}":`, error);
      }
    }
  }
  
  console.log('Cache pre-warming complete');
};

/**
 * Get search usage statistics from cache
 */
export const getCacheStats = (): { 
  size: number, 
  oldestEntry: number, 
  newestEntry: number,
  averageHitCount: number,
  hitRate: number,
  totalHits: number,
  totalMisses: number,
  popularQueries: Array<{key: string, hits: number}>
} => {
  const keys = Object.keys(cache);
  if (keys.length === 0) {
    return { 
      size: 0, 
      oldestEntry: 0, 
      newestEntry: 0,
      averageHitCount: 0,
      hitRate: 0,
      totalHits: 0,
      totalMisses: 0,
      popularQueries: []
    };
  }
  
  // Calculate statistics
  let totalHitCount = 0;
  let oldestEntry = Date.now();
  let newestEntry = 0;
  
  // Track hit statistics for each cached item
  keys.forEach(key => {
    const item = cache[key];
    totalHitCount += item.hitCount;
    
    if (item.timestamp < oldestEntry) {
      oldestEntry = item.timestamp;
    }
    
    if (item.timestamp > newestEntry) {
      newestEntry = item.timestamp;
    }
  });
  
  // Calculate hit rate (approximate from metadata)
  const totalHits = totalHitCount;
  const totalMisses = Math.max(0, globalHitsMisses.misses);
  const hitRate = totalHits / (totalHits + totalMisses);
  
  // Get popular queries (top 5)
  const popularQueries = keys
    .map(key => ({ key, hits: cache[key].hitCount }))
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 5);
  
  return {
    size: keys.length,
    oldestEntry,
    newestEntry,
    averageHitCount: totalHitCount / keys.length,
    hitRate,
    totalHits,
    totalMisses,
    popularQueries
  };
};

// Global counter for tracking cache hits/misses
const globalHitsMisses = {
  hits: 0,
  misses: 0
};

/**
 * Update the global hit/miss counters
 */
export const updateHitMissStats = (isHit: boolean): void => {
  if (isHit) {
    globalHitsMisses.hits++;
  } else {
    globalHitsMisses.misses++;
  }
};

/**
 * Save cache to localStorage for persistence between sessions
 */
export const persistCache = (): void => {
  try {
    // Only save minimal cache data to avoid localStorage size limits
    const serializedCache = Object.entries(cache).map(([key, item]) => ({
      key,
      timestamp: item.timestamp,
      hitCount: item.hitCount,
      results: item.results
    }));
    
    localStorage.setItem('search_cache', JSON.stringify(serializedCache));
    console.log(`Cache persisted with ${serializedCache.length} entries`);
  } catch (error) {
    console.error('Error persisting cache to localStorage:', error);
  }
};

/**
 * Load cache from localStorage
 */
export const loadPersistedCache = (): void => {
  try {
    const serializedCache = localStorage.getItem('search_cache');
    if (!serializedCache) return;
    
    const cacheData = JSON.parse(serializedCache);
    
    // Restore cache entries
    cacheData.forEach((entry: any) => {
      cache[entry.key] = {
        timestamp: entry.timestamp,
        results: entry.results,
        hitCount: entry.hitCount,
        lastAccessed: Date.now()
      };
    });
    
    console.log(`Loaded ${cacheData.length} entries from persisted cache`);
  } catch (error) {
    console.error('Error loading persisted cache from localStorage:', error);
  }
};

// Mock data for search results
const mockResults = {
  '1': {
    query: 'Digital artwork sunset',
    results: [
      {
        id: '1',
        title: 'Digital Sunset Artwork',
        url: 'https://example.com/digital-sunset',
        thumbnail: 'https://example.com/images/sunset-thumb.jpg',
        source: 'instagram.com',
        match_level: 'High',
        found_at: '2023-04-10T15:30:00Z',
        type: 'image'
      },
      {
        id: '2',
        title: 'Sunset Digital Art Collection',
        url: 'https://example.com/sunset-collection',
        thumbnail: 'https://example.com/images/collection-thumb.jpg',
        source: 'behance.net',
        match_level: 'Medium',
        found_at: '2023-04-09T12:45:00Z',
        type: 'website'
      },
      {
        id: '3',
        title: 'Sunset Artwork Repost',
        url: 'https://example.com/sunset-repost',
        thumbnail: 'https://example.com/images/repost-thumb.jpg',
        source: 'facebook.com',
        match_level: 'High',
        found_at: '2023-04-08T18:20:00Z',
        type: 'social'
      }
    ]
  },
  '2': {
    query: 'Mountain landscape photo',
    results: [
      {
        id: '4',
        title: 'Mountain Landscape Photography',
        url: 'https://example.com/mountain-landscape',
        thumbnail: 'https://example.com/images/mountain-thumb.jpg',
        source: 'flickr.com',
        match_level: 'High',
        found_at: '2023-04-07T09:15:00Z',
        type: 'image'
      },
      {
        id: '5',
        title: 'Mountain Photo Collection',
        url: 'https://example.com/mountain-collection',
        thumbnail: 'https://example.com/images/mountain-collection-thumb.jpg',
        source: '500px.com',
        match_level: 'Low',
        found_at: '2023-04-06T14:30:00Z',
        type: 'website'
      }
    ]
  },
  '3': {
    query: '#naturebeauty',
    results: [
      {
        id: '6',
        title: 'Nature Beauty Post',
        url: 'https://example.com/nature-beauty',
        thumbnail: 'https://example.com/images/nature-thumb.jpg',
        source: 'twitter.com',
        match_level: 'Medium',
        found_at: '2023-04-05T11:45:00Z',
        type: 'social'
      },
      {
        id: '7',
        title: 'Nature Photography Website',
        url: 'https://example.com/nature-photography',
        thumbnail: 'https://example.com/images/nature-website-thumb.jpg',
        source: 'wordpress.com',
        match_level: 'Low',
        found_at: '2023-04-04T16:20:00Z',
        type: 'website'
      },
      {
        id: '8',
        title: 'Nature Beauty Images',
        url: 'https://example.com/nature-images',
        thumbnail: 'https://example.com/images/nature-images-thumb.jpg',
        source: 'pinterest.com',
        match_level: 'High',
        found_at: '2023-04-03T13:10:00Z',
        type: 'image'
      }
    ]
  }
};

/**
 * Mock function to get search results - simulates an API call
 */
export const getSearchResults = async (id: string): Promise<any> => {
  // Update miss counter for tracking
  updateHitMissStats(false);
  
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const results = mockResults[id as keyof typeof mockResults] || { 
        query: 'Unknown search',
        results: [] 
      };
      resolve(results);
    }, 500);
  });
};

// Initialize cache on module load - run this to hydrate cache from localStorage
(() => {
  try {
    loadPersistedCache();
    
    // Set up periodic persistence
    if (typeof window !== 'undefined') {
      setInterval(persistCache, 5 * 60 * 1000); // Save cache every 5 minutes
    }
  } catch (error) {
    console.error('Error initializing cache:', error);
  }
})();
