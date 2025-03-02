
import { google } from 'googleapis';

// Define a type for the search result item
export interface SearchResultItem {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
  formattedUrl: string;
  pagemap?: any;
}

// Define a type for the search results
export interface SearchResults {
  items?: SearchResultItem[];
  kind: string;
  searchInformation: {
    formattedSearchTime: string;
    formattedTotalResults: string;
    searchTime: number;
    totalResults: string;
  };
}

// Define the optimized search results format
export interface OptimizedSearchResults {
  results: Array<{
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    source: string;
    match_level: 'High' | 'Medium' | 'Low';
    found_at: string;
    type: 'website' | 'image' | 'social';
    snippet?: string;
  }>;
  totalResults: number;
}

// Class to manage Google API interactions, including rate limiting and error handling
class GoogleApiManager {
  private apiKey: string = '';
  private cseId: string = '';
  private searchClient: any;
  private retryCount: number = 3;
  private retryDelay: number = 1000;
  
  constructor() {
    // Try to load credentials when the class is instantiated
    this.loadCredentialsFromStorage();
  }

  // Initialize the search client with current credentials
  private initializeSearchClient(): void {
    if (this.apiKey && this.cseId) {
      this.searchClient = google.customsearch('v1');
      console.log("Google Custom Search client initialized with API key and CSE ID");
    } else {
      console.warn("Cannot initialize search client: Missing API key or CSE ID");
    }
  }

  // Load credentials from session/local storage
  private loadCredentialsFromStorage(): void {
    let apiKey = '';
    let cseId = '';

    // Try to get from session storage first
    if (typeof window !== 'undefined') {
      apiKey = sessionStorage.getItem('GOOGLE_API_KEY') || '';
      cseId = sessionStorage.getItem('GOOGLE_CSE_ID') || '';
      
      // If not in session storage, try local storage
      if (!apiKey || !cseId) {
        apiKey = localStorage.getItem('GOOGLE_API_KEY') || '';
        cseId = localStorage.getItem('GOOGLE_CSE_ID') || '';
      }
      
      // If still not found, try environment variables
      if (!apiKey || !cseId) {
        apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
        cseId = import.meta.env.VITE_GOOGLE_CSE_ID || '';
      }
      
      if (apiKey && cseId) {
        this.apiKey = apiKey;
        this.cseId = cseId;
        this.initializeSearchClient();
        console.log("Successfully loaded Google API credentials from storage");
      } else {
        console.warn("Failed to load Google API credentials from storage or environment variables");
      }
    }
  }

  // Check if API credentials are properly configured
  public checkApiCredentials(): { configured: boolean; source?: string } {
    // Force reload of credentials before checking
    this.loadCredentialsFromStorage();
    
    if (this.apiKey && this.cseId) {
      let source = 'unknown';
      
      if (sessionStorage.getItem('GOOGLE_API_KEY')) {
        source = 'session storage';
      } else if (localStorage.getItem('GOOGLE_API_KEY')) {
        source = 'local storage';
      } else if (import.meta.env.VITE_GOOGLE_API_KEY) {
        source = 'environment variables';
      }
      
      console.log(`Google API credentials are configured (source: ${source})`);
      return { configured: true, source };
    }
    
    console.error("Google API credentials not configured: " + 
      (!this.apiKey && !this.cseId ? "Both Google API Key and CSE ID are missing" : 
       !this.apiKey ? "Google API Key is missing" : "CSE ID is missing") + 
      ". Please configure them in Supabase secrets.");
      
    return { configured: false };
  }

  // Set API credentials
  public setCredentials(apiKey: string, cseId: string): void {
    console.log("Setting new Google API credentials");
    this.apiKey = apiKey;
    this.cseId = cseId;
    
    // Save to session storage for current session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('GOOGLE_API_KEY', apiKey);
      sessionStorage.setItem('GOOGLE_CSE_ID', cseId);
      localStorage.setItem('GOOGLE_API_KEY', apiKey);
      localStorage.setItem('GOOGLE_CSE_ID', cseId);
    }
    
