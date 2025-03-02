
import { EnhancedSearchResult, GoogleSearchResponse } from '../text-search/types';

/**
 * Merges and sorts search results from multiple sources
 * @param allItems Combined results from different search engines
 * @param maxResults Maximum number of results to return
 * @returns Sorted and limited search results
 */
export function mergeAndSortResults(
  allItems: EnhancedSearchResult[], 
  maxResults: number = 30
): GoogleSearchResponse {
  // Sort by relevance
  allItems.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  
  // Limit to max results
  const items = allItems.slice(0, maxResults);
  
  return {
    items,
    searchInformation: {
      totalResults: String(items.length),
      formattedTotalResults: String(items.length),
      searchTime: 0.5,
      formattedSearchTime: "0.5"
    }
  };
}
