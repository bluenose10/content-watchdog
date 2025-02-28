
import { Sidebar } from "@/components/ui/sidebar";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getSearchQueryById, getSearchResults, performGoogleSearch, performImageSearch, createSearchResults } from "@/lib/db-service";
import { SearchResult } from "@/lib/db-types";
import { PaginatedResults } from "@/components/ui/paginated-results";
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
import { SearchFilters, SortOption, MatchLevelFilter, SourceFilter } from "@/components/ui/search-filters";
import { getCacheKey, clearCache } from "@/lib/search-cache";
import { ExportMenu } from "@/components/ui/export-menu";

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
  
  // Filter state
  const [sortOption, setSortOption] = useState<SortOption>("relevance");
  const [matchLevelFilter, setMatchLevelFilter] = useState<MatchLevelFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>([]);
  const [keywordFilter, setKeywordFilter] = useState("");
  
  // Items per page for pagination (adjust for different screen sizes)
  const [itemsPerPage, setItemsPerPage] = useState(6);
  
  // Update items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerPage(9); // For large screens
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(6); // For medium screens
      } else {
        setItemsPerPage(3); // For small screens
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter and sort results based on current filters
  const filteredResults = useMemo(() => {
    let filtered = [...results];
    
    // Filter by match level
    if (matchLevelFilter !== "all") {
      filtered = filtered.filter(result => 
        result.match_level.toLowerCase() === matchLevelFilter.toLowerCase()
      );
    }
    
    // Filter by source
    if (sourceFilter.length > 0) {
      filtered = filtered.filter(result => 
        sourceFilter.includes(result.source)
      );
    }
    
    // Filter by keyword
    if (keywordFilter) {
      const keyword = keywordFilter.toLowerCase();
      filtered = filtered.filter(result => 
        result.title.toLowerCase().includes(keyword) || 
        result.source.toLowerCase().includes(keyword) ||
        result.url.toLowerCase().includes(keyword)
      );
    }
    
    // Sort the results
    if (sortOption === "date-new") {
      filtered.sort((a, b) => new Date(b.found_at).getTime() - new Date(a.found_at).getTime());
    } else if (sortOption === "date-old") {
      filtered.sort((a, b) => new Date(a.found_at).getTime() - new Date(b.found_at).getTime());
    } else {
      // Default "relevance" sort - prioritize results with relevance/similarity scores
      filtered.sort((a, b) => {
        // First try to use the relevance/similarity scores
        if (a.relevance_score !== undefined && b.relevance_score !== undefined) {
          return b.relevance_score - a.relevance_score;
        }
        
        if (a.similarity_score !== undefined && b.similarity_score !== undefined) {
          return b.similarity_score - a.similarity_score;
        }
        
        // Fallback to match level if no scores are available
        const levelScore = {
          'High': 3,
          'Medium': 2,
          'Low': 1
        };
        
        return levelScore[b.match_level as keyof typeof levelScore] - levelScore[a.match_level as keyof typeof levelScore];
      });
    }
    
    return filtered;
  }, [results, sortOption, matchLevelFilter, sourceFilter, keywordFilter]);
  
  // Get all unique sources for filtering
  const availableSources = useMemo(() => 
    [...new Set(results.map(result => result.source))],
    [results]
  );

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
        if (searchId.startsWith('temp_')) {
          const tempSearchData = sessionStorage.getItem(`temp_search_${searchId}`);
          if (tempSearchData) {
            const parsedData = JSON.parse(tempSearchData);
            setSearchData(parsedData);
            
            // For anonymous users, we'll generate results on the fly
            setIsGeneratingResults(true);
            try {
              if (parsedData.query_type === "name" || parsedData.query_type === "hashtag") {
                const textResults = await performGoogleSearch(parsedData.query_text, 'anonymous', parsedData.search_params);
                if (textResults && textResults.items) {
                  console.log("Successfully received text results:", textResults.items.length);
                  const formattedResults = textResults.items.slice(0, 20).map((item: any, index: number) => {
                    // Determine match level based on position or relevance score
                    let matchLevel: 'High' | 'Medium' | 'Low';
                    if (item.relevanceScore) {
                      matchLevel = item.relevanceScore > 0.75 ? 'High' : item.relevanceScore > 0.5 ? 'Medium' : 'Low';
                    } else {
                      matchLevel = index < 5 ? 'High' : index < 10 ? 'Medium' : 'Low';
                    }
                    
                    return {
                      search_id: searchId,
                      title: item.title || "Untitled Content",
                      url: item.link || "#",
                      thumbnail: item.pagemap?.cse_image?.[0]?.src || "",
                      source: item.displayLink || new URL(item.link || "#").hostname,
                      match_level: matchLevel,
                      found_at: new Date().toISOString(),
                      relevance_score: item.relevanceScore || undefined
                    };
                  });
                  console.log("Formatted results:", formattedResults.length);
                  setResults(formattedResults);
                } else {
                  console.error("No items in text search results");
                  setError("No search results found. Please try a different search.");
                }
              } else if (parsedData.query_type === "image" && parsedData.image_url) {
                const imageResults = await performImageSearch(parsedData.image_url, 'anonymous', parsedData.search_params);
                if (imageResults && imageResults.items) {
                  console.log("Successfully received image results:", imageResults.items.length);
                  const formattedResults = imageResults.items.slice(0, 20).map((item: any, index: number) => {
                    // Determine match level based on similarity score if available
                    let matchLevel: 'High' | 'Medium' | 'Low';
                    if (item.similarityScore) {
                      matchLevel = item.similarityScore > 0.75 ? 'High' : item.similarityScore > 0.5 ? 'Medium' : 'Low';
                    } else if (item.matchQuality) {
                      matchLevel = item.matchQuality === 'high' ? 'High' : item.matchQuality === 'medium' ? 'Medium' : 'Low';
                    } else {
                      matchLevel = index < 5 ? 'High' : index < 10 ? 'Medium' : 'Low';
                    }
                    
                    return {
                      search_id: searchId,
                      title: item.title || "Untitled Content",
                      url: item.link || item.image?.contextLink || "#",
                      thumbnail: item.image?.thumbnailLink || "",
                      source: item.displayLink || new URL(item.link || "#").hostname,
                      match_level: matchLevel,
                      found_at: new Date().toISOString(),
                      similarity_score: item.similarityScore
                    };
                  });
                  console.log("Formatted image results:", formattedResults.length);
                  setResults(formattedResults);
                } else {
                  console.error("No items in image search results");
                  setError("No search results found. Please try a different search.");
                }
              }
            } catch (err) {
              console.error("Error generating anonymous results:", err);
              setError("Failed to generate search results. Please try again.");
            } finally {
              setIsGeneratingResults(false);
            }
            setIsLoading(false);
            return;
          } else {
            console.error("Temporary search data not found in session storage");
            setError("Search data not found. Please try a new search.");
            setIsLoading(false);
            return;
          }
        }

        // First, get the search query data from DB for logged-in users
        try {
          const searchQueryData = await getSearchQueryById(searchId);
          console.log("Search query data:", searchQueryData);
          setSearchData(searchQueryData);

          // Check if we already have results for this search
          let searchResults = await getSearchResults(searchId);
          console.log("Initial search results:", searchResults?.length || 0);
          
          // If no results found, we need to perform the search
          if (!searchResults || searchResults.length === 0) {
            setIsGeneratingResults(true);
            
            try {
              if (searchQueryData.query_type === "image" && searchQueryData.image_url) {
                // Perform image search
                console.log("Performing image search with URL:", searchQueryData.image_url);
                const imageResults = await performImageSearch(
                  searchQueryData.image_url, 
                  user?.id || 'anonymous',
                  searchQueryData.search_params
                );
                
                // Process and save the image search results
                if (imageResults && imageResults.items && imageResults.items.length > 0) {
                  console.log("Image search results:", imageResults.items.length);
                  const formattedResults: SearchResult[] = imageResults.items.slice(0, 20).map((item: any, index: number) => {
                    // Determine match level based on similarity score if available
                    let matchLevel: 'High' | 'Medium' | 'Low';
                    if (item.similarityScore) {
                      matchLevel = item.similarityScore > 0.75 ? 'High' : item.similarityScore > 0.5 ? 'Medium' : 'Low';
                    } else if (item.matchQuality) {
                      matchLevel = item.matchQuality === 'high' ? 'High' : item.matchQuality === 'medium' ? 'Medium' : 'Low';
                    } else {
                      matchLevel = index < 5 ? 'High' : index < 10 ? 'Medium' : 'Low';
                    }
                    
                    return {
                      search_id: searchId,
                      title: item.title || "Untitled Content",
                      url: item.link || item.image?.contextLink || "#",
                      thumbnail: item.image?.thumbnailLink || "",
                      source: item.displayLink || new URL(item.link || "#").hostname,
                      match_level: matchLevel,
                      found_at: new Date().toISOString(),
                      similarity_score: item.similarityScore
                    };
                  });
                  
                  // Save search results to database if user is logged in
                  if (user) {
                    try {
                      console.log("Saving image search results to database:", formattedResults.length);
                      await createSearchResults(formattedResults);
                      console.log("Created image search results successfully");
                      
                      // Re-fetch results after saving
                      searchResults = await getSearchResults(searchId);
                      console.log("Re-fetched search results:", searchResults?.length || 0);
                    } catch (saveError) {
                      console.error("Error saving image search results:", saveError);
                      // Use the formatted results even if saving failed
                      searchResults = formattedResults;
                    }
                  } else {
                    // For anonymous users, just use the results without saving
                    searchResults = formattedResults;
                  }
                } else {
                  console.error("No items in image search results");
                  setError("No search results found. Please try a different search.");
                }
              } else if ((searchQueryData.query_type === "name" || searchQueryData.query_type === "hashtag") && searchQueryData.query_text) {
                // Perform text-based search
                console.log("Performing text search with query:", searchQueryData.query_text);
                const textResults = await performGoogleSearch(
                  searchQueryData.query_text, 
                  user?.id || 'anonymous',
                  searchQueryData.search_params
                );
                
                // Process and save the text search results
                if (textResults && textResults.items && textResults.items.length > 0) {
                  console.log("Text search results:", textResults.items.length);
                  const formattedResults: SearchResult[] = textResults.items.slice(0, 20).map((item: any, index: number) => {
                    // Determine match level based on relevance score if available
                    let matchLevel: 'High' | 'Medium' | 'Low';
                    if (item.relevanceScore) {
                      matchLevel = item.relevanceScore > 0.75 ? 'High' : item.relevanceScore > 0.5 ? 'Medium' : 'Low';
                    } else {
                      matchLevel = index < 5 ? 'High' : index < 10 ? 'Medium' : 'Low';
                    }
                    
                    let thumbnailUrl = "";
                    try {
                      thumbnailUrl = item.pagemap?.cse_image?.[0]?.src || "";
                    } catch (err) {
                      console.log("No thumbnail for item:", item.title);
                    }
                    
                    let source = "";
                    try {
                      source = item.displayLink || new URL(item.link || "#").hostname;
                    } catch (err) {
                      console.log("Error parsing URL for source:", item.link);
                      source = "Unknown source";
                    }
                    
                    return {
                      search_id: searchId,
                      title: item.title || "Untitled Content",
                      url: item.link || "#",
                      thumbnail: thumbnailUrl,
                      source: source,
                      match_level: matchLevel,
                      found_at: new Date().toISOString(),
                      relevance_score: item.relevanceScore
                    };
                  });
                  
                  // Save search results to database if user is logged in
                  if (user) {
                    try {
                      console.log("Saving text search results to database:", formattedResults.length);
                      await createSearchResults(formattedResults);
                      console.log("Created text search results successfully");
                      
                      // Re-fetch results after saving
                      searchResults = await getSearchResults(searchId);
                      console.log("Re-fetched search results:", searchResults?.length || 0);
                    } catch (saveError) {
                      console.error("Error saving text search results:", saveError);
                      // Use the formatted results even if saving failed
                      searchResults = formattedResults;
                    }
                  } else {
                    // For anonymous users, just use the results without saving
                    searchResults = formattedResults;
                  }
                } else {
                  console.error("No items in text search results");
                  setError("No search results found. Please try a different search.");
                }
              } else {
                console.error("Invalid search data:", searchQueryData);
                setError("Invalid search data. Please try a new search.");
              }
            } catch (searchError) {
              console.error("Error generating search results:", searchError);
              setError("Failed to generate search results. Please try again.");
              toast({
                title: "Error generating results",
                description: "There was a problem finding matches. Please try again.",
                variant: "destructive",
              });
            } finally {
              setIsGeneratingResults(false);
            }
          }
          
          if (searchResults) {
            console.log("Setting final results:", searchResults.length);
            setResults(searchResults);
          } else {
            console.error("No search results after all attempts");
            if (!error) {
              setError("No results found. Please try a different search.");
            }
          }
        } catch (err) {
          console.error("Error fetching search data:", err);
          setError("Failed to load search data. Please try again.");
        }
      } catch (err) {
        console.error("Error in main try block:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchId, user, navigate, toast, accessLevel]);
  
  const handleFilterChange = (filters: {
    sort: SortOption;
    matchLevel: MatchLevelFilter;
    sources: SourceFilter;
    keyword: string;
  }) => {
    setSortOption(filters.sort);
    setMatchLevelFilter(filters.matchLevel);
    setSourceFilter(filters.sources);
    setKeywordFilter(filters.keyword);
  };

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

  const handleNewSearch = () => {
    // Clear any search caches for the current query if it exists
    if (searchData) {
      if (searchData.query_type === "image" && searchData.image_url) {
        const cacheKey = getCacheKey('image', searchData.image_url, searchData.search_params);
        clearCache(cacheKey);
      } else if ((searchData.query_type === "name" || searchData.query_type === "hashtag") && searchData.query_text) {
        const cacheKey = getCacheKey('text', searchData.query_text, searchData.search_params);
        clearCache(cacheKey);
      }
    }
    
    navigate('/');
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleNewSearch}
                  >
                    New Search
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  {accessLevel !== AccessLevel.ANONYMOUS && (
                    <ExportMenu 
                      results={filteredResults}
                      filename={`search-${searchData?.query_text || searchId}`}
                      buttonSize="sm"
                    />
                  )}
                
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
                      {searchData?.search_params && Object.keys(searchData.search_params).length > 0 && (
                        <span className="ml-2 text-sm">
                          • Using advanced parameters
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
                              loading="lazy"
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
                        <p>Sign in to see 5 search results or upgrade to Pro for full access.</p>
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
                  
                  {accessLevel === AccessLevel.BASIC && results.length > 5 && (
                    <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                      <LockIcon className="h-4 w-4 text-blue-500" />
                      <AlertTitle className="text-blue-700 dark:text-blue-300">Basic Access</AlertTitle>
                      <AlertDescription className="text-blue-600 dark:text-blue-400">
                        <p>You can view 5 out of {results.length} results without blur. Upgrade to Pro for full access.</p>
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

                  {/* Search filters */}
                  <div className="mb-6">
                    <SearchFilters 
                      onFilterChange={handleFilterChange}
                      availableSources={availableSources}
                      totalResults={results.length}
                    />
                  </div>

                  {filteredResults.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground">
                        No results found matching your filters.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex justify-end">
                        {accessLevel !== AccessLevel.ANONYMOUS && filteredResults.length > 0 && (
                          <ExportMenu 
                            results={filteredResults}
                            filename={`search-${searchData?.query_text || searchId}`}
                          />
                        )}
                      </div>
                      
                      <div className="mb-12">
                        <PaginatedResults 
                          results={filteredResults}
                          accessLevel={accessLevel}
                          itemsPerPage={itemsPerPage}
                          onUpgrade={handleUpgrade}
                        />
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
