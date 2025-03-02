
import { TextSearchParams } from '../../../db-types';
import { performGoogleSearch } from '../text-search/google-search';
import { performDuckDuckGoSearch } from '../text-search/ddg-search';
import { EnhancedSearchResult, GoogleSearchResponse } from '../text-search/types';

/**
 * Combines search results from multiple engines
 * @param query Search query
 * @param userId User ID
 * @param searchParams Search parameters
 * @returns Combined search results
 */
export const performCombinedSearch = async (
  query: string, 
  userId: string, 
  searchParams: TextSearchParams = {}
): Promise<GoogleSearchResponse> => {
  try {
    // Execute searches in parallel
    const [googleResults, ddgResults] = await Promise.allSettled([
      performGoogleSearch(query, userId, searchParams),
      performDuckDuckGoSearch(query, userId, searchParams)
    ]);
    
    // Extract results
    const googleItems = googleResults.status === 'fulfilled' ? googleResults.value.items || [] : [];
    const ddgItems = ddgResults.status === 'fulfilled' ? ddgResults.value.items || [] : [];
    
    // Combine all results
    const allItems = [...googleItems, ...ddgItems];
    
    // Remove duplicates by URL
    const uniqueItems = removeDuplicateResults(allItems);
    
    // Sort by relevance
    uniqueItems.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    
    // Limit to max results
    const items = uniqueItems.slice(0, searchParams.maxResults || 30);
    
    return {
      items,
      searchInformation: {
        totalResults: String(items.length),
        formattedTotalResults: String(items.length),
        searchTime: 0.5,
        formattedSearchTime: "0.5"
      }
    };
  } catch (error) {
    console.error('Combined search error:', error);
    throw error;
  }
};

/**
 * Remove duplicate results based on URL
 */
function removeDuplicateResults(results: EnhancedSearchResult[]): EnhancedSearchResult[] {
  const seen = new Set<string>();
  return results.filter(result => {
    if (!result.link) return false;
    if (seen.has(result.link)) return false;
    seen.add(result.link);
    return true;
  });
}
