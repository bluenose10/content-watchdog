
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentSearches } from "@/components/dashboard/RecentSearches";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpgradeCard } from "@/components/dashboard/UpgradeCard";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { useAuth } from "@/context/AuthContext";
import { PremiumFeature, useProtectedRoute } from "@/hooks/useProtectedRoute";
import { ScheduledSearches } from "@/components/dashboard/ScheduledSearches";
import { BarChart3, Search, Shield } from "lucide-react";
import { getUserSearchQueries } from "@/lib/db-service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuth();
  const { accessLevel, isReady, hasPremiumFeature } = useProtectedRoute(true);
  const [isLoading, setIsLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchesCount, setSearchesCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);

  useEffect(() => {
    // Fetch user data and recent searches
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // Fetch recent searches
        const searches = await getUserSearchQueries(user.id);
        setRecentSearches(searches);
        
        // Update counts for the stats cards
        if (searches && Array.isArray(searches)) {
          setSearchesCount(searches.length);
          
          // For demo purposes, calculate a random number of matches based on searches
          const estimatedMatches = searches.length * Math.floor(Math.random() * 10) + 5;
          setMatchesCount(estimatedMatches);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        // Finish loading after a short delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    
    if (user && isReady) {
      fetchDashboardData();
    }
  }, [user, isReady]);

  // Show loading state while auth is being checked
  if (!isReady || isLoading) {
    return <LoadingState />;
  }

  // Get user information
  const fullName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  // Extract first name only
  const firstName = fullName.split(' ')[0];
  const avatarUrl = user?.user_metadata?.avatar_url;
  const userInitials = getInitials(fullName);

  // Determine if user needs to see the upgrade card
  const showUpgradeCard = !hasPremiumFeature(PremiumFeature.UNLIMITED_RESULTS);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-12">
        <div className="flex items-center gap-4 mb-8 pt-8">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-primary">Welcome back, {firstName}</h1>
            <p className="text-muted-foreground">Here's an overview of your content monitoring</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <StatsCard 
            title="Performed Searches" 
            value={searchesCount} 
            change={searchesCount > 10 ? searchesCount - 10 : searchesCount}
            duration="this month"
            icon={Search}
          />
          <StatsCard 
            title="Content Matches" 
            value={matchesCount} 
            change={Math.floor(matchesCount * 0.3)}
            duration="this month"
            icon={BarChart3}
          />
          <StatsCard 
            title="DMCA Takedowns" 
            value={Math.floor(matchesCount * 0.1)} 
            change={Math.floor(matchesCount * 0.05)}
            duration="this month"
            icon={Shield}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <RecentSearches limit={5} searchQueries={recentSearches} />
          </div>
          <div className="flex flex-col gap-8">
            <QuickActions />
            {showUpgradeCard && <UpgradeCard />}
          </div>
        </div>

        <div className="mt-8">
          <ScheduledSearches />
        </div>
      </main>
      <Footer />
    </div>
  );
}
