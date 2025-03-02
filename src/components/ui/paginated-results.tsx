
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SearchResultCard } from "@/components/ui/search-result-card";
import { ChevronLeft, ChevronRight, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { AccessLevel } from "@/hooks/useProtectedRoute";
import { toast } from "sonner";
import { GoogleApiSetup } from "./google-api-setup";
import { loadGoogleApiCredentials } from "@/lib/pre-fetch-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PaginatedResultsProps {
  results: any[];
  accessLevel: AccessLevel;
  itemsPerPage?: number;
  onUpgrade: () => void;
}

export function PaginatedResults({
  results,
  accessLevel,
  itemsPerPage = 10,
  onUpgrade,
}: PaginatedResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFallbackData, setIsFallbackData] = useState(false);
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(true);
  const [credentialsLoaded, setCredentialsLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // First, try to load the credentials from Supabase
  useEffect(() => {
    const attemptCredentialLoad = async () => {
      setIsLoadingCredentials(true);
      try {
        console.log("PaginatedResults: Attempting to load Google API credentials");
        
        // Clear any cached credentials before trying again
        if (retryCount > 0) {
          console.log("PaginatedResults: Clearing cached credentials for retry attempt");
          sessionStorage.removeItem("GOOGLE_API_KEY");
          sessionStorage.removeItem("GOOGLE_CSE_ID");
        }
        
        const success = await loadGoogleApiCredentials();
        setCredentialsLoaded(success);
        
        if (success) {
          console.log("PaginatedResults: Successfully loaded Google API credentials");
          // If we were successfully able to get credentials, we should
          // tell the user to refresh the page to use them
          if (isFallbackData) {
            toast.success("API credentials loaded successfully. Try searching again for real results.");
          }
        } else {
          console.warn("PaginatedResults: Failed to load Google API credentials");
        }
      } catch (error) {
        console.error("PaginatedResults: Failed to load credentials:", error);
      } finally {
        setIsLoadingCredentials(false);
      }
    };

    attemptCredentialLoad();
  }, [isFallbackData, retryCount]);

  useEffect(() => {
    // Check if we're using fallback data by looking for the fallback pattern in IDs
    if (results && results.length > 0) {
      const hasFallbackIds = results.some(result => 
        result.id?.toString().includes('fallback') || 
        result.id?.toString().includes('Sample') ||
        result.title?.includes('Sample') ||
        (result.id?.toString().startsWith('result-') && !result.id?.toString().includes('google'))
      );
      
      if (hasFallbackIds) {
        setIsFallbackData(true);
        console.log("Warning: Using fallback/sample search results");
      } else {
        setIsFallbackData(false);
        console.log("Using real API search results");
      }
    }
  }, [results]);

  const handleRefreshAfterCredentials = () => {
    setShowApiSetup(false);
    toast.success("Credentials saved! Please try your search again.");
    window.location.reload();
  };

  const handleRetryCredentialLoad = () => {
    setRetryCount(prev => prev + 1);
    toast.info("Retrying to fetch credentials from Supabase...");
  };

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No results found</p>
      </div>
    );
  }

  // Calculate pagination values
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, results.length);
  const currentResults = results.slice(startIndex, endIndex);

  // Get result limit based on access level
  const getResultLimit = () => {
    switch (accessLevel) {
      case AccessLevel.PREMIUM:
        return 20; // Pro users can see all 20 results unblurred
      case AccessLevel.BASIC:
        return 5; // Registered users can see 5 unblurred results
      case AccessLevel.ANONYMOUS:
      default:
        return 0; // Anonymous users see 0 unlocked results (all blurred)
    }
  };

  // Check if a result should be premium (unblurred)
  const isPremium = (index: number) => {
    const actualIndex = startIndex + index;
    return actualIndex < getResultLimit();
  };

  // Check if a result is a free preview for anonymous users
  const isFreePreview = (index: number) => {
    const actualIndex = startIndex + index;
    return accessLevel === AccessLevel.ANONYMOUS && actualIndex < 2;
  };

  return (
    <div className="space-y-6">
      {showApiSetup ? (
        <GoogleApiSetup onComplete={handleRefreshAfterCredentials} />
      ) : isLoadingCredentials ? (
        <Alert className="mb-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin mr-2" />
          <AlertTitle>Checking for Google API credentials</AlertTitle>
          <AlertDescription>
            We're attempting to load the Google Search API credentials from Supabase...
          </AlertDescription>
        </Alert>
      ) : isFallbackData && !credentialsLoaded ? (
        <Alert variant="warning" className="mb-4 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
          <AlertTitle>Using sample results</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              There was an issue connecting to the Google search service. 
              We attempted to load the Google API credentials from Supabase, but were unable to.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800 dark:hover:bg-yellow-900/50"
                onClick={handleRetryCredentialLoad}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry Loading Credentials
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800 dark:hover:bg-yellow-900/50"
                onClick={() => setShowApiSetup(true)}
              >
                Manual API Setup
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : isFallbackData && credentialsLoaded ? (
        <Alert className="mb-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
          <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
          <AlertTitle>API credentials loaded successfully</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              Your API credentials were loaded, but you're still seeing sample results.
              Try searching again to see real results from Google.
            </p>
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900/50 mt-2"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh Page
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}
      
      <div className="flex flex-col gap-3">
        {currentResults.map((result, index) => (
          <SearchResultCard
            key={result.id || `result-${startIndex + index}`}
            result={{
              id: result.id || `result-${startIndex + index}`,
              title: result.title,
              url: result.url,
              thumbnail: result.thumbnail,
              source: result.source,
              matchLevel: result.match_level,
              date: result.found_at,
              type: result.type,
              snippet: result.snippet,
            }}
            isPremium={isPremium(index)}
            isFreePreview={isFreePreview(index)}
            onUpgrade={onUpgrade}
          />
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm text-muted-foreground px-2">
            Page {currentPage} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
