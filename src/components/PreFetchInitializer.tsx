
import { useEffect, useState } from 'react';
import { loadGoogleApiCredentials, schedulePreFetching, startPreFetching } from '@/lib/pre-fetch-service';
import { useToast } from '@/hooks/use-toast';
import { googleApiManager } from '@/lib/google-api-manager';
import { testSupabaseConnection } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

export function PreFetchInitializer() {
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const [credentialsChecked, setCredentialsChecked] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  useEffect(() => {
    let cleanupFunction: (() => void) | undefined;
    
    const initializeServices = async () => {
      console.log("Initializing pre-fetch and API services...");
      
      try {
        // Test Supabase connection first
        const isConnected = await testSupabaseConnection();
        setSupabaseConnected(isConnected);
        
        if (!isConnected) {
          console.error("Unable to connect to Supabase, retrying API initialization");
          
          if (retryCount < 3) {
            setTimeout(() => setRetryCount(prev => prev + 1), 3000);
            return;
          } else {
            // Log auth session details for debugging
            const { data: sessionData } = await supabase.auth.getSession();
            console.log("Auth session for debugging:", sessionData ? "Session exists" : "No session", 
                        sessionData?.session ? `Token present of length: ${sessionData.session.access_token.length}` : "No token");
            
            toast({
              title: "Supabase Connection Issue",
              description: "Could not connect to Supabase Edge Functions. Please check your network and authentication status.",
              variant: "destructive",
              duration: 6000,
            });
          }
        } else {
          console.log("Supabase connection successful, proceeding with API initialization");
        }
        
        // Force clear any potentially corrupt credentials (only on retry)
        if (retryCount > 0) {
          console.log("Retry attempt, clearing previous credentials");
          sessionStorage.removeItem("GOOGLE_API_KEY");
          sessionStorage.removeItem("GOOGLE_CSE_ID");
          localStorage.removeItem("GOOGLE_API_KEY");
          localStorage.removeItem("GOOGLE_CSE_ID");
        }
        
        // Try to load the API credentials
        console.log("Attempting to load Google API credentials");
        const credentialsLoaded = await loadGoogleApiCredentials();
        setCredentialsChecked(true);
        
        if (!credentialsLoaded) {
          console.warn("Failed to load Google API credentials during initialization");
          
          // Check Google API configuration status
          const apiStatus = googleApiManager.checkApiCredentials();
          
          if (!apiStatus.configured) {
            toast({
              title: "API Configuration Issue",
              description: "Google API credentials could not be retrieved from Supabase. Search results may be limited.",
              variant: "destructive",
              duration: 6000,
            });
          }
        } else {
          // If credentials loaded successfully, try to start pre-fetching
          console.log("Credentials loaded successfully, starting pre-fetch");
          await startPreFetching();
          console.log("Initial pre-fetch completed");
          
          // Confirm API is working by checking the manager
          const apiStatus = googleApiManager.checkApiCredentials();
          if (apiStatus.configured) {
            console.log("Google API credentials configured successfully:", apiStatus.source);
            
            toast({
              title: "Search Service Ready",
              description: "Google Search API connected successfully.",
              duration: 3000,
            });
          }
        }
        
        // Schedule pre-fetching regardless of API status
        // It will skip actual API calls if credentials aren't available
        cleanupFunction = schedulePreFetching(60); // Every 60 minutes
      } catch (error) {
        console.error("Error during API initialization:", error);
        toast({
          title: "Search Service Error",
          description: "There was a problem initializing the search service. Some features may be limited.",
          variant: "destructive",
          duration: 6000,
        });
      }
    };
    
    // Call the async function
    initializeServices();
    
    // Return cleanup function
    return () => {
      if (cleanupFunction && typeof cleanupFunction === 'function') {
        cleanupFunction();
      }
    };
  }, [toast, retryCount]);

  // This component doesn't render anything
  return null;
}

export default PreFetchInitializer;
