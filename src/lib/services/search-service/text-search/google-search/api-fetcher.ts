
import { GoogleSearchResponse } from '../types';
import { enhanceResultsWithScores } from './results-enhancer';

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
  
  // Check credentials validity - but don't block in production
  if (!apiKey || !engineId) {
    console.warn('Google Search API - Missing required parameters but continuing anyway');
  }
  
  for (let page = 0; page < numPages; page++) {
    // Add start parameter for pagination
    const pageParams = new URLSearchParams(params);
    pageParams.append('start', (page * maxResultsPerPage + 1).toString());
    
    // Make the API request with error handling
    try {
      console.log(`Making Google API request for page ${page+1}/${numPages}`);
      
      // Include authentication headers
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
      
      const requestUrl = `https://www.googleapis.com/customsearch/v1?${pageParams.toString()}`;
      
      // Log sanitized URL for debugging (remove API keys)
      console.log(`Request URL: ${requestUrl.replace(/key=[^&]+/, 'key=***API_KEY***').replace(/cx=[^&]+/, 'cx=***CSE_ID***')}`);
      
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: headers,
        // Include credentials to prevent "callers without established identity" error
        credentials: 'include'
      });
      
      if (!response.ok) {
        let errorMessage = `Google API error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error('Google API error response:', errorData);
          
          // Extract meaningful error message
          if (errorData?.error?.message) {
            errorMessage = errorData.error.message;
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
