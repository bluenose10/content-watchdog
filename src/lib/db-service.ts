
import { supabase } from './supabase';
import { SearchQuery, SearchResult, UserSubscription } from './db-types';
import { getCacheKey, getCachedResults, cacheResults } from './search-cache';

// Track pending requests to avoid duplicate calls
const pendingRequests: Record<string, Promise<any>> = {};

// Search queries functions
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

// Delete search query and its results
export const deleteSearchQuery = async (searchId: string) => {
  // First get the search query to check if there's an image to delete
  const { data: searchQuery, error: fetchError } = await supabase
    .from('search_queries')
    .select('*')
    .eq('id', searchId)
    .single();
  
  if (fetchError) throw fetchError;
  
  // If there's an image URL, delete it from storage
  if (searchQuery.image_url && searchQuery.query_type === 'image') {
    try {
      // Extract the file path from the URL
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
          // Continue with deleting the record even if file delete fails
        }
      }
    } catch (e) {
      console.error('Error processing image URL for deletion:', e);
      // Continue with deletion even if URL parsing fails
    }
  }
  
  // Now delete the search query (cascading delete will remove results too)
  const { error } = await supabase
    .from('search_queries')
    .delete()
    .eq('id', searchId);
  
  if (error) throw error;
  
  return { success: true };
};

