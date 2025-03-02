
import { TextSearchParams } from '../../../db-types';
import { performGoogleSearch } from '../text-search/google-search';
import { performDuckDuckGoSearch } from '../text-search/ddg-search';
import { EnhancedSearchResult } from '../text-search/types';

/**
 * Executes searches across multiple engines in parallel
 * @param query Search query
 * @param userId User ID
 * @param searchParams Search parameters
 * @returns Combined results from all search engines
 */
export async function executeParallelSearches(
  query: string, 
  userId: string, 
  searchParams: TextSearchParams = {}
): Promise<EnhancedSearchResult[]> {
  // Execute searches in parallel
  const [googleResults, ddgResults] = await Promise.allSettled([
    performGoogleSearch(query, userId, searchParams),
    performDuckDuckGoSearch(query, userId, searchParams)
  ]);
  
  // Extract results
  const googleItems = googleResults.status === 'fulfilled' ? googleResults.value.items || [] : [];
  const ddgItems = ddgResults.status === 'fulfilled' ? ddgResults.value.items || [] : [];
  
  // Combine all results
  return [...googleItems, ...ddgItems];
}
