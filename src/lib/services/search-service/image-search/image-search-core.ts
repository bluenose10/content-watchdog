
import { getCacheKey, getCachedResults, cacheResults } from '@/lib/search-cache';
import { ImageSearchOptions, ImageSearchResponse } from './types';
import { handleGoogleImageSearch } from './api-handlers';
import { generateMockImageResults, generateFallbackResults } from './mock-results-generator';

// Cache for pending requests to prevent duplicate calls
const pendingRequests: Record<string, Promise<any>> = {};

/**
 * Performs an image search using the provided URL and parameters
 */
export const performImageSearch = async (
  imageUrl: string, 
  userId: string, 
  searchParams: ImageSearchOptions = {}
): Promise<ImageSearchResponse> => {
  try {
    const cacheKey = getCacheKey('image', imageUrl, searchParams);
    
    if (pendingRequests[cacheKey]) {
      console.log('Returning existing pending request for image search');
      return pendingRequests[cacheKey];
    }
    
    const cachedResults = getCachedResults(cacheKey);
    if (cachedResults) {
      return cachedResults;
    }
    
    console.log('Performing enhanced image search with URL:', imageUrl, 'with params:', searchParams);
    
    const request = new Promise<ImageSearchResponse>(async (resolve, reject) => {
      try {
        // Check if we have actual Google API credentials first
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
        const searchEngineId = import.meta.env.VITE_GOOGLE_CSE_ID || '';
        
        if (!apiKey || !searchEngineId) {
          console.error('ERROR: No API keys found for image search. Please configure VITE_GOOGLE_API_KEY and VITE_GOOGLE_CSE_ID');
          reject(new Error('Google API configuration missing. Please configure API keys.'));
          return;
        }
        
        // Use Google Image Search API
        const googleResults = await handleGoogleImageSearch(imageUrl, searchParams, apiKey, searchEngineId);
        cacheResults(cacheKey, googleResults);
        resolve(googleResults);
      } catch (error) {
        console.error('Image Search API error:', error);
        reject(error);
      } finally {
        setTimeout(() => {
          delete pendingRequests[cacheKey];
        }, 100);
      }
    });
    
    pendingRequests[cacheKey] = request;
    
    return request;
  } catch (error) {
    console.error('Image Search API error:', error);
    throw error;
  }
};
