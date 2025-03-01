
// Re-export everything from the modular cache files
import { getCacheKey, setCacheMaxSize, clearCache } from './cache/cache-store';
import { 
  getCachedResults, 
  cacheResults, 
  invalidateCache, 
  cleanupCache, 
  getCacheStats 
} from './cache/cache-operations';
import { 
  batchGetSearchResults, 
  getSearchResults, 
  queryWithSelectiveFields 
} from './cache/cache-advanced';

// Export all functions
export {
  // From cache-store
  getCacheKey,
  setCacheMaxSize,
  clearCache,
  
  // From cache-operations
  getCachedResults,
  cacheResults,
  invalidateCache,
  cleanupCache,
  getCacheStats,
  
  // From cache-advanced
  batchGetSearchResults,
  getSearchResults,
  queryWithSelectiveFields
};

// Set up periodic cache cleanup
import { CACHE_CLEANUP_INTERVAL } from './cache/cache-store';
import { cleanupCache as performCleanup } from './cache/cache-operations';

setInterval(performCleanup, CACHE_CLEANUP_INTERVAL);

// Initialize cache
console.log('Search cache initialized with Google API optimizations');
