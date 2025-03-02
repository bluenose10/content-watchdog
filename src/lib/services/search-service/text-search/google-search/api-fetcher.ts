
/**
 * Helper function to fetch multiple pages of Google search results
 * @param params URLSearchParams object with configured search parameters
 * @param numPages Number of pages to fetch
 * @param maxResultsPerPage Maximum results per page
 * @returns Combined search results
 */
export const fetchMultiplePages = async (
  params: URLSearchParams, 
  numPages: number,
  maxResultsPerPage: number
) => {
  // Clone the params object to avoid mutating the original
  const baseParams = new URLSearchParams(params.toString());
  
  // Initialize combined results
  const combinedResults: any = {
    items: [],
    searchInformation: null
  };
  
  // Fetch each page in sequence
  for (let i = 0; i < numPages; i++) {
    // Set the start index for this page
    const startIndex = i * maxResultsPerPage + 1;
    
    const pageParams = new URLSearchParams(baseParams.toString());
    pageParams.set('start', startIndex.toString());
    pageParams.set('num', maxResultsPerPage.toString());
    
    const url = `https://www.googleapis.com/customsearch/v1?${pageParams.toString()}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Google API responded with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Store search information from the first page
      if (i === 0) {
        combinedResults.searchInformation = data.searchInformation;
      }
      
      // Add items from this page
      if (data.items && data.items.length > 0) {
        combinedResults.items = [...combinedResults.items, ...data.items];
      }
      
      // If there are no more results, stop fetching
      if (!data.items || data.items.length === 0) {
        break;
      }
    } catch (error) {
      console.error(`Error fetching page ${i + 1}:`, error);
      break;
    }
  }
  
  return combinedResults;
};
