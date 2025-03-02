
import { CachedSearchResult } from './types';

/**
 * Get search results for a given search ID
 * This is a mock function that returns fake results for pre-fetching
 */
export const getSearchResults = async (searchId: string): Promise<CachedSearchResult> => {
  // This is a mock function that returns fake results for pre-fetching
  // In a real implementation, this would call your actual search API
  
  const mockResults = [];
  
  // Generate some mock results
  for (let i = 0; i < 5; i++) {
    mockResults.push({
      id: `result_${i}_${searchId}`,
      search_id: searchId,
      title: `Sample Result ${i}`,
      url: `https://example.com/result-${i}`,
      thumbnail: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/200/300`,
      source: ['instagram.com', 'twitter.com', 'facebook.com', 'linkedin.com'][Math.floor(Math.random() * 4)],
      match_level: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      found_at: new Date().toISOString(),
      similarity_score: Math.random()
    });
  }
  
  return {
    query: `Search ${searchId}`,
    results: mockResults
  };
};

/**
 * Batch multiple Google API requests to optimize quotas
 * @param searchIds Array of search IDs to pre-fetch
 * @returns Object containing all fetched results mapped by ID
 */
export const batchGetSearchResults = async (searchIds: string[]): Promise<Record<string, CachedSearchResult>> => {
  // This would batch requests to Google API in a real implementation
  // For mock purposes, we'll just call getSearchResults for each ID
  
  console.log(`Batch fetching ${searchIds.length} search results`);
  
  const resultMap: Record<string, CachedSearchResult> = {};
  
  // Process in smaller batches to avoid overwhelming APIs
  const batchSize = 5;
  for (let i = 0; i < searchIds.length; i += batchSize) {
    const batch = searchIds.slice(i, i + batchSize);
    
    // Process each batch in parallel
    const batchResults = await Promise.all(
      batch.map(id => getSearchResults(id))
    );
    
    // Map results to IDs
    batch.forEach((id, index) => {
      resultMap[id] = batchResults[index];
    });
    
    // Small delay between batches
    if (i + batchSize < searchIds.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return resultMap;
};

/**
 * Query with selective fields to reduce payload size
 * @param query The search query
 * @param fields Optional specific fields to request
 * @returns Search results with only requested fields
 */
export const queryWithSelectiveFields = async (
  query: string, 
  fields: string[] = ['id', 'title', 'url']
): Promise<CachedSearchResult> => {
  // This would actually call Google API with field restrictions
  // For mock purposes, we'll just simulate it
  
  const fullResults = await getSearchResults('selective_' + query);
  
  // Filter to only include requested fields
  const filteredResults = fullResults.results.map(item => {
    const filtered: Record<string, any> = {};
    fields.forEach(field => {
      if (item.hasOwnProperty(field)) {
        filtered[field] = item[field];
      }
    });
    return filtered;
  });
  
  return {
    query: fullResults.query,
    results: filteredResults
  };
};
