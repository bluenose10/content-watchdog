
import { getCacheKey, getCachedResults, cacheResults } from "./search-cache";

// Quota management for Google APIs
interface QuotaConfig {
  dailyLimit: number;
  currentUsage: number;
  resetTime: number;
  perMinuteLimit: number;
  minuteUsage: number;
  minuteReset: number;
}

class GoogleApiManager {
  private static instance: GoogleApiManager;
  private quotas: Record<string, QuotaConfig> = {};
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  
  // Default quota values - adjust based on your actual Google API limits
  private DEFAULT_QUOTA: QuotaConfig = {
    dailyLimit: 10000,
    currentUsage: 0,
    resetTime: this.getEndOfDay(),
    perMinuteLimit: 60,
    minuteUsage: 0,
    minuteReset: Date.now() + 60000
  };
  
  private constructor() {
    // Initialize default quotas for different Google APIs
    this.quotas = {
      'search': { ...this.DEFAULT_QUOTA },
      'maps': { ...this.DEFAULT_QUOTA, dailyLimit: 5000 },
      'youtube': { ...this.DEFAULT_QUOTA, dailyLimit: 20000 }
    };
    
    // Set up periodic quota reset
    setInterval(() => this.checkAndResetQuotas(), 60000); // Check every minute
  }
  
  public static getInstance(): GoogleApiManager {
    if (!GoogleApiManager.instance) {
      GoogleApiManager.instance = new GoogleApiManager();
    }
    return GoogleApiManager.instance;
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
      console.error('Error processing Google API request:', error);
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
              cacheResults(cacheKey, result, 'google', 0.01); // Estimated cost per request
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
      cacheResults(cacheKey, result, 'google', 0.01); // Estimated cost per request
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
   * Execute a Google API search with all optimizations applied
   */
  public async optimizedSearch(
    type: string,
    query: string,
    params: any = {}
  ): Promise<any> {
    const cacheKey = getCacheKey(type, query, params);
    
    // Helper function to execute the actual API call
    const executeSearch = async () => {
      // In a real implementation, this would call the Google API with the query
      // For this mock, we'll use our existing getSearchResults function
      
      console.log(`Executing optimized Google API search: ${type} - ${query}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For demonstration - in a real app, this would be the actual Google API call
      const searchId = `${type}_${query.replace(/\W+/g, '_')}`;
      
      // Get results with only the fields we need
      const result = await import('./search-cache').then(module => 
        module.getSearchResults(searchId)
      );
      
      return result;
    };
    
    return this.executeWithThrottling('search', executeSearch, cacheKey);
  }
}

// Export singleton instance
export const googleApiManager = GoogleApiManager.getInstance();

// Export convenience methods
export const optimizedGoogleSearch = (
  type: string,
  query: string,
  params: any = {}
) => googleApiManager.optimizedSearch(type, query, params);
