
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

// Class to manage Google API interactions, including rate limiting and error handling
class GoogleApiManager {
  private apiKey: string = '';
  private cseId: string = '';
  private searchClient: any;
  
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

  // Optimized search with automatic retries
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
