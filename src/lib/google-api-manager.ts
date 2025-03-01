
import { searchApiManager } from './search/search-api-manager';
import { getCacheKey, getCachedResults, cacheResults } from './search-cache';

// Export convenience methods
export const optimizedSearch = (
  type: string,
  query: string,
  params: any = {}
) => searchApiManager.optimizedSearch(type, query, params);

// For backward compatibility
export const optimizedGoogleSearch = optimizedSearch;

// Export methods to control search engines
export const getSearchEngineStats = () => searchApiManager.getSearchEngineStats();
export const toggleSearchEngine = (name: string, enabled: boolean) => 
  searchApiManager.toggleSearchEngine(name, enabled);
export const getAvailableSearchEngines = () => 
  searchApiManager.getAvailableSearchEngines();

// Export new Bing-specific methods
export const enableBingSearch = () => toggleSearchEngine('bing', true);
export const disableBingSearch = () => toggleSearchEngine('bing', false);
export const setBingPriority = (priority: number) => 
  searchApiManager.setPriority('bing', priority);

// Re-export types for backward compatibility
export { 
  SearchEngineConfig, 
  QueuedRequest,
  BingWebResult,
  BingImageResult,
  BingVideoResult,
  BingNewsResult
} from './search/search-types';

export { QuotaConfig } from './search/quota-manager';

// Set priority for a user
export const setPriorityMode = (userId: string, isPriority: boolean) => 
  searchApiManager.setPriorityMode(userId, isPriority);

// Check if a user has priority
export const hasUserPriority = (userId: string) => 
  searchApiManager.hasUserPriority(userId);

// Export the search cache methods for direct use
export { getCacheKey, getCachedResults, cacheResults };
