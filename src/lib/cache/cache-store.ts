
import { CacheEntry, CacheStats } from './types';

// In-memory cache with improved structure
const cache: Record<string, CacheEntry> = {};

// Cache statistics
const cacheStats: CacheStats = {
  hits: 0,
  misses: 0,
  size: 0,
  maxSize: 100, // Default max size
  keyAccess: {},
  apiCalls: {
    google: 0,
    other: 0
  },
  estimatedCost: 0, // Track estimated API costs
};

// Cache configuration - Longer TTL for Google API responses
export const CACHE_TTL = 30 * 60 * 1000; // 30 minutes for regular cache
export const GOOGLE_API_CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours for Google API cache
export const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Export the cache and stats objects
export { cache, cacheStats };
