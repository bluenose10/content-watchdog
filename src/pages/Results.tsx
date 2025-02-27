
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SearchResultCard } from "@/components/ui/search-result-card";
import { MOCK_SEARCH_RESULTS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { getSearchQueryById, getSearchResults, getUserSubscription, getFreePlan } from "@/lib/db-service";
import { useAuth } from "@/context/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { ArrowLeft, ArrowRight, Download, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plan, SearchResult } from "@/lib/db-types";

const Results = () => {
  const { toast } = useToast();
  const { user } = useProtectedRoute();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchId = searchParams.get('id');
  const [isPremium, setIsPremium] = useState(false);
  const [resultLimit, setResultLimit] = useState(5); // Default limit for free users
  const FREE_PREVIEW_COUNT = 2; // Number of results to show as free preview
  
  // Fetch user subscription
  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: () => user ? getUserSubscription(user.id) : null,
    enabled: !!user,
  });

  // Fetch free plan as fallback
  const { data: freePlan } = useQuery({
    queryKey: ['freePlan'],
    queryFn: () => getFreePlan(),
    enabled: !subscription,
  });

  // Fetch search query
  const { data: searchQuery, isLoading: queryLoading } = useQuery({
    queryKey: ['search', searchId],
    queryFn: () => searchId ? getSearchQueryById(searchId) : null,
    enabled: !!searchId,
  });

  // Fetch search results
  const { data: searchResults, isLoading: resultsLoading } = useQuery({
    queryKey: ['results', searchId],
    queryFn: () => searchId ? getSearchResults(searchId) : null,
    enabled: !!searchId,
    // If we don't have real results yet, use mock data for demo
    placeholderData: MOCK_SEARCH_RESULTS,
  });

  // Determine user's plan limits and premium status
  useEffect(() => {
    if (subscription) {
      // If subscription exists and is active, use the plan's result limit
      const isActive = subscription.status === 'active';
      setIsPremium(isActive);
      
      // If plans data is available, set result limit
      if (subscription.plans) {
        const planLimit = subscription.plans.result_limit;
        // -1 means unlimited
        setResultLimit(planLimit === -1 ? 9999 : planLimit);
      } else {
        // Default to free plan limit if plan details not available
        setResultLimit(freePlan?.result_limit || 5);
      }
    } else if (freePlan) {
      // If no subscription, use free plan limit
      setResultLimit(freePlan.result_limit);
      setIsPremium(false);
    }
  }, [subscription, freePlan]);
  
  const handleUpgrade = () => {
    toast({
      title: "Upgrade Required",
      description: "Please upgrade to a premium plan to see all results.",
    });
  };
  
  // For non-premium users, show only up to the result limit, but make the first FREE_PREVIEW_COUNT clickable
  const visibleResults = searchResults ? 
    (isPremium ? searchResults : searchResults.slice(0, resultLimit)) : 
    [];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
              </div>
              <p className="text-muted-foreground">
                Results for: <span className="font-medium">
                  {searchQuery?.query_type === 'image' 
                    ? 'Image Search' 
                    : searchQuery?.query_text || '@johndoe'}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" disabled={!isPremium} onClick={() => {
                if (!isPremium) {
                  handleUpgrade();
                } else {
                  toast({
                    title: "Downloading Results",
                    description: "Your results are being prepared for download.",
                  });
                }
              }}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {!isPremium && searchResults && searchResults.length > resultLimit && (
            <Card className="mb-8 bg-secondary/30 border-primary/20">
              <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-1">Free Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    You're viewing {resultLimit} of {searchResults?.length || 0} total results. 
                    The first {FREE_PREVIEW_COUNT} results are clickable as a preview. 
                    Upgrade to see all matches and access premium features.
                  </p>
                </div>
                <Button asChild className="button-animation">
                  <Link to="/#pricing">Upgrade Now</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {resultsLoading ? (
            <div className="text-center py-12">
              <p>Loading search results...</p>
            </div>
          ) : searchResults?.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No results found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find any matches for your search. Try a different query or search type.
              </p>
              <Button asChild>
                <Link to="/">Try Another Search</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleResults.map((result: SearchResult, index: number) => (
                <SearchResultCard
                  key={result.id}
                  result={{
                    id: result.id || '',
                    title: result.title,
                    url: result.url,
                    thumbnail: result.thumbnail,
                    source: result.source,
                    matchLevel: result.match_level,
                    date: result.found_at
                  }}
                  isPremium={isPremium}
                  // For non-premium users, the first FREE_PREVIEW_COUNT results are clickable previews
                  isFreePreview={!isPremium && index < FREE_PREVIEW_COUNT}
                  onUpgrade={handleUpgrade}
                />
              ))}
            </div>
          )}

          {!isPremium && searchResults && searchResults.length > resultLimit && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                {visibleResults.length} of {searchResults.length} results shown
              </p>
              <Button asChild className="button-animation">
                <Link to="/#pricing">
                  Upgrade to See All Results
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
