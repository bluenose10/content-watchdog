
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
  
  for (let page = 0; page < numPages; page++) {
    // Add start parameter for pagination
    const pageParams = new URLSearchParams(params);
    pageParams.append('start', (page * maxResultsPerPage + 1).toString());
    
    // Make the API request with error handling
    try {
      console.log(`Making Google API request for page ${page+1}/${numPages}`);
      console.log(`Request URL: https://www.googleapis.com/customsearch/v1?${pageParams.toString()}`);
      
      const response = await fetch(`https://www.googleapis.com/customsearch/v1?${pageParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Google API error:', errorData);
        
        // Extract meaningful error message
        let errorMessage = 'Unknown Google API error';
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData?.error?.errors?.length > 0) {
          errorMessage = errorData.error.errors[0].message;
        }
        
        // If this is not the first page, we don't throw the error but continue with what we have
        if (page === 0) {
          throw new Error(`Google API error: ${response.status} ${response.statusText} - ${errorMessage}`);
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
