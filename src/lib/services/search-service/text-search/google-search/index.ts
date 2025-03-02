
import { TextSearchParams } from '../../../../db-types';
import { cacheResults } from '../../../../search-cache';
import { GoogleSearchResponse } from '../types';
import { checkRequestCache, registerPendingRequest } from '../cache-helpers';
import { buildSearchParams } from './params-builder';
import { fetchMultiplePages } from './api-fetcher';

/**
 * Enhanced Google search function with improved parameter handling and error management
 * @param query Search query text
 * @param userId User ID making the request
 * @param searchParams Additional search parameters
 * @returns Search results
 */
export const performGoogleSearch = async (query: string, userId: string, searchParams: TextSearchParams = {}) => {
  try {
    // First, validate API configuration before proceeding
    // Access API keys from import.meta.env
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
    const searchEngineId = import.meta.env.VITE_GOOGLE_CSE_ID || '';
    
    console.log('API Key available:', apiKey ? 'Yes' : 'No');
    console.log('Search Engine ID available:', searchEngineId ? 'Yes' : 'No');
    
    if (!apiKey || !searchEngineId) {
      console.error('ERROR: No API keys found for Google search. Please configure VITE_GOOGLE_API_KEY and VITE_GOOGLE_CSE_ID');
      throw new Error('Google API configuration missing. Please configure API keys in your environment variables.');
    }

    // Check for valid format of API key and Search Engine ID
    if (apiKey.length < 10) {
      console.error('ERROR: Google API key appears to be invalid (too short)');
      throw new Error('Google API key appears to be invalid. Please check your configuration.');
    }
    
    // Check for valid search engine ID format
    if (!searchEngineId.includes(':')) {
      console.error('ERROR: Google Custom Search Engine ID appears to be invalid (missing colon)');
      throw new Error('Google Custom Search Engine ID appears to be invalid. Please check your configuration.');
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
        
        // Make multiple API requests if we need more than max results per page
        const maxResultsPerPage = 10;
        const numPages = Math.min(3, Math.ceil((searchParams.maxResults || 30) / maxResultsPerPage));
        const allResults = await fetchMultiplePages(params, numPages, maxResultsPerPage);
        
        console.log('Google API response completed with', allResults.items?.length || 0, 'total results');
        
        if (!allResults.items || allResults.items.length === 0) {
          console.warn('No search results returned from Google API');
        }
        
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

// Export all needed components from this module
export * from './params-builder';
export * from './api-fetcher';
export * from './results-enhancer';
