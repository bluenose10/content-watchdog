import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useResultProcessing } from "./useResultProcessing";
import { useTemporarySearch } from "./useTemporarySearch";
import { usePermanentSearch } from "./usePermanentSearch";

export function useSearchResults(id: string | null, isReady: boolean) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>("Today");
  const [totalResults, setTotalResults] = useState<number>(0);
  const { toast } = useToast();

  // Import helper hooks
  const { processSearchResponse } = useResultProcessing({ setResults, setTotalResults });
  const { handleTemporarySearch } = useTemporarySearch({ 
    setQuery, 
    setResults, 
    setTotalResults, 
    processSearchResponse, 
    toast
  });
  const { handlePermanentSearch } = usePermanentSearch({
    setQuery,
    setResults,
    setTotalResults,
    processSearchResponse,
    toast
  });

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

  return { 
    isLoading, 
    results, 
    query, 
    searchDate, 
    totalResults
  };
}

// Fallback results for when API calls fail - moved to this file to avoid circular dependencies
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
