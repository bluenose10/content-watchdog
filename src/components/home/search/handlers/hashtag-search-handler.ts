
import { User } from "@supabase/supabase-js";
import { AccessLevel } from "@/hooks/useProtectedRoute";
import { TextSearchParams } from "@/lib/db-types";
import { createTextSearchQuery } from "../search-utils";
import { checkRateLimit } from "../quota-manager";
import { optimizedSearch } from "@/lib/search/search-api-manager";

type HashtagSearchProps = {
  query: string;
  user: User | null;
  accessLevel: AccessLevel;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  navigate: (path: string) => void;
  params?: TextSearchParams;
};

export const executeHashtagSearch = async ({
  query,
  user,
  accessLevel,
  setIsLoading,
  setError,
  navigate,
  params,
}: HashtagSearchProps) => {
  // Validate the hashtag format
  if (!query.trim()) {
    setError("Please enter a hashtag to search");
    return;
  }

  // Add hashtag symbol if not present
  let formattedQuery = query.trim();
  if (!formattedQuery.startsWith('#')) {
    formattedQuery = '#' + formattedQuery;
  }

  try {
    setIsLoading(true);
    setError(null);

    console.log(`Executing hashtag search for "${formattedQuery}" with access level: ${accessLevel}`);

    // Check rate limits for non-admin users only
    if (accessLevel !== AccessLevel.ADMIN) {
      const rateLimitCheck = await checkRateLimit(user?.id);
      if (!rateLimitCheck.allowed) {
        setError(rateLimitCheck.message || "Rate limit exceeded. Please try again later.");
        return;
      }
    }

    // Create search query
    const searchId = await createTextSearchQuery({
      query: formattedQuery,
      type: "hashtag",
      user,
      params,
    });

    if (!searchId) {
      setError("Failed to create search. Please try again.");
      return;
    }

    console.log(`Search created with ID: ${searchId}`);

    // For admin users, make sure to pre-fetch results
    if (accessLevel === AccessLevel.ADMIN) {
      try {
        // Attempt to pre-fetch results to prevent 404s
        console.log("Admin user detected, pre-fetching results");
        await optimizedSearch("hashtag", formattedQuery, params || {});
      } catch (prefetchError) {
        console.error("Admin pre-fetch error:", prefetchError);
        // Continue even if pre-fetch fails, as results page will handle this
      }
    }

    // Navigate to results page
    navigate(`/results?id=${searchId}`);
  } catch (error) {
    console.error("Hashtag search error:", error);
    setError("An unexpected error occurred. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
