
import { searchEngineConfig } from './search-engine-config';
import { searchExecutor } from './search-executor';
import { resultMerger } from './result-merger';
import { getCacheKey, getCachedResults, cacheResults } from '../search-cache';
import { requestQueue } from './request-queue';

export class SearchApiManager {
  private static instance: SearchApiManager;
  private maxResultsPerEngine = 20;
  private combinedResultsLimit = 50;
  
  private constructor() {
    console.log('SearchApiManager initialized with multiple search engines');
  }
  
  public static getInstance(): SearchApiManager {
    if (!SearchApiManager.instance) {
      SearchApiManager.instance = new SearchApiManager();
    }
    return SearchApiManager.instance;
  }
  
  public getAvailableSearchEngines(): string[] {
    return searchEngineConfig.getAvailableEngines();
  }
  
  public setMaxResultsPerEngine(count: number): void {
    this.maxResultsPerEngine = count;
    console.log(`Max results per engine set to ${count}`);
  }
  
  public setCombinedResultsLimit(count: number): void {
    this.combinedResultsLimit = count;
    console.log(`Combined results limit set to ${count}`);
  }
  
  public toggleSearchEngine(name: string, enabled: boolean): void {
    searchEngineConfig.toggleEngine(name, enabled);
  }
  
  public setPriority(name: string, priority: number): void {
    searchEngineConfig.setPriority(name, priority);
  }
  
  public canMakeRequest(engine: string): boolean {
    const { quotaManager } = require('./quota-manager');
    return quotaManager.canMakeRequest(engine);
  }
  
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
    
    // Set results count in params if not already set
    params.maxResults = params.maxResults || this.combinedResultsLimit;
    params.resultsPerEngine = params.resultsPerEngine || this.maxResultsPerEngine;
    
    // Get available search engines sorted by priority
    const availableEngines = this.getAvailableSearchEngines();
    
    if (availableEngines.length === 0) {
      throw new Error('No search engines available. Try again later.');
    }
    
    // Run parallel searches on multiple engines for faster response
    let combinedResults = { items: [] };
    let lastError = null;
    
    console.log(`Starting parallel search on engines: ${availableEngines.join(', ')}`);
    
    // Run parallel searches on multiple engines for faster response
    const searchPromises = availableEngines.map(async (engine) => {
      // Skip YouTube engine for non-video searches
      if (engine === 'youtube' && type !== 'video') return null;
      
      try {
        console.log(`Trying ${engine} search for query: ${query}`);
        // Execute the search with the current engine
        return await searchExecutor.executeSearchWithEngine(engine, type, query, {
          ...params,
          maxResults: params.resultsPerEngine
        });
      } catch (error) {
        console.error(`Error with ${engine} search:`, error);
        lastError = error;
        return null;
      }
    });
    
    // Wait for all engines to respond
    const engineResults = await Promise.all(searchPromises);
    
    // Merge all results
    for (const result of engineResults) {
      if (result && result.items && result.items.length > 0) {
        if (combinedResults.items.length === 0) {
          combinedResults = result;
        } else {
          // Merge results, avoiding duplicates
          resultMerger.mergeSearchResults(combinedResults, result);
        }
      }
    }
    
    // If we got no results from any engine, throw the last error
    if (combinedResults.items.length === 0) {
      if (lastError) {
        throw lastError;
      } else {
        throw new Error('No search results found from any available search engines');
      }
    }
    
    // Apply final limit to combined results
    if (combinedResults.items.length > params.maxResults) {
      combinedResults.items = combinedResults.items.slice(0, params.maxResults);
    }
    
    console.log(`Combined search completed with ${combinedResults.items.length} results`);
    
    // Cache combined results
    cacheResults(cacheKey, combinedResults, 'multi-engine', 0.02);
    
    return combinedResults;
  }
  
  public getSearchEngineStats(): any {
    return searchEngineConfig.getEngineStats();
  }
  
  public setPriorityMode(userId: string, isPriority: boolean): void {
    requestQueue.setPriorityMode(userId, isPriority);
  }
  
  public hasUserPriority(userId: string): boolean {
    return requestQueue.hasUserPriority(userId);
  }
}

// Export singleton instance
export const searchApiManager = SearchApiManager.getInstance();
