
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
  
  // Validate required API parameters before making requests
  if (!params.has('key') || !params.has('cx')) {
    console.error('Missing required Google API parameters - key or cx missing');
    throw new Error('Google Search configuration error: API key or Search Engine ID missing.');
  }
  
  // Get API key and Search Engine ID for detailed logging
  const apiKey = params.get('key');
  const engineId = params.get('cx');
  
  // Log configuration details to help with debugging
  console.log('Using Google API key pattern:', apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 'None');
  console.log('Using Google Search Engine ID pattern:', engineId ? engineId.split(':')[0] + ':...' : 'None');
  
  // Strict validation for API key and Search Engine ID formats (don't assume dev environment)
  if (!apiKey || apiKey.length < 10) {
    console.error('Google API key appears to be invalid or too short');
    throw new Error('Google API key appears to be invalid. Please check your API key configuration.');
  }
  
  if (!engineId || !engineId.includes(':')) {
    console.error('Google Search Engine ID appears to be invalid (missing colon format)');
    throw new Error('Google Custom Search Engine ID appears to be invalid. Please check your configuration.');
  }
  
  for (let page = 0; page < numPages; page++) {
    // Add start parameter for pagination
    const pageParams = new URLSearchParams(params);
    pageParams.append('start', (page * maxResultsPerPage + 1).toString());
    
    // Make the API request with error handling
    try {
      console.log(`Making Google API request for page ${page+1}/${numPages}`);
      const requestUrl = `https://www.googleapis.com/customsearch/v1?${pageParams.toString()}`;
      console.log(`Request URL pattern: ${requestUrl.replace(apiKey, '***API_KEY***').replace(engineId, '***CSE_ID***')}`);
      
      const response = await fetch(requestUrl);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Google API error response:', errorData);
        
        // Extract meaningful error message
        let errorMessage = 'Unknown Google API error';
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData?.error?.errors?.length > 0) {
          errorMessage = errorData.error.errors[0].message;
        }
        
        // Check for specific error types
        if (errorMessage.includes('keyInvalid') || errorMessage.includes('invalid key')) {
          errorMessage = 'Invalid Google API key. Please check your configuration.';
        } else if (errorMessage.includes('dailyLimitExceeded') || errorMessage.includes('quota')) {
          errorMessage = 'Daily API quota exceeded. Please try again tomorrow.';
        } else if (errorMessage.includes('accessNotConfigured') || errorMessage.includes('not enabled')) {
          errorMessage = 'Google Custom Search API is not enabled for this project.';
        } else if (errorMessage.includes('invalid cx')) {
          errorMessage = 'Invalid Search Engine ID. Please check your configuration.';
        }
        
        // If this is not the first page, we don't throw the error but continue with what we have
        if (page === 0) {
          throw new Error(`Google API error: ${response.status} ${response.statusText} - ${errorMessage}`);
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
