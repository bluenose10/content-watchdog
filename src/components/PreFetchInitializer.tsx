
import { useEffect } from 'react';
import { schedulePreFetching } from '@/lib/pre-fetch-service';

export function PreFetchInitializer() {
  useEffect(() => {
    // Check if pre-fetching was previously enabled
    const isPrefetchEnabled = localStorage.getItem('prefetch_enabled') === 'true';
    
    if (isPrefetchEnabled) {
      console.log('[PreFetchInitializer] Initializing scheduled pre-fetching');
      const cleanup = schedulePreFetching(60); // Every 60 minutes
      
      // Store cleanup function
      (window as any).preFetchCleanup = cleanup;
    } else {
      console.log('[PreFetchInitializer] Pre-fetching is disabled');
    }
    
    return () => {
      // Cleanup when component unmounts
      if ((window as any).preFetchCleanup) {
        console.log('[PreFetchInitializer] Cleaning up pre-fetch scheduler');
        (window as any).preFetchCleanup();
      }
    };
  }, []);
  
  // This component doesn't render anything
  return null;
}
