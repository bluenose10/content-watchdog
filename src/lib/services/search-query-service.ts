
import { supabase } from '../supabase';
import { SearchQuery, TextSearchParams } from '../db-types';
import { getCacheKey, getCachedResults, cacheResults } from '../search-cache';

// Cache for pending requests to prevent duplicate calls
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

export async function processSearch(
  searchData: SearchQuery, 
  user: any | null
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
