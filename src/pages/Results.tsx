
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/context/AuthContext";
import { AccessLevel, useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Sidebar } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

// Import from the newly created index file
import {
  ResultsHeader,
  GuestBanner,
  EmptyResults,
  ResultsTabs,
  ResultsLoadingState
} from "@/components/results";

import { useSearchResults } from "@/components/results/hooks";

export default function Results() {
  // Use search params to get the ID instead of URL parameters
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  
  const navigate = useNavigate();
  const { user } = useAuth();
  // Allow anonymous users to view results
  const { isReady, accessLevel } = useProtectedRoute(false);
  const { toast } = useToast();

  // Use the custom hook to handle search results
  const { 
    isLoading, 
    results, 
    query, 
    searchDate, 
    totalResults 
  } = useSearchResults(id, isReady);

  // Handler for upgrade button click
  const handleUpgrade = () => {
    toast({
      title: "Premium Feature",
      description: "Upgrade your account to unlock all results and features.",
      variant: "default",
    });
    navigate("/checkout");
  };

  // Show loading state while fetching results
  if (!isReady || isLoading) {
    return <ResultsLoadingState />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex">
        <div className="hidden md:block w-64 border-r">
          <Sidebar />
        </div>
        <main className="flex-grow">
          <div className="px-8 pt-24 pb-8 max-w-6xl mx-auto">
            <ResultsHeader 
              query={query} 
              searchDate={searchDate} 
              totalResults={totalResults} 
            />

            {!user && <GuestBanner />}

            {results.length === 0 ? (
              <EmptyResults />
            ) : (
              <ResultsTabs 
                results={results} 
                accessLevel={accessLevel} 
                onUpgrade={handleUpgrade} 
              />
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
