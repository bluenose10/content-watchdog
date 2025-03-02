
import { TextSearchParams } from '../../../../db-types';
import { cacheResults } from '../../../../search-cache';
import { GoogleSearchResponse } from '../types';
import { checkRequestCache, registerPendingRequest } from '../cache-helpers';
import { buildSearchParams } from './params-builder';
import { fetchMultiplePages } from './api-fetcher';
import { generateMockResults } from '../mock-generator';

/**
 * Enhanced Google search function with improved parameter handling and error management
 * @param query Search query text
 * @param userId User ID making the request
 * @param searchParams Additional search parameters
 * @returns Search results
 */
export const performGoogleSearch = async (query: string, userId: string, searchParams: TextSearchParams = {}) => {
  try {
    // Access API keys from import.meta.env
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
    const searchEngineId = import.meta.env.VITE_GOOGLE_CSE_ID || '';
    
    // Log API credentials status for debugging - but don't expose actual keys
    console.log('Google Search API - API Key available:', apiKey ? `Yes (length: ${apiKey.length})` : 'No');
    console.log('Google Search API - Search Engine ID available:', searchEngineId ? 'Yes' : 'No');
    
    // More explicit API key validation with clearer error messages
    if (!apiKey) {
      const errorMsg = 'Google Search API configuration error: API key is missing. Please configure VITE_GOOGLE_API_KEY in your environment variables.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    if (!searchEngineId) {
      const errorMsg = 'Google Search API configuration error: Custom Search Engine ID is missing. Please configure VITE_GOOGLE_CSE_ID in your environment variables.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    if (apiKey.length < 10) {
      const errorMsg = 'Google Search API configuration error: API key appears to be invalid (too short). Please check your VITE_GOOGLE_API_KEY value.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
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
        // Build the URL parameters with enhanced configuration
        const params = buildSearchParams(query, searchParams, apiKey, searchEngineId);
        
        // Add user identification if available (for authentication tracking)
        if (userId && userId !== 'anonymous') {
          params.append('userIdentity', userId); // Add user identity to help prevent "callers without established identity" errors
        }
        
        // Make multiple API requests if we need more than max results per page
        const maxResultsPerPage = 10;
        const numPages = Math.min(3, Math.ceil((searchParams.maxResults || 30) / maxResultsPerPage));
        
        try {
          const allResults = await fetchMultiplePages(params, numPages, maxResultsPerPage);
          
          console.log('Google API response completed with', allResults.items?.length || 0, 'total results');
          
          if (!allResults.items || allResults.items.length === 0) {
            console.warn('No search results returned from Google API');
            resolve({ items: [], searchInformation: allResults.searchInformation || null });
            return;
          }
          
          cacheResults(cacheKey, allResults);
          resolve(allResults);
        } catch (error) {
          console.error('Google API request error:', error);
          
          // Improved error messages for API configuration issues
          const errorMsg = error instanceof Error ? error.message : String(error);
          
          if (errorMsg.includes('API key') || errorMsg.includes('configuration')) {
            reject(new Error('Google Search API configuration error: Please configure valid VITE_GOOGLE_API_KEY and VITE_GOOGLE_CSE_ID in your environment variables.'));
          } else if (errorMsg.includes('unregistered callers') || errorMsg.includes('without established identity')) {
            reject(new Error('Google API authentication error: The Google API requires valid credentials with proper permissions for Custom Search API.'));
          } else if (errorMsg.includes('API key not valid') || errorMsg.includes('invalid key')) {
            reject(new Error('Invalid API key: The Google API key you provided is not valid. Please check that you have entered the correct key and that it has the Custom Search API enabled in the Google Cloud Console.'));
          } else {
            reject(error);
          }
        }
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

// Export all needed components from this module
export * from './params-builder';
export * from './api-fetcher';
export * from './results-enhancer';
