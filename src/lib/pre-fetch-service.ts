
import { getCacheKey, getCachedResults, cacheResults, batchGetSearchResults } from '@/lib/search-cache';
import { getRecentSearches } from '@/lib/db-service';
import { googleApiManager } from '@/lib/google-api-manager';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

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
 * Check Google API quota availability before pre-fetching
 */
const hasAvailableQuota = (): boolean => {
  return googleApiManager.canMakeRequest('search');
};

/**
 * Load Google API credentials from Supabase and store them in session storage
 */
export const loadGoogleApiCredentials = async (): Promise<boolean> => {
  try {
    console.log("Starting to load Google API credentials...");
    
    // Skip if already loaded in session storage
    if (sessionStorage.getItem('GOOGLE_API_KEY') && sessionStorage.getItem('GOOGLE_CSE_ID')) {
      console.log("Google API credentials already loaded in session storage");
      console.log("API Key starts with:", sessionStorage.getItem('GOOGLE_API_KEY')?.substring(0, 4) + '...');
      console.log("CSE ID starts with:", sessionStorage.getItem('GOOGLE_CSE_ID')?.substring(0, 4) + '...');
      return true;
    }

    // Check for credentials in process.env first (already loaded from environment)
    if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_CSE_ID) {
      sessionStorage.setItem('GOOGLE_API_KEY', process.env.GOOGLE_API_KEY);
      sessionStorage.setItem('GOOGLE_CSE_ID', process.env.GOOGLE_CSE_ID);
      console.log("Google API credentials loaded from environment");
      console.log("API Key starts with:", process.env.GOOGLE_API_KEY.substring(0, 4) + '...');
      console.log("CSE ID starts with:", process.env.GOOGLE_CSE_ID.substring(0, 4) + '...');
      return true;
    }

    // Try to load from local storage as fallback
    if (localStorage.getItem('GOOGLE_API_KEY') && localStorage.getItem('GOOGLE_CSE_ID')) {
      sessionStorage.setItem('GOOGLE_API_KEY', localStorage.getItem('GOOGLE_API_KEY')!);
      sessionStorage.setItem('GOOGLE_CSE_ID', localStorage.getItem('GOOGLE_CSE_ID')!);
      console.log("Google API credentials loaded from local storage");
      console.log("API Key starts with:", localStorage.getItem('GOOGLE_API_KEY')?.substring(0, 4) + '...');
      console.log("CSE ID starts with:", localStorage.getItem('GOOGLE_CSE_ID')?.substring(0, 4) + '...');
      return true;
    }

    // Try to load from Supabase Edge Function that exposes secrets
    try {
      console.log("Attempting to load Google API credentials from Supabase Edge Function...");
      const { data, error } = await supabase.functions.invoke('get-search-credentials', {
        method: 'GET',
      });

      if (error) {
        console.error("Error fetching Google API credentials from Supabase:", error);
        return false;
      }

      if (data && data.apiKey && data.cseId) {
        // Store in both session storage and local storage for resilience
        sessionStorage.setItem('GOOGLE_API_KEY', data.apiKey);
        sessionStorage.setItem('GOOGLE_CSE_ID', data.cseId);
        localStorage.setItem('GOOGLE_API_KEY', data.apiKey);
        localStorage.setItem('GOOGLE_CSE_ID', data.cseId);
        
        console.log("Google API credentials successfully loaded from Supabase Edge Function");
        console.log("API Key starts with:", data.apiKey.substring(0, 4) + '...');
        console.log("CSE ID starts with:", data.cseId.substring(0, 4) + '...');
        return true;
      } else {
        console.error("Edge function returned but missing credentials:", data);
        if (data && data.error) {
          console.error("Error details:", data.error);
        }
      }
    } catch (e) {
      console.error("Failed to load Google API credentials from Edge Function:", e);
      // Display a toast notification about the failure
      if (typeof window !== 'undefined') {  // Check if we're in browser environment
        toast({
          title: "API Configuration Issue",
          description: "Could not connect to Google Search API. Please check your configuration.",
          variant: "destructive",
        });
      }
    }

    console.warn("Could not load Google API credentials from any source");
    return false;
  } catch (error) {
    console.error("Error in loadGoogleApiCredentials:", error);
    return false;
  }
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
    // Make sure credentials are loaded
    await loadGoogleApiCredentials();
    
    // Generate cache key for this query
    const cacheKey = getCacheKey(queryType, query, params);
    
    // Check if already cached
    if (getCachedResults(cacheKey)) {
      console.log(`[Pre-fetch] Query already cached: ${queryType} - ${query}`);
      return false;
    }
    
    // Skip if we don't have quota available
    if (!hasAvailableQuota()) {
      console.log(`[Pre-fetch] Skipping due to quota limits: ${queryType} - ${query}`);
      return false;
    }
    
    console.log(`[Pre-fetch] Fetching: ${queryType} - ${query}`);
    
    // Use Google API Manager for optimized, throttled access
    const results = await googleApiManager.optimizedSearch(queryType, query, params);
    
    // Cache the results
    cacheResults(cacheKey, results, 'google', 0.01); // Tracking cost per request
    
    console.log(`[Pre-fetch] Successfully cached: ${queryType} - ${query}`);
    return true;
  } catch (error) {
    console.error(`[Pre-fetch] Error pre-fetching ${queryType} - ${query}:`, error);
    return false;
  }
};

