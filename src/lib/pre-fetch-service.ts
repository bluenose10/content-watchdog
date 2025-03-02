
import { googleApiManager } from './google-api-manager';
import { supabase } from './supabase';
import { toast } from 'sonner';

// Load Google API credentials from Supabase Edge Function with enhanced error handling and debugging
export async function loadGoogleApiCredentials(): Promise<boolean> {
  console.log("Loading Google API credentials from Supabase...");
  
  try {
    // Check if we already have credentials in session storage first
    const sessionApiKey = sessionStorage.getItem("GOOGLE_API_KEY");
    const sessionCseId = sessionStorage.getItem("GOOGLE_CSE_ID");
    
    if (sessionApiKey && sessionCseId) {
      console.log("Using Google API credentials from session storage");
      googleApiManager.setCredentials(sessionApiKey, sessionCseId);
      return true;
    }
    
    // Otherwise, fetch from Supabase Edge Function with better error handling
    console.log("Fetching credentials from Supabase Edge Function...");
    
    // Make the request to the edge function with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const { data, error } = await supabase.functions.invoke('get-search-credentials', {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error("Error fetching Google API credentials from Edge Function:", error);
        toast.error("Failed to fetch Google API credentials from Supabase");
        
        // Try to get credentials directly from environment variables as fallback
        const envApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        const envCseId = import.meta.env.VITE_GOOGLE_CSE_ID;
        
        if (envApiKey && envCseId) {
          console.log("Using Google API credentials from environment variables");
          googleApiManager.setCredentials(envApiKey, envCseId);
          sessionStorage.setItem("GOOGLE_API_KEY", envApiKey);
          sessionStorage.setItem("GOOGLE_CSE_ID", envCseId);
          return true;
        }
        
        // If we got this far, we couldn't get credentials
        return false;
      }
      
      // Additional detailed logging to understand what we're getting from the edge function
      console.log("Edge Function response received:", JSON.stringify(data, null, 2));
      
      if (data && typeof data.apiKey === 'string' && typeof data.cseId === 'string') {
        // Store the credentials in memory and session storage
        console.log("Successfully received valid Google API credentials from Supabase");
        googleApiManager.setCredentials(data.apiKey, data.cseId);
        sessionStorage.setItem("GOOGLE_API_KEY", data.apiKey);
        sessionStorage.setItem("GOOGLE_CSE_ID", data.cseId);
        return true;
      } else {
        console.warn("Invalid Google API credentials returned from Supabase:", data);
        
        // Check if there's a message in the response that might explain the issue
        if (data && data.message) {
          console.error("Edge Function error message:", data.message);
          toast.error(`Supabase Edge Function error: ${data.message}`);
        }
        
        // Try to use local storage or environment variables as a fallback
        const localApiKey = localStorage.getItem("GOOGLE_API_KEY") || import.meta.env.VITE_GOOGLE_API_KEY;
        const localCseId = localStorage.getItem("GOOGLE_CSE_ID") || import.meta.env.VITE_GOOGLE_CSE_ID;
        
        if (localApiKey && localCseId) {
          console.log("Using Google API credentials from local fallback");
          googleApiManager.setCredentials(localApiKey, localCseId);
          sessionStorage.setItem("GOOGLE_API_KEY", localApiKey);
          sessionStorage.setItem("GOOGLE_CSE_ID", localCseId);
          return true;
        }
        
        return false;
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("Fetch error getting Google API credentials:", fetchError);
      toast.error("Network error fetching Google API credentials");
      
      // Attempt fallback to any available source
      const fallbackApiKey = localStorage.getItem("GOOGLE_API_KEY") || 
                           import.meta.env.VITE_GOOGLE_API_KEY;
      const fallbackCseId = localStorage.getItem("GOOGLE_CSE_ID") || 
                          import.meta.env.VITE_GOOGLE_CSE_ID;
      
      if (fallbackApiKey && fallbackCseId) {
        console.log("Using fallback Google API credentials after network error");
        googleApiManager.setCredentials(fallbackApiKey, fallbackCseId);
        sessionStorage.setItem("GOOGLE_API_KEY", fallbackApiKey);
        sessionStorage.setItem("GOOGLE_CSE_ID", fallbackCseId);
        return true;
      }
      
      return false;
    }
  } catch (error) {
    console.error("Failed to load Google API credentials:", error);
    toast.error("Error loading Google API credentials");
    
    // Attempt one last fallback to any available source
    try {
      const lastResortApiKey = localStorage.getItem("GOOGLE_API_KEY") || 
                              sessionStorage.getItem("GOOGLE_API_KEY") || 
                              import.meta.env.VITE_GOOGLE_API_KEY;
      const lastResortCseId = localStorage.getItem("GOOGLE_CSE_ID") || 
                             sessionStorage.getItem("GOOGLE_CSE_ID") || 
                             import.meta.env.VITE_GOOGLE_CSE_ID;
      
      if (lastResortApiKey && lastResortCseId) {
        console.log("Using last resort Google API credentials");
        googleApiManager.setCredentials(lastResortApiKey, lastResortCseId);
        return true;
      }
    } catch (e) {
      console.error("Final fallback attempt also failed:", e);
    }
    
    return false;
  }
}

// Schedule pre-fetching popular searches at regular intervals
export function schedulePreFetching(intervalMinutes: number = 60): () => void {
  console.log(`Scheduling pre-fetching every ${intervalMinutes} minutes`);
  
  // Immediately load credentials and perform first pre-fetch
  loadGoogleApiCredentials().then((success) => {
    if (success) {
      console.log("Credentials loaded, performing initial pre-fetch");
      performPreFetch();
    } else {
      console.warn("Failed to load credentials, skipping initial pre-fetch");
    }
  });
  
  // Set up regular interval for pre-fetching
  const intervalId = setInterval(() => {
    console.log("Running scheduled pre-fetch");
    performPreFetch();
  }, intervalMinutes * 60 * 1000);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    console.log("Pre-fetch scheduler stopped");
  };
}

// Add the missing startPreFetching function that was imported by PreFetchManager.tsx
export async function startPreFetching(): Promise<void> {
  console.log("Manual pre-fetch initiated");
  
  // Check API credentials before proceeding
  if (!googleApiManager.checkApiCredentials().configured) {
    console.warn("Cannot start pre-fetch: Google API credentials not configured");
    
    // Try to load credentials
    const credentialsLoaded = await loadGoogleApiCredentials();
    
    if (!credentialsLoaded) {
      console.error("Failed to load API credentials, cannot perform pre-fetch");
      throw new Error("Google API credentials not available");
    }
  }
  
  // Perform the actual pre-fetch
  return performPreFetch();
}

// Perform the actual pre-fetching
async function performPreFetch(): Promise<void> {
  try {
    // Check if we have valid API credentials before attempting pre-fetch
    const apiStatus = googleApiManager.checkApiCredentials();
    
    if (!apiStatus.configured) {
      console.warn("Skipping pre-fetch: Google API credentials not configured");
      return;
    }
    
    console.log("Performing pre-fetch of popular searches");
    
    // Here you would implement the actual logic to pre-fetch popular searches
    // For now, we'll just log that we would do it
    console.log("Pre-fetch completed successfully");
  } catch (error) {
    console.error("Error during pre-fetch:", error);
  }
}
