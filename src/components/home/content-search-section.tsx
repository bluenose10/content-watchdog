
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { SearchTabs } from "./search/SearchTabs";
import { handleTextSearch, handleImageSearch } from "./search/searchService";
import { AlertCircle } from "lucide-react";
import { AccessLevel, useProtectedRoute } from "@/hooks/useProtectedRoute";
import { checkRateLimit, getUserRateLimits } from "@/lib/rate-limiter";

export function ContentSearchSection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessLevel } = useProtectedRoute(false);

  const checkUserRateLimit = () => {
    // Skip rate limiting for non-production environments
    if (import.meta.env.DEV && !import.meta.env.VITE_ENABLE_RATE_LIMIT_IN_DEV) {
      return { allowed: true };
    }
    
    // Determine user tier from accessLevel
    let userTier: 'anonymous' | 'basic' | 'premium' | 'admin' = 'anonymous';
    
    if (!user) {
      userTier = 'anonymous';
    } else if (accessLevel === AccessLevel.ADMIN) {
      userTier = 'admin';
    } else if (accessLevel === AccessLevel.PREMIUM) {
      userTier = 'premium';
    } else {
      userTier = 'basic';
    }
    
    // Get appropriate rate limits for user tier
    const { maxRequests, timeWindow } = getUserRateLimits(user?.id || null, userTier);
    
    // Check if user is within rate limits
    return checkRateLimit(user?.id || 'anonymous', maxRequests, timeWindow);
  };

  const handleNameSearch = async (query: string, params?: any) => {
    // If anonymous user, redirect to signup
    if (!user) {
      navigate('/signup');
      return;
    }

    try {
      // Check rate limits before proceeding
      const rateLimitResult = checkUserRateLimit();
      if (!rateLimitResult.allowed) {
        const retrySeconds = rateLimitResult.retryAfter || 60;
        const retryMinutes = Math.ceil(retrySeconds / 60);
        
        toast({
          title: "Rate limit exceeded",
          description: `You've reached your search limit. Please try again in ${retryMinutes} ${retryMinutes === 1 ? 'minute' : 'minutes'}.`,
          variant: "destructive",
        });
        
        setError(`Rate limit exceeded. Please try again in ${retryMinutes} ${retryMinutes === 1 ? 'minute' : 'minutes'}.`);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      console.log("Name search with query:", query, "and params:", params);
      const searchId = await handleTextSearch(query, "name", user, params);
      
      // Use the searchId directly in the URL for results
      navigate(`/results?id=${searchId}`);
    } catch (error) {
      console.error("Name search error:", error);
      
      // Set the error message for display in the UI
      setError("There was a problem with your search. Please try again.");
      
      // Show toast notification
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "There was a problem with your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHashtagSearch = async (query: string, params?: any) => {
    // If anonymous user, redirect to signup
    if (!user) {
      navigate('/signup');
      return;
    }

    try {
      // Check rate limits before proceeding
      const rateLimitResult = checkUserRateLimit();
      if (!rateLimitResult.allowed) {
        const retrySeconds = rateLimitResult.retryAfter || 60;
        const retryMinutes = Math.ceil(retrySeconds / 60);
        
        toast({
          title: "Rate limit exceeded",
          description: `You've reached your search limit. Please try again in ${retryMinutes} ${retryMinutes === 1 ? 'minute' : 'minutes'}.`,
          variant: "destructive",
        });
        
        setError(`Rate limit exceeded. Please try again in ${retryMinutes} ${retryMinutes === 1 ? 'minute' : 'minutes'}.`);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      console.log("Hashtag search with query:", query, "and params:", params);
      const searchId = await handleTextSearch(query, "hashtag", user, params);
      
      // Use the searchId directly in the URL for results
      navigate(`/results?id=${searchId}`);
    } catch (error) {
      console.error("Hashtag search error:", error);
      
      // Set the error message for display in the UI
      setError("There was a problem with your hashtag search. Please try again.");
      
      // Show toast notification
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "There was a problem with your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSearchSubmit = async (file: File, params?: any) => {
    // If anonymous user, redirect to signup
    if (!user) {
      navigate('/signup');
      return;
    }

    try {
      // Check rate limits before proceeding
      const rateLimitResult = checkUserRateLimit();
      if (!rateLimitResult.allowed) {
        const retrySeconds = rateLimitResult.retryAfter || 60;
        const retryMinutes = Math.ceil(retrySeconds / 60);
        
        toast({
          title: "Rate limit exceeded",
          description: `You've reached your search limit. Please try again in ${retryMinutes} ${retryMinutes === 1 ? 'minute' : 'minutes'}.`,
          variant: "destructive",
        });
        
        setError(`Rate limit exceeded. Please try again in ${retryMinutes} ${retryMinutes === 1 ? 'minute' : 'minutes'}.`);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      console.log("Image search with file:", file.name, "and params:", params);
      
      const searchId = await handleImageSearch(file, user, params);
      
      // Use the searchId directly in the URL for results
      navigate(`/results?id=${searchId}`);
    } catch (error) {
      console.error("Image search error:", error);
      
      // Set the error message for display in the UI
      setError("There was a problem with your image search. Please try again.");
      
      // Show toast notification
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "There was a problem with your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="content-search-section" className="h-full">
      <div className="container px-4 md:px-6 h-full">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Content Search</h2>
          <p className="text-sm text-muted-foreground">
            Find and protect your content
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="glass-card">
          <CardContent className="p-4 sm:p-6">
            <SearchTabs
              onNameSearch={handleNameSearch}
              onHashtagSearch={handleHashtagSearch}
              onImageSearch={handleImageSearchSubmit}
              isLoading={isLoading}
              isAuthenticated={!!user} // Pass actual authentication state
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
