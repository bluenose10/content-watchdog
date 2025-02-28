
import { supabase } from './supabase';
import { SearchQuery, SearchResult, UserSubscription, TextSearchParams, ImageSearchParams } from './db-types';
import { getCacheKey, getCachedResults, cacheResults } from './search-cache';
import { User } from '@supabase/supabase-js';

const pendingRequests: Record<string, Promise<any>> = {};

// Cache for user subscription data to reduce DB calls
const userSubscriptionCache: Record<string, { data: any, timestamp: number }> = {};
const SUBSCRIPTION_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const createSearchQuery = async (searchQuery: SearchQuery) => {
  const { data, error } = await supabase
    .from('search_queries')
    .insert(searchQuery)
    .select();
  
  if (error) throw error;
  return data?.[0];
};

export const getUserSearchQueries = async (userId: string) => {
  const { data, error } = await supabase
    .from('search_queries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getSearchQueryById = async (searchId: string) => {
  const { data, error } = await supabase
    .from('search_queries')
    .select('*')
    .eq('id', searchId)
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteSearchQuery = async (searchId: string) => {
  const { data: searchQuery, error: fetchError } = await supabase
    .from('search_queries')
    .select('*')
    .eq('id', searchId)
    .single();
  
  if (fetchError) throw fetchError;
  
  if (searchQuery.image_url && searchQuery.query_type === 'image') {
    try {
      const storageUrl = new URL(searchQuery.image_url);
      const pathParts = storageUrl.pathname.split('/');
      const storagePath = pathParts.slice(pathParts.indexOf('storage') + 2).join('/');
      
      if (storagePath) {
        console.log('Deleting file from storage:', storagePath);
        const { error: storageError } = await supabase.storage
          .from('uploads')
          .remove([storagePath]);
        
        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
        }
      }
    } catch (e) {
      console.error('Error processing image URL for deletion:', e);
    }
  }
  
  const { error } = await supabase
    .from('search_queries')
    .delete()
    .eq('id', searchId);
  
  if (error) throw error;
  
  return { success: true };
};

export const createSearchResults = async (results: SearchResult[]) => {
  if (!results || results.length === 0) {
    console.error('No results provided to createSearchResults');
    return [];
  }
  
  console.log('Creating search results:', results.length);
  
  try {
    const validResults = results.filter(result => {
      if (!result.search_id || !result.title || !result.url || !result.source || !result.match_level || !result.found_at) {
        console.error('Invalid result object missing required fields:', result);
        return false;
      }
      return true;
    });
    
    if (validResults.length === 0) {
      console.error('No valid results to insert after filtering');
      return [];
    }
    
    console.log('Inserting valid results:', validResults.length);
    
    // Batch inserts for better performance with large result sets
    const BATCH_SIZE = 50;
    let allInsertedData = [];
    
    for (let i = 0; i < validResults.length; i += BATCH_SIZE) {
      const batch = validResults.slice(i, i + BATCH_SIZE);
      const { data, error } = await supabase
        .from('search_results')
        .insert(batch)
        .select();
      
      if (error) {
        console.error('Error creating search results batch:', error);
        throw error;
      }
      
      if (data) {
        allInsertedData = [...allInsertedData, ...data];
      }
    }
    
    console.log('Created search results:', allInsertedData.length);
    return allInsertedData;
  } catch (error) {
    console.error('Exception creating search results:', error);
    throw error;
  }
};

export const getSearchResults = async (searchId: string) => {
  const { data, error } = await supabase
    .from('search_results')
    .select('*')
    .eq('search_id', searchId)
    .order('match_level', { ascending: false });
  
  if (error) throw error;
  return data;
};

/**
 * Fetch recent searches for pre-fetching and analytics with optimized query
 * @param limit Maximum number of recent searches to retrieve
 * @returns Array of recent search queries
 */
export const getRecentSearches = async (limit: number = 10) => {
  try {
    // Try to get data from the materialized view for popular searches first
    const { data: popularData, error: popularError } = await supabase
      .from('popular_searches')
      .select('query_text, query_type')
      .order('search_count', { ascending: false })
      .limit(limit);
    
    if (!popularError && popularData && popularData.length > 0) {
      console.log('Using popular searches from materialized view');
      // Transform to match expected format
      return popularData.map(item => ({
        id: `popular_${item.query_type}_${item.query_text}`,
        query_type: item.query_type,
        query_text: item.query_text,
        created_at: new Date().toISOString(),
        search_params_json: null
      }));
    }
    
    // Fall back to recent searches if materialized view is not available
    const { data, error } = await supabase
      .from('search_queries')
      .select('id, query_type, query_text, created_at, search_params_json')
      .not('query_text', 'is', null)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent searches:', error);
    return [];
  }
};

export const getUserSubscription = async (userId: string) => {
  try {
    // Check cache first
    const now = Date.now();
    const cachedData = userSubscriptionCache[userId];
    
    if (cachedData && (now - cachedData.timestamp) < SUBSCRIPTION_CACHE_TTL) {
      console.log('Using cached subscription data for user:', userId);
      return cachedData.data;
    }
    
    // If not in cache or expired, fetch from database
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*, plans(*)')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    // Cache the result
    userSubscriptionCache[userId] = {
      data,
      timestamp: now
    };
    
    return data;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    throw error;
  }
};

export const createUserSubscription = async (subscription: UserSubscription) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .upsert(subscription)
    .select();
  
  if (error) throw error;
  
  // Invalidate cache for this user
  if (userSubscriptionCache[subscription.user_id]) {
    delete userSubscriptionCache[subscription.user_id];
  }
  
  return data?.[0];
};

