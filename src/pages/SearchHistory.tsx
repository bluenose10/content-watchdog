
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RecentSearches } from "@/components/dashboard/RecentSearches";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { useAuth } from "@/context/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getUserSearchQueries } from "@/lib/services/search-query-service";
import { useNavigate } from "react-router-dom";
import { SearchQuery } from "@/lib/db-types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function SearchHistory() {
  const { user } = useAuth();
  const { isReady } = useProtectedRoute(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQueries, setSearchQueries] = useState<SearchQuery[]>([]);
  const navigate = useNavigate();

  const fetchSearchHistory = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      console.log("Fetching search history for user:", user.id);
      const searches = await getUserSearchQueries(user.id);
      console.log("Total searches fetched:", searches.length);
      
      if (searches.length > 0) {
        console.log("Most recent search date:", searches[0]?.created_at);
        console.log("Oldest search in history:", searches[searches.length - 1]?.created_at);
      }
      
      setSearchQueries(searches);
      toast.success(`Loaded ${searches.length} searches`);
    } catch (error) {
      console.error("Error fetching search history:", error);
      toast.error("Failed to load search history");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user && isReady) {
      fetchSearchHistory();
    }
  }, [user, isReady]);

  // Show loading state while auth is being checked
  if (!isReady || isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <Button 
              variant="ghost" 
              className="mb-2" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-primary">Search History</h1>
            <p className="text-muted-foreground">View all your previous content searches</p>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchSearchHistory}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <RecentSearches 
          searchQueries={searchQueries} 
          limit={100} // Show all searches
        />
      </main>
      <Footer />
    </div>
  );
}
