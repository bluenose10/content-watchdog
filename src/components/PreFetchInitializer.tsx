
import { useEffect } from 'react';
import { loadGoogleApiCredentials, schedulePreFetching } from '@/lib/pre-fetch-service';
import { useToast } from '@/hooks/use-toast';
import { googleApiManager } from '@/lib/google-api-manager';

export function PreFetchInitializer() {
  const { toast } = useToast();

  useEffect(() => {
    let cleanupFunction: (() => void) | undefined;
    
    const initializeServices = async () => {
      console.log("Initializing pre-fetch and API services...");
      
      try {
        // Try to load the API credentials
        const credentialsLoaded = await loadGoogleApiCredentials();
        
        if (!credentialsLoaded) {
          console.warn("Failed to load Google API credentials during initialization");
          
          // Check Google API configuration status
          const apiStatus = googleApiManager.checkApiCredentials();
          
          if (!apiStatus.configured) {
            toast({
              title: "API Configuration Issue",
              description: "Google API credentials are not configured properly. Search results may be limited.",
              variant: "destructive",
              duration: 6000,
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
  }, [toast]);

  // This component doesn't render anything
  return null;
}

export default PreFetchInitializer;
