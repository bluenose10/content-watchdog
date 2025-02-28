
import { supabase } from './supabase';
import { SearchQuery, SearchResult, UserSubscription, TextSearchParams, ImageSearchParams } from './db-types';
import { getCacheKey, getCachedResults, cacheResults } from './search-cache';
import { User } from '@supabase/supabase-js';

const pendingRequests: Record<string, Promise<any>> = {};

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
    
    const { data, error } = await supabase
      .from('search_results')
      .insert(validResults)
      .select();
    
    if (error) {
      console.error('Error creating search results:', error);
      throw error;
    }
    
    console.log('Created search results:', data?.length);
    return data;
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

export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*, plans(*)')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createUserSubscription = async (subscription: UserSubscription) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .upsert(subscription)
    .select();
  
  if (error) throw error;
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
          const mockResults = generateMockSearchResults(query, searchParams);
          cacheResults(cacheKey, mockResults);
          resolve(mockResults);
          return;
        }
        
        const params = new URLSearchParams({
          key: apiKey,
          cx: searchEngineId,
          q: query,
          num: '20'
        });
        
        // Apply advanced search parameters
        if (searchParams?.exactMatch) {
          params.append('exactTerms', query);
        }
        
        if (searchParams?.dateRestrict) {
          params.append('dateRestrict', searchParams.dateRestrict);
        }
        
        if (searchParams?.searchType) {
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
        
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Google API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Google API response:', data);
        
        cacheResults(cacheKey, data);
        resolve(data);
      } catch (error) {
        console.error('Google Search API error:', error);
        
        const mockResults = generateMockSearchResults(query, searchParams);
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
    
    return generateMockSearchResults(query, searchParams);
  }
};

function generateMockSearchResults(query: string, searchParams: TextSearchParams = {}) {
  console.log('Generating mock search results for:', query, 'with params:', searchParams);
  
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
  
  const mockResults = {
    items: sources.map((source, index) => {
      const isHighlyRelevant = index < Math.ceil(resultCount * 0.25) || (exactMatch && index < Math.ceil(resultCount * 0.4));
      const isSomewhatRelevant = index < Math.ceil(resultCount * 0.6) || (dateRestrict && index < Math.ceil(resultCount * 0.75));
      
      return {
        title: `${titlePrefix} Profile on ${source.split('.')[0]}`,
        link: `https://${source}/profile`,
        displayLink: source,
        snippet: `${isHighlyRelevant ? 'Highly relevant' : isSomewhatRelevant ? 'Relevant' : 'Possibly related'} profile page for ${query} with ${dateRestrict ? 'recent' : ''} activity.`,
        pagemap: {
          cse_image: [{ src: `https://picsum.photos/200/300?random=${index+1}` }]
        },
        relevanceScore: isHighlyRelevant ? 0.9 : isSomewhatRelevant ? 0.7 : 0.4
      };
    })
  };
  
  console.log('Generated mock results:', mockResults.items.length);
  return mockResults;
}

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
    
    console.log('Performing image search with URL:', imageUrl, 'with params:', searchParams);
    
    const request = new Promise(async (resolve) => {
      try {
        const similarityThreshold = searchParams?.similarityThreshold || 0.6;
        const maxResults = searchParams?.maxResults || 20;
        const searchMode = searchParams?.searchMode || 'relaxed';
        const includeSimilarColors = searchParams?.includeSimilarColors !== false;
        const includePartialMatches = searchParams?.includePartialMatches !== false;
        const minSize = searchParams?.minSize || 'medium';
        const imageType = searchParams?.imageType || undefined;
        const imageColorType = searchParams?.imageColorType || undefined;
        const dominantColor = searchParams?.dominantColor || undefined;
        
        console.log('Image search params:', { 
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
          
          // Apply color type filter (for demonstration)
          if (imageColorType && Math.random() > 0.7) {
            return null;
          }
          
          // Apply dominant color filter (for demonstration)
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
          
          return {
            title: `${source.split('.')[0].charAt(0).toUpperCase() + source.split('.')[0].slice(1)} Match`,
            link: `https://${source}/image-match-${index}`,
            displayLink: source,
            snippet: `${matchQuality.quality.charAt(0).toUpperCase() + matchQuality.quality.slice(1)} match (${Math.round(matchQuality.score * 100)}% similar) found on ${source}.`,
            image: {
              contextLink: `https://${source}`,
              thumbnailLink: `https://picsum.photos/200/300?random=${index+1}`,
            },
            similarityScore: matchQuality.score,
            matchQuality: matchQuality.quality,
            // Additional metadata for advanced filtering
            size: minSize,
            colorType: imageColorType,
            dominantColor: dominantColor
          };
        }).filter(Boolean);
        
        const sortedResults = mockItems.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, maxResults);
        
        const mockResults = {
          items: sortedResults
        };
        
        console.log('Generated mock image results:', mockResults.items?.length || 0);
        
        cacheResults(cacheKey, mockResults);
        resolve(mockResults);
      } catch (error) {
        console.error('Image Search API error:', error);
        
        const fallbackResults = {
          items: [
            {
              title: 'LinkedIn Profile Match',
              link: 'https://linkedin.com/in/profile-match',
              displayLink: 'linkedin.com',
              snippet: 'Professional profile page with potential image match.',
              image: {
                contextLink: 'https://linkedin.com',
                thumbnailLink: 'https://picsum.photos/200/300?random=1',
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
                thumbnailLink: 'https://picsum.photos/200/300?random=2',
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
                thumbnailLink: 'https://picsum.photos/200/300?random=3',
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
      items: [
        {
          title: 'LinkedIn Profile Match',
          link: 'https://linkedin.com/in/profile-match',
          displayLink: 'linkedin.com',
          snippet: 'Professional profile page with potential image match.',
          image: {
            contextLink: 'https://linkedin.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=1',
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
            thumbnailLink: 'https://picsum.photos/200/300?random=2',
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
            thumbnailLink: 'https://picsum.photos/200/300?random=3',
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
