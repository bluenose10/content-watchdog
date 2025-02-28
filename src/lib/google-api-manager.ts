
import { getCacheKey, getCachedResults, cacheResults } from "./search-cache";

// Quota management for Search APIs
interface QuotaConfig {
  dailyLimit: number;
  currentUsage: number;
  resetTime: number;
  perMinuteLimit: number;
  minuteUsage: number;
  minuteReset: number;
}

// Interface for search engine configuration
interface SearchEngineConfig {
  name: string;
  enabled: boolean;
  priority: number; // Higher number = higher priority
  quotaConfig: QuotaConfig;
}

class SearchApiManager {
  private static instance: SearchApiManager;
  private searchEngines: Record<string, SearchEngineConfig> = {};
  private quotas: Record<string, QuotaConfig> = {};
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  
  // Default quota values - adjust based on your actual API limits
  private DEFAULT_QUOTA: QuotaConfig = {
    dailyLimit: 10000,
    currentUsage: 0,
    resetTime: this.getEndOfDay(),
    perMinuteLimit: 60,
    minuteUsage: 0,
    minuteReset: Date.now() + 60000
  };
  
  private constructor() {
    // Initialize default quotas for different search APIs
    this.quotas = {
      'google': { ...this.DEFAULT_QUOTA },
      'bing': { ...this.DEFAULT_QUOTA, dailyLimit: 3000, perMinuteLimit: 50 },
      'maps': { ...this.DEFAULT_QUOTA, dailyLimit: 5000 },
      'youtube': { ...this.DEFAULT_QUOTA, dailyLimit: 20000 }
    };
    
    // Initialize search engines with priority (higher = tried first)
    this.searchEngines = {
      'google': {
        name: 'Google Search',
        enabled: true,
        priority: 10,
        quotaConfig: this.quotas['google']
      },
      'bing': {
        name: 'Bing Search',
        enabled: true,
        priority: 8,
        quotaConfig: this.quotas['bing']
      },
      'youtube': {
        name: 'YouTube Search',
        enabled: true,
        priority: 5,
        quotaConfig: this.quotas['youtube']
      }
    };
    
    // Set up periodic quota reset
    setInterval(() => this.checkAndResetQuotas(), 60000); // Check every minute
    
    console.log('SearchApiManager initialized with multiple search engines');
  }
  
  public static getInstance(): SearchApiManager {
    if (!SearchApiManager.instance) {
      SearchApiManager.instance = new SearchApiManager();
    }
    return SearchApiManager.instance;
  }
  
  private getEndOfDay(): number {
    const now = new Date();
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23, 59, 59, 999
    );
    return endOfDay.getTime();
  }
  
  private checkAndResetQuotas(): void {
    const now = Date.now();
    
    // Reset daily quotas if needed
    Object.keys(this.quotas).forEach(key => {
      const quota = this.quotas[key];
      
      // Reset daily quota if past reset time
      if (now > quota.resetTime) {
        quota.currentUsage = 0;
        quota.resetTime = this.getEndOfDay();
      }
      
      // Reset minute quota if past minute reset
      if (now > quota.minuteReset) {
        quota.minuteUsage = 0;
        quota.minuteReset = now + 60000; // Next minute
      }
    });
  }
  
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      // Process the next request in the queue
      const nextRequest = this.requestQueue.shift();
      if (nextRequest) {
        await nextRequest();
      }
    } catch (error) {
      console.error('Error processing Search API request:', error);
    } finally {
      this.isProcessing = false;
      
      // Continue processing if there are more requests
      if (this.requestQueue.length > 0) {
        // Small delay between requests to avoid rate limiting
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }
  
  public canMakeRequest(apiType: string): boolean {
    const quota = this.quotas[apiType] || this.DEFAULT_QUOTA;
    const now = Date.now();
    
    // Reset minute quota if needed
    if (now > quota.minuteReset) {
      quota.minuteUsage = 0;
      quota.minuteReset = now + 60000;
    }
    
    return (
      quota.currentUsage < quota.dailyLimit &&
      quota.minuteUsage < quota.perMinuteLimit
    );
  }
  
  public getAvailableSearchEngines(): string[] {
    return Object.keys(this.searchEngines)
      .filter(key => this.searchEngines[key].enabled && this.canMakeRequest(key))
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
  
  public async executeWithThrottling<T>(
    apiType: string,
    executeFunc: () => Promise<T>,
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
    if (!this.canMakeRequest(apiType)) {
      return new Promise((resolve, reject) => {
        this.requestQueue.push(async () => {
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
        });
        
        // Start processing the queue if not already
        this.processQueue();
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
    const quota = this.quotas[apiType] || this.DEFAULT_QUOTA;
    
    // Update quota usage
    quota.currentUsage++;
    quota.minuteUsage++;
    
    // Execute the request
    return executeFunc();
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
      
      // Simulate API call delay for mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For demonstration - in a real app, call the appropriate API
      const searchId = `${engine}_${type}_${query.replace(/\W+/g, '_')}`;
      
      // Get results with only the fields we need
      const result = await import('./search-cache').then(module => 
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
  
  /**
   * Get stats about available search engines
   */
  public getSearchEngineStats(): any {
    const stats: Record<string, any> = {};
    
    Object.keys(this.searchEngines).forEach(key => {
      const engine = this.searchEngines[key];
      const quota = engine.quotaConfig;
      
      stats[key] = {
        name: engine.name,
        enabled: engine.enabled,
        priority: engine.priority,
        dailyUsage: quota.currentUsage,
        dailyLimit: quota.dailyLimit,
        dailyRemaining: quota.dailyLimit - quota.currentUsage,
        minuteUsage: quota.minuteUsage,
        minuteLimit: quota.perMinuteLimit,
        available: this.canMakeRequest(key)
      };
    });
    
    return stats;
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

// Export methods to control search engines
export const getSearchEngineStats = () => searchApiManager.getSearchEngineStats();
export const toggleSearchEngine = (name: string, enabled: boolean) => 
  searchApiManager.toggleSearchEngine(name, enabled);
export const getAvailableSearchEngines = () => 
  searchApiManager.getAvailableSearchEngines();
