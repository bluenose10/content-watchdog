
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { googleApiManager } from '@/lib/google-api-manager';

// Timeout for Supabase function calls (in milliseconds)
const FUNCTION_TIMEOUT = 15000; // Increased timeout for more reliability

/**
 * Load Google API credentials from Supabase Edge Function
 * @returns Promise<boolean> - True if credentials were successfully loaded
 */
export async function loadGoogleApiCredentials(): Promise<boolean> {
  console.log("Attempting to load Google API credentials from Supabase");
  
  try {
    // Check if we already have valid credentials in sessionStorage
    const sessionApiKey = sessionStorage.getItem("GOOGLE_API_KEY");
    const sessionCseId = sessionStorage.getItem("GOOGLE_CSE_ID");
    
    if (sessionApiKey && sessionCseId) {
      console.log("Using Google API credentials from session storage");
      googleApiManager.setCredentials(sessionApiKey, sessionCseId);
      return true;
    }
    
    // Function to implement timeout for the Supabase function call
    const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Function call timed out after ' + FUNCTION_TIMEOUT + 'ms'));
      }, FUNCTION_TIMEOUT);
    });
    
    // Attempt to get credentials from the Supabase edge function with explicit headers
    console.log("Calling Supabase function to get credentials");
    const functionPromise = supabase.functions.invoke('get-search-credentials', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`
      }
    });
    
    // Race the function call against the timeout
    const { data, error } = await Promise.race([
      functionPromise,
      timeoutPromise
    ]);
    
    if (error) {
      console.error("Error fetching Google API credentials from Supabase:", error);
      
      // Try to fall back to environment variables
      const envApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const envCseId = import.meta.env.VITE_GOOGLE_CSE_ID;
      
      if (envApiKey && envCseId) {
        console.log("Using environment variables for Google API credentials");
        sessionStorage.setItem("GOOGLE_API_KEY", envApiKey);
        sessionStorage.setItem("GOOGLE_CSE_ID", envCseId);
        googleApiManager.setCredentials(envApiKey, envCseId);
        return true;
      }
      
      // Try to fall back to localStorage as last resort
      const localApiKey = localStorage.getItem("GOOGLE_API_KEY");
      const localCseId = localStorage.getItem("GOOGLE_CSE_ID");
      
      if (localApiKey && localCseId) {
        console.log("Using locally stored Google API credentials");
        sessionStorage.setItem("GOOGLE_API_KEY", localApiKey);
        sessionStorage.setItem("GOOGLE_CSE_ID", localCseId);
        googleApiManager.setCredentials(localApiKey, localCseId);
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
    
    // Update the GoogleApiManager with the new credentials
    googleApiManager.setCredentials(apiKey, cseId);
    
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
 * Manually start the pre-fetch process
 * @returns Promise that resolves when pre-fetch is complete
 */
export async function startPreFetching(): Promise<void> {
  console.log("Manually starting pre-fetch operations");
  return performPreFetch();
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
    
    // Instead of calling refreshCredentials which doesn't exist, 
    // we'll re-load the credentials from storage to ensure we have the latest
    const sessionApiKey = sessionStorage.getItem("GOOGLE_API_KEY");
    const sessionCseId = sessionStorage.getItem("GOOGLE_CSE_ID");
    
    if (sessionApiKey && sessionCseId) {
      googleApiManager.setCredentials(sessionApiKey, sessionCseId);
      console.log("Refreshed Google API credentials from session storage");
    }
    
    // Test a sample search to ensure everything is working
    const testQuery = "test query";
    try {
      // Try direct call to google-search edge function first
      console.log("Testing direct call to google-search edge function");
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://phkdkwusblkngypuwgao.supabase.co';
      const resp = await fetch(`${supabaseUrl}/functions/v1/google-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ 
          query: testQuery,
          searchType: "text"
        })
      });
      
      if (!resp.ok) {
        throw new Error(`Direct google-search function call failed: ${resp.status} ${resp.statusText}`);
      }
      
      const directResult = await resp.json();
      console.log("Google search edge function response:", directResult);
      
      // Also test through googleApiManager for comparison
      const testSearch = await googleApiManager.optimizedSearch("text", testQuery);
      console.log(`Pre-fetch test search completed with ${testSearch.results.length} results via GoogleApiManager`);
    } catch (error) {
      console.error("Error during pre-fetch test search:", error);
    }
    
    console.log("Pre-fetch operations completed successfully");
  } catch (error) {
    console.error("Error during pre-fetch operations:", error);
  }
}
