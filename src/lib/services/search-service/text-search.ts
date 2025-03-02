
import { supabase } from '../../supabase';
import { TextSearchParams } from '../../db-types';
import { getCacheKey, getCachedResults, cacheResults } from '../../search-cache';

// Cache for pending requests to prevent duplicate calls
const pendingRequests: Record<string, Promise<any>> = {};

// Enhanced Google search function with improved parameter handling and error management
export const performGoogleSearch = async (query: string, userId: string, searchParams: TextSearchParams = {}) => {
  try {
    const cacheKey = getCacheKey('text', query, searchParams);
    
    if (pendingRequests[cacheKey]) {
      console.log('Returning existing pending request for:', query);
      return pendingRequests[cacheKey];
    }
    
    const cachedResults = getCachedResults(cacheKey);
    if (cachedResults) {
      return cachedResults;
    }
    
    console.log('Performing Google search for query:', query, 'by user:', userId, 'with params:', searchParams);
    
    const request = new Promise(async (resolve) => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
        const searchEngineId = import.meta.env.VITE_GOOGLE_CSE_ID || '';
        
        if (!apiKey || !searchEngineId) {
          console.log('No API keys found, falling back to mock data');
          const mockResults = generateEnhancedMockSearchResults(query, searchParams);
          cacheResults(cacheKey, mockResults);
          resolve(mockResults);
          return;
        }
        
        // Build the URL parameters with enhanced configuration
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
        
        // Make multiple API requests if we need more than max results per page
        const maxResultsPerPage = 10;
        const numPages = Math.min(3, Math.ceil((searchParams.maxResults || 30) / maxResultsPerPage));
        const allResults = { items: [], searchInformation: null };
        
        for (let page = 0; page < numPages; page++) {
          // Add start parameter for pagination
          const pageParams = new URLSearchParams(params);
          pageParams.append('start', (page * maxResultsPerPage + 1).toString());
          
          // Make the API request with error handling
          try {
            const response = await fetch(`https://www.googleapis.com/customsearch/v1?${pageParams.toString()}`);
            
            if (!response.ok) {
              const errorData = await response.json();
              console.error('Google API error:', errorData);
              // If this is not the first page, we don't throw the error but continue with what we have
              if (page === 0) {
                throw new Error(`Google API error: ${response.status} ${response.statusText} - ${errorData?.error?.message || 'Unknown error'}`);
              } else {
                break;
              }
            }
            
            const data = await response.json();
            
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
          allResults.items = allResults.items.map((item: any, index: number) => {
            // Calculate relevance score based on position and content
            let relevanceScore = Math.max(0, 1 - (index / allResults.items.length));
            
            // Title match is a strong signal
            if (item.title && item.title.toLowerCase().includes(query.toLowerCase())) {
              relevanceScore += 0.3;
            }
            
            // Snippet match is also important
            if (item.snippet && item.snippet.toLowerCase().includes(query.toLowerCase())) {
              relevanceScore += 0.2;
            }
            
            // URL match is a good signal
            if (item.link && item.link.toLowerCase().includes(query.toLowerCase().replace(/\s+/g, ''))) {
              relevanceScore += 0.1;
            }
            
            // Cap at 1.0
            item.relevanceScore = Math.min(1.0, relevanceScore);
            return item;
          });
        }
        
        console.log('Google API response:', allResults.items?.length || 0, 'results');
        
        cacheResults(cacheKey, allResults);
        resolve(allResults);
      } catch (error) {
        console.error('Google Search API error:', error);
        
        const mockResults = generateEnhancedMockSearchResults(query, searchParams);
        cacheResults(cacheKey, mockResults);
        resolve(mockResults);
      } finally {
        setTimeout(() => {
          delete pendingRequests[cacheKey];
        }, 100);
      }
    });
    
    pendingRequests[cacheKey] = request;
    
    return request;
  } catch (error) {
    console.error('Google Search API error:', error);
    
    return generateEnhancedMockSearchResults(query, searchParams);
  }
};

function generateEnhancedMockSearchResults(query: string, searchParams: TextSearchParams = {}) {
  console.log('Generating enhanced mock search results for:', query, 'with params:', searchParams);
  
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
    items: mockItems
  };
  
  console.log('Generated enhanced mock results:', mockResults.items.length);
  return mockResults;
}
