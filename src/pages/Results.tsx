
import { Sidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getSearchQueryById, getSearchResults, performGoogleSearch, performImageSearch, createSearchResults } from "@/lib/db-service";
import { SearchResult } from "@/lib/db-types";
import { SearchResultCard } from "@/components/ui/search-result-card";
import { useAuth } from "@/context/AuthContext";
import { DeleteSearchButton } from "@/components/ui/delete-search-button";
import { useProtectedRoute, AccessLevel } from "@/hooks/useProtectedRoute";
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
  LockIcon,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UpgradeCard } from "@/components/dashboard/UpgradeCard";

export default function Results() {
  const [searchParams] = useSearchParams();
  const searchId = searchParams.get("id");
  const { user } = useAuth();
  const { accessLevel } = useProtectedRoute(false); // Allow anonymous access but track level
  const [searchData, setSearchData] = useState<any>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingResults, setIsGeneratingResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Result limits based on access level
  const getResultLimit = () => {
    switch (accessLevel) {
      case AccessLevel.PREMIUM:
        return 20; // Pro users can see up to 20 results
      case AccessLevel.BASIC:
        return 2;  // Registered users can see 2 results
      case AccessLevel.ANONYMOUS:
      default:
        return 0;  // Anonymous users see 0 unlocked results (all blurred)
    }
  };

  const getDisplayCount = () => {
    return Math.min(20, results.length); // Display up to 20 results max for all user types
  };

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

        // Handle anonymous searches from session storage
        if (!user && searchId.startsWith('temp_')) {
          const tempSearchData = sessionStorage.getItem(`temp_search_${searchId}`);
          if (tempSearchData) {
            const parsedData = JSON.parse(tempSearchData);
            setSearchData(parsedData);
            
            // For anonymous users, we'll generate results on the fly
            setIsGeneratingResults(true);
            try {
              if (parsedData.query_type === "name" || parsedData.query_type === "hashtag") {
                const textResults = await performGoogleSearch(parsedData.query_text, 'anonymous');
                if (textResults && textResults.items) {
                  const formattedResults = textResults.items.map((item: any, index: number) => {
                    const matchLevel = index < 2 ? "High" as const : index < 4 ? "Medium" as const : "Low" as const;
                    return {
                      search_id: searchId,
                      title: item.title || "Untitled Content",
                      url: item.link || "#",
                      thumbnail: item.pagemap?.cse_image?.[0]?.src || "",
                      source: item.displayLink || new URL(item.link || "#").hostname,
                      match_level: matchLevel,
                      found_at: new Date().toISOString()
                    };
                  });
                  setResults(formattedResults);
                }
              }
            } catch (err) {
              console.error("Error generating anonymous results:", err);
              setError("Failed to generate search results");
            } finally {
              setIsGeneratingResults(false);
            }
            setIsLoading(false);
            return;
          }
        }

        // First, get the search query data from DB for logged-in users
        const searchQueryData = await getSearchQueryById(searchId);
        console.log("Search query data:", searchQueryData);
        setSearchData(searchQueryData);

        // Check if we already have results for this search
        let searchResults = await getSearchResults(searchId);
        console.log("Initial search results:", searchResults);
        
        // If no results found, we need to perform the search
        if (!searchResults || searchResults.length === 0) {
          setIsGeneratingResults(true);
          
          try {
            if (searchQueryData.query_type === "image" && searchQueryData.image_url) {
              // Perform image search
              console.log("Performing image search with URL:", searchQueryData.image_url);
              const imageResults = await performImageSearch(searchQueryData.image_url, user?.id || 'anonymous');
              
              // Process and save the image search results
              if (imageResults && imageResults.items) {
                console.log("Image search results:", imageResults.items.length);
                const formattedResults: SearchResult[] = imageResults.items.map((item: any, index: number) => {
                  // Determine match level based on position
                  const matchLevel = index < 2 ? "High" as const : index < 4 ? "Medium" as const : "Low" as const;
                  
                  return {
                    search_id: searchId,
                    title: item.title || "Untitled Content",
                    url: item.link || item.image?.contextLink || "#",
                    thumbnail: item.image?.thumbnailLink || "",
                    source: item.displayLink || new URL(item.link || "#").hostname,
                    match_level: matchLevel,
                    found_at: new Date().toISOString()
                  };
                });
                
                // Save search results to database if user is logged in
                if (user) {
                  await createSearchResults(formattedResults);
                  console.log("Created image search results:", formattedResults.length);
                  
                  // Re-fetch results after saving
                  searchResults = await getSearchResults(searchId);
                } else {
                  // For anonymous users, just use the results without saving
                  searchResults = formattedResults;
                }
              }
            } else if ((searchQueryData.query_type === "name" || searchQueryData.query_type === "hashtag") && searchQueryData.query_text) {
              // Perform text-based search
              console.log("Performing text search with query:", searchQueryData.query_text);
              const textResults = await performGoogleSearch(searchQueryData.query_text, user?.id || 'anonymous');
              
              // Process and save the text search results
              if (textResults && textResults.items) {
                console.log("Text search results:", textResults.items.length);
                const formattedResults: SearchResult[] = textResults.items.map((item: any, index: number) => {
                  // Determine match level based on position
                  const matchLevel = index < 2 ? "High" as const : index < 4 ? "Medium" as const : "Low" as const;
                  
                  return {
                    search_id: searchId,
                    title: item.title || "Untitled Content",
                    url: item.link || "#",
                    thumbnail: item.pagemap?.cse_image?.[0]?.src || "",
                    source: item.displayLink || new URL(item.link || "#").hostname,
                    match_level: matchLevel,
                    found_at: new Date().toISOString()
                  };
                });
                
                // Save search results to database if user is logged in
                if (user) {
                  console.log("Saving formatted results:", formattedResults);
                  await createSearchResults(formattedResults);
                  console.log("Created text search results");
                  
                  // Re-fetch results after saving
                  searchResults = await getSearchResults(searchId);
                } else {
                  // For anonymous users, just use the results without saving
                  searchResults = formattedResults;
                }
              } else {
                console.error("No items in text search results");
              }
            } else {
              console.error("Invalid search data:", searchQueryData);
            }
          } catch (searchError) {
            console.error("Error generating search results:", searchError);
            toast({
              title: "Error generating results",
              description: "There was a problem finding matches. Please try again.",
              variant: "destructive",
            });
          } finally {
            setIsGeneratingResults(false);
          }
        }
        
        setResults(searchResults || []);
        console.log("Final results set:", searchResults?.length);
      } catch (err) {
        console.error("Error fetching search data:", err);
        setError("Failed to load search results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchId, user, navigate, toast, accessLevel]);

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

  const handleUpgrade = () => {
    navigate('/#pricing');
  };

  const handleSignIn = () => {
    // Store the current path to redirect back after login
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
    navigate('/login');
  };

  return (
    <SidebarProvider>
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
                  {user && searchData && (
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
                      {accessLevel !== AccessLevel.ANONYMOUS && (
                        <DropdownMenuItem onClick={handleDownload}>
                          <Download className="mr-2 h-4 w-4" />
                          Download CSV
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading search results...</p>
                </div>
              ) : isGeneratingResults ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Generating search results...</p>
                  <p className="text-xs text-muted-foreground mt-2">This may take a moment</p>
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

                  {/* Access level notice */}
                  {accessLevel === AccessLevel.ANONYMOUS && (
                    <Alert className="mb-6 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
                      <LockIcon className="h-4 w-4 text-purple-500" />
                      <AlertTitle className="text-purple-700 dark:text-purple-300">Limited Access</AlertTitle>
                      <AlertDescription className="text-purple-600 dark:text-purple-400">
                        <p>Sign in to see 2 search results or upgrade to Pro for full access.</p>
                        <div className="flex gap-2 mt-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/40"
                            onClick={handleSignIn}
                          >
                            Sign In
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={handleUpgrade}
                          >
                            Upgrade to Pro
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {accessLevel === AccessLevel.BASIC && results.length > getResultLimit() && (
                    <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                      <LockIcon className="h-4 w-4 text-blue-500" />
                      <AlertTitle className="text-blue-700 dark:text-blue-300">Basic Access</AlertTitle>
                      <AlertDescription className="text-blue-600 dark:text-blue-400">
                        <p>You can view {getResultLimit()} out of {results.length} results. Upgrade to Pro for full access.</p>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white mt-2"
                          onClick={handleUpgrade}
                        >
                          Upgrade to Pro
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      {results.length} matches found
                      {accessLevel !== AccessLevel.PREMIUM && getResultLimit() < results.length && (
                        <span> (viewing {getDisplayCount()})</span>
                      )}
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
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {results.slice(0, getDisplayCount()).map((result, index) => (
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
                            isPremium={index < getResultLimit()}
                            isFreePreview={accessLevel === AccessLevel.ANONYMOUS && index < 2}
                            onUpgrade={handleUpgrade}
                          />
                        ))}
                      </div>
                      
                      {/* Upgrade card at the bottom */}
                      {accessLevel !== AccessLevel.PREMIUM && (
                        <div className="mb-8">
                          <UpgradeCard />
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
