
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { SearchTabs } from "./search/SearchTabs";
import { handleTextSearch, handleImageSearch, getAvailableSearchEngines } from "./search/searchService";
import { AlertCircle, Search } from "lucide-react";
import { AccessLevel, useProtectedRoute } from "@/hooks/useProtectedRoute";
import { checkRateLimit, getUserRateLimits } from "@/lib/rate-limiter";
import { Badge } from "@/components/ui/badge";

export function ContentSearchSection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessLevel } = useProtectedRoute(false);
  const [availableEngines, setAvailableEngines] = useState<string[]>([]);

  useEffect(() => {
    // Get available search engines
    setAvailableEngines(getAvailableSearchEngines());
    
    // Refresh the list every 30 seconds
    const interval = setInterval(() => {
      setAvailableEngines(getAvailableSearchEngines());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const checkUserRateLimit = (): { 
    allowed: boolean; 
    remaining: number; 
    resetTime: number; 
    retryAfter?: number;
    weeklyRemaining?: number;
    weeklyResetTime?: number;
    monthlyRemaining?: number;
    monthlyResetTime?: number;
  } => {
    // Skip rate limiting for non-production environments but maintain consistent return type
    if (import.meta.env.DEV && !import.meta.env.VITE_ENABLE_RATE_LIMIT_IN_DEV) {
      return { 
        allowed: true, 
        remaining: 1000, 
        resetTime: Date.now() + 3600000, // 1 hour from now
        weeklyRemaining: 1000,
        weeklyResetTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
        monthlyRemaining: 1000,
        monthlyResetTime: Date.now() + 30 * 24 * 60 * 60 * 1000
      };
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
    const { maxRequests, timeWindow, maxWeeklyRequests, maxMonthlyRequests } = getUserRateLimits(user?.id || null, userTier);
    
    // Check if user is within rate limits
    return checkRateLimit(
      user?.id || 'anonymous', 
      maxRequests, 
      timeWindow,
      maxWeeklyRequests,
      maxMonthlyRequests
    );
  };

  const formatTimeRemainingFromMs = (timeMs: number): string => {
    const seconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
  };

  const getLimitExceededMessage = (rateLimitResult: ReturnType<typeof checkUserRateLimit>): string => {
    const now = Date.now();
    
    // Check which limit was exceeded
    if (rateLimitResult.weeklyRemaining === 0) {
      const timeRemaining = formatTimeRemainingFromMs(
        rateLimitResult.weeklyResetTime! - now
      );
      return `You've reached your weekly search limit. New search available in ${timeRemaining}.`;
    } else if (rateLimitResult.monthlyRemaining === 0) {
      const timeRemaining = formatTimeRemainingFromMs(
        rateLimitResult.monthlyResetTime! - now
      );
      return `You've reached your monthly search limit. Next month starts in ${timeRemaining}.`;
    } else {
      // Default to minute-based rate limit message
      const retrySeconds = rateLimitResult.retryAfter || 60;
      const retryMinutes = Math.ceil(retrySeconds / 60);
      return `Rate limit exceeded. Please try again in ${retryMinutes} ${retryMinutes === 1 ? 'minute' : 'minutes'}.`;
    }
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
        const limitMessage = getLimitExceededMessage(rateLimitResult);
        
        toast({
          title: "Search limit reached",
          description: limitMessage,
          variant: "destructive",
        });
        
        setError(limitMessage);
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
        const limitMessage = getLimitExceededMessage(rateLimitResult);
        
        toast({
          title: "Search limit reached",
          description: limitMessage,
          variant: "destructive",
        });
        
        setError(limitMessage);
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
        const limitMessage = getLimitExceededMessage(rateLimitResult);
        
        toast({
          title: "Search limit reached",
          description: limitMessage,
          variant: "destructive",
        });
        
        setError(limitMessage);
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
          
          {availableEngines.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <div className="text-xs text-muted-foreground flex items-center">
                <Search className="h-3 w-3 mr-1" />
                Powered by:
              </div>
              {availableEngines.map(engine => (
                <Badge 
                  key={engine} 
                  variant="outline" 
                  className="text-xs capitalize"
                >
                  {engine}
                </Badge>
              ))}
            </div>
          )}
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
