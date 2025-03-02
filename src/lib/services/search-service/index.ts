
// Re-export all search service functionality from a centralized entry point
export * from './text-search';
export * from './image-search';

// Initialize the search API manager with optimized settings
import { searchApiManager } from '../../search/search-api-manager';

// Set global search configuration
searchApiManager.setMaxResultsPerEngine(30);
searchApiManager.setCombinedResultsLimit(50);

// Export the initialized search API manager for direct access
export { searchApiManager };
