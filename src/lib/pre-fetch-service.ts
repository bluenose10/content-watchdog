
import { getCacheKey, getCachedResults, cacheResults, getSearchResults } from '@/lib/search-cache';
import { getRecentSearches } from '@/lib/db-service';

// Popular search types and terms that we want to pre-fetch
interface PreFetchQuery {
  queryType: 'name' | 'hashtag' | 'image';
  query: string;
  params?: any;
}

// Default list of queries to pre-fetch (can be expanded based on analytics)
const DEFAULT_PREFETCH_QUERIES: PreFetchQuery[] = [
  { queryType: 'name', query: 'digital art' },
  { queryType: 'name', query: 'photography' },
  { queryType: 'hashtag', query: '#naturebeauty' },
  { queryType: 'hashtag', query: '#digitalart' },
  // Add more common searches based on analytics
];

/**
 * Check if we're in an "off-peak" period where pre-fetching won't impact performance
 */
const isOffPeakHours = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  
  // Consider early morning and late night as off-peak hours
  // This can be tuned based on your actual traffic patterns
  return (hour >= 0 && hour < 7) || (hour >= 22);
};

/**
 * Determines if the system is under low load and suitable for pre-fetching
 */
const isLowSystemLoad = (): boolean => {
  // In a real implementation, this would check system metrics
  // For demo purposes, we'll assume it's always OK to prefetch during off-peak hours
  return true;
};

/**
 * Pre-fetch a specific search query and cache the results
 */
export const preFetchQuery = async (
  queryType: 'name' | 'hashtag' | 'image',
  query: string, 
  params: any = {}
): Promise<boolean> => {
  try {
    // Generate cache key for this query
    const cacheKey = getCacheKey(queryType, query, params);
    
    // Check if already cached
    if (getCachedResults(cacheKey)) {
      console.log(`[Pre-fetch] Query already cached: ${queryType} - ${query}`);
      return false;
    }
    
    console.log(`[Pre-fetch] Fetching: ${queryType} - ${query}`);
    
    // In a real implementation, this would call your actual search API
    // For this demo, we'll use the mock getSearchResults
    const results = await getSearchResults('1'); // Using a mock ID for demo
    
    // Cache the results
    cacheResults(cacheKey, results);
    
    console.log(`[Pre-fetch] Successfully cached: ${queryType} - ${query}`);
    return true;
  } catch (error) {
    console.error(`[Pre-fetch] Error pre-fetching ${queryType} - ${query}:`, error);
    return false;
  }
};

/**
 * Start pre-fetching process for common queries
 */
export const startPreFetching = async (customQueries?: PreFetchQuery[]): Promise<void> => {
  // Only run during off-peak hours
  if (!isOffPeakHours() || !isLowSystemLoad()) {
    console.log('[Pre-fetch] Not pre-fetching: Peak hours or high system load');
    return;
  }
  
  console.log('[Pre-fetch] Starting pre-fetch process');
  
  // Combine default and custom queries
  const queriesToFetch = [...DEFAULT_PREFETCH_QUERIES, ...(customQueries || [])];
  
  // Try to get popular searches from recent user activity
  try {
    const recentSearches = await getRecentSearches(10);
    
    if (recentSearches && recentSearches.length > 0) {
      // Transform recent searches into pre-fetch queries
      const recentQueries = recentSearches.map(search => ({
        queryType: search.query_type as 'name' | 'hashtag' | 'image',
        query: search.query_text || '',
        params: search.search_params_json ? JSON.parse(search.search_params_json) : {}
      }));
      
      // Add unique recent searches to our pre-fetch list
      recentQueries.forEach(query => {
        if (!queriesToFetch.some(q => 
          q.queryType === query.queryType && 
          q.query.toLowerCase() === query.query.toLowerCase()
        )) {
          queriesToFetch.push(query);
        }
      });
    }
  } catch (error) {
    console.error('[Pre-fetch] Error fetching recent searches:', error);
    // Continue with default queries if we can't get recent searches
  }
  
  // Perform pre-fetching with a small delay between each request to avoid overloading
  let fetchedCount = 0;
  
  for (const query of queriesToFetch) {
    // Skip invalid queries
    if (!query.query) continue;
    
    // Add a small delay between fetches
    if (fetchedCount > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const success = await preFetchQuery(query.queryType, query.query, query.params);
    if (success) fetchedCount++;
    
    // Limit the number of pre-fetches in one batch
    if (fetchedCount >= 20) break;
  }
  
  console.log(`[Pre-fetch] Completed pre-fetching. Cached ${fetchedCount} queries.`);
};

/**
 * Schedule regular pre-fetching to run at specified intervals
 */
export const schedulePreFetching = (intervalMinutes = 60): (() => void) => {
  console.log(`[Pre-fetch] Scheduled pre-fetching every ${intervalMinutes} minutes`);
  
  // Initial pre-fetch after a short delay
  const initialTimeout = setTimeout(() => {
    startPreFetching();
  }, 30000); // 30 seconds after app starts
  
  // Regular interval pre-fetching
  const intervalId = setInterval(() => {
    startPreFetching();
  }, intervalMinutes * 60 * 1000);
  
  // Return a cleanup function
  return () => {
    clearTimeout(initialTimeout);
    clearInterval(intervalId);
  };
};
