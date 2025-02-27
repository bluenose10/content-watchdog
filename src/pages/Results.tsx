
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SearchResultCard } from "@/components/ui/search-result-card";
import { MOCK_SEARCH_RESULTS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Download, Filter } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Results = () => {
  const { toast } = useToast();
  const [isPremium, setIsPremium] = useState(false); // In a real app, this would come from auth state
  const [showingCount, setShowingCount] = useState(5); // Free users see 5 results
  
  const handleUpgrade = () => {
    toast({
      title: "Upgrade Required",
      description: "Please upgrade to a premium plan to see all results.",
    });
  };
  
  const visibleResults = MOCK_SEARCH_RESULTS.slice(0, isPremium ? MOCK_SEARCH_RESULTS.length : showingCount);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
              </div>
              <p className="text-muted-foreground">
                Results for: <span className="font-medium">@johndoe</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" disabled={!isPremium} onClick={() => {
                if (!isPremium) {
                  handleUpgrade();
                } else {
                  toast({
                    title: "Downloading Results",
                    description: "Your results are being prepared for download.",
                  });
                }
              }}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {!isPremium && (
            <Card className="mb-8 bg-secondary/30 border-primary/20">
              <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-1">Free Plan Limitation</h3>
                  <p className="text-sm text-muted-foreground">
                    You're viewing 5 of {MOCK_SEARCH_RESULTS.length} total results. Upgrade to see all matches and access premium features.
                  </p>
                </div>
                <Button asChild className="button-animation">
                  <Link to="/#pricing">Upgrade Now</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleResults.map((result) => (
              <SearchResultCard
                key={result.id}
                result={result}
                isPremium={isPremium}
                onUpgrade={handleUpgrade}
              />
            ))}
          </div>

          {!isPremium && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                {visibleResults.length} of {MOCK_SEARCH_RESULTS.length} results shown
              </p>
              <Button asChild className="button-animation">
                <Link to="/#pricing">
                  Upgrade to See All Results
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
