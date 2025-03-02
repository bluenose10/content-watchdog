
import { TextSearchParams } from '../../../db-types';
import { cacheResults } from '../../../search-cache';
import { GoogleSearchResponse, EnhancedSearchResult } from './types';
import { checkRequestCache, registerPendingRequest } from './cache-helpers';
import { generateEnhancedMockSearchResults } from './mock-generator';

/**
 * Enhanced Google search function with improved parameter handling and error management
 * @param query Search query text
 * @param userId User ID making the request
 * @param searchParams Additional search parameters
 * @returns Search results
 */
export const performGoogleSearch = async (query: string, userId: string, searchParams: TextSearchParams = {}) => {
  try {
    // Check cache and pending requests
    const { cacheKey, cachedResult, pendingRequest } = checkRequestCache(query, searchParams);
    
    if (pendingRequest) {
      return pendingRequest;
    }
    
    if (cachedResult) {
      return cachedResult;
    }
    
    console.log('Performing Google search for query:', query, 'by user:', userId, 'with params:', searchParams);
    
    const request = new Promise(async (resolve, reject) => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
        const searchEngineId = import.meta.env.VITE_GOOGLE_CSE_ID || '';
        
        if (!apiKey || !searchEngineId) {
          console.error('ERROR: No API keys found for Google search. Please configure VITE_GOOGLE_API_KEY and VITE_GOOGLE_CSE_ID');
          reject(new Error('Google API configuration missing. Please configure API keys.'));
          return;
        }
        
        // Build the URL parameters with enhanced configuration
        const params = buildSearchParams(query, searchParams, apiKey, searchEngineId);
        
        // Make multiple API requests if we need more than max results per page
        const maxResultsPerPage = 10;
        const numPages = Math.min(3, Math.ceil((searchParams.maxResults || 30) / maxResultsPerPage));
        const allResults = await fetchMultiplePages(params, numPages, maxResultsPerPage);
        
        console.log('Google API response completed with', allResults.items?.length || 0, 'total results');
        
        cacheResults(cacheKey, allResults);
        resolve(allResults);
      } catch (error) {
        console.error('Google Search API error:', error);
        reject(error);
      }
    });
    
    registerPendingRequest(cacheKey, request);
    
    return request;
  } catch (error) {
    console.error('Google Search API error:', error);
    throw error;
  }
};

/**
 * Build search parameters for Google API
 */
function buildSearchParams(query: string, searchParams: TextSearchParams, apiKey: string, searchEngineId: string): URLSearchParams {
  const params = new URLSearchParams({
    key: apiKey,
    cx: searchEngineId,
    q: query,
    num: searchParams.maxResults?.toString() || '30' // Request more results than default 20
  });
  
  // Apply advanced search parameters
  if (searchParams?.exactMatch) {
    params.append('exactTerms', query);
  }
  
  if (searchParams?.dateRestrict) {
    params.append('dateRestrict', searchParams.dateRestrict);
  }
  
  if (searchParams?.searchType && searchParams.searchType !== 'web') {
    params.append('searchType', searchParams.searchType);
  }
  
  if (searchParams?.contentFilter) {
    params.append('safe', searchParams.contentFilter === 'high' ? 'active' : 'off');
  }
  
  if (searchParams?.siteFilter && searchParams.siteFilter.length > 0) {
    params.append('siteSearch', searchParams.siteFilter.join('|'));
    params.append('siteSearchFilter', 'i'); // include sites
  }
  
  if (searchParams?.excludeSites && searchParams.excludeSites.length > 0) {
    // If already filtering to specific sites, we can't also exclude sites
    if (!searchParams?.siteFilter || searchParams.siteFilter.length === 0) {
      params.append('siteSearch', searchParams.excludeSites.join('|'));
      params.append('siteSearchFilter', 'e'); // exclude sites
    }
  }
  
  if (searchParams?.language) {
    params.append('lr', `lang_${searchParams.language}`);
  }
  
  if (searchParams?.country) {
    params.append('cr', `country${searchParams.country.toUpperCase()}`);
  }
  
  if (searchParams?.fileType) {
    params.append('fileType', searchParams.fileType);
  }
  
  if (searchParams?.rights) {
    params.append('rights', searchParams.rights);
  }
  
  if (searchParams?.sortBy === 'date') {
    params.append('sort', 'date');
  }
  
  // Add enhanced parameters for better results
  params.append('fields', 'items(title,link,snippet,pagemap,displayLink),searchInformation');
  
  return params;
}

/**
 * Fetch multiple pages of search results
 */
async function fetchMultiplePages(params: URLSearchParams, numPages: number, maxResultsPerPage: number): Promise<GoogleSearchResponse> {
  const allResults: GoogleSearchResponse = { items: [], searchInformation: null };
  
  for (let page = 0; page < numPages; page++) {
    // Add start parameter for pagination
    const pageParams = new URLSearchParams(params);
    pageParams.append('start', (page * maxResultsPerPage + 1).toString());
    
    // Make the API request with error handling
    try {
      console.log(`Making Google API request for page ${page+1}/${numPages}`);
      const response = await fetch(`https://www.googleapis.com/customsearch/v1?${pageParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Google API error:', errorData);
        // If this is not the first page, we don't throw the error but continue with what we have
        if (page === 0) {
          throw new Error(`Google API error: ${response.status} ${response.statusText} - ${errorData?.error?.message || 'Unknown error'}`);
        } else {
          break;
        }
      }
      
      const data = await response.json();
      console.log(`Received page ${page+1} results: ${data.items?.length || 0} items`);
      
      // Set search information from first page
      if (page === 0) {
        allResults.searchInformation = data.searchInformation;
      }
      
      // Add items to combined results
      if (data.items && data.items.length > 0) {
        allResults.items = [...allResults.items, ...data.items];
      }
      
      // If no more results, break
      if (!data.items || data.items.length < maxResultsPerPage) {
        break;
      }
    } catch (error) {
      console.error(`Google Search API request error on page ${page}:`, error);
      // If this is the first page, throw the error, otherwise continue with what we have
      if (page === 0) throw error;
      break;
    }
  }
  
  // Enhance the results with calculated scores
  if (allResults.items && allResults.items.length > 0) {
    allResults.items = enhanceResultsWithScores(allResults.items);
  }
  
  return allResults;
}

/**
 * Enhance search results with relevance scores
 */
function enhanceResultsWithScores(items: EnhancedSearchResult[]): EnhancedSearchResult[] {
  return items.map((item: EnhancedSearchResult, index: number) => {
    // Calculate relevance score based on position and content
    let relevanceScore = Math.max(0, 1 - (index / items.length));
    
    // Title match is a strong signal
    if (item.title && item.title.toLowerCase().includes((item as any).q?.toLowerCase() || '')) {
      relevanceScore += 0.3;
    }
    
    // Snippet match is also important
    if (item.snippet && item.snippet.toLowerCase().includes((item as any).q?.toLowerCase() || '')) {
      relevanceScore += 0.2;
    }
    
    // URL match is a good signal
    if (item.link && item.link.toLowerCase().includes((item as any).q?.toLowerCase()?.replace(/\s+/g, '') || '')) {
      relevanceScore += 0.1;
    }
    
    // Cap at 1.0
    item.relevanceScore = Math.min(1.0, relevanceScore);
    return item;
  });
}
