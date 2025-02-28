
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

export default function Dashboard() {
  const { user } = useAuth();
  const { accessLevel, isReady, hasPremiumFeature } = useProtectedRoute(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state while auth is being checked
  if (!isReady || isLoading) {
    return <LoadingState />;
  }

  // Determine if user needs to see the upgrade card
  const showUpgradeCard = !hasPremiumFeature(PremiumFeature.UNLIMITED_RESULTS);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <StatsCard 
            title="Performed Searches" 
            value={24} 
            change={+14}
            duration="this month"
          />
          <StatsCard 
            title="Content Matches" 
            value={173} 
            change={+42}
            duration="this month"
          />
          <StatsCard 
            title="DMCA Takedowns" 
            value={12} 
            change={+5}
            duration="this month"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <RecentSearches limit={5} />
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
