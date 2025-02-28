
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RecentSearches } from "@/components/dashboard/RecentSearches";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { useAuth } from "@/context/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getUserSearchQueries } from "@/lib/db-service";
import { useNavigate } from "react-router-dom";
import { SearchQuery } from "@/lib/db-types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SearchHistory() {
  const { user } = useAuth();
  const { isReady } = useProtectedRoute(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQueries, setSearchQueries] = useState<SearchQuery[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data and search history
    const fetchSearchHistory = async () => {
      if (!user) return;
      
      try {
        const searches = await getUserSearchQueries(user.id);
        setSearchQueries(searches);
      } catch (error) {
        console.error("Error fetching search history:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };
    
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
