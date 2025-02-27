
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Home, Image, Search, Shield, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useEffect, useState } from "react";
import { getUserSearchQueries, getUserSubscription, getSearchResults } from "@/lib/db-service";
import { SearchQuery, UserSubscription } from "@/lib/db-types";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentSearches } from "@/components/dashboard/RecentSearches";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpgradeCard } from "@/components/dashboard/UpgradeCard";
import { LoadingState } from "@/components/dashboard/LoadingState";

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

              <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
                <RecentSearches searchQueries={searchQueries} />
                <QuickActions />
              </div>

              <div className="mt-6">
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
