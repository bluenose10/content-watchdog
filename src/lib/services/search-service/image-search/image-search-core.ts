
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
    
    const request = new Promise<ImageSearchResponse>(async (resolve) => {
      try {
        // Check if we have actual Google API credentials first
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
        const searchEngineId = import.meta.env.VITE_GOOGLE_CSE_ID || '';
        
        if (apiKey && searchEngineId) {
          // Use Google Image Search API if credentials are available
          const googleResults = await handleGoogleImageSearch(imageUrl, searchParams, apiKey, searchEngineId);
          cacheResults(cacheKey, googleResults);
          resolve(googleResults);
        } else {
          // Fall back to mock data if no API credentials
          const mockResults = generateMockImageResults(searchParams);
          cacheResults(cacheKey, mockResults);
          resolve(mockResults);
        }
      } catch (error) {
        console.error('Image Search API error:', error);
        
        const fallbackResults = generateFallbackResults();
        cacheResults(cacheKey, fallbackResults);
        resolve(fallbackResults);
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
    return generateFallbackResults();
  }
};
