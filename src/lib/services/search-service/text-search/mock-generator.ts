
import { TextSearchParams } from '../../../db-types';

/**
 * Generates enhanced mock search results (only used for testing when API is unavailable)
 * @param query The search query
 * @param maxResults Max number of results to generate or object with search params
 * @returns Mock search results in Google API format
 */
export function generateEnhancedMockSearchResults(
  query: string, 
  maxResultsOrParams: number | TextSearchParams = {}
): any {
  console.warn('FALLBACK: Using mock data for search - this should only happen during development');
  
  // Handle both number and TextSearchParams
  const searchParams: TextSearchParams = typeof maxResultsOrParams === 'number' 
    ? { maxResults: maxResultsOrParams } 
    : maxResultsOrParams;
  
  const exactMatch = searchParams?.exactMatch;
  const dateRestrict = searchParams?.dateRestrict;
  const contentFilter = searchParams?.contentFilter || 'medium';
  const siteFilter = searchParams?.siteFilter;
  const excludeSites = searchParams?.excludeSites;
  const maxResults = searchParams?.maxResults || 30;
  
  const getTitlePrefix = () => {
    if (exactMatch) return `Exact match: "${query}"`;
    if (dateRestrict === 'last24h') return `Latest: ${query}`;
    if (dateRestrict === 'lastWeek') return `Recent: ${query}`;
    if (dateRestrict === 'lastMonth') return `This month: ${query}`;
    return query;
  };
  
  const getSources = () => {
    // Generate more diverse mock sources
    const allSources = [
      'linkedin.com', 'twitter.com', 'instagram.com', 'facebook.com', 
      'youtube.com', 'tiktok.com', 'pinterest.com', 'reddit.com', 
      'tumblr.com', 'flickr.com', 'deviantart.com', 'behance.net', 
      'dribbble.com', 'unsplash.com', 'pexels.com', 'shutterstock.com', 
      'gettyimages.com', 'stock.adobe.com', 'istockphoto.com', 'medium.com',
      'github.com', 'stackoverflow.com', 'medium.com', 'dev.to',
      'techcrunch.com', 'wired.com', 'cnn.com', 'bbc.com',
      'nytimes.com', 'theguardian.com', 'reuters.com', 'bloomberg.com',
      'forbes.com', 'entrepreneur.com', 'mashable.com', 'theverge.com',
      'engadget.com', 'gizmodo.com', 'ars.technica.com', 'zdnet.com'
    ];
    
    // Apply site filters if provided
    let filteredSources = [...allSources];
    
    if (siteFilter && siteFilter.length > 0) {
      filteredSources = allSources.filter(source => 
        siteFilter.some(site => source.includes(site) || site.includes(source))
      );
    }
    
    if (excludeSites && excludeSites.length > 0) {
      filteredSources = filteredSources.filter(source => 
        !excludeSites.some(site => source.includes(site) || site.includes(source))
      );
    }
    
    if (contentFilter === 'high') {
      filteredSources = filteredSources.filter(s => !['tiktok.com', 'reddit.com', 'twitch.tv'].includes(s));
    }
    
    return filteredSources;
  };
  
  const sources = getSources();
  const titlePrefix = getTitlePrefix();
  
  // Generate more results to match maxResults parameter
  const resultCount = Math.min(Math.max(maxResults, 30), sources.length);
  
  const mockItems = sources.slice(0, resultCount).map((source, index) => {
    const isHighlyRelevant = index < Math.ceil(resultCount * 0.25) || (exactMatch && index < Math.ceil(resultCount * 0.4));
    const isSomewhatRelevant = index < Math.ceil(resultCount * 0.6) || (dateRestrict && index < Math.ceil(resultCount * 0.75));
    
    const relevanceScore = isHighlyRelevant ? 0.8 + (Math.random() * 0.2) : 
                          isSomewhatRelevant ? 0.6 + (Math.random() * 0.2) : 
                          0.3 + (Math.random() * 0.3);
    
    // Create richer search results with pagemap data
    return {
      title: `${titlePrefix} on ${source.split('.')[0]}`,
      link: `https://${source}/search/${query.replace(/\s+/g, '-')}`,
      displayLink: source,
      snippet: `${isHighlyRelevant ? 'Highly relevant' : isSomewhatRelevant ? 'Relevant' : 'Possibly related'} content matching "${query}" ${dateRestrict ? 'from recent activity' : ''}.`,
      pagemap: {
        cse_image: [{ 
          src: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/200/300` 
        }],
        metatags: [{
          'og:title': `${titlePrefix} - ${source.split('.')[0]}`,
          'og:description': `Find ${query} on ${source.split('.')[0]}`,
          'og:type': source.includes('instagram') || source.includes('flickr') ? 'image' : 
                    source.includes('youtube') || source.includes('vimeo') ? 'video' : 'website'
        }]
      },
      relevanceScore: relevanceScore
    };
  });
  
  // Sort results by relevance score
  mockItems.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  const mockResults = {
    searchInformation: {
      totalResults: sources.length.toString(),
      formattedTotalResults: sources.length.toString(),
      searchTime: 0.5,
      formattedSearchTime: "0.5"
    },
    items: mockItems,
    _source: 'mock' // Add this to identify mock results
  };
  
  console.log('Generated enhanced mock results:', mockResults.items.length);
  return mockResults;
}

// Export the function with the name the other modules are looking for
export const generateMockResults = generateEnhancedMockSearchResults;
