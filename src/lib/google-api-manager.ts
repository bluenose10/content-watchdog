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
    try {
      const result = await executeFunc();
      return result;
    } catch (error) {
      console.error(`Google API request failed (${apiType}):`, error);
      throw error;
    }
  }
  
  /**
   * Execute a Google API search with direct call to Google API
   */
  public async directGoogleSearch(
    query: string,
    apiKey?: string,
    cseId?: string
  ): Promise<any> {
    // Get API credentials from environment variables or session storage
    const googleApiKey = apiKey || process.env.GOOGLE_API_KEY || sessionStorage.getItem('GOOGLE_API_KEY');
    const googleCseId = cseId || process.env.GOOGLE_CSE_ID || sessionStorage.getItem('GOOGLE_CSE_ID');
    
    if (!googleApiKey || !googleCseId) {
      console.error("Missing Google API credentials");
      throw new Error("Missing Google API credentials. Please set GOOGLE_API_KEY and GOOGLE_CSE_ID in your environment or session storage.");
    }
    
    console.log("Attempting direct Google API call for query:", query);
    const url = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCseId}&q=${encodeURIComponent(query)}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Google API error response:", errorText);
        throw new Error(`Google API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Successfully received Google API response with items:", data.items?.length || 0);
      return data;
    } catch (error) {
      console.error("Error making direct Google API call:", error);
      throw error;
    }
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
      console.log(`Executing optimized Google API search: ${type} - ${query}`);
      
      try {
        // First try direct API call with credentials from different sources
        const apiKey = process.env.GOOGLE_API_KEY || 
                      sessionStorage.getItem('GOOGLE_API_KEY') || 
                      localStorage.getItem('GOOGLE_API_KEY');
                      
        const cseId = process.env.GOOGLE_CSE_ID || 
                     sessionStorage.getItem('GOOGLE_CSE_ID') || 
                     localStorage.getItem('GOOGLE_CSE_ID');
        
        if (apiKey && cseId) {
          console.log("Found Google API credentials, attempting direct search");
          const directResult = await this.directGoogleSearch(query, apiKey, cseId);
          
          if (directResult && directResult.items && directResult.items.length > 0) {
            console.log("Successfully retrieved direct Google search results");
            
            // Format results
            const results = directResult.items.map((item: any, index: number) => ({
              id: `google-${index}-${Date.now()}`,
              title: item.title || "Untitled",
              url: item.link || "#",
              thumbnail: item.pagemap?.cse_image?.[0]?.src || 
                          item.pagemap?.cse_thumbnail?.[0]?.src ||
                          `https://picsum.photos/200/300?random=${index+1}`,
              source: item.displayLink || "unknown",
              match_level: index < 3 ? 'High' : index < 7 ? 'Medium' : 'Low',
              found_at: new Date().toISOString(),
              type: this.determineResultType(item, type),
              snippet: item.snippet || null
            }));
            
            return { results, searchInformation: directResult.searchInformation };
          } else {
            console.warn("Google API call succeeded but returned no items");
          }
        } else {
          console.error("No Google API credentials found. Please set GOOGLE_API_KEY and GOOGLE_CSE_ID");
        }
        
        // If direct API call failed, fall back to simulated results
        console.warn("Direct API call failed or returned no results, using fallback");
        throw new Error("Direct Google API call failed");
      } catch (error) {
        console.error("All Google API methods failed:", error);
        throw error;
      }
    };
    
    return this.executeWithThrottling('search', executeSearch, cacheKey);
  }
  
  private determineResultType(item: any, queryType: string): 'website' | 'social' | 'image' {
    const source = item.displayLink || "";
    
    if (queryType === 'image' || 
        item.pagemap?.imageobject || 
        item.pagemap?.cse_image ||
        source.includes('instagram') || 
        source.includes('flickr') || 
        source.includes('pinterest') ||
        item.title?.toLowerCase().includes('image') ||
        item.title?.toLowerCase().includes('photo')) {
      return 'image';
    } else if (
        item.pagemap?.videoobject || 
        source.includes('youtube') || 
        source.includes('vimeo') || 
        source.includes('tiktok') ||
        source.includes('twitter') || 
        source.includes('facebook') || 
        source.includes('linkedin') || 
        source.includes('reddit') ||
        item.title?.toLowerCase().includes('profile') ||
        item.title?.toLowerCase().includes('video')) {
      return 'social';
    }
    
    return 'website';
  }
  
  // Method to check if Google API credentials are configured
  public checkApiCredentials(): { configured: boolean, message: string } {
    const apiKey = process.env.GOOGLE_API_KEY || 
                  sessionStorage.getItem('GOOGLE_API_KEY') || 
                  localStorage.getItem('GOOGLE_API_KEY');
                  
    const cseId = process.env.GOOGLE_CSE_ID || 
                 sessionStorage.getItem('GOOGLE_CSE_ID') || 
                 localStorage.getItem('GOOGLE_CSE_ID');
    
    if (!apiKey && !cseId) {
      return { 
        configured: false, 
        message: "Both Google API Key and CSE ID are missing. Please configure them in Supabase secrets." 
      };
    } else if (!apiKey) {
      return { 
        configured: false, 
        message: "Google API Key is missing. Please configure it in Supabase secrets." 
      };
    } else if (!cseId) {
      return { 
        configured: false, 
        message: "Google CSE ID is missing. Please configure it in Supabase secrets." 
      };
    }
    
    return { 
      configured: true, 
      message: "Google API credentials are configured correctly." 
    };
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

// Add direct Google search method
export const directGoogleSearch = (
  query: string,
  apiKey?: string,
  cseId?: string
) => googleApiManager.directGoogleSearch(query, apiKey, cseId);

// Export method to check API credentials
export const checkGoogleApiCredentials = () => googleApiManager.checkApiCredentials();
