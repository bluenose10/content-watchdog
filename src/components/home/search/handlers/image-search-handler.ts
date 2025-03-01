
import { User } from "@supabase/supabase-js";
import { AccessLevel } from "@/hooks/useProtectedRoute";
import { ImageSearchParams } from "@/lib/db-types";
import { handleImageSearch } from "../image-search";
import { checkSearchLimits } from "../quota-manager";
import { optimizedSearch } from "@/lib/search/search-api-manager";

type ImageSearchProps = {
  file: File;
  user: User | null;
  accessLevel: AccessLevel;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  navigate: (path: string) => void;
  params?: ImageSearchParams;
};

export const executeImageSearch = async ({
  file,
  user,
  accessLevel,
  setIsLoading,
  setError,
  navigate,
  params,
}: ImageSearchProps) => {
  if (!file) {
    setError("Please select an image to search");
    return;
  }

  // Validate file is an image
  if (!file.type.startsWith('image/')) {
    setError("Please upload a valid image file");
    return;
  }

  try {
    setIsLoading(true);
    setError(null);

    console.log(`Executing image search with access level: ${accessLevel}`);

    // Check rate limits for non-admin users
    if (accessLevel !== AccessLevel.ADMIN) {
      const rateLimitCheck = await checkSearchLimits(user?.id || 'anonymous', false, user?.email);
      if (!rateLimitCheck.isAllowed) {
        setError(rateLimitCheck.message || "Rate limit exceeded. Please try again later.");
        return;
      }
    }

    if (!user) {
      setError("You must be signed in to perform image searches");
      return;
    }

    // Upload image and create search query using the existing handleImageSearch function
    try {
      const searchId = await handleImageSearch(file, user, params);
      
      if (!searchId) {
        setError("Failed to upload image. Please try again.");
        return;
      }

      console.log(`Image search created with ID: ${searchId}`);

      // For admin users, make sure to pre-fetch results
      if (accessLevel === AccessLevel.ADMIN) {
        try {
          // Attempt to pre-fetch results to prevent 404s
          console.log("Admin user detected, pre-fetching results");
          // For image search, we'll pass placeholder values since we don't have the imageUrl yet
          await optimizedSearch("image", "admin-prefetch", params || {});
        } catch (prefetchError) {
          console.error("Admin pre-fetch error:", prefetchError);
          // Continue even if pre-fetch fails, as results page will handle this
        }
      }

      // Navigate to results page
      navigate(`/results?id=${searchId}`);
    } catch (error: any) {
      console.error("Image upload error:", error);
      setError(error.message || "Failed to process image search. Please try again.");
    }
  } catch (error) {
    console.error("Image search error:", error);
    setError("An unexpected error occurred while processing your image. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
