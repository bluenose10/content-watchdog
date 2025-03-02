
// Export all service functions from a single entry point
export * from './search-query-service';
export * from './search-results-service';
export * from './subscription-service';
export * from './storage-service';
export * from './metrics-service';
export * from './search-service/text-search';
export * from './search-service/image-search';
export * from './dashboard-stats-service';

// Initialize search API manager with optimized settings
import { searchApiManager } from '../search/search-api-manager';
searchApiManager.setMaxResultsPerEngine(30);
searchApiManager.setCombinedResultsLimit(50);

// Export the initialized search API manager
export { searchApiManager };
