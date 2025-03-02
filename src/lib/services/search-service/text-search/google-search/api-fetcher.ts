
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
  
  // Enhanced validation for API credentials
  if (!apiKey || apiKey.length < 10) {
    console.warn('Google Search API - Invalid or missing API key');
    throw new Error('Invalid Google API key. Please check your API key configuration.');
  }
  
  if (!engineId) {
    console.warn('Google Search API - Missing Search Engine ID');
    throw new Error('Search Engine ID is missing. Please configure your Google Custom Search Engine ID.');
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
              
              // Add more helpful context for specific errors
              if (errorMessage.includes('API key not valid')) {
                errorMessage = 'The provided Google API key is not valid or has been revoked. Please check your key and ensure it has access to the Custom Search API.';
              } else if (errorMessage.includes('API key expired')) {
                errorMessage = 'Your Google API key has expired. Please renew or replace it.';
              } else if (errorMessage.includes('limit')) {
                errorMessage = 'Google API quota exceeded. Please try again later or increase your quota.';
              } else if (errorMessage.includes('callers')) {
                errorMessage = 'Google API authentication error: The search requires a valid API key with proper authentication. Please check your Google API key settings.';
              }
            } else if (errorData?.error?.errors?.length > 0) {
              errorMessage = errorData.error.errors[0].message;
            }
          } catch (e) {
            // If we can't parse the error, just use the status
            console.error('Could not parse error response:', e);
          }
          
          // If this is not the first page, we don't throw the error but continue with what we have
          if (page === 0) {
            throw new Error(errorMessage);
          } else {
            console.warn(`Stopping pagination due to error on page ${page+1}. Using results collected so far.`);
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
          if (page === 0) {
            throw new Error('Search request timed out. The Google API did not respond in time. Please try again later.');
          } 
          break;
        }
        
        // Handle network errors more gracefully
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.error('Network error when contacting Google API:', error);
          throw new Error('Network connection error when contacting the Google API. Please check your internet connection and try again.');
        }
        
        // Log and rethrow
        console.error(`Google Search API request error on page ${page}:`, error);
        
        // Add helpful context for common errors
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('API key') && page === 0) {
          throw new Error('Google API key error: ' + errorMessage + '. Please verify your API key configuration in the environment variables.');
        }
        
        // If this is the first page, throw the error, otherwise continue with what we have
        if (page === 0) throw error;
        break;
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
