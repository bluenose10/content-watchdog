
import { TextSearchParams } from '../../../db-types';
import { cacheResults } from '../../../search-cache';
import { checkRequestCache, registerPendingRequest } from './cache-helpers';
import { generateEnhancedMockSearchResults } from './mock-generator';

/**
 * Perform DuckDuckGo search with enhanced features
 * @param query Search query text
 * @param userId User ID making the request
 * @param searchParams Additional search parameters
 * @returns Search results
 */
export const performDuckDuckGoSearch = async (query: string, userId: string, searchParams: TextSearchParams = {}) => {
  try {
    // Check cache and pending requests
    const { cacheKey, cachedResult, pendingRequest } = checkRequestCache(query, searchParams);
    
    if (pendingRequest) {
      return pendingRequest;
    }
    
    if (cachedResult) {
      return cachedResult;
    }
    
    console.log('Performing DuckDuckGo search for query:', query, 'with params:', searchParams);
    
    const request = new Promise(async (resolve, reject) => {
      try {
        const apiKey = import.meta.env.VITE_DDG_API_KEY || '';
        
        if (!apiKey) {
          console.warn('No DuckDuckGo API key configured. Using mock data for development.');
          const mockResults = generateEnhancedMockSearchResults(query, searchParams);
          cacheResults(cacheKey, mockResults);
          resolve(mockResults);
          return;
        }
        
        // Actual DuckDuckGo search implementation would go here
        // For now, we'll just return mock results
        const mockResults = generateEnhancedMockSearchResults(query, searchParams);
        cacheResults(cacheKey, mockResults);
        resolve(mockResults);
      } catch (error) {
        console.error('DuckDuckGo Search error:', error);
        reject(error);
      }
    });
    
    registerPendingRequest(cacheKey, request);
    
    return request;
  } catch (error) {
    console.error('DuckDuckGo Search error:', error);
    throw error;
  }
};
