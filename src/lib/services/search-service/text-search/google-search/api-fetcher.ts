
import { GoogleSearchResponse } from '../types';
import { enhanceResultsWithScores } from './results-enhancer';
import { generateMockResults } from '../mock-generator';

/**
 * Fetch multiple pages of search results from Google API
 * @param params URL search parameters
 * @param numPages Number of pages to fetch
 * @param maxResultsPerPage Maximum results per page
 * @returns Combined search results
 */
export async function fetchMultiplePages(
  params: URLSearchParams, 
  numPages: number, 
  maxResultsPerPage: number
): Promise<GoogleSearchResponse> {
  const allResults: GoogleSearchResponse = { items: [], searchInformation: null };
  
  // Extract API key and Search Engine ID for logging
  const apiKey = params.get('key') || '';
  const engineId = params.get('cx') || '';
  
  // Log configuration details for debugging (but mask sensitive info)
  console.log('Google Search API - Using API key:', apiKey ? `Present (length: ${apiKey.length})` : 'None');
  console.log('Google Search API - Using Search Engine ID:', engineId ? 'Present' : 'None');
  
  // Check if we have valid credentials - if not, return mock results
  if (!apiKey || apiKey.length < 10 || !engineId) {
    console.log('Missing API configuration, returning mock results');
    const query = params.get('q') || 'unknown query';
    return generateMockResults(query, 20);
  }
  
  for (let page = 0; page < numPages; page++) {
    // Add start parameter for pagination
    const pageParams = new URLSearchParams(params);
    pageParams.append('start', (page * maxResultsPerPage + 1).toString());
    
    // Make the API request with error handling
    try {
      console.log(`Making Google API request for page ${page+1}/${numPages}`);
      
      // Include proper headers for Google API
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
      
      const requestUrl = `https://www.googleapis.com/customsearch/v1?${pageParams.toString()}`;
      
      // Log sanitized URL for debugging (remove API keys)
      console.log(`Request URL: ${requestUrl.replace(/key=[^&]+/, 'key=***API_KEY***').replace(/cx=[^&]+/, 'cx=***CSE_ID***')}`);
      
      // Use AbortController to set a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for slower connections
      
      try {
        const response = await fetch(requestUrl, {
          method: 'GET',
          headers: headers,
          signal: controller.signal,
          mode: 'cors' // Explicitly set CORS mode for cross-origin requests
        });
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          let errorMessage = `Google API error: ${response.status} ${response.statusText}`;
          try {
            const errorData = await response.json();
            console.error('Google API error response:', errorData);
            
            // Enhanced error message extraction
            if (errorData?.error?.message) {
              errorMessage = errorData.error.message;
            } else if (errorData?.error?.errors?.length > 0) {
              errorMessage = errorData.error.errors[0].message;
            }
          } catch (e) {
            // If we can't parse the error, just use the status
            console.error('Could not parse error response:', e);
          }
          
          throw new Error(errorMessage);
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
        } else if (page === 0) {
          // If first page has no results, we need to return an empty result set
          console.log('No search results found on first page');
          return { items: [], searchInformation: data.searchInformation || null };
        }
        
        // If no more results, break
        if (!data.items || data.items.length < maxResultsPerPage) {
          break;
        }
      } catch (error) {
        // Clear the timeout if there was an error
        clearTimeout(timeoutId);
        
        // Enhanced error handling
        if (error.name === 'AbortError') {
          console.error(`Google Search API request timeout on page ${page}`);
          throw new Error('Search request timed out. The Google API did not respond in time. Please try again later.');
        }
        
        // Handle network errors more gracefully
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.error('Network error when contacting Google API:', error);
          throw new Error('Network connection error when contacting the Google API. Please check your internet connection and try again.');
        }
        
        // Log and rethrow
        console.error(`Google Search API request error on page ${page}:`, error);
        throw error;
      }
    } catch (error) {
      console.error(`Google Search API request error on page ${page}:`, error);
      
      // If this is the first page and no fallback data, throw the error
      if (page === 0 && allResults.items.length === 0) throw error; 
      break;
    }
  }
  
  // Enhance the results with calculated scores
  if (allResults.items && allResults.items.length > 0) {
    allResults.items = enhanceResultsWithScores(allResults.items);
  }
  
  return allResults;
}
