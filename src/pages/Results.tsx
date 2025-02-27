
import { Sidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getSearchQueryById, getSearchResults } from "@/lib/db-service";
import { SearchResult } from "@/lib/db-types";
import { SearchResultCard } from "@/components/ui/search-result-card";
import { useAuth } from "@/context/AuthContext";
import { DeleteSearchButton } from "@/components/ui/delete-search-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Filter,
  Share,
  Download,
  MoreVertical,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Results() {
  const [searchParams] = useSearchParams();
  const searchId = searchParams.get("id");
  const { user } = useAuth();
  const [searchData, setSearchData] = useState<any>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!searchId) {
      setError("No search ID provided");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const searchQueryData = await getSearchQueryById(searchId);
        setSearchData(searchQueryData);

        const searchResults = await getSearchResults(searchId);
        setResults(searchResults || []);
      } catch (err) {
        console.error("Error fetching search data:", err);
        setError("Failed to load search results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out these search results",
          text: `Search results for ${searchData?.query_text || "image"}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "URL copied to clipboard",
        description: "Share this link with others to show your results",
      });
    }
  };

  const handleDownload = () => {
    // Create a CSV of the search results
    const headers = [
      "Title",
      "URL",
      "Source",
      "Match Level",
      "Found Date",
    ].join(",");
    
    const rows = results.map((result) => {
      return [
        `"${result.title.replace(/"/g, '""')}"`,
        `"${result.url.replace(/"/g, '""')}"`,
        `"${result.source.replace(/"/g, '""')}"`,
        `"${result.match_level}"`,
        `"${new Date(result.found_at).toLocaleDateString()}"`,
      ].join(",");
    });
    
    const csv = [headers, ...rows].join("\n");
    
    // Create a download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `search-results-${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <main className="flex-1 p-4 md:p-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              <div className="flex items-center gap-2">
                {/* Add the delete button here */}
                {searchData && (
                  <DeleteSearchButton 
                    searchId={searchId || ''} 
                    searchType={searchData.query_type}
                  />
                )}
              
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleShare}>
                      <Share className="mr-2 h-4 w-4" />
                      Share Results
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading search results...</p>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="my-8">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-2 mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Search Results
                  </h1>
                  <p className="text-muted-foreground">
                    {searchData?.query_type === "image"
                      ? "Results for your image search"
                      : `Results for "${searchData?.query_text}"`}
                    {searchData?.created_at && (
                      <span className="ml-2 text-sm">
                        • Searched on {formatDate(searchData.created_at)}
                      </span>
                    )}
                  </p>
                  {searchData?.query_type === "image" && searchData?.image_url && (
                    <div className="mt-4 p-4 rounded-lg border border-border bg-secondary/20">
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-md overflow-hidden border border-border shadow-sm">
                          <img
                            src={searchData.image_url}
                            alt="Search image"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">Search Image</h3>
                          <p className="text-sm text-muted-foreground">
                            We found {results.length} matches for this image
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    {results.length} matches found
                  </p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>

                {results.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">
                      No results found for this search.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {results.map((result, index) => (
                      <SearchResultCard
                        key={result.id || index}
                        result={{
                          id: result.id || `result-${index}`,
                          title: result.title,
                          url: result.url,
                          thumbnail: result.thumbnail,
                          source: result.source,
                          matchLevel: result.match_level,
                          date: result.found_at,
                        }}
                        isPremium={true}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
