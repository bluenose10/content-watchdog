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
    
    // Get the access token first
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    
    if (!accessToken) {
      console.warn("No auth token available for Supabase function call");
      // Fall back to using anon key only
    }
    
    // Function to implement timeout for the fetch call
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Function call timed out after ' + FUNCTION_TIMEOUT + 'ms'));
      }, FUNCTION_TIMEOUT);
    });
    
    // Attempt direct API call to edge function instead of using the SDK
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://phkdkwusblkngypuwgao.supabase.co';
    console.log(`Calling Supabase edge function directly at: ${supabaseUrl}/functions/v1/get-search-credentials`);
    
    // Prepare headers with proper auth
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    // Add the anon key for anonymous access
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoa2Rrd3VzYmxrbmd5cHV3Z2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NTk2NTMsImV4cCI6MjA1NjIzNTY1M30.3EqEUglSG8hAqwkKMul68LOzvnhQ6Z7M-LEXslPdVTY';
    headers['apikey'] = anonKey;
    
    // Race the direct fetch against timeout
    let response;
    try {
      const fetchPromise = fetch(`${supabaseUrl}/functions/v1/get-search-credentials`, {
        method: 'GET',
        headers: headers
      });
      
      // Fixed type error: Using Promise.race with proper typing
      response = await Promise.race([fetchPromise, timeoutPromise]);
      
      console.log("Direct edge function response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Edge function returned error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
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
      console.error("Direct edge function call failed:", error);
      
      // Fall back to SDK method as a secondary attempt
      console.log("Falling back to Supabase SDK for function invocation");
      try {
        const { data, error: sdkError } = await supabase.functions.invoke('get-search-credentials', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (sdkError || !data) {
          console.error("SDK function call failed:", sdkError);
          throw sdkError || new Error("No data returned from function call");
        }
        
        const { apiKey, cseId } = data as { apiKey?: string, cseId?: string };
        
        if (!apiKey || !cseId) {
          console.error("Missing apiKey or cseId in SDK response:", data);
          return false;
        }
        
        console.log("Successfully retrieved Google API credentials via SDK");
        
        // Store the credentials
        sessionStorage.setItem("GOOGLE_API_KEY", apiKey);
        sessionStorage.setItem("GOOGLE_CSE_ID", cseId);
        localStorage.setItem("GOOGLE_API_KEY", apiKey);
        localStorage.setItem("GOOGLE_CSE_ID", cseId);
        googleApiManager.setCredentials(apiKey, cseId);
        
        return true;
      } catch (sdkError) {
        console.error("Both direct and SDK function calls failed:", sdkError);
      }
    }
      
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
    
    // Re-load the credentials from storage to ensure we have the latest
    const sessionApiKey = sessionStorage.getItem("GOOGLE_API_KEY");
    const sessionCseId = sessionStorage.getItem("GOOGLE_CSE_ID");
    
    if (sessionApiKey && sessionCseId) {
      googleApiManager.setCredentials(sessionApiKey, sessionCseId);
      console.log("Refreshed Google API credentials from session storage");
    }
    
    // Test a sample search to ensure everything is working
    const testQuery = "test query";
    try {
      // Get the access token for authentication
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      
      // Prepare direct call to edge function with proper headers
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://phkdkwusblkngypuwgao.supabase.co';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      // Add the anon key for anonymous access
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoa2Rrd3VzYmxrbmd5cHV3Z2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NTk2NTMsImV4cCI6MjA1NjIzNTY1M30.3EqEUglSG8hAqwkKMul68LOzvnhQ6Z7M-LEXslPdVTY';
      headers['apikey'] = anonKey;
      
      console.log("Testing direct call to google-search edge function with headers:", JSON.stringify(headers));
      
      // Try direct call to google-search edge function first using fetch
      const resp = await fetch(`${supabaseUrl}/functions/v1/google-search`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ 
          query: testQuery,
          searchType: "text"
        })
      });
      
      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Direct google-search function call failed: ${resp.status} ${resp.statusText} - ${errorText}`);
      }
      
      const directResult = await resp.json();
      console.log("Google search edge function response:", directResult);
      
      // Also test through googleApiManager for comparison
      const testSearch = await googleApiManager.optimizedSearch("text", testQuery);
      console.log(`Pre-fetch test search completed with ${testSearch.results.length} results via GoogleApiManager`);
    } catch (error) {
      console.error("Error during pre-fetch test search:", error);
      
      // Try as a fallback to use the SDK method
      try {
        console.log("Attempting to use SDK for google-search function");
        const { data, error: sdkError } = await supabase.functions.invoke('google-search', {
          method: 'POST',
          body: { 
            query: testQuery,
            searchType: "text"
          }
        });
        
        if (sdkError) {
          throw sdkError;
        }
        
        console.log("Google search via SDK response:", data);
      } catch (sdkError) {
        console.error("Both direct and SDK function calls failed:", sdkError);
      }
    }
    
    console.log("Pre-fetch operations completed successfully");
  } catch (error) {
    console.error("Error during pre-fetch operations:", error);
  }
}
