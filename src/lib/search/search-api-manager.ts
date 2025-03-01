import { QueuedRequest, SearchEngineConfig } from './search-types';
import { quotaManager } from './quota-manager';
import { requestQueue } from './request-queue';
import { bingSearchProcessor } from './bing-search-processor';
import { resultMerger } from './result-merger';
import { getCacheKey, getCachedResults, cacheResults } from '../search-cache';

export class SearchApiManager {
  private static instance: SearchApiManager;
  private searchEngines: Record<string, SearchEngineConfig> = {};
  
  private constructor() {
    // Initialize search engines with priority (higher = tried first)
    this.searchEngines = {
      'google': {
        name: 'Google Search',
        enabled: true,
        priority: 10,
        quotaConfig: quotaManager['quotas']['google']
      },
      'bing': {
        name: 'Bing Search',
        enabled: true,
        priority: 8,
        quotaConfig: quotaManager['quotas']['bing']
      },
      'youtube': {
        name: 'YouTube Search',
        enabled: true,
        priority: 5,
        quotaConfig: quotaManager['quotas']['youtube']
      }
    };
    
    console.log('SearchApiManager initialized with multiple search engines');
  }
  
  public static getInstance(): SearchApiManager {
    if (!SearchApiManager.instance) {
      SearchApiManager.instance = new SearchApiManager();
    }
    return SearchApiManager.instance;
  }
  
  public getAvailableSearchEngines(): string[] {
    return Object.keys(this.searchEngines)
      .filter(key => this.searchEngines[key].enabled && quotaManager.canMakeRequest(key))
      .sort((a, b) => this.searchEngines[b].priority - this.searchEngines[a].priority);
  }
  
  public toggleSearchEngine(name: string, enabled: boolean): void {
    if (this.searchEngines[name]) {
      this.searchEngines[name].enabled = enabled;
      console.log(`${name} search engine ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
  
  public setPriority(name: string, priority: number): void {
    if (this.searchEngines[name]) {
      this.searchEngines[name].priority = priority;
      console.log(`${name} search engine priority set to ${priority}`);
    }
  }
  
  public canMakeRequest(engine: string): boolean {
    return quotaManager.canMakeRequest(engine);
  }
  
  public async executeWithThrottling<T>(
    apiType: string,
    executeFunc: () => Promise<T>,
    userId?: string,
    cacheKey?: string
  ): Promise<T> {
    // Try cache first if a key is provided
    if (cacheKey) {
      const cachedResult = getCachedResults(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }
    }
    
    // If can't make request directly, add to queue
    if (!quotaManager.canMakeRequest(apiType)) {
      return new Promise((resolve, reject) => {
        requestQueue.addToQueue({
          execute: async () => {
            try {
              const result = await this.executeRequest(apiType, executeFunc);
              
              // Cache result if needed
              if (cacheKey) {
                cacheResults(cacheKey, result, apiType, 0.01); // Estimated cost per request
              }
              
              resolve(result);
            } catch (error) {
              reject(error);
            }
          },
          userId
        });
      });
    }
    
    // If can make request directly
    const result = await this.executeRequest(apiType, executeFunc);
    
    // Cache result if needed
    if (cacheKey) {
      cacheResults(cacheKey, result, apiType, 0.01); // Estimated cost per request
    }
    
    return result;
  }
  
  private async executeRequest<T>(
    apiType: string,
    executeFunc: () => Promise<T>
  ): Promise<T> {
    // Update quota usage
    quotaManager.incrementUsage(apiType);
    
    // Execute the request
    return executeFunc();
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
    
    // Get available search engines sorted by priority
    const availableEngines = this.getAvailableSearchEngines();
    
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
          resultMerger.mergeSearchResults(combinedResults, results);
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
        return bingSearchProcessor.executeBingSearch(type, query, params);
      }
      
      // For other engines or mock implementation
      // Simulate API call delay for mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For demonstration - in a real app, call the appropriate API
      const searchId = `${engine}_${type}_${query.replace(/\W+/g, '_')}`;
      
      // Get results with only the fields we need
      const result = await import('../search-cache').then(module => 
        module.getSearchResults(searchId)
      );
      
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
    
    return this.executeWithThrottling(engine, executeSearch);
  }
  
  public getSearchEngineStats(): any {
    const stats: Record<string, any> = {};
    
    Object.keys(this.searchEngines).forEach(key => {
      const engine = this.searchEngines[key];
      const quota = engine.quotaConfig;
      
      stats[key] = {
        name: engine.name,
        enabled: engine.enabled,
        priority: engine.priority,
        ...quotaManager.getQuotaStats()[key]
      };
    });
    
    return stats;
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
