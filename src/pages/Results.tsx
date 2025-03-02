import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaginatedResults } from "@/components/ui/paginated-results";
import { useAuth } from "@/context/AuthContext";
import { AccessLevel, useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getSearchResults } from "@/lib/search-cache";
import { Calendar, Image, Info } from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { getSearchQueryById, performGoogleSearch, performImageSearch } from "@/lib/db-service";
import { googleApiManager } from "@/lib/google-api-manager";

const FALLBACK_RESULTS = [
  {
    id: 'fallback-1',
    title: 'LinkedIn Profile Match',
    url: 'https://linkedin.com/in/profile-match',
    thumbnail: 'https://picsum.photos/200/300?random=1',
    source: 'linkedin.com',
    match_level: 'High',
    found_at: new Date().toISOString(),
    type: 'website'
  },
  {
    id: 'fallback-2',
    title: 'Twitter Post',
    url: 'https://twitter.com/user/status/123456789',
    thumbnail: 'https://picsum.photos/200/300?random=2',
    source: 'twitter.com',
    match_level: 'Medium',
    found_at: new Date().toISOString(),
    type: 'social'
  },
  {
    id: 'fallback-3',
    title: 'Instagram Image Match',
    url: 'https://instagram.com/p/abc123',
    thumbnail: 'https://picsum.photos/200/300?random=3',
    source: 'instagram.com',
    match_level: 'High',
    found_at: new Date().toISOString(),
    type: 'image'
  },
  {
    id: 'fallback-4',
    title: 'Facebook Profile',
    url: 'https://facebook.com/profile',
    thumbnail: 'https://picsum.photos/200/300?random=4',
    source: 'facebook.com',
    match_level: 'High',
    found_at: new Date().toISOString(),
    type: 'website'
  },
  {
    id: 'fallback-5',
    title: 'Personal Blog Post',
    url: 'https://medium.com/blog-post',
    thumbnail: 'https://picsum.photos/200/300?random=5',
    source: 'medium.com',
    match_level: 'Medium',
    found_at: new Date().toISOString(),
    type: 'website'
  },
  {
    id: 'fallback-6',
    title: 'YouTube Video',
    url: 'https://youtube.com/watch?v=abcdef',
    thumbnail: 'https://picsum.photos/200/300?random=6',
    source: 'youtube.com',
    match_level: 'Medium',
    found_at: new Date().toISOString(),
    type: 'social'
  },
  {
    id: 'fallback-7',
    title: 'GitHub Profile',
    url: 'https://github.com/username',
    thumbnail: 'https://picsum.photos/200/300?random=7',
    source: 'github.com',
    match_level: 'High',
    found_at: new Date().toISOString(),
    type: 'website'
  },
  {
    id: 'fallback-8',
    title: 'Pinterest Board',
    url: 'https://pinterest.com/user/board',
    thumbnail: 'https://picsum.photos/200/300?random=8',
    source: 'pinterest.com',
    match_level: 'Low',
    found_at: new Date().toISOString(),
    type: 'image'
  },
  {
    id: 'fallback-9',
    title: 'TikTok Profile',
    url: 'https://tiktok.com/@username',
    thumbnail: 'https://picsum.photos/200/300?random=9',
    source: 'tiktok.com',
    match_level: 'Medium',
    found_at: new Date().toISOString(),
    type: 'social'
  },
  {
    id: 'fallback-10',
    title: 'Behance Portfolio',
    url: 'https://behance.net/username',
    thumbnail: 'https://picsum.photos/200/300?random=10',
    source: 'behance.net',
    match_level: 'High',
    found_at: new Date().toISOString(),
    type: 'image'
  },
  {
    id: 'fallback-11',
    title: 'Dribbble Portfolio',
    url: 'https://dribbble.com/username',
    thumbnail: 'https://picsum.photos/200/300?random=11',
    source: 'dribbble.com',
    match_level: 'Medium',
    found_at: new Date().toISOString(),
    type: 'image'
  },
  {
    id: 'fallback-12',
    title: 'Reddit Comment',
    url: 'https://reddit.com/r/subreddit/comments/123456',
    thumbnail: 'https://picsum.photos/200/300?random=12',
    source: 'reddit.com',
    match_level: 'Low',
    found_at: new Date().toISOString(),
    type: 'social'
  }
];

