
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaginatedResults } from "@/components/ui/paginated-results";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { useAuth } from "@/context/AuthContext";
import { AccessLevel, useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getSearchResults } from "@/lib/search-cache";
import { ArrowLeft, Calendar, Image, Info } from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Results() {
  // Use search params to get the ID instead of URL parameters
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  
  const navigate = useNavigate();
  const { user } = useAuth();
  // Allow anonymous users to view results
  const { isReady, accessLevel, hasPremiumFeature } = useProtectedRoute(false);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>("Today");
  const { toast } = useToast();

  // Handler for upgrade button click
  const handleUpgrade = () => {
    toast({
      title: "Premium Feature",
      description: "Upgrade your account to unlock all results and features.",
      variant: "default",
    });
    navigate("/checkout");
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "No search ID provided. Please try your search again.",
          variant: "destructive",
        });
        navigate("/search");
        return;
      }
      
      try {
        setIsLoading(true);
        // In a real app, we would fetch results from an API
        // For now, we'll use mock data
        const data = await getSearchResults(id);
        setResults(data.results);
        setQuery(data.query);
        
        // Set a realistic search date
        const now = new Date();
        setSearchDate(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      } catch (error) {
        console.error("Error fetching results:", error);
        toast({
          title: "Error",
          description: "Failed to load search results. Please try again.",
          variant: "destructive",
        });
        navigate("/search");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };
    
    if (isReady) {
      fetchResults();
    }
  }, [isReady, id, toast, navigate]);

  // Show loading state while fetching results
  if (!isReady || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center p-6">
          <div className="w-full max-w-4xl">
            <div className="mb-8">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If no results found
  if (!results || results.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find any matches for your search. Please try a different search.
            </p>
            <Button onClick={() => navigate("/search")}>
              Try Another Search
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex">
        <div className="hidden md:block w-64 border-r">
          <Sidebar />
        </div>
        <main className="flex-grow p-6">
          <div className="container mx-auto">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                className="mr-4"
                onClick={() => navigate("/search")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
              <div>
                <h1 className="text-2xl font-bold mb-1">Search Results</h1>
                <p className="text-muted-foreground">
                  {query ? (
                    <span>Results for <span className="font-medium">{query}</span></span>
                  ) : (
                    <span>Recent search results</span>
                  )}
                </p>
              </div>
            </div>

            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Searched on {searchDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Image className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Content search</span>
                  </div>
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Found {results.length} matches</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!user && (
              <Card className="mb-6 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="font-medium text-purple-800 dark:text-purple-300">Free Preview</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You're viewing limited results as a guest. Sign up for free to save your searches and access more features.
                      </p>
                    </div>
                    <div className="ml-4">
                      <Button 
                        onClick={() => navigate("/signup")}
                        variant="default"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Sign Up Free
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Results</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="websites">Websites</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <PaginatedResults
                  results={results}
                  itemsPerPage={5}
                  accessLevel={accessLevel}
                  onUpgrade={handleUpgrade}
                />
              </TabsContent>
              
              <TabsContent value="images" className="mt-4">
                <PaginatedResults
                  results={results.filter(r => r.type === 'image')}
                  itemsPerPage={5}
                  accessLevel={accessLevel}
                  onUpgrade={handleUpgrade}
                />
              </TabsContent>
              
              <TabsContent value="websites" className="mt-4">
                <PaginatedResults
                  results={results.filter(r => r.type === 'website')}
                  itemsPerPage={5}
                  accessLevel={accessLevel}
                  onUpgrade={handleUpgrade}
                />
              </TabsContent>
              
              <TabsContent value="social" className="mt-4">
                <PaginatedResults
                  results={results.filter(r => r.type === 'social')}
                  itemsPerPage={5}
                  accessLevel={accessLevel}
                  onUpgrade={handleUpgrade}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
