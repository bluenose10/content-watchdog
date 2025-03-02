
// Re-export services for easier imports
export { handleTextSearch } from './textSearch';
export { handleImageSearch } from './imageSearch';
export { sanitizeSearchQuery, validateImageFile } from './searchUtils';
export { DEFAULT_TEXT_PARAMS, DEFAULT_IMAGE_PARAMS } from './searchParameters';
export { checkSearchLimits, incrementSearchCount, formatTimeRemaining } from './searchLimits';

// Re-export from external modules that were previously exported by searchService.ts
import { getSearchEngineStats, getAvailableSearchEngines } from "@/lib/google-api-manager";
export { getSearchEngineStats, getAvailableSearchEngines };
