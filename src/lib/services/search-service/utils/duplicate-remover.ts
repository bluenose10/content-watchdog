
import { EnhancedSearchResult } from '../text-search/types';

/**
 * Remove duplicate results based on URL
 */
export function removeDuplicateResults(results: EnhancedSearchResult[]): EnhancedSearchResult[] {
  const seen = new Set<string>();
  return results.filter(result => {
    if (!result.link) return false;
    if (seen.has(result.link)) return false;
    seen.add(result.link);
    return true;
  });
}
