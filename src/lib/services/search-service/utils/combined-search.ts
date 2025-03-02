
import { TextSearchParams } from '../../../db-types';
import { GoogleSearchResponse } from '../text-search/types';
import { executeParallelSearches } from './parallel-search';
import { removeDuplicateResults } from './duplicate-remover';
import { mergeAndSortResults } from './result-merger';

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
    // Get results from all search engines in parallel
    const allItems = await executeParallelSearches(query, userId, searchParams);
    
    // Remove duplicates by URL
    const uniqueItems = removeDuplicateResults(allItems);
    
    // Merge, sort, and limit results
    return mergeAndSortResults(uniqueItems, searchParams.maxResults);
  } catch (error) {
    console.error('Combined search error:', error);
    throw error;
  }
};
