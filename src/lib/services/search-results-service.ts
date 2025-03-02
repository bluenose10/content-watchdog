
import { supabase } from '../supabase';
import { SearchResult } from '../db-types';

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