export default function Results() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isReady, accessLevel } = useProtectedRoute(false);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>("Today");
  const [totalResults, setTotalResults] = useState<number>(0);
  const { toast } = useToast();

  // Add a new state for API connection status
  const [apiConnectionFailed, setApiConnectionFailed] = useState<boolean>(false);

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
        console.log("Fetching results for search ID:", id);
        
        // Check if Google API credentials are loaded
        const credentialsLoaded = await googleApiManager.checkApiCredentials();
        if (!credentialsLoaded.configured) {
          console.error("Google API credentials not configured:", credentialsLoaded.message);
          setApiConnectionFailed(true);
        }
        
        const isTemporarySearch = id.startsWith('temp_');
        const isFallbackSearch = id.startsWith('fallback_') || id.startsWith('generated_') || id.startsWith('recovery_');
        
        if (isTemporarySearch) {
          const tempSearchData = sessionStorage.getItem(`temp_search_${id}`);
          
          if (tempSearchData) {
            const searchData = JSON.parse(tempSearchData);
            const queryText = searchData.query_text || "Unknown search";
            const queryType = searchData.query_type;
            
            console.log("Processing temporary search:", queryText, "of type", queryType);
            setQuery(queryText);
            
            const searchParams = searchData.search_params_json ? 
                                 JSON.parse(searchData.search_params_json) : {};
            
            try {
              let searchResponse;
              if (queryType === 'image') {
                console.log("Performing image search");
                searchResponse = await performImageSearch(searchData.image_url, 'anonymous', searchParams);
              } else {
                console.log("Performing Google search");
                searchResponse = await performGoogleSearch(queryText, 'anonymous', searchParams);
              }
              
              console.log("Google API response:", searchResponse);
              
              if (searchResponse && searchResponse.items && searchResponse.items.length > 0) {
                setTotalResults(searchResponse.searchInformation?.totalResults || searchResponse.items.length);
                
                const formattedResults = searchResponse.items.map((item: any, index: number) => {
                  const thumbnailUrl = 
                    item.pagemap?.cse_thumbnail?.[0]?.src || 
                    item.pagemap?.cse_image?.[0]?.src || 
                    item.image?.thumbnailLink ||
                    `https://picsum.photos/200/300?random=${index+1}`;
                  
                  const source = item.displayLink || "unknown";
                  let type = 'website';
                  
                  if (item.pagemap?.videoobject || 
                      source.includes('youtube') || 
                      source.includes('vimeo') || 
                      source.includes('tiktok') ||
                      item.title?.toLowerCase().includes('video')) {
                    type = 'social';
                  } else if (
                      item.pagemap?.imageobject || 
                      item.pagemap?.cse_image ||
                      source.includes('instagram') || 
                      source.includes('flickr') || 
                      source.includes('pinterest') ||
                      item.title?.toLowerCase().includes('image') ||
                      item.title?.toLowerCase().includes('photo') ||
                      queryType === 'image'
                  ) {
                    type = 'image';
                  } else if (
                      source.includes('twitter') || 
                      source.includes('facebook') || 
                      source.includes('linkedin') || 
                      source.includes('reddit') ||
                      item.title?.toLowerCase().includes('profile')
                  ) {
                    type = 'social';
                  }
                  
                  let matchScore = 0;
                  
                  matchScore += Math.max(0, 1 - (index / searchResponse.items.length));
                  
                  if (item.title && item.title.toLowerCase().includes(queryText.toLowerCase())) {
                    matchScore += 0.4;
                  }
                  
                  if (item.snippet && item.snippet.toLowerCase().includes(queryText.toLowerCase())) {
                    matchScore += 0.2;
                  }
                  
                  if (item.pagemap?.metatags?.[0]?.['og:title']?.toLowerCase().includes(queryText.toLowerCase())) {
                    matchScore += 0.2;
                  }
                  
                  if (item.link?.toLowerCase().includes(queryText.toLowerCase().replace(/\s+/g, ''))) {
                    matchScore += 0.2;
                  }
                  
                  matchScore = Math.min(1, matchScore);
                  
                  let matchLevel = 'Medium';
                  if (matchScore > 0.65) matchLevel = 'High';
                  else if (matchScore < 0.3) matchLevel = 'Low';
                  
                  return {
                    id: `result-${index}`,
                    title: item.title,
                    url: item.link,
                    thumbnail: thumbnailUrl,
                    source: source,
                    match_level: matchLevel,
                    found_at: new Date().toISOString(),
                    type: type,
                    snippet: item.snippet || null
                  };
                });
                
                setResults(formattedResults);
                console.log("Formatted results:", formattedResults);
              } else if (searchResponse && searchResponse.error) {
                console.error("API error:", searchResponse.error);
                throw new Error(searchResponse.error.message || "API error");
              } else {
                setResults([]);
                setTotalResults(0);
                toast({
                  title: "No Results Found",
                  description: "Your search didn't return any results. Try different keywords or parameters.",
                  variant: "default",
                });
              }
            } catch (error) {
              console.error("Error performing direct search:", error);
              
              try {
                console.log("Attempting fallback using Google API Manager");
                const managerResponse = await googleApiManager.optimizedSearch(
                  queryType, 
                  queryText, 
                  searchParams
                );
                
                if (managerResponse && managerResponse.results && managerResponse.results.length > 0) {
                  setResults(managerResponse.results);
                  setTotalResults(managerResponse.results.length);
                  console.log("Using results from Google API Manager:", managerResponse.results);
                } else {
                  throw new Error("No results from API Manager");
                }
              } catch (managerError) {
                console.error("API Manager fallback failed:", managerError);
                
                try {
                  const googleApiKey = process.env.GOOGLE_API_KEY || sessionStorage.getItem('GOOGLE_API_KEY');
                  const googleCseId = process.env.GOOGLE_CSE_ID || sessionStorage.getItem('GOOGLE_CSE_ID');
                  
                  if (googleApiKey && googleCseId) {
                    console.log("Attempting direct Google API call");
                    const directApiUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCseId}&q=${encodeURIComponent(queryText)}`;
                    
                    const directResponse = await fetch(directApiUrl);
                    const directData = await directResponse.json();
                    
                    if (directData.items && directData.items.length > 0) {
                      const directResults = directData.items.map((item: any, index: number) => ({
                        id: `direct-${index}`,
                        title: item.title,
                        url: item.link,
                        thumbnail: item.pagemap?.cse_image?.[0]?.src || `https://picsum.photos/200/300?random=${index+1}`,
                        source: item.displayLink,
                        match_level: index < 3 ? 'High' : index < 7 ? 'Medium' : 'Low',
                        found_at: new Date().toISOString(),
                        type: item.pagemap?.cse_image ? 'image' : 'website',
                        snippet: item.snippet
                      }));
                      
                      setResults(directResults);
                      setTotalResults(directResults.length);
                      console.log("Using results from direct Google API call:", directResults);
                    } else {
                      throw new Error("No results from direct API call");
                    }
                  } else {
                    throw new Error("Missing Google API credentials");
                  }
                } catch (directError) {
                  console.error("All Google API methods failed:", directError);
                  toast({
                    title: "Search API Error",
                    description: "Unable to connect to Google Search API. Using sample results instead.",
                    variant: "destructive",
                  });
                  
                  setResults(FALLBACK_RESULTS);
                  setTotalResults(FALLBACK_RESULTS.length);
                }
              }
            }
          } else {
            console.error("No temporary search data found");
            setResults(FALLBACK_RESULTS);
            setTotalResults(FALLBACK_RESULTS.length);
            setQuery("Unknown search");
          }
        } else {
          try {
            const cachedData = await getSearchResults(id);
            
            if (cachedData && cachedData.results && cachedData.results.length > 0) {
              console.log("Using cached results:", cachedData);
              setResults(cachedData.results);
              setQuery(cachedData.query);
              setTotalResults(cachedData.results.length);
            } else {
              let searchQuery;
              
              try {
                searchQuery = await getSearchQueryById(id);
                console.log("Found search query:", searchQuery);
              } catch (error) {
                console.error("Error fetching search query:", error);
                
                if (isFallbackSearch) {
                  const cachedParams = sessionStorage.getItem(`search_params_${id}`);
                  if (cachedParams) {
                    searchQuery = JSON.parse(cachedParams);
                    console.log("Using cached search parameters:", searchQuery);
                  }
                }
              }
              
              if (searchQuery) {
                const queryText = searchQuery.query_text || "Unknown search";
                const queryType = searchQuery.query_type;
                setQuery(queryText);
                
                const searchParams = searchQuery.search_params_json ? 
                                    JSON.parse(searchQuery.search_params_json) : {};
                
                try {
                  console.log("Attempting direct Google API search for", queryType, queryText);
                  let searchResponse;
                  
                  if (queryType === 'image') {
                    console.log("Performing image search with URL:", searchQuery.image_url);
                    if (!searchQuery.image_url) {
                      throw new Error("Missing image URL for image search");
                    }
                    searchResponse = await performImageSearch(searchQuery.image_url, searchQuery.user_id, searchParams);
                  } else {
                    console.log("Performing Google search with text:", queryText);
                    if (!queryText || queryText === "Unknown search") {
                      throw new Error("Missing query text for search");
                    }
                    searchResponse = await performGoogleSearch(queryText, searchQuery.user_id, searchParams);
                  }
                  
                  console.log("Google API search response:", searchResponse);
                  
                  if (searchResponse && searchResponse.items && searchResponse.items.length > 0) {
                    setTotalResults(searchResponse.searchInformation?.totalResults || searchResponse.items.length);
                    
                    const formattedResults = searchResponse.items.map((item: any, index: number) => {
                      
                      const thumbnailUrl = 
                        item.pagemap?.cse_thumbnail?.[0]?.src || 
                        item.pagemap?.cse_image?.[0]?.src || 
                        item.image?.thumbnailLink ||
                        `https://picsum.photos/200/300?random=${index+1}`;
                      
                      const source = item.displayLink || "unknown";
                      let type = 'website';
                      
                      if (item.pagemap?.videoobject || 
                          source.includes('youtube') || 
                          source.includes('vimeo') || 
                          source.includes('tiktok') ||
                          item.title?.toLowerCase().includes('video')) {
                        type = 'social';
                      } else if (
                          item.pagemap?.imageobject || 
                          item.pagemap?.cse_image ||
                          source.includes('instagram') || 
                          source.includes('flickr') || 
                          source.includes('pinterest') ||
                          item.title?.toLowerCase().includes('image') ||
                          item.title?.toLowerCase().includes('photo') ||
                          queryType === 'image'
                      ) {
                        type = 'image';
                      } else if (
                          source.includes('twitter') || 
                          source.includes('facebook') || 
                          source.includes('linkedin') || 
                          source.includes('reddit') ||
                          item.title?.toLowerCase().includes('profile')
                      ) {
                        type = 'social';
                      }
                      
                      let matchScore = 0;
                      
                      matchScore += Math.max(0, 1 - (index / searchResponse.items.length));
                      
                      if (item.title && item.title.toLowerCase().includes(queryText.toLowerCase())) {
                        matchScore += 0.4;
                      }
                      
                      if (item.snippet && item.snippet.toLowerCase().includes(queryText.toLowerCase())) {
                        matchScore += 0.2;
                      }
                      
                      if (item.pagemap?.metatags?.[0]?.['og:title']?.toLowerCase().includes(queryText.toLowerCase())) {
                        matchScore += 0.2;
                      }
                      
                      if (item.link?.toLowerCase().includes(queryText.toLowerCase().replace(/\s+/g, ''))) {
                        matchScore += 0.2;
                      }
                      
                      matchScore = Math.min(1, matchScore);
                      
                      let matchLevel = 'Medium';
                      if (matchScore > 0.65) matchLevel = 'High';
                      else if (matchScore < 0.3) matchLevel = 'Low';
                      
                      return {
                        id: `result-${index}`,
                        title: item.title,
                        url: item.link,
                        thumbnail: thumbnailUrl,
                        source: source,
                        match_level: matchLevel,
                        found_at: new Date().toISOString(),
                        type: type,
                        snippet: item.snippet || null
                      };
                    });
                    
                    setResults(formattedResults);
                    console.log("Formatted Google API results:", formattedResults);
                  } else if (searchResponse && searchResponse.error) {
                    console.error("API error:", searchResponse.error);
                    throw new Error(searchResponse.error.message || "API error");
                  } else {
                    console.warn("Google API returned empty results");
                    throw new Error("Empty results from Google API");
                  }
                } catch (error) {
                  console.error("Error performing Google search:", error);
                  
                  try {
                    console.log("Attempting fallback using Google API Manager");
                    const managerResponse = await googleApiManager.optimizedSearch(
                      queryType, 
                      queryText, 
                      searchParams
                    );
                    
                    if (managerResponse && managerResponse.results && managerResponse.results.length > 0) {
                      setResults(managerResponse.results);
                      setTotalResults(managerResponse.results.length);
                      console.log("Using results from Google API Manager:", managerResponse.results);
                    } else {
                      throw new Error("No results from API Manager");
                    }
                  } catch (managerError) {
                    console.error("Fallback search also failed:", managerError);
                    
                    try {
                      const googleApiKey = process.env.GOOGLE_API_KEY || sessionStorage.getItem('GOOGLE_API_KEY');
                      const googleCseId = process.env.GOOGLE_CSE_ID || sessionStorage.getItem('GOOGLE_CSE_ID');
                      
                      if (googleApiKey && googleCseId) {
                        console.log("Attempting direct Google API call");
                        const directApiUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCseId}&q=${encodeURIComponent(queryText)}`;
                        
                        const directResponse = await fetch(directApiUrl);
                        const directData = await directResponse.json();
                        
                        if (directData.items && directData.items.length > 0) {
                          const directResults = directData.items.map((item: any, index: number) => ({
                            id: `direct-${index}`,
                            title: item.title || "Untitled",
                            url: item.link || "#",
                            thumbnail: item.pagemap?.cse_image?.[0]?.src || `https://picsum.photos/200/300?random=${index+1}`,
                            source: item.displayLink || "unknown",
                            match_level: index < 3 ? 'High' : index < 7 ? 'Medium' : 'Low',
                            found_at: new Date().toISOString(),
                            type: item.pagemap?.cse_image ? 'image' : 'website',
                            snippet: item.snippet || null
                          }));
                          
                          setResults(directResults);
                          setTotalResults(directResults.length);
                          console.log("Using results from direct Google API call:", directResults);
                        } else {
                          throw new Error("No results from direct API call");
                        }
                      } else {
                        throw new Error("Missing Google API credentials");
                      }
                    } catch (directError) {
                      console.error("All Google API methods failed:", directError);
                      toast({
                        title: "Search Error",
                        description: "Unable to fetch results from Google. Please check your API configuration.",
                        variant: "destructive",
                      });
                      
                      setResults(FALLBACK_RESULTS);
                      setTotalResults(FALLBACK_RESULTS.length);
                    }
                  }
                }
              } else {
                console.error("Search query not found");
                toast({
                  title: "Search Not Found",
                  description: "The search you're looking for couldn't be found.",
                  variant: "destructive",
                });
                navigate("/search");
              }
            }
          } catch (error) {
            console.error("Error fetching search or results:", error);
            toast({
              title: "Error",
              description: "Could not fetch search results. Please try again.",
              variant: "destructive",
            });
            navigate("/search");
          }
        }
        
        const now = new Date();
        setSearchDate(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      } catch (error) {
        console.error("Error in fetchResults:", error);
        setApiConnectionFailed(true);
        toast({
          title: "Search Error",
          description: "Something went wrong with your search. Please try again.",
          variant: "destructive",
        });
        navigate("/search");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };
    
    if (isReady) {
      fetchResults();
    }
  }, [isReady, id, toast, navigate]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex">
        <div className="hidden md:block w-64 border-r">
          <Sidebar />
        </div>
        <main className="flex-grow">
          <div className="px-8 pt-24 pb-8 max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Search Results</h1>
              <p className="text-muted-foreground text-lg">
                Results for {query ? <span className="font-medium">{query}</span> : <span>Unknown search</span>}
              </p>
            </div>

            {apiConnectionFailed && (
              <Card className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-amber-800 dark:text-amber-300">API Connection Issue</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Using sample results. There was an issue connecting to the Google search service. 
                        Please check if the Google API key and CSE ID are correctly set in Supabase secrets.
                      </p>
                    </div>
                    <div>
                      <Button 
                        onClick={() => navigate("/search")}
                        variant="default"
                        className="bg-amber-600 hover:bg-amber-700 w-full md:w-auto"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mb-8 mt-6">
              <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:gap-8">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>Searched on {searchDate}</span>
                </div>
                <div className="flex items-center">
                  <Image className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>Content search</span>
                </div>
                <div className="flex items-center">
                  <Info className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>Found {totalResults.toLocaleString()} matches</span>
                </div>
              </CardContent>
            </Card>

            {!user && (
              <Card className="mb-6 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-purple-800 dark:text-purple-300">Free Preview</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You're viewing limited results as a guest. Sign up for free to save your searches and access more features.
                      </p>
                    </div>
                    <div>
                      <Button 
                        onClick={() => navigate("/signup")}
                        variant="default"
                        className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto"
                      >
                        Sign Up Free
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {results.length === 0 ? (
              <Card className="p-8 my-8 text-center">
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any matches for your search. Try using different keywords or search parameters.
                </p>
                <Button onClick={() => navigate("/search")}>Try a New Search</Button>
              </Card>
            ) : (
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
                    itemsPerPage={8}
                    accessLevel={accessLevel}
                    onUpgrade={handleUpgrade}
                  />
                </TabsContent>
                
                <TabsContent value="images" className="mt-4">
                  <PaginatedResults
                    results={results.filter(r => r.type === 'image')}
                    itemsPerPage={8}
                    accessLevel={accessLevel}
                    onUpgrade={handleUpgrade}
                  />
                </TabsContent>
                
                <TabsContent value="websites" className="mt-4">
                  <PaginatedResults
                    results={results.filter(r => r.type === 'website')}
                    itemsPerPage={8}
                    accessLevel={accessLevel}
                    onUpgrade={handleUpgrade}
                  />
                </TabsContent>
                
                <TabsContent value="social" className="mt-4">
                  <PaginatedResults
                    results={results.filter(r => r.type === 'social')}
                    itemsPerPage={8}
                    accessLevel={accessLevel}
                    onUpgrade={handleUpgrade}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
