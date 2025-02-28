
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
