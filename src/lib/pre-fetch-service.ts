
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Timeout for Supabase function calls (in milliseconds)
const FUNCTION_TIMEOUT = 8000;

/**
 * Load Google API credentials from Supabase Edge Function
 * @returns Promise<boolean> - True if credentials were successfully loaded
 */
export async function loadGoogleApiCredentials(): Promise<boolean> {
  console.log("Attempting to load Google API credentials from Supabase");
  
  try {
    // Function to implement timeout for the Supabase function call
    const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Function call timed out after ' + FUNCTION_TIMEOUT + 'ms'));
      }, FUNCTION_TIMEOUT);
    });
    
    // Attempt to get credentials from the Supabase edge function
    const functionPromise = supabase.functions.invoke('get-search-credentials', {
      method: 'GET'
    });
    
    // Race the function call against the timeout
    const { data, error } = await Promise.race([
      functionPromise,
      timeoutPromise
    ]);
    
    if (error) {
      console.error("Error fetching Google API credentials:", error);
      
      // Try to fall back to environment variables
      const envApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const envCseId = import.meta.env.VITE_GOOGLE_CSE_ID;
      
      if (envApiKey && envCseId) {
        console.log("Using environment variables for Google API credentials");
        sessionStorage.setItem("GOOGLE_API_KEY", envApiKey);
        sessionStorage.setItem("GOOGLE_CSE_ID", envCseId);
        return true;
      }
      
      // Try to fall back to localStorage as last resort
      const localApiKey = localStorage.getItem("GOOGLE_API_KEY");
      const localCseId = localStorage.getItem("GOOGLE_CSE_ID");
      
      if (localApiKey && localCseId) {
        console.log("Using locally stored Google API credentials");
        sessionStorage.setItem("GOOGLE_API_KEY", localApiKey);
        sessionStorage.setItem("GOOGLE_CSE_ID", localCseId);
        return true;
      }
      
      return false;
    }
    
    // Make sure data is valid
    if (!data || typeof data !== 'object') {
      console.error("Invalid response from get-search-credentials:", data);
      return false;
    }
    
    const { apiKey, cseId } = data as { apiKey?: string, cseId?: string };
    
    if (!apiKey || !cseId) {
      console.error("Missing apiKey or cseId in response:", data);
      return false;
    }
    
    console.log("Successfully retrieved Google API credentials from Supabase");
    
    // Store the credentials in session storage for immediate use
    sessionStorage.setItem("GOOGLE_API_KEY", apiKey);
    sessionStorage.setItem("GOOGLE_CSE_ID", cseId);
    
    // Also store in localStorage for persistence
    localStorage.setItem("GOOGLE_API_KEY", apiKey);
    localStorage.setItem("GOOGLE_CSE_ID", cseId);
    
    return true;
  } catch (error) {
    console.error("Failed to load Google API credentials:", error);
    return false;
  }
}

/**
 * Schedule pre-fetching of data at regular intervals
 * @param intervalMinutes Interval in minutes to perform the pre-fetch
 * @returns Cleanup function to cancel the interval
 */
export function schedulePreFetching(intervalMinutes: number = 30): () => void {
  console.log(`Scheduling pre-fetching every ${intervalMinutes} minutes`);
  
  // Initial pre-fetch
  setTimeout(() => {
    performPreFetch();
  }, 5000); // Short delay for initial pre-fetch
  
  // Schedule recurring pre-fetch
  const intervalId = setInterval(() => {
    performPreFetch();
  }, intervalMinutes * 60 * 1000);
  
  // Return cleanup function
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}

/**
 * Perform pre-fetch operations
 */
async function performPreFetch(): Promise<void> {
  console.log("Performing pre-fetch operations");
  
  try {
    // First, ensure API credentials are loaded
    const credentialsLoaded = await loadGoogleApiCredentials();
    
    if (!credentialsLoaded) {
      console.warn("Failed to load Google API credentials during pre-fetch, skipping operations");
      return;
    }
    
    // Add your pre-fetch operations here
    console.log("Pre-fetch operations completed successfully");
  } catch (error) {
    console.error("Error during pre-fetch operations:", error);
  }
}
