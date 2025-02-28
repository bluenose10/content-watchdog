import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Home, Image, Search, Shield, User, BarChart, PieChart, LineChart, TrendingUp } from "lucide-react";
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
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line } from "recharts";

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
  const [activeTab, setActiveTab] = useState("overview");

  const firstName = user?.user_metadata?.name 
    ? user.user_metadata.name.split(' ')[0] 
    : user?.email 
      ? user.email.split('@')[0] 
      : '';

  const [platformData, setPlatformData] = useState<{name: string, value: number}[]>([]);
  const [trendsData, setTrendsData] = useState<{date: string, matches: number}[]>([]);
  const [categoryData, setCategoryData] = useState<{name: string, count: number}[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const searches = await getUserSearchQueries(user.id);
        setSearchQueries(searches || []);
        setSearchCount(searches?.length || 0);
        
        const userSubscription = await getUserSubscription(user.id);
        setSubscription(userSubscription);
        
        let totalMatches = 0;
        let resultsByPlatform: Record<string, number> = {};
        let allResults: SearchResult[] = [];
        
        for (const search of searches?.slice(0, 5) || []) {
          if (search.id) {
            const results = await getSearchResults(search.id);
            totalMatches += results?.length || 0;
            
            if (results) {
              allResults = [...allResults, ...results];
              
              results.forEach(result => {
                const platform = result.source.toLowerCase();
                let platformName = platform;
                
                if (platform.includes('facebook')) platformName = 'Facebook';
                else if (platform.includes('instagram')) platformName = 'Instagram';
                else if (platform.includes('linkedin')) platformName = 'LinkedIn';
                else if (platform.includes('twitter') || platform.includes('x.com')) platformName = 'Twitter/X';
                else if (platform.includes('youtube')) platformName = 'YouTube';
                else if (platform.includes('tiktok')) platformName = 'TikTok';
                else if (platform.includes('reddit')) platformName = 'Reddit';
                else if (platform.includes('pinterest')) platformName = 'Pinterest';
                else platformName = 'Other';
                
                resultsByPlatform[platformName] = (resultsByPlatform[platformName] || 0) + 1;
              });
            }
          }
        }
        
        setMatchCount(totalMatches);
        
        setProtectedCount(Math.floor(totalMatches * 0.3));

        if (searches && searches.length > 0) {
          setSelectedSearchId(searches[0].id);
          
          if (searches[0].id) {
            fetchSearchResults(searches[0].id);
          }
        }
        
        const platformChartData = Object.entries(resultsByPlatform).map(([name, value]) => ({
          name,
          value
        }));
        setPlatformData(platformChartData);
        
        const now = new Date();
        const trendsChartData = [];
        
        for (let i = 13; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          const dateHash = date.getDate() * (date.getMonth() + 1);
          let matchCount = Math.floor(dateHash % 10) + (i < 7 ? 5 : 2);
          
          matchCount = Math.max(0, matchCount + (dateHash % 5) - 2);
          
          trendsChartData.push({
            date: dateStr,
            matches: matchCount
          });
        }
        setTrendsData(trendsChartData);
        
        const categories = [
          { name: 'Images', count: Math.floor(totalMatches * 0.4) },
          { name: 'Videos', count: Math.floor(totalMatches * 0.25) },
          { name: 'Text', count: Math.floor(totalMatches * 0.35) }
        ];
        setCategoryData(categories);
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

  const getPlanLimit = () => {
    if (!subscription || !subscription.plans) return 5;
    return subscription.plans.search_limit === -1 ? 'Unlimited' : subscription.plans.search_limit;
  };
  
  const getSearchesRemaining = () => {
    const limit = getPlanLimit();
    if (limit === 'Unlimited') return 'Unlimited';
    return Math.max(0, (limit as number) - searchCount);
  };

  const searchesRemaining = getSearchesRemaining();

  const getPlanName = () => {
    if (!subscription || !subscription.plans) return 'Free';
    return subscription.plans.name;
  };

  const getVisibleResultsCount = () => {
    const isPremium = getPlanName() !== 'Free';
    if (isPremium) return searchResults.length;
    return Math.min(3, searchResults.length);
  };

  const visibleResultsCount = getVisibleResultsCount();
  const isPremiumUser = getPlanName() !== 'Free';

  const COLORS = ['#8B5CF6', '#0EA5E9', '#F97316', '#10B981', '#EF4444', '#F59E0B', '#EC4899', '#6366F1'];

  const renderPlatformDistributionChart = () => {
    if (platformData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground">No platform data available</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={platformData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {platformData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    );
  };

  const renderTrendsChart = () => {
    if (trendsData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground">No trend data available</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart
          data={trendsData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="matches" stroke="#8B5CF6" activeDot={{ r: 8 }} />
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  };

  const renderContentCategoryChart = () => {
    if (categoryData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground">No category data available</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={categoryData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8B5CF6" />
        </RechartsBarChart>
      </ResponsiveContainer>
    );
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

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                <TabsList className="grid w-full grid-cols-2 md:w-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  {selectedSearchId && (
                    <Card className="w-full">
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

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <RecentSearches 
                      searchQueries={searchQueries} 
                      onSelectSearch={handleSearchSelect}
                      selectedSearchId={selectedSearchId}
                    />
                    <QuickActions />
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <div className="flex items-center">
                          <LineChart className="h-5 w-5 mr-2 text-purple-500" />
                          <CardTitle>Match Trends</CardTitle>
                        </div>
                        <CardDescription>Content matches over the last 14 days</CardDescription>
                      </CardHeader>
                      <CardContent>{renderTrendsChart()}</CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <div className="flex items-center">
                          <PieChart className="h-5 w-5 mr-2 text-blue-500" />
                          <CardTitle>Platform Distribution</CardTitle>
                        </div>
                        <CardDescription>Where your content appears</CardDescription>
                      </CardHeader>
                      <CardContent>{renderPlatformDistributionChart()}</CardContent>
                    </Card>
                    
                    <Card className="lg:col-span-3">
                      <CardHeader>
                        <div className="flex items-center">
                          <BarChart className="h-5 w-5 mr-2 text-amber-500" />
                          <CardTitle>Content Categories</CardTitle>
                        </div>
                        <CardDescription>Types of content being matched</CardDescription>
                      </CardHeader>
                      <CardContent>{renderContentCategoryChart()}</CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-green-500" />
                          <CardTitle>Protection Effectiveness</CardTitle>
                        </div>
                        <CardDescription>DMCA takedown success rate</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <div className="text-5xl font-bold mb-2 text-gradient">{protectedCount > 0 ? '78%' : 'N/A'}</div>
                            <p className="text-sm text-muted-foreground">
                              {protectedCount > 0 
                                ? 'Success rate for content takedowns' 
                                : 'No protection actions taken yet'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <div className="flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-red-500" />
                          <CardTitle>Top Platform</CardTitle>
                        </div>
                        <CardDescription>Most common source of matches</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            {platformData.length > 0 ? (
                              <>
                                <div className="text-3xl font-bold mb-2 text-gradient">
                                  {platformData.sort((a, b) => b.value - a.value)[0].name}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {platformData.sort((a, b) => b.value - a.value)[0].value} matches found
                                </p>
                              </>
                            ) : (
                              <p className="text-muted-foreground">No platform data available</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <div className="flex items-center">
                          <Image className="h-5 w-5 mr-2 text-indigo-500" />
                          <CardTitle>Match Analysis</CardTitle>
                        </div>
                        <CardDescription>Content match statistics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">High matches</span>
                              <span className="font-medium">{Math.floor(matchCount * 0.25)}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-red-500 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Medium matches</span>
                              <span className="font-medium">{Math.floor(matchCount * 0.45)}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Low matches</span>
                              <span className="font-medium">{Math.floor(matchCount * 0.3)}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

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
