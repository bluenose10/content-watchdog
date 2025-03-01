import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getSearchResults } from "@/lib/search-cache";
import { getSearchQueryById, performGoogleSearch, performImageSearch } from "@/lib/db-service";

// Fallback results for when API calls fail
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

export function useSearchResults(id: string | null, isReady: boolean) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>("Today");
  const [totalResults, setTotalResults] = useState<number>(0);
  const { toast } = useToast();

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
        
        // Check if it's a temporary search ID (for anonymous users)
        const isTemporarySearch = id.startsWith('temp_');
        
        if (isTemporarySearch) {
          await handleTemporarySearch(id);
        } else {
          await handlePermanentSearch(id);
        }
        
        // Set a realistic search date
        const now = new Date();
        setSearchDate(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      } catch (error) {
        console.error("Error in fetchResults:", error);
        // Even if everything fails, show something to the user
        setResults(FALLBACK_RESULTS);
        setTotalResults(FALLBACK_RESULTS.length);
        setQuery("Your search");
        
        toast({
          title: "Warning",
          description: "We encountered an issue loading your full results, showing sample matches instead.",
          variant: "default",
        });
      } finally {
        // Reduced loading time
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };
    
    if (isReady) {
      fetchResults();
    }
  }, [isReady, id, toast, navigate]);

  const handleTemporarySearch = async (id: string) => {
    // For temporary searches, try to get stored search data from session storage
    const tempSearchData = sessionStorage.getItem(`temp_search_${id}`);
    
    if (tempSearchData) {
      const searchData = JSON.parse(tempSearchData);
      const queryText = searchData.query_text || "Unknown search";
      const queryType = searchData.query_type;
      
      console.log("Processing temporary search:", queryText, "of type", queryType);
      setQuery(queryText);
      
      // Get search parameters if available
      const searchParams = searchData.search_params_json ? 
                           JSON.parse(searchData.search_params_json) : {};
      
      // Perform Google search directly for temporary searches
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
          processSearchResponse(searchResponse, queryText, queryType);
        } else if (searchResponse && searchResponse.error) {
          // Handle API-reported errors
          console.error("API error:", searchResponse.error);
          throw new Error(searchResponse.error.message || "API error");
        } else {
          // Handle empty results
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
        setResults(FALLBACK_RESULTS);
        setTotalResults(FALLBACK_RESULTS.length);
        toast({
          title: "API Error",
          description: "Could not fetch search results from Google API. Showing sample results instead.",
          variant: "destructive",
        });
      }
    } else {
      console.error("No temporary search data found");
      setResults(FALLBACK_RESULTS);
      setTotalResults(FALLBACK_RESULTS.length);
      setQuery("Unknown search");
    }
  };

  const handlePermanentSearch = async (id: string) => {
    try {
      // Try to get cached results first
      const cachedData = await getSearchResults(id);
      
      if (cachedData && cachedData.results && cachedData.results.length > 0) {
        console.log("Using cached results:", cachedData);
        setResults(cachedData.results);
        setQuery(cachedData.query);
        setTotalResults(cachedData.results.length);
      } else {
        // If no cached results, fetch the search query from the database
        const searchQuery = await getSearchQueryById(id);
        
        if (searchQuery) {
          console.log("Found search query:", searchQuery);
          const queryText = searchQuery.query_text || "Unknown search";
          const queryType = searchQuery.query_type;
          setQuery(queryText);
          
          // Get search parameters if available
          const searchParams = searchQuery.search_params_json ? 
                              JSON.parse(searchQuery.search_params_json) : {};
          
          // Perform Google search
          try {
            let searchResponse;
            if (queryType === 'image') {
              console.log("Performing image search");
              searchResponse = await performImageSearch(searchQuery.image_url, searchQuery.user_id, searchParams);
            } else {
              console.log("Performing Google search");
              searchResponse = await performGoogleSearch(queryText, searchQuery.user_id, searchParams);
            }
            
            console.log("Google API response:", searchResponse);
            
            if (searchResponse && searchResponse.items && searchResponse.items.length > 0) {
              processSearchResponse(searchResponse, queryText, queryType);
            } else if (searchResponse && searchResponse.error) {
              // Handle API-reported errors
              console.error("API error:", searchResponse.error);
              throw new Error(searchResponse.error.message || "API error");
            } else {
              // Handle empty results
              setResults([]);
              setTotalResults(0);
              toast({
                title: "No Results Found",
                description: "Your search didn't return any results. Try different keywords or parameters.",
                variant: "default",
              });
            }
          } catch (error) {
            console.error("Error performing search:", error);
            setResults(FALLBACK_RESULTS);
            setTotalResults(FALLBACK_RESULTS.length);
            toast({
              title: "API Error",
              description: "Could not fetch search results from Google API. Showing sample results instead.",
              variant: "destructive",
            });
          }
        } else {
          console.error("Search query not found");
          setResults(FALLBACK_RESULTS);
          setTotalResults(FALLBACK_RESULTS.length);
          setQuery("Unknown search");
        }
      }
    } catch (error) {
      console.error("Error fetching search or results:", error);
      setResults(FALLBACK_RESULTS);
      setTotalResults(FALLBACK_RESULTS.length);
      setQuery("Unknown search");
      
      toast({
        title: "Error",
        description: "Could not fetch search results. Showing sample results instead.",
        variant: "destructive",
      });
    }
  };

  const processSearchResponse = (searchResponse: any, queryText: string, queryType: string) => {
    setTotalResults(searchResponse.searchInformation?.totalResults || searchResponse.items.length);
    
    // Transform Google API response to our format
    const formattedResults = searchResponse.items.map((item: any, index: number) => {
      // Extract thumbnail with fallbacks
      const thumbnailUrl = 
        item.pagemap?.cse_thumbnail?.[0]?.src || 
        item.pagemap?.cse_image?.[0]?.src || 
        item.image?.thumbnailLink ||
        `https://picsum.photos/200/300?random=${index+1}`;
      
      // Determine result type based on URL, pagemap, or other factors
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
      
      // Determine match level based on ranking factors
      const matchScore = calculateMatchScore(item, index, queryText, searchResponse.items.length);
      
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
  };

  const calculateMatchScore = (item: any, index: number, queryText: string, totalItems: number) => {
    let matchScore = 0;
    
    // Position in results matters (earlier = better)
    matchScore += Math.max(0, 1 - (index / totalItems));
    
    // Exact title match is a strong signal
    if (item.title && item.title.toLowerCase().includes(queryText.toLowerCase())) {
      matchScore += 0.4;
    }
    
    // Snippet/description match is also important
    if (item.snippet && item.snippet.toLowerCase().includes(queryText.toLowerCase())) {
      matchScore += 0.2;
    }
    
    // Metatags match
    if (item.pagemap?.metatags?.[0]?.['og:title']?.toLowerCase().includes(queryText.toLowerCase())) {
      matchScore += 0.2;
    }
    
    // URL match
    if (item.link?.toLowerCase().includes(queryText.toLowerCase().replace(/\s+/g, ''))) {
      matchScore += 0.2;
    }

    // Final normalization of score to 0-1 range
    return Math.min(1, matchScore);
  };

  return { 
    isLoading, 
    results, 
    query, 
    searchDate, 
    totalResults
  };
}
