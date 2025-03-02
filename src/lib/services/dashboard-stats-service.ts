
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
    
    // Get total content matches from search results
    const { data: searchResults, error: resultsError } = await supabase
      .from('search_results')
      .select('search_id')
      .in('search_id', supabase
        .from('search_queries')
        .select('id')
        .eq('user_id', userId)
      );
    
    if (resultsError) throw resultsError;
    
    const contentMatchCount = searchResults?.length || 0;
    
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
