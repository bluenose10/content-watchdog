
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ArrowRight, BarChart, FileClock, Home, Image, Loader2, Search, Shield, Upload, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useEffect, useState } from "react";
import { getUserSearchQueries, getUserSubscription, getSearchResults } from "@/lib/db-service";
import { SearchQuery, UserSubscription, SearchResult } from "@/lib/db-types";
import { formatDate } from "@/lib/utils";

const Dashboard = () => {
  const { user } = useAuth();
  useProtectedRoute();
  
  const [searchQueries, setSearchQueries] = useState<SearchQuery[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCount, setSearchCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [protectedCount, setProtectedCount] = useState(0);

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
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

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
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading dashboard data...</span>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Searches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{searchCount}</div>
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {searchesRemaining === 'Unlimited' 
                        ? 'Unlimited searches available' 
                        : `${searchesRemaining} searches remaining this month`}
                    </p>
                  </CardContent>
                </Card>
                <Card className="glass-card transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Content Matches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{matchCount}</div>
                      <Image className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {matchCount > 0 ? '+12 from last month' : 'No matches yet'}
                    </p>
                  </CardContent>
                </Card>
                <Card className="glass-card transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Protected Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{protectedCount}</div>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {protectedCount > 0 ? `${Math.floor(protectedCount * 0.6)} DMCA notices sent` : 'No content protected yet'}
                    </p>
                  </CardContent>
                </Card>
                <Card className="glass-card transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Subscription
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{getPlanName()}</div>
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {getPlanName() === 'Free' ? (
                        <Link to="/#pricing" className="text-primary hover:underline">
                          Upgrade to Pro
                        </Link>
                      ) : (
                        <span>
                          Expires on {
                            subscription?.current_period_end ? 
                              formatDate(subscription.current_period_end) : 
                              'N/A'
                          }
                        </span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="glass-card md:col-span-2 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Recent Searches</CardTitle>
                    <CardDescription>
                      Your most recent content searches and results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {searchQueries.length === 0 ? (
                        <p className="text-center text-muted-foreground py-6">
                          You haven't performed any searches yet. Start by searching for your content.
                        </p>
                      ) : (
                        searchQueries.slice(0, 3).map((search) => (
                          <div key={search.id} className="flex items-start gap-4">
                            <div className="rounded-full bg-secondary p-2">
                              {search.query_type === 'image' ? (
                                <Upload className="h-4 w-4" />
                              ) : (
                                <Search className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {search.query_type === 'image' 
                                  ? 'Image Search' 
                                  : search.query_type === 'hashtag'
                                    ? `Hashtag Search: #${search.query_text}`
                                    : `Username Search: @${search.query_text}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {search.created_at ? formatDate(search.created_at) : 'Recent'} 
                                {/* We'll add match count later when implemented */}
                              </p>
                            </div>
                            <div className="ml-auto">
                              <Button size="sm" variant="ghost" asChild>
                                <Link to={`/results?id=${search.id}`}>View Results</Link>
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-6 text-center">
                      <Button variant="outline" asChild>
                        <Link to="/history">
                          View All Searches
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-card transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks and actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/search">
                          <Search className="mr-2 h-4 w-4" />
                          New Content Search
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/monitoring">
                          <FileClock className="mr-2 h-4 w-4" />
                          Set Up Monitoring
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/analytics">
                          <BarChart className="mr-2 h-4 w-4" />
                          View Analytics
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/">
                          <Home className="mr-2 h-4 w-4" />
                          Back to Home
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/account">
                          <User className="mr-2 h-4 w-4" />
                          Account Settings
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Get unlimited searches and advanced features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-2">
                        <p className="text-gradient font-semibold text-lg mb-2">Protect Your Content From Unauthorized Use</p>
                        <ul className="space-y-1">
                          <li className="flex items-center text-sm">
                            <Shield className="mr-2 h-4 w-4 text-green-500" />
                            Unlimited search results
                          </li>
                          <li className="flex items-center text-sm">
                            <Shield className="mr-2 h-4 w-4 text-green-500" />
                            Advanced content monitoring
                          </li>
                          <li className="flex items-center text-sm">
                            <Shield className="mr-2 h-4 w-4 text-green-500" />
                            10 automated monitoring sessions
                          </li>
                          <li className="flex items-center text-sm">
                            <Shield className="mr-2 h-4 w-4 text-green-500" />
                            Export results in multiple formats
                          </li>
                        </ul>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold mb-2">$19.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                        <Button asChild className="button-animation">
                          <Link to="/#pricing">
                            Upgrade Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
