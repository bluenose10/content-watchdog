
import { User } from "@supabase/supabase-js";
import { AccessLevel } from "@/hooks/useProtectedRoute";
import { ImageSearchParams } from "@/lib/db-types";
import { uploadImageAndCreateQuery } from "../image-search";
import { checkRateLimit } from "../quota-manager";
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
      const rateLimitCheck = await checkRateLimit(user?.id);
      if (!rateLimitCheck.allowed) {
        setError(rateLimitCheck.message || "Rate limit exceeded. Please try again later.");
        return;
      }
    }

    // Upload image and create search query
    const { searchId, imageUrl } = await uploadImageAndCreateQuery(file, user, params);

    if (!searchId || !imageUrl) {
      setError("Failed to upload image. Please try again.");
      return;
    }

    console.log(`Image search created with ID: ${searchId}`);

    // For admin users, make sure to pre-fetch results
    if (accessLevel === AccessLevel.ADMIN) {
      try {
        // Attempt to pre-fetch results to prevent 404s
        console.log("Admin user detected, pre-fetching results");
        // For image search, we may need to pass the image URL instead of query text
        await optimizedSearch("image", imageUrl, params || {});
      } catch (prefetchError) {
        console.error("Admin pre-fetch error:", prefetchError);
        // Continue even if pre-fetch fails, as results page will handle this
      }
    }

    // Navigate to results page
    navigate(`/results?id=${searchId}`);
  } catch (error) {
    console.error("Image search error:", error);
    setError("An unexpected error occurred while processing your image. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
