
/**
 * Enhanced in-memory cache for search results to prevent redundant API calls
 */
interface CacheItem {
  timestamp: number;
  results: any;
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
  return `${queryType}_${normalizedQuery}_${params ? JSON.stringify(params) : 'default'}`;
};

/**
 * Get cached search results if available and not expired
 */
export const getCachedResults = (key: string): any | null => {
  const item = cache[key];
  
  if (!item) return null;
  
  // Check if cache has expired
  if (Date.now() - item.timestamp > SEARCH_CACHE_EXPIRATION) {
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
  
  // Perform cache cleanup if it's getting too large (over 100 items)
  if (Object.keys(cache).length > 100) {
    performCacheCleanup();
  }
};

/**
 * Clean up oldest cache entries when cache gets too large
 */
const performCacheCleanup = (): void => {
  const keys = Object.keys(cache);
  if (keys.length <= 50) return; // Don't clean up if we're under 50 items
  
  // Sort keys by timestamp (oldest first)
  const sortedKeys = keys.sort((a, b) => 
    cache[a].timestamp - cache[b].timestamp
  );
  
  // Remove the oldest 20% of cache entries
  const removeCount = Math.ceil(sortedKeys.length * 0.2);
  for (let i = 0; i < removeCount; i++) {
    if (sortedKeys[i]) {
      delete cache[sortedKeys[i]];
    }
  }
  
  console.log(`Cache cleanup: removed ${removeCount} old entries`);
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
 * Get search usage statistics from cache
 */
export const getCacheStats = (): { size: number, oldestEntry: number, newestEntry: number } => {
  const keys = Object.keys(cache);
  if (keys.length === 0) {
    return { size: 0, oldestEntry: 0, newestEntry: 0 };
  }
  
  // Find oldest and newest timestamps
  const timestamps = keys.map(key => cache[key].timestamp);
  const oldestEntry = Math.min(...timestamps);
  const newestEntry = Math.max(...timestamps);
  
  return {
    size: keys.length,
    oldestEntry,
    newestEntry
  };
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
