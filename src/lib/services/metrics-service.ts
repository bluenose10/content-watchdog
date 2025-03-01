
import { supabase } from '../supabase';

// Add a function to log search metrics for performance monitoring
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
