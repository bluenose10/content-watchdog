
import { User } from "@supabase/supabase-js";
import { AccessLevel } from "@/hooks/useProtectedRoute";
import { TextSearchParams } from "@/lib/db-types";
import { processSearch } from "../search-utils";
import { checkSearchLimits } from "../quota-manager";
import { optimizedSearch } from "@/lib/search/search-api-manager";

type NameSearchProps = {
  query: string;
  user: User | null;
  accessLevel: AccessLevel;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  navigate: (path: string) => void;
  params?: TextSearchParams;
};

export const executeNameSearch = async ({
  query,
  user,
  accessLevel,
  setIsLoading,
  setError,
  navigate,
  params,
}: NameSearchProps) => {
  if (!query.trim()) {
    setError("Please enter a search term");
    return;
  }

  try {
    setIsLoading(true);
    setError(null);

    console.log(`Executing name search for "${query}" with access level: ${accessLevel}`);

    // Check rate limits for non-admin users only
    if (accessLevel !== AccessLevel.ADMIN) {
      const rateLimitCheck = await checkSearchLimits(user?.id || 'anonymous', false, user?.email);
      if (!rateLimitCheck.isAllowed) {
        setError(rateLimitCheck.message || "Rate limit exceeded. Please try again later.");
        return;
      }
    }

    // Create search query with all necessary parameters
    const searchData = {
      user_id: user?.id,
      query_type: "name",
      query_text: query,
      search_params_json: JSON.stringify(params || {})
    };

    // For anonymous users or when searchId couldn't be created
    if (!user) {
      setError("You must be signed in to perform searches");
      return;
    }

    const searchId = await processSearch(searchData, user);

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
        await optimizedSearch("name", query, params || {});
      } catch (prefetchError) {
        console.error("Admin pre-fetch error:", prefetchError);
        // Continue even if pre-fetch fails, as results page will handle this
      }
    }

    // Navigate to results page
    navigate(`/results?id=${searchId}`);
  } catch (error) {
    console.error("Name search error:", error);
    setError("An unexpected error occurred. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