    this.initializeSearchClient();
  }

  // Optimized search with automatic retries and result formatting
  public async optimizedSearch(
    queryType: string,
    query: string,
    searchParams: any = {}
  ): Promise<OptimizedSearchResults> {
    console.log(`GoogleApiManager: Performing optimized ${queryType} search for: "${query}"`);
    
    try {
      // Before searching, ensure we have the latest credentials
      this.loadCredentialsFromStorage();
      
      if (!this.apiKey || !this.cseId) {
        throw new Error("Missing Google API credentials. Please set them in Supabase secrets or manually.");
      }
      
      // Try to perform the search with retries
      let searchResults = null;
      let lastError = null;
      
      for (let attempt = 0; attempt < this.retryCount; attempt++) {
        try {
          console.log(`Search attempt ${attempt + 1} for "${query}"`);
          searchResults = await this.search(query);
          
          if (searchResults && searchResults.items && searchResults.items.length > 0) {
            break; // Successful search, exit retry loop
          }
        } catch (error) {
          console.error(`Attempt ${attempt + 1} failed:`, error);
          lastError = error;
          
          if (attempt < this.retryCount - 1) {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          }
        }
      }
      
      if (!searchResults || !searchResults.items || searchResults.items.length === 0) {
        throw lastError || new Error("No search results found after retries");
      }
      
      const formattedResults = searchResults.items.map((item: any, index: number) => {
        const thumbnailUrl = 
          item.pagemap?.cse_thumbnail?.[0]?.src || 
          item.pagemap?.cse_image?.[0]?.src || 
          item.image?.thumbnailLink ||
          `https://picsum.photos/200/300?random=${index+1}`;
        
        const source = item.displayLink || "unknown";
        let type: 'website' | 'image' | 'social' = 'website';
        
        // Determine content type based on source and metadata
        if (item.pagemap?.videoobject || 
            source.includes('youtube') || 
            source.includes('vimeo') || 
            source.includes('tiktok') ||
            item.title?.toLowerCase().includes('video')) {
          type = 'social';
        } else if (
            item.pagemap?.imageobject || 
            item.pagemap?.cse_image ||
            source.includes('instagram') || 
            source.includes('flickr') || 
            source.includes('pinterest') ||
            item.title?.toLowerCase().includes('image') ||
            item.title?.toLowerCase().includes('photo') ||
            queryType === 'image'
        ) {
          type = 'image';
        } else if (
            source.includes('twitter') || 
            source.includes('facebook') || 
            source.includes('linkedin') || 
            source.includes('reddit') ||
            item.title?.toLowerCase().includes('profile')
        ) {
          type = 'social';
        }
        
        // Calculate match score
        let matchScore = 0;
        matchScore += Math.max(0, 1 - (index / searchResults.items.length));
        
        if (item.title && item.title.toLowerCase().includes(query.toLowerCase())) {
          matchScore += 0.4;
        }
        
        if (item.snippet && item.snippet.toLowerCase().includes(query.toLowerCase())) {
          matchScore += 0.2;
        }
        
        if (item.pagemap?.metatags?.[0]?.['og:title']?.toLowerCase().includes(query.toLowerCase())) {
          matchScore += 0.2;
        }
        
        if (item.link?.toLowerCase().includes(query.toLowerCase().replace(/\s+/g, ''))) {
          matchScore += 0.2;
        }
        
        matchScore = Math.min(1, matchScore);
        
        let matchLevel: 'High' | 'Medium' | 'Low' = 'Medium';
        if (matchScore > 0.65) matchLevel = 'High';
        else if (matchScore < 0.3) matchLevel = 'Low';
        
        return {
          id: `result-${index}`,
          title: item.title || "Untitled",
          url: item.link || "#",
          thumbnail: thumbnailUrl,
          source: source,
          match_level: matchLevel,
          found_at: new Date().toISOString(),
          type: type,
          snippet: item.snippet || null
        };
      });
      
      console.log("Optimized search completed:", formattedResults.length, "results");
      
      return {
        results: formattedResults,
        totalResults: parseInt(searchResults.searchInformation?.totalResults) || formattedResults.length
      };
    } catch (error) {
      console.error("Optimized search failed:", error);
      throw error;
    }
  }

  // Perform search with automatic retries
  public async search(query: string): Promise<any> {
    // Make sure credentials are loaded
    this.loadCredentialsFromStorage();
    
    // Check if we have valid credentials
    if (!this.apiKey || !this.cseId) {
      console.error("Cannot perform search: Missing Google API credentials");
      throw new Error("Missing Google API credentials");
    }
    
    // Check if search client is initialized
    if (!this.searchClient) {
      this.initializeSearchClient();
      if (!this.searchClient) {
        console.error("Cannot perform search: Failed to initialize search client");
        throw new Error("Failed to initialize search client");
      }
    }
    
    try {
      console.log(`Performing Google search for query: "${query}"`);
      
      const response = await this.searchClient.cse.list({
        q: query,
        cx: this.cseId,
        key: this.apiKey,
        num: 10 // Number of results to return
      });
      
      console.log(`Search completed successfully. Results:`, response.data);
      return response.data;
    } catch (error) {
      console.error("Error performing Google search:", error);
      throw error;
    }
  }
}

// Create a singleton instance
export const googleApiManager = new GoogleApiManager();
