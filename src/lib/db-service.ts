
import { supabase } from './supabase';
import { SearchQuery, SearchResult, UserSubscription } from './db-types';

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

// Search results functions
export const createSearchResults = async (results: SearchResult[]) => {
  const { data, error } = await supabase
    .from('search_results')
    .insert(results)
    .select();
  
  if (error) throw error;
  return data;
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
    .select('*')
    .eq('user_id', userId)
    .single();
  
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

// File upload functions
export const uploadSearchImage = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  const filePath = `search-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(filePath, file);
  
  if (uploadError) throw uploadError;
  
  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};
