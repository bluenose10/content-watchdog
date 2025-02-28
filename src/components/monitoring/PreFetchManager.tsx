
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { schedulePreFetching, startPreFetching } from '@/lib/pre-fetch-service';
import { Progress } from "@/components/ui/progress";
import { useToast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CogIcon, PlayIcon, PauseIcon } from 'lucide-react';

export function PreFetchManager() {
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [isManualFetching, setIsManualFetching] = useState<boolean>(false);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check if pre-fetching was previously enabled
    const wasPreviouslyEnabled = localStorage.getItem('prefetch_enabled') === 'true';
    
    if (wasPreviouslyEnabled) {
      enableScheduledPreFetch();
    }
    
    return () => {
      // Cleanup
      if (isScheduled) {
        cleanupPreFetch();
      }
    };
  }, []);

  const enableScheduledPreFetch = () => {
    // Set up scheduled pre-fetching
    const cleanup = schedulePreFetching(60); // Every 60 minutes
    
    // Store the cleanup function
    (window as any).preFetchCleanup = cleanup;
    
    // Update state
    setIsScheduled(true);
    localStorage.setItem('prefetch_enabled', 'true');
    
    toast({
      title: "Pre-fetching Enabled",
      description: "Search results will be pre-cached during off-peak hours",
    });
  };

  const cleanupPreFetch = () => {
    // Run the cleanup function if it exists
    if ((window as any).preFetchCleanup) {
      (window as any).preFetchCleanup();
      (window as any).preFetchCleanup = null;
    }
    
    // Update state
    setIsScheduled(false);
    localStorage.setItem('prefetch_enabled', 'false');
  };

  const toggleScheduledPreFetch = () => {
    if (isScheduled) {
      cleanupPreFetch();
      
      toast({
        title: "Pre-fetching Disabled",
        description: "Automatic pre-caching has been turned off",
      });
    } else {
      enableScheduledPreFetch();
    }
  };

  const runManualPreFetch = async () => {
    setIsManualFetching(true);
    setProgress(10);
    
    try {
      // Show progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);
      
      // Run the pre-fetch
      await startPreFetching();
      
      // Cleanup and finalize
      clearInterval(progressInterval);
      setProgress(100);
      setLastFetchTime(new Date());
      
      toast({
        title: "Pre-fetch Complete",
        description: "Common search results have been cached",
      });
    } catch (error) {
      console.error("Pre-fetch error:", error);
      
      toast({
        title: "Pre-fetch Failed",
        description: "There was an error pre-caching search results",
        variant: "destructive",
      });
    } finally {
      // Reset after a short delay
      setTimeout(() => {
        setIsManualFetching(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Pre-Fetching</CardTitle>
        <CardDescription>Cache common search results during off-peak hours</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Automatic Pre-fetching</h4>
              <p className="text-sm text-muted-foreground">
                Schedule automatic pre-fetching of popular searches
              </p>
            </div>
            <Switch 
              checked={isScheduled} 
              onCheckedChange={toggleScheduledPreFetch}
              aria-label="Toggle automatic pre-fetching"
            />
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Manual Pre-fetch</h4>
            
            {isManualFetching && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full h-2" />
                <p className="text-xs text-muted-foreground">Pre-fetching in progress...</p>
              </div>
            )}
            
            {lastFetchTime && !isManualFetching && (
              <p className="text-sm text-muted-foreground">
                Last pre-fetch: {lastFetchTime.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={runManualPreFetch} 
          disabled={isManualFetching}
          className="w-full"
        >
          {isManualFetching ? (
            <>
              <CogIcon className="h-4 w-4 mr-2 animate-spin" />
              Pre-fetching...
            </>
          ) : (
            <>
              <PlayIcon className="h-4 w-4 mr-2" />
              Run Pre-fetch Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
