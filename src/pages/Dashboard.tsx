
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentSearches } from "@/components/dashboard/RecentSearches";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpgradeCard } from "@/components/dashboard/UpgradeCard";
import { useAuth } from "@/context/AuthContext";
import { PremiumFeature, useProtectedRoute } from "@/hooks/useProtectedRoute";
import { ScheduledSearches } from "@/components/dashboard/ScheduledSearches";
import { BarChart3, Search, Shield } from "lucide-react";
import { getUserSearchQueries } from "@/lib/db-service";
import { getUserDashboardStats } from "@/lib/services/dashboard-stats-service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuth();
  const { accessLevel, isReady, hasPremiumFeature } = useProtectedRoute(true);
  const [isLoading, setIsLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState([]);
  const [stats, setStats] = useState({
    searchCount: 0,
    contentMatchCount: 0,
    takedownCount: 0,
    searchGrowth: 0
  });

  useEffect(() => {
    console.log("Dashboard component mounted, user:", !!user);
    
    // Fetch user data and recent searches
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching dashboard data for user:", user.id);
        
        // Fetch recent searches
        const searches = await getUserSearchQueries(user.id);
        setRecentSearches(searches);
        
        // Fetch user statistics
        const userStats = await getUserDashboardStats(user.id);
        setStats(userStats);
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
    } else {
      // If no user or not ready, still set loading to false after a delay
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [user, isReady]);

  // Get user information
  const fullName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  // Extract first name only
  const firstName = fullName.split(' ')[0];
  const avatarUrl = user?.user_metadata?.avatar_url;
  const userInitials = getInitials(fullName);

  // Determine if user needs to see the upgrade card
  const showUpgradeCard = !hasPremiumFeature(PremiumFeature.UNLIMITED_RESULTS);

  return (
    <Layout>
      <div className="container px-4 py-16">
        <div className="flex items-center gap-4 mb-8 pt-12">
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
            value={stats.searchCount} 
            change={stats.searchGrowth}
            duration="this month"
            icon={Search}
          />
          <StatsCard 
            title="Content Matches" 
            value={stats.contentMatchCount} 
            change={0}
            duration="this month"
            icon={BarChart3}
          />
          <StatsCard 
            title="DMCA Takedowns" 
            value={stats.takedownCount} 
            change={0}
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
      </div>
    </Layout>
  );
}
