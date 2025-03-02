
import { TextSearchParams } from '../../../../db-types';

/**
 * Build search parameters for Google API
 * @param query Search query
 * @param searchParams Additional search parameters 
 * @param apiKey Google API key
 * @param searchEngineId Google Custom Search Engine ID
 * @returns URLSearchParams object
 */
export function buildSearchParams(
  query: string, 
  searchParams: TextSearchParams, 
  apiKey: string, 
  searchEngineId: string
): URLSearchParams {
  const params = new URLSearchParams({
    key: apiKey,
    cx: searchEngineId,
    q: query,
    num: searchParams.maxResults?.toString() || '30' // Request more results than default 20
  });
  
  // Apply advanced search parameters
  if (searchParams?.exactMatch) {
    params.append('exactTerms', query);
  }
  
  if (searchParams?.dateRestrict) {
    params.append('dateRestrict', searchParams.dateRestrict);
  }
  
  if (searchParams?.searchType && searchParams.searchType !== 'web') {
    params.append('searchType', searchParams.searchType);
  }
  
  if (searchParams?.contentFilter) {
    params.append('safe', searchParams.contentFilter === 'high' ? 'active' : 'off');
  }
  
  if (searchParams?.siteFilter && searchParams.siteFilter.length > 0) {
    params.append('siteSearch', searchParams.siteFilter.join('|'));
    params.append('siteSearchFilter', 'i'); // include sites
  }
  
  if (searchParams?.excludeSites && searchParams.excludeSites.length > 0) {
    // If already filtering to specific sites, we can't also exclude sites
    if (!searchParams?.siteFilter || searchParams.siteFilter.length === 0) {
      params.append('siteSearch', searchParams.excludeSites.join('|'));
      params.append('siteSearchFilter', 'e'); // exclude sites
    }
  }
  
  if (searchParams?.language) {
    params.append('lr', `lang_${searchParams.language}`);
  }
  
  if (searchParams?.country) {
    params.append('cr', `country${searchParams.country.toUpperCase()}`);
  }
  
  if (searchParams?.fileType) {
    params.append('fileType', searchParams.fileType);
  }
  
  if (searchParams?.rights) {
    params.append('rights', searchParams.rights);
  }
  
  if (searchParams?.sortBy === 'date') {
    params.append('sort', 'date');
  }
  
  // Add enhanced parameters for better results
  params.append('fields', 'items(title,link,snippet,pagemap,displayLink),searchInformation');
  
  return params;
}
