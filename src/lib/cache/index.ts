
// Re-export all cache functionality
import { startCacheCleanup } from './cache-maintenance';

// Initialize cache system
startCacheCleanup();
console.log('Search cache initialized with Google API optimizations');

// Re-export all necessary functions and types
export { getCacheKey } from './cache-key';
export { 
  getCachedResults, 
  cacheResults, 
  invalidateCache, 
  clearCache, 
  setCacheMaxSize 
} from './cache-operations';

export { 
  getCacheStats,
  cleanupCache,
  prioritizeCacheEntries
} from './cache-maintenance';

export {
  getSearchResults,
  batchGetSearchResults,
  queryWithSelectiveFields
} from './search-utils';

export type { CacheEntry, CachedSearchResult } from './types';
