
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Home, Image, Search, Shield, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useEffect, useState } from "react";
import { getUserSearchQueries, getUserSubscription, getSearchResults } from "@/lib/db-service";
import { SearchQuery, UserSubscription, SearchResult } from "@/lib/db-types";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentSearches } from "@/components/dashboard/RecentSearches";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpgradeCard } from "@/components/dashboard/UpgradeCard";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { SearchResultCard } from "@/components/ui/search-result-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user } = useAuth();
  useProtectedRoute();
  
  const [searchQueries, setSearchQueries] = useState<SearchQuery[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCount, setSearchCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [protectedCount, setProtectedCount] = useState(0);
  const [selectedSearchId, setSelectedSearchId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  const firstName = user?.user_metadata?.name 
    ? user.user_metadata.name.split(' ')[0] 
    : user?.email 
      ? user.email.split('@')[0] 
      : '';

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        // Fetch user's search queries
        const searches = await getUserSearchQueries(user.id);
        setSearchQueries(searches || []);
        setSearchCount(searches?.length || 0);
        
        // Fetch user's subscription
        const userSubscription = await getUserSubscription(user.id);
        setSubscription(userSubscription);
        
        // Calculate match count
        let totalMatches = 0;
        for (const search of searches?.slice(0, 5) || []) {
          if (search.id) {
            const results = await getSearchResults(search.id);
            totalMatches += results?.length || 0;
          }
        }
        
        setMatchCount(totalMatches);
        
        // For now, just set a placeholder for protected count
        setProtectedCount(Math.floor(totalMatches * 0.3));

        // Select the most recent search if available
        if (searches && searches.length > 0) {
          setSelectedSearchId(searches[0].id);
          
          // Load results for this search
          if (searches[0].id) {
            fetchSearchResults(searches[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  const fetchSearchResults = async (searchId: string) => {
    if (!searchId) return;
    
    try {
      setIsLoadingResults(true);
      const results = await getSearchResults(searchId);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handleSearchSelect = (searchId: string) => {
    setSelectedSearchId(searchId);
    fetchSearchResults(searchId);
  };

  // Calculate remaining searches
  const getPlanLimit = () => {
    if (!subscription || !subscription.plans) return 5; // Default to free plan limit
    return subscription.plans.search_limit === -1 ? 'Unlimited' : subscription.plans.search_limit;
  };
  
  const getSearchesRemaining = () => {
    const limit = getPlanLimit();
    if (limit === 'Unlimited') return 'Unlimited';
    return Math.max(0, (limit as number) - searchCount);
  };

  const searchesRemaining = getSearchesRemaining();

  // Get plan display name
  const getPlanName = () => {
    if (!subscription || !subscription.plans) return 'Free';
    return subscription.plans.name;
  };

  // Determine how many results to show based on subscription
  const getVisibleResultsCount = () => {
    const isPremium = getPlanName() !== 'Free';
    if (isPremium) return searchResults.length; // Show all for premium users
    return Math.min(3, searchResults.length); // Show only 3 for free users
  };

  const visibleResultsCount = getVisibleResultsCount();
  const isPremiumUser = getPlanName() !== 'Free';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-gradient font-medium">
                Welcome back, {firstName}! Monitor and protect your content.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button asChild>
                <Link to="/search">
                  <Search className="mr-2 h-4 w-4" />
                  New Search
                </Link>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard 
                  title="Total Searches"
                  value={searchCount}
                  icon={Search}
                  description={
                    searchesRemaining === 'Unlimited' 
                      ? 'Unlimited searches available' 
                      : `${searchesRemaining} searches remaining this month`
                  }
                />
                <StatsCard 
                  title="Content Matches"
                  value={matchCount}
                  icon={Image}
                  description={
                    matchCount > 0 ? '+12 from last month' : 'No matches yet'
                  }
                />
                <StatsCard 
                  title="Protected Content"
                  value={protectedCount}
                  icon={Shield}
                  description={
                    protectedCount > 0 
                      ? `${Math.floor(protectedCount * 0.6)} DMCA notices sent` 
                      : 'No content protected yet'
                  }
                />
                <StatsCard 
                  title="Subscription"
                  value={getPlanName()}
                  icon={User}
                  description={
                    getPlanName() === 'Free' 
                      ? 'Upgrade to Pro' 
                      : `Expires on ${subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}`
                  }
                />
              </div>

              {/* Search Results Section */}
              {selectedSearchId && (
                <Card className="mt-6 w-full">
                  <CardHeader>
                    <CardTitle>Search Results</CardTitle>
                    <CardDescription>
                      {searchResults.length > 0
                        ? `Showing ${visibleResultsCount} of ${searchResults.length} results`
                        : "No results found"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingResults ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {searchResults.slice(0, visibleResultsCount).map((result, index) => (
                            <SearchResultCard
                              key={result.id || index}
                              result={{
                                id: result.id || `result-${index}`,
                                title: result.title,
                                url: result.url,
                                thumbnail: result.thumbnail,
                                source: result.source,
                                matchLevel: result.match_level,
                                date: result.found_at,
                              }}
                              isPremium={isPremiumUser}
                              isFreePreview={!isPremiumUser && index < 3}
                              onUpgrade={() => {
                                // Handle upgrade logic
                                window.scrollTo(0, document.body.scrollHeight);
                              }}
                            />
                          ))}
                        </div>
                        
                        {!isPremiumUser && searchResults.length > 3 && (
                          <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground mb-3">
                              Upgrade to view all {searchResults.length} results
                            </p>
                            <Button variant="outline" className="mx-auto">
                              <Link to="#upgrade">Upgrade Now</Link>
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No results found for this search</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
                <RecentSearches 
                  searchQueries={searchQueries} 
                  onSelectSearch={handleSearchSelect}
                  selectedSearchId={selectedSearchId}
                />
                <QuickActions />
              </div>

              <div id="upgrade" className="mt-6">
                <UpgradeCard />
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
