
import { supabase } from '../supabase';

interface UserStats {
  searchCount: number;
  contentMatchCount: number;
  takedownCount: number;
  searchGrowth: number;
}

/**
 * Fetches dashboard statistics for a specific user
 */
export const getUserDashboardStats = async (userId: string): Promise<UserStats> => {
  try {
    // Get total search count
    const { count: searchCount, error: searchError } = await supabase
      .from('search_queries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (searchError) throw searchError;

    // Get search count from previous month for growth calculation
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const { count: lastMonthCount, error: lastMonthError } = await supabase
      .from('search_queries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .lt('created_at', lastMonth.toISOString());
    
    if (lastMonthError) throw lastMonthError;
    
    // Calculate growth percentage
    const searchGrowth = lastMonthCount > 0 
      ? Math.round(((searchCount - lastMonthCount) / lastMonthCount) * 100) 
      : 0;
    
    // First, get all search query IDs for this user
    const { data: searchIds, error: idsError } = await supabase
      .from('search_queries')
      .select('id')
      .eq('user_id', userId);
    
    if (idsError) throw idsError;
    
    // Then get content matches count using the array of search IDs
    let contentMatchCount = 0;
    
    if (searchIds && searchIds.length > 0) {
      // Extract just the ID values into an array
      const searchIdValues = searchIds.map(row => row.id);
      
      const { count, error: resultsError } = await supabase
        .from('search_results')
        .select('*', { count: 'exact', head: true })
        .in('search_id', searchIdValues);
      
      if (resultsError) throw resultsError;
      
      contentMatchCount = count || 0;
    }
    
    // For now, we'll return a placeholder for takedowns
    // In a real implementation, this would come from a takedowns table
    const takedownCount = 0;
    
    return {
      searchCount: searchCount || 0,
      contentMatchCount,
      takedownCount,
      searchGrowth,
    };
  } catch (error) {
    console.error('Error fetching user dashboard stats:', error);
    // Return default values if there's an error
    return {
      searchCount: 0,
      contentMatchCount: 0,
      takedownCount: 0,
      searchGrowth: 0,
    };
  }
};