/**
 * Batch pre-fetch multiple queries at once for efficiency
 */
export const batchPreFetch = async (queries: PreFetchQuery[]): Promise<number> => {
  // Skip if we don't have sufficient quota
  if (!hasAvailableQuota()) {
    console.log(`[Pre-fetch] Skipping batch pre-fetch due to quota limits`);
    return 0;
  }
  
  // Filter out queries that are already cached
  const queriesToFetch = queries.filter(q => {
    const cacheKey = getCacheKey(q.queryType, q.query, q.params);
    return !getCachedResults(cacheKey);
  });
  
  if (queriesToFetch.length === 0) {
    console.log(`[Pre-fetch] All queries already cached`);
    return 0;
  }
  
  try {
    // Create search IDs for each query
    const searchIds = queriesToFetch.map(q => 
      `${q.queryType}_${q.query.replace(/\W+/g, '_')}`
    );
    
    // Batch fetch the results
    const batchResults = await batchGetSearchResults(searchIds);
    
    // Cache each result
    let cachedCount = 0;
    
    queriesToFetch.forEach((query, index) => {
      const searchId = searchIds[index];
      const result = batchResults[searchId];
      
      if (result) {
        const cacheKey = getCacheKey(query.queryType, query.query, query.params);
        cacheResults(cacheKey, result, 'google', 0.01);
        cachedCount++;
      }
    });
    
    console.log(`[Pre-fetch] Batch cached ${cachedCount} of ${queriesToFetch.length} queries`);
    return cachedCount;
  } catch (error) {
    console.error(`[Pre-fetch] Error batch pre-fetching:`, error);
    return 0;
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
  
  // Use batch pre-fetching for efficiency
  const batchSize = 5;
  let totalFetched = 0;
  
  for (let i = 0; i < queriesToFetch.length; i += batchSize) {
    const batch = queriesToFetch.slice(i, i + batchSize);
    
    // Process in batches for better performance
    const fetched = await batchPreFetch(batch);
    totalFetched += fetched;
    
    // If we've hit quota limits, stop
    if (!hasAvailableQuota()) {
      console.log(`[Pre-fetch] Stopping due to quota limits after ${totalFetched} fetches`);
      break;
    }
    
    // Small delay between batches
    if (i + batchSize < queriesToFetch.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`[Pre-fetch] Completed pre-fetching. Cached ${totalFetched} queries.`);
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
