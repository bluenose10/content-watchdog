
import { getCacheKey, getCachedResults, cacheResults } from "../search-cache";
import { searchEngineManager, getAvailableSearchEngines } from "./search-engine-manager";
import { requestProcessor } from "./request-processor";
import { bingApiService } from "./bing-api-service";
import { getSearchResults } from "../search-cache";

export class SearchApiManager {
  private static instance: SearchApiManager;
  
  private constructor() {
    console.log('SearchApiManager initialized with multiple search engines');
  }
  
  public static getInstance(): SearchApiManager {
    if (!SearchApiManager.instance) {
      SearchApiManager.instance = new SearchApiManager();
    }
    return SearchApiManager.instance;
  }

  /**
   * Execute a search with all optimizations applied across multiple engines
   */
  public async optimizedSearch(
    type: string,
    query: string,
    params: any = {}
  ): Promise<any> {
    const cacheKey = getCacheKey(type, query, params);
    const cachedResults = getCachedResults(cacheKey);
    
    if (cachedResults) {
      console.log(`Using cached results for ${type} search: ${query}`);
      return cachedResults;
    }
    
    // Get available search engines sorted by priority
    const availableEngines = getAvailableSearchEngines();
    
    if (availableEngines.length === 0) {
      throw new Error('No search engines available. Try again later.');
    }
    
    // Try each search engine in priority order
    let lastError = null;
    let combinedResults = { items: [] };
    
    for (const engine of availableEngines) {
      try {
        // Skip YouTube engine for non-video searches
        if (engine === 'youtube' && type !== 'video') continue;
        
        console.log(`Trying ${engine} search for query: ${query}`);
        
        // Execute the search with the current engine
        const results = await this.executeSearchWithEngine(engine, type, query, params);
        
        // If this is the first successful result, use it as base
        if (combinedResults.items.length === 0) {
          combinedResults = results;
        } else {
          // Merge results, avoiding duplicates
          this.mergeSearchResults(combinedResults, results);
        }
        
        // If we have enough results already, stop trying more engines
        if (combinedResults.items.length >= (params.maxResults || 20)) {
          break;
        }
      } catch (error) {
        console.error(`Error with ${engine} search:`, error);
        lastError = error;
        // Continue to next engine if one fails
      }
    }
    
    // If we got no results from any engine, throw the last error
    if (combinedResults.items.length === 0 && lastError) {
      throw lastError;
    }
    
    // Cache combined results
    cacheResults(cacheKey, combinedResults, 'multi-engine', 0.02);
    
    return combinedResults;
  }
  
  private async executeSearchWithEngine(
    engine: string,
    type: string,
    query: string,
    params: any = {}
  ): Promise<any> {
    // Helper function to execute the search with specific engine
    const executeSearch = async () => {
      console.log(`Executing ${engine} search for ${type}: ${query}`);
      
      if (engine === 'bing') {
        return bingApiService.executeBingSearch(type, query, params);
      }
      
      // For other engines or mock implementation
      // Simulate API call delay for mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For demonstration - in a real app, call the appropriate API
      const searchId = `${engine}_${type}_${query.replace(/\W+/g, '_')}`;
      
      // Get results with only the fields we need
      const result = await getSearchResults(searchId);
      
      // Tag results with their source
      if (result && result.results) {
        result.results.forEach((item: any) => {
          item.source_engine = engine;
        });
      }
      
      return { 
        items: result.results || [],
        engine: engine,
        query: query
      };
    };
    
    return requestProcessor.executeWithThrottling(engine, executeSearch);
  }
  
  // Merge results from different engines avoiding duplicates
  private mergeSearchResults(target: any, source: any): void {
    if (!source.items || !Array.isArray(source.items)) return;
    
    const existingUrls = new Set(
      target.items.map((item: any) => item.url || '')
    );
    
    for (const item of source.items) {
      // Skip if we already have an item with the same URL
      if (item.url && existingUrls.has(item.url)) continue;
      
      target.items.push(item);
      if (item.url) existingUrls.add(item.url);
    }
  }
}

// Export singleton instance
export const searchApiManager = SearchApiManager.getInstance();

// Export convenience methods
export const optimizedSearch = (
  type: string,
  query: string,
  params: any = {}
) => searchApiManager.optimizedSearch(type, query, params);

// For backward compatibility
export const optimizedGoogleSearch = optimizedSearch;

// Re-export from search-engine-manager for convenience
export { 
  getAvailableSearchEngines,
  getSearchEngineStats,
  toggleSearchEngine,
  enableBingSearch,
  disableBingSearch,
  setBingPriority
} from './search-engine-manager';
