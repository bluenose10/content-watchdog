
// This file now serves as a compatibility layer
// All functionality has been moved to the search directory modules
import { 
  searchApiManager,
  optimizedSearch,
  getAvailableSearchEngines,
  getSearchEngineStats,
  toggleSearchEngine,
  enableBingSearch,
  disableBingSearch,
  setBingPriority
} from './search';

// Export the search manager for backward compatibility
export { searchApiManager };

// Export convenience methods
export const optimizedGoogleSearch = optimizedSearch;

// Re-export all other functions for backward compatibility
export {
  optimizedSearch,
  getAvailableSearchEngines,
  getSearchEngineStats,
  toggleSearchEngine,
  enableBingSearch,
  disableBingSearch,
  setBingPriority
};