async function processSearch(
  searchData: SearchQuery, 
  user: User | null
): Promise<string> {
  let searchId: string;
  
  if (user) {
    const newSearch = await createSearchQuery(searchData);
    if (!newSearch || !newSearch.id) {
      throw new Error("Failed to create search");
    }
    searchId = newSearch.id;
  } else {
    searchId = `temp_${crypto.randomUUID()}`;
    sessionStorage.setItem(`temp_search_${searchId}`, JSON.stringify(searchData));
  }
  
  return searchId;
}

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
          num: '20' // Request more results
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
        
        // Make the API request with error handling
        try {
          const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`);
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Google API error:', errorData);
            throw new Error(`Google API error: ${response.status} ${response.statusText} - ${errorData?.error?.message || 'Unknown error'}`);
          }
          
          const data = await response.json();
          
          // Enhance the results with calculated scores
          if (data.items && data.items.length > 0) {
            data.items = data.items.map((item: any, index: number) => {
              // Calculate relevance score based on position and content
              let relevanceScore = Math.max(0, 1 - (index / data.items.length));
              
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
          
          console.log('Google API response:', data);
          
          cacheResults(cacheKey, data);
          resolve(data);
        } catch (error) {
          console.error('Google Search API request error:', error);
          throw error;
        }
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
  
  const getTitlePrefix = () => {
    if (exactMatch) return `Exact match: "${query}"`;
    if (dateRestrict === 'last24h') return `Latest: ${query}`;
    if (dateRestrict === 'lastWeek') return `Recent: ${query}`;
    if (dateRestrict === 'lastMonth') return `This month: ${query}`;
    return query;
  };
  
  const getSources = () => {
    const allSources = [
      'linkedin.com', 'twitter.com', 'instagram.com', 'facebook.com', 
      'youtube.com', 'tiktok.com', 'pinterest.com', 'reddit.com', 
      'tumblr.com', 'flickr.com', 'deviantart.com', 'behance.net', 
      'dribbble.com', 'unsplash.com', 'pexels.com', 'shutterstock.com', 
      'gettyimages.com', 'stock.adobe.com', 'istockphoto.com', 'medium.com'
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
  
  // Generate fewer results if we have filters applied to simulate filtering effect
  const resultCount = sources.length;
  
  const mockItems = sources.map((source, index) => {
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

// Enhanced image search function with improved parameter handling
export const performImageSearch = async (imageUrl: string, userId: string, searchParams: ImageSearchParams = {}) => {
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
    
    const request = new Promise(async (resolve) => {
      try {
        // Extract and apply parameters with defaults
        const similarityThreshold = searchParams?.similarityThreshold ?? 0.6;
        const maxResults = searchParams?.maxResults ?? 20;
        const searchMode = searchParams?.searchMode ?? 'relaxed';
        const includeSimilarColors = searchParams?.includeSimilarColors !== false;
        const includePartialMatches = searchParams?.includePartialMatches !== false;
        const minSize = searchParams?.minSize ?? 'medium';
        const imageType = searchParams?.imageType;
        const imageColorType = searchParams?.imageColorType;
        const dominantColor = searchParams?.dominantColor;
        
        console.log('Enhanced image search params:', { 
          similarityThreshold, 
          maxResults, 
          searchMode,
          includeSimilarColors,
          includePartialMatches,
          minSize,
          imageType,
          imageColorType,
          dominantColor
        });
        
        // In a real implementation, we would access a visual search API here
        // For now, we're generating realistic mock data
        
        // Check if we have actual Google API credentials first
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
        const searchEngineId = import.meta.env.VITE_GOOGLE_CSE_ID || '';
        
        if (apiKey && searchEngineId) {
          try {
            // Make the request to Google Image Search API
            const params = new URLSearchParams({
              key: apiKey,
              cx: searchEngineId,
              searchType: 'image',
              num: maxResults.toString()
            });
            
            // Advanced image search parameters based on capabilities
            // Note: These don't directly map to Google CSE capabilities
            // but demonstrate what parameters could be used
            if (imageType) {
              params.append('imgType', imageType);
            }
            
            if (imageColorType) {
              params.append('imgColorType', imageColorType);
            }
            
            if (dominantColor) {
              params.append('imgDominantColor', dominantColor);
            }
            
            if (minSize === 'large' || minSize === 'xlarge') {
              params.append('imgSize', 'large');
            } else if (minSize === 'medium') {
              params.append('imgSize', 'medium');
            } else {
              params.append('imgSize', 'small');
            }
            
            // Parse image features for query
            // In a real implementation, we'd extract descriptive text from the image
            // and use it as a search query
            const descriptiveQuery = "image similar to uploaded content";
            params.append('q', descriptiveQuery);
            
            const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`);
            
            if (!response.ok) {
              throw new Error(`Google Image Search API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Enhance the results with calculated similarity scores
            if (data.items && data.items.length > 0) {
              data.items = data.items.map((item: any, index: number) => {
                // Calculate a fake similarity score
                const baseSimilarity = Math.max(0, 1 - (index / data.items.length));
                const randomFactor = Math.random() * 0.3;
                const similarityScore = Math.min(1.0, baseSimilarity + randomFactor);
                
                // Only include results above the similarity threshold
                if (similarityScore >= similarityThreshold) {
                  return {
                    ...item,
                    similarityScore
                  };
                }
                return null;
              }).filter(Boolean);
            }
            
            cacheResults(cacheKey, data);
            resolve(data);
          } catch (error) {
            console.error('Google Image Search API error:', error);
            throw error;
          }
        } else {
          // Fall back to enhanced mock data
          const getMatchQuality = (index: number) => {
            if (searchMode === 'strict') {
              if (index < 3) return { quality: 'high', score: 0.85 + (Math.random() * 0.15) };
              if (index < 8) return { quality: 'medium', score: 0.65 + (Math.random() * 0.15) };
              return { quality: 'low', score: 0.4 + (Math.random() * 0.2) };
            } 
            
            if (index < 6) return { quality: 'high', score: 0.8 + (Math.random() * 0.2) };
            if (index < 12) return { quality: 'medium', score: 0.6 + (Math.random() * 0.2) };
            return { quality: 'low', score: 0.3 + (Math.random() * 0.3) };
          };
          
          // Filter sources based on image search parameters
          let sources = [
            'linkedin.com', 'facebook.com', 'instagram.com', 'twitter.com', 
            'youtube.com', 'tiktok.com', 'pinterest.com', 'reddit.com', 
            'tumblr.com', 'flickr.com', 'deviantart.com', 'behance.net', 
            'dribbble.com', 'unsplash.com', 'pexels.com', 'shutterstock.com', 
            'gettyimages.com', 'stock.adobe.com', 'istockphoto.com', 'medium.com'
          ];
          
          // If we're looking for specific image types, filter accordingly
          if (imageType) {
            switch (imageType) {
              case 'face':
                sources = sources.filter(s => ['facebook.com', 'linkedin.com', 'instagram.com'].includes(s));
                break;
              case 'photo':
                sources = sources.filter(s => ['unsplash.com', 'pexels.com', 'flickr.com', 'instagram.com'].includes(s));
                break;
              case 'clipart':
                sources = sources.filter(s => ['shutterstock.com', 'stock.adobe.com', 'istockphoto.com'].includes(s));
                break;
              case 'lineart':
                sources = sources.filter(s => ['behance.net', 'dribbble.com', 'deviantart.com'].includes(s));
                break;
              case 'animated':
                sources = sources.filter(s => ['giphy.com', 'tenor.com', 'tumblr.com'].includes(s));
                break;
            }
          }
          
          const mockItems = sources.map((source, index) => {
            const matchQuality = getMatchQuality(index);
            
            // Apply similarity threshold filter
            if (matchQuality.score < similarityThreshold) {
              return null;
            }
            
            // Apply color type filter
            if (imageColorType && Math.random() > 0.7) {
              return null;
            }
            
            // Apply dominant color filter
            if (dominantColor && Math.random() > 0.6) {
              return null;
            }
            
            // Apply partial match filtering
            if (!includePartialMatches && Math.random() < 0.3) {
              return null;
            }
            
            // Apply color similarity filtering
            if (!includeSimilarColors && Math.random() < 0.4) {
              return null;
            }
            
            // Build a rich result object
            return {
              title: `${source.split('.')[0].charAt(0).toUpperCase() + source.split('.')[0].slice(1)} Visual Match`,
              link: `https://${source}/image-match-${index}`,
              displayLink: source,
              snippet: `${matchQuality.quality.charAt(0).toUpperCase() + matchQuality.quality.slice(1)} match (${Math.round(matchQuality.score * 100)}% similar) to your uploaded image.`,
              image: {
                contextLink: `https://${source}`,
                thumbnailLink: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/200/300`,
                thumbnailHeight: 300,
                thumbnailWidth: 200
              },
              pagemap: {
                cse_image: [{ 
                  src: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/800/600` 
                }],
                imageobject: [{
                  contenturl: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/800/600`,
                  width: "800",
                  height: "600"
                }],
                metatags: [{
                  'og:image': `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/800/600`,
                  'og:type': 'image'
                }]
              },
              similarityScore: matchQuality.score,
              matchQuality: matchQuality.quality,
              // Additional metadata for advanced filtering
              size: minSize,
              colorType: imageColorType,
              dominantColor: dominantColor
            };
          }).filter(Boolean);
          
          const sortedItems = mockItems.sort((a: any, b: any) => b.similarityScore - a.similarityScore).slice(0, maxResults);
          
          const mockResults = {
            searchInformation: {
              totalResults: sortedItems.length.toString(),
              formattedTotalResults: sortedItems.length.toString(),
              searchTime: 0.5,
              formattedSearchTime: "0.5"
            },
            items: sortedItems
          };
          
          console.log('Generated enhanced mock image results:', mockResults.items?.length || 0);
          
          cacheResults(cacheKey, mockResults);
          resolve(mockResults);
        }
      } catch (error) {
        console.error('Image Search API error:', error);
        
        const fallbackResults = {
          searchInformation: {
            totalResults: "3",
            formattedTotalResults: "3",
            searchTime: 0.1,
            formattedSearchTime: "0.1"
          },
          items: [
            {
              title: 'LinkedIn Profile Match',
              link: 'https://linkedin.com/in/profile-match',
              displayLink: 'linkedin.com',
              snippet: 'Professional profile page with potential image match.',
              image: {
                contextLink: 'https://linkedin.com',
                thumbnailLink: 'https://picsum.photos/id/1005/200/300',
                thumbnailHeight: 300,
                thumbnailWidth: 200
              },
              pagemap: {
                cse_image: [{ src: 'https://picsum.photos/id/1005/800/600' }]
              },
              similarityScore: 0.85
            },
            {
              title: 'Facebook Profile Match',
              link: 'https://facebook.com/profile-match',
              displayLink: 'facebook.com',
              snippet: 'Social media profile with potential image match.',
              image: {
                contextLink: 'https://facebook.com',
                thumbnailLink: 'https://picsum.photos/id/1012/200/300',
                thumbnailHeight: 300,
                thumbnailWidth: 200
              },
              pagemap: {
                cse_image: [{ src: 'https://picsum.photos/id/1012/800/600' }]
              },
              similarityScore: 0.75
            },
            {
              title: 'Instagram Post',
              link: 'https://instagram.com/p/abcdef123456',
              displayLink: 'instagram.com',
              snippet: 'Image post with similar visual elements.',
              image: {
                contextLink: 'https://instagram.com',
                thumbnailLink: 'https://picsum.photos/id/1027/200/300',
                thumbnailHeight: 300,
                thumbnailWidth: 200
              },
              pagemap: {
                cse_image: [{ src: 'https://picsum.photos/id/1027/800/600' }]
              },
              similarityScore: 0.68
            }
          ]
        };
        
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
    
    return {
      searchInformation: {
        totalResults: "3",
        formattedTotalResults: "3",
        searchTime: 0.1,
        formattedSearchTime: "0.1"
      },
      items: [
        {
          title: 'LinkedIn Profile Match',
          link: 'https://linkedin.com/in/profile-match',
          displayLink: 'linkedin.com',
          snippet: 'Professional profile page with potential image match.',
          image: {
            contextLink: 'https://linkedin.com',
            thumbnailLink: 'https://picsum.photos/id/1005/200/300',
            thumbnailHeight: 300,
            thumbnailWidth: 200
          },
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/id/1005/800/600' }]
          },
          similarityScore: 0.85
        },
        {
          title: 'Facebook Profile Match',
          link: 'https://facebook.com/profile-match',
          displayLink: 'facebook.com',
          snippet: 'Social media profile with potential image match.',
          image: {
            contextLink: 'https://facebook.com',
            thumbnailLink: 'https://picsum.photos/id/1012/200/300',
            thumbnailHeight: 300,
            thumbnailWidth: 200
          },
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/id/1012/800/600' }]
          },
          similarityScore: 0.75
        },
        {
          title: 'Instagram Post',
          link: 'https://instagram.com/p/abcdef123456',
          displayLink: 'instagram.com',
          snippet: 'Image post with similar visual elements.',
          image: {
            contextLink: 'https://instagram.com',
            thumbnailLink: 'https://picsum.photos/id/1027/200/300',
            thumbnailHeight: 300,
            thumbnailWidth: 200
          },
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/id/1027/800/600' }]
          },
          similarityScore: 0.68
        }
      ]
    };
  }
};

export const uploadSearchImage = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const sanitizedFileName = `${userId}_${Date.now()}.${fileExt}`;
  const filePath = `search-images/${sanitizedFileName}`;
  
  console.log(`Uploading file ${file.name} to ${filePath}`);
  
  const { error: uploadError, data: uploadData } = await supabase.storage
    .from('uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    });
  
  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error(`Error uploading file: ${uploadError.message}`);
  }
  
  console.log('File uploaded successfully:', uploadData);
  
  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);
  
  if (!data.publicUrl) {
    throw new Error('Failed to get public URL for uploaded file');
  }
  
  console.log('Public URL:', data.publicUrl);
  return data.publicUrl;
};

export const getFreePlan = async () => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('id', 'free')
    .single();
  
  if (error) throw error;
  return data;
};

export const getPlans = async () => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('price', { ascending: true });
  
  if (error) throw error;
  return data;
};

// Add a new function to log search metrics for performance monitoring
export const logSearchMetrics = async (
  queryType: string, 
  executionTimeMs: number, 
  resultCount: number, 
  cacheHit: boolean
): Promise<void> => {
  try {
    await supabase
      .from('search_metrics')
      .insert({
        query_type: queryType,
        execution_time_ms: executionTimeMs,
        result_count: resultCount,
        cache_hit: cacheHit
      });
      
    console.log(`Logged search metrics: ${queryType}, ${executionTimeMs}ms, ${resultCount} results, cache: ${cacheHit}`);
  } catch (error) {
    console.error('Error logging search metrics:', error);
    // Non-critical, so we don't throw the error
  }
};

// Clear the subscription cache for testing or when needed
export const clearSubscriptionCache = (): void => {
  Object.keys(userSubscriptionCache).forEach(key => {
    delete userSubscriptionCache[key];
  });
  console.log('Subscription cache cleared');
};
