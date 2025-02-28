
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isReady, accessLevel, hasPremiumFeature } = useProtectedRoute(true);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
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
      if (!id) return;
      try {
        setIsLoading(true);
        // In a real app, we would fetch results from an API
        // For now, we'll use mock data
        const data = await getSearchResults(id);
        setResults(data.results);
        setQuery(data.query);
      } catch (error) {
        console.error("Error fetching results:", error);
        toast({
          title: "Error",
          description: "Failed to load search results. Please try again.",
          variant: "destructive",
        });
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };
    
    if (isReady && id) {
      fetchResults();
    }
  }, [isReady, id, toast]);

  if (!isReady || isLoading) {
    return <LoadingState />;
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
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
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
                    <span className="text-sm">Searched on April 12, 2023</span>
                  </div>
                  <div className="flex items-center">
                    <Image className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Image search</span>
                  </div>
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Found {results.length} matches</span>
                  </div>
                </div>
              </CardContent>
            </Card>

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