// Search results functions
export const createSearchResults = async (results: SearchResult[]) => {
  if (!results || results.length === 0) {
    console.error('No results provided to createSearchResults');
    return [];
  }
  
  console.log('Creating search results:', results.length);
  
  try {
    // Ensure results have the required fields
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

// User subscription functions
export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*, plans(*)')
    .eq('user_id', userId)
    .maybeSingle();
  
  // If no subscription found, it's not an error - user is on free plan
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

// Google Custom Search API function - real API integration with caching
export const performGoogleSearch = async (query: string, userId: string, searchParams: any = {}) => {
  try {
    // Generate cache key from query and search parameters
    const cacheKey = getCacheKey('text', query, searchParams);
    
    // Check if there's already a pending request for this search
    if (pendingRequests[cacheKey]) {
      console.log('Returning existing pending request for:', query);
      return pendingRequests[cacheKey];
    }
    
    // Check cache first
    const cachedResults = getCachedResults(cacheKey);
    if (cachedResults) {
      return cachedResults;
    }
    
    console.log('Performing Google search for query:', query, 'by user:', userId, 'with params:', searchParams);
    
    // Create a new promise for this request and store it
    const request = new Promise(async (resolve) => {
      try {
        // Try to use the real Google Search API if we have an API key
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
        const searchEngineId = import.meta.env.VITE_GOOGLE_CSE_ID || '';
        
        if (!apiKey || !searchEngineId) {
          console.log('No API keys found, falling back to mock data');
          const mockResults = generateMockSearchResults(query, searchParams);
          cacheResults(cacheKey, mockResults);
          resolve(mockResults);
          return;
        }
        
        // Build search parameters
        const params = new URLSearchParams({
          key: apiKey,
          cx: searchEngineId,
          q: query,
          num: '20' // Maximum results to return
        });
        
        // Add advanced search parameters if provided
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
        
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Google API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Google API response:', data);
        
        // Cache the results
        cacheResults(cacheKey, data);
        resolve(data);
      } catch (error) {
        console.error('Google Search API error:', error);
        
        // If API call fails, fall back to mock data
        const mockResults = generateMockSearchResults(query, searchParams);
        cacheResults(cacheKey, mockResults);
        resolve(mockResults);
      } finally {
        // Clean up the pending request
        setTimeout(() => {
          delete pendingRequests[cacheKey];
        }, 100);
      }
    });
    
    // Store the promise
    pendingRequests[cacheKey] = request;
    
    return request;
  } catch (error) {
    console.error('Google Search API error:', error);
    
    // If API call fails, fall back to mock data
    return generateMockSearchResults(query, searchParams);
  }
};

// Fallback to generate mock results when API is not available
function generateMockSearchResults(query: string, searchParams: any = {}) {
  console.log('Generating mock search results for:', query, 'with params:', searchParams);
  
  // Use search parameters to alter the mock results
  const exactMatch = searchParams?.exactMatch;
  const dateRestrict = searchParams?.dateRestrict;
  const contentFilter = searchParams?.contentFilter || 'medium';
  
  // Generate more relevant titles based on search params
  const getTitlePrefix = () => {
    if (exactMatch) return `Exact match: "${query}"`;
    if (dateRestrict === 'last24h') return `Latest: ${query}`;
    if (dateRestrict === 'lastWeek') return `Recent: ${query}`;
    if (dateRestrict === 'lastMonth') return `This month: ${query}`;
    return query;
  };
  
  // Simulate different sources based on content filter
  const getSources = () => {
    const allSources = [
      'linkedin.com', 'twitter.com', 'instagram.com', 'facebook.com', 
      'youtube.com', 'tiktok.com', 'pinterest.com', 'reddit.com', 
      'medium.com', 'etsy.com', 'snapchat.com', 'twitch.tv', 
      'deviantart.com', 'behance.net', 'dribbble.com', 'vimeo.com', 
      'spotify.com', 'soundcloud.com', 'flickr.com', 'github.com'
    ];
    
    // With high content filter, exclude certain platforms
    if (contentFilter === 'high') {
      return allSources.filter(s => !['tiktok.com', 'reddit.com', 'twitch.tv'].includes(s));
    }
    
    return allSources;
  };
  
  // Generate mock results
  const sources = getSources();
  const titlePrefix = getTitlePrefix();
  
  const mockResults = {
    items: sources.map((source, index) => {
      // Determine relevance based on index and search params
      const isHighlyRelevant = index < 5 || (exactMatch && index < 8);
      const isSomewhatRelevant = index < 10 || (dateRestrict && index < 12);
      
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

// Image Search function - separate from text search
export const performImageSearch = async (imageUrl: string, userId: string, searchParams: any = {}) => {
  try {
    // Generate cache key from image URL and search parameters
    const cacheKey = getCacheKey('image', imageUrl, searchParams);
    
    // Check if there's already a pending request for this search
    if (pendingRequests[cacheKey]) {
      console.log('Returning existing pending request for image search');
      return pendingRequests[cacheKey];
    }
    
    // Check cache first
    const cachedResults = getCachedResults(cacheKey);
    if (cachedResults) {
      return cachedResults;
    }
    
    console.log('Performing image search with URL:', imageUrl, 'with params:', searchParams);
    
    // Create a new promise for this request and store it
    const request = new Promise(async (resolve) => {
      try {
        // Extract search parameters
        const similarityThreshold = searchParams?.similarityThreshold || 0.6;
        const maxResults = searchParams?.maxResults || 20;
        const searchMode = searchParams?.searchMode || 'relaxed';
        
        // In a real implementation, these parameters would be passed to the API
        console.log('Image search params:', { similarityThreshold, maxResults, searchMode });
        
        // Simulate different levels of match quality based on the parameters
        const getMatchQuality = (index: number) => {
          // Strict mode has fewer high-quality matches
          if (searchMode === 'strict') {
            if (index < 3) return { quality: 'high', score: 0.85 + (Math.random() * 0.15) };
            if (index < 8) return { quality: 'medium', score: 0.65 + (Math.random() * 0.15) };
            return { quality: 'low', score: 0.4 + (Math.random() * 0.2) };
          } 
          
          // Relaxed mode has more matches in general
          if (index < 6) return { quality: 'high', score: 0.8 + (Math.random() * 0.2) };
          if (index < 12) return { quality: 'medium', score: 0.6 + (Math.random() * 0.2) };
          return { quality: 'low', score: 0.3 + (Math.random() * 0.3) };
        };
        
        // Generate mock results with enhanced relevance data
        const sources = [
          'linkedin.com', 'facebook.com', 'instagram.com', 'twitter.com', 
          'youtube.com', 'tiktok.com', 'pinterest.com', 'reddit.com', 
          'tumblr.com', 'flickr.com', 'deviantart.com', 'behance.net', 
          'dribbble.com', 'unsplash.com', 'pexels.com', 'shutterstock.com', 
          'gettyimages.com', 'stock.adobe.com', 'istockphoto.com', 'medium.com'
        ];
        
        const mockItems = sources.map((source, index) => {
          const matchQuality = getMatchQuality(index);
          
          // Only include results that meet the similarity threshold
          if (matchQuality.score < similarityThreshold) {
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
            matchQuality: matchQuality.quality
          };
        }).filter(Boolean); // Remove null entries (below threshold)
        
        // Sort by similarity score and limit to max results
        const sortedResults = mockItems.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, maxResults);
        
        const mockResults = {
          items: sortedResults
        };
        
        console.log('Generated mock image results:', mockResults.items?.length || 0);
        
        // Cache the results
        cacheResults(cacheKey, mockResults);
        resolve(mockResults);
      } catch (error) {
        console.error('Image Search API error:', error);
        
        // Return fallback results if the API call fails
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
        
        // Cache even the fallback results
        cacheResults(cacheKey, fallbackResults);
        resolve(fallbackResults);
      } finally {
        // Clean up the pending request
        setTimeout(() => {
          delete pendingRequests[cacheKey];
        }, 100);
      }
    });
    
    // Store the promise
    pendingRequests[cacheKey] = request;
    
    return request;
  } catch (error) {
    console.error('Image Search API error:', error);
    
    // Return fallback results if the API call fails
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

// File upload functions
export const uploadSearchImage = async (file: File, userId: string) => {
  // Create a clean filename with user ID and timestamp to avoid collisions
  const fileExt = file.name.split('.').pop();
  const sanitizedFileName = `${userId}_${Date.now()}.${fileExt}`;
  const filePath = `search-images/${sanitizedFileName}`;

  console.log(`Uploading file ${file.name} to ${filePath}`);

  // Upload the file to the storage bucket
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
  
  // Get the public URL of the uploaded file
  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);
  
  if (!data.publicUrl) {
    throw new Error('Failed to get public URL for uploaded file');
  }
  
  console.log('Public URL:', data.publicUrl);
  return data.publicUrl;
};

// Get free plan details
export const getFreePlan = async () => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('id', 'free')
    .single();
  
  if (error) throw error;
  return data;
};

// Get all available plans
export const getPlans = async () => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('price', { ascending: true });
  
  if (error) throw error;
  return data;
};
