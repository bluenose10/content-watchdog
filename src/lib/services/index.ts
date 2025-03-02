
// Export all service functions from a single entry point
export * from './search-query-service';
export * from './search-results-service';
export * from './subscription-service';
export * from './storage-service';
export * from './metrics-service';
export * from './search-service/index';
export * from './search-service/text-search';
export * from './search-service/image-search';
export * from './search-service/utils';
export * from './dashboard-stats-service';

// Export the initialized search API manager
import { searchApiManager } from '../search/search-api-manager';
export { searchApiManager };
