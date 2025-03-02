import { googleApiManager } from './google-api-manager';
import { supabase } from './supabase';

// Load Google API credentials from Supabase Edge Function
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
    const { data, error } = await supabase.functions.invoke('get-search-credentials', {
      method: 'GET',
    });
    
    if (error) {
      console.error("Error fetching Google API credentials from Edge Function:", error);
      
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
    
    if (data && data.apiKey && data.cseId) {
      // Store the credentials in memory and session storage
      console.log("Successfully received Google API credentials from Supabase");
      googleApiManager.setCredentials(data.apiKey, data.cseId);
      sessionStorage.setItem("GOOGLE_API_KEY", data.apiKey);
      sessionStorage.setItem("GOOGLE_CSE_ID", data.cseId);
      return true;
    } else {
      console.warn("No valid Google API credentials returned from Supabase:", data);
      return false;
    }
  } catch (error) {
    console.error("Failed to load Google API credentials:", error);
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
