
import { quotaManager } from './quota-manager';
import { bingSearchProcessor } from './bing-search-processor';
import { getCacheKey, getCachedResults, cacheResults } from '../search-cache';

/**
 * Handles the execution of search requests with throttling and caching
 */
export class SearchExecutor {
  /**
   * Execute a function with throttling based on quota
   */
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
    
    // Check if can make request directly
    if (!quotaManager.canMakeRequest(apiType)) {
      // Request queue will be handled by the request-queue module
      return this.queueRequest(apiType, executeFunc, userId, cacheKey);
    }
    
    // Execute request directly
    const result = await this.executeRequest(apiType, executeFunc);
    
    // Cache result if needed
    if (cacheKey) {
      cacheResults(cacheKey, result, apiType, 0.01); // Estimated cost per request
    }
    
    return result;
  }
  
  /**
   * Queue a request for later execution
   */
  private async queueRequest<T>(
    apiType: string,
    executeFunc: () => Promise<T>,
    userId?: string,
    cacheKey?: string
  ): Promise<T> {
    const { requestQueue } = await import('./request-queue');
    
    return new Promise((resolve, reject) => {
      requestQueue.addToQueue({
        execute: async () => {
          try {
            const result = await this.executeRequest(apiType, executeFunc);
            
            // Cache result if needed
            if (cacheKey) {
              cacheResults(cacheKey, result, apiType, 0.01);
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
  
  /**
   * Execute a search request and update quota
   */
  private async executeRequest<T>(
    apiType: string,
    executeFunc: () => Promise<T>
  ): Promise<T> {
    // Update quota usage
    quotaManager.incrementUsage(apiType);
    
    // Execute the request
    return executeFunc();
  }
  
  /**
   * Execute a search using a specific engine
   */
  public async executeSearchWithEngine(
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
      
      // For other engines - assume Google search as default
      // Simulate API call delay for mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For production - call the appropriate search API
      throw new Error(`Search engine ${engine} not implemented - use another engine`);
    };
    
    return this.executeWithThrottling(engine, executeSearch);
  }
}

// Export singleton instance
export const searchExecutor = new SearchExecutor();
