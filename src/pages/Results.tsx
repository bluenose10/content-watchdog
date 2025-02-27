
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
import { ArrowLeft, ArrowRight, Download, Filter, Loader, Image } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plan, SearchResult } from "@/lib/db-types";
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";

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
      const isActive = subscription.status === 'active';
      setIsPremium(isActive);
      
      if (subscription.plans) {
        const planLimit = subscription.plans.result_limit;
        setResultLimit(planLimit === -1 ? 9999 : planLimit);
      } else {
        setResultLimit(freePlan?.result_limit || 5);
      }
    } else if (freePlan) {
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
  
  const visibleResults = searchResults ? 
    (isPremium ? searchResults : searchResults.slice(0, resultLimit)) : 
    [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          {/* Header Section with Glassmorphism */}
          <Card className="mb-8 border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Link to="/dashboard">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100/50 dark:text-blue-400 dark:hover:bg-blue-900/30">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Search Results
                    </h1>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    Results for: <span className="font-medium text-blue-600 dark:text-blue-400">
                      {searchQuery?.query_type === 'image' 
                        ? 'Image Search' 
                        : searchQuery?.query_text || '@johndoe'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:hover:border-blue-700 dark:hover:bg-blue-900/50">
                    <Filter className="mr-2 h-4 w-4 text-blue-500" />
                    Filter
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={!isPremium}
                    className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:hover:border-blue-700 dark:hover:bg-blue-900/50"
                    onClick={() => {
                      if (!isPremium) {
                        handleUpgrade();
                      } else {
                        toast({
                          title: "Downloading Results",
                          description: "Your results are being prepared for download.",
                        });
                      }
                    }}
                  >
                    <Download className="mr-2 h-4 w-4 text-blue-500" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display uploaded image if this is an image search */}
          {searchQuery?.query_type === 'image' && searchQuery.image_url && (
            <AnimatedGradientBorder 
              gradientClasses="from-blue-500 via-purple-600 to-indigo-600" 
              className="mb-8 p-0"
            >
              <Card className="border-0 shadow-none bg-transparent overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden border border-white/20 shadow-lg">
                      <img 
                        src={searchQuery.image_url}
                        alt="Uploaded image"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Uploaded Image</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        We're searching the web for visually similar images and potential unauthorized uses.
                      </p>
                      {resultsLoading ? (
                        <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400">
                          <Loader className="h-4 w-4 animate-spin" />
                          <span>Searching across platforms...</span>
                        </div>
                      ) : searchResults?.length ? (
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Found {searchResults.length} potential matches
                        </p>
                      ) : (
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                          No matches found yet
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedGradientBorder>
          )}

          {!isPremium && searchResults && searchResults.length > resultLimit && (
            <AnimatedGradientBorder 
              gradientClasses="from-purple-600 via-blue-600 to-indigo-700" 
              className="mb-8 p-0"
            >
              <Card className="mb-0 border-0 shadow-none overflow-hidden bg-transparent backdrop-blur-sm">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gradient bg-gradient-to-r from-blue-600 to-purple-600">Free Plan</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      You're viewing {resultLimit} of {searchResults?.length || 0} total results. 
                      The first {FREE_PREVIEW_COUNT} results are clickable as a preview. 
                      Upgrade to see all matches and access premium features.
                    </p>
                  </div>
                  <Button asChild className="button-animation bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md">
                    <Link to="/#pricing">Upgrade Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </AnimatedGradientBorder>
          )}

          {resultsLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900 opacity-25"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
              </div>
              <p className="text-blue-600 dark:text-blue-400 font-medium">Searching across platforms...</p>
            </div>
          ) : searchResults?.length === 0 ? (
            <Card className="text-center py-12 border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-md">
              <div className="max-w-md mx-auto px-6">
                <Image className="h-16 w-16 mx-auto mb-4 text-blue-500 opacity-50" />
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">No results found</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  We couldn't find any matches for your search. Try a different query or search type.
                </p>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm">
                  <Link to="/search">Try Another Search</Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  isFreePreview={!isPremium && index < FREE_PREVIEW_COUNT}
                  onUpgrade={handleUpgrade}
                />
              ))}
            </div>
          )}

          {!isPremium && searchResults && searchResults.length > resultLimit && (
            <div className="mt-12 text-center">
              <p className="text-gray-500 mb-4 dark:text-gray-400">
                {visibleResults.length} of {searchResults.length} results shown
              </p>
              <AnimatedGradientBorder 
                gradientClasses="from-blue-500 via-purple-600 to-indigo-600"
                containerClassName="inline-block"
              >
                <Button asChild className="bg-transparent hover:bg-white/10 border-0 shadow-none">
                  <Link to="/#pricing" className="px-6 py-2">
                    <span className="font-medium mr-2">Upgrade to See All Results</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </AnimatedGradientBorder>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Results;
