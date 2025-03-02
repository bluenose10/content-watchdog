
import { EnhancedSearchResult } from '../types';

/**
 * Enhance search results with relevance scores
 * @param items Search result items
 * @returns Enhanced search results with relevance scores
 */
export function enhanceResultsWithScores(items: EnhancedSearchResult[]): EnhancedSearchResult[] {
  return items.map((item: EnhancedSearchResult, index: number) => {
    // Calculate relevance score based on position and content
    let relevanceScore = Math.max(0, 1 - (index / items.length));
    
    // Title match is a strong signal
    if (item.title && item.title.toLowerCase().includes((item as any).q?.toLowerCase() || '')) {
      relevanceScore += 0.3;
    }
    
    // Snippet match is also important
    if (item.snippet && item.snippet.toLowerCase().includes((item as any).q?.toLowerCase() || '')) {
      relevanceScore += 0.2;
    }
    
    // URL match is a good signal
    if (item.link && item.link.toLowerCase().includes((item as any).q?.toLowerCase()?.replace(/\s+/g, '') || '')) {
      relevanceScore += 0.1;
    }
    
    // Cap at 1.0
    item.relevanceScore = Math.min(1.0, relevanceScore);
    return item;
  });
}
