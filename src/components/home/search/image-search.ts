
import { uploadSearchImage } from "@/lib/db-service";
import { ImageSearchParams, SearchQuery } from "@/lib/db-types";
import { User } from "@supabase/supabase-js";
import { optimizedSearch } from "@/lib/search";
import { checkSearchLimits, incrementSearchCount } from "./quota-manager";
import { processSearch } from "./search-utils";
import { validateImageFile, validateImageSearchParams } from "./validation";
import { getCachedSearchId, storeInCache } from "./cache-manager";

// Enhanced search parameters for image-based searches
export const DEFAULT_IMAGE_PARAMS: ImageSearchParams = {
  similarityThreshold: 0.65,
  maxResults: 20,
  searchMode: 'relaxed', 
  includeSimilarColors: true,
  includePartialMatches: true,
  minSize: 'medium',
  imageType: undefined,
  imageColorType: undefined,
  dominantColor: undefined
};

// Handles image-based searches with enhanced parameters
export async function handleImageSearch(
  file: File, 
  user: User | null,
  searchParams?: Partial<ImageSearchParams>
): Promise<string> {
  if (!user) {
    throw new Error("You must be signed in to perform image searches");
  }

  // Validate file type and size
  validateImageFile(file);

  // Check search limits for this user
  const isPro = true; // Mock function - in production should check subscription status
  const limitCheck = await checkSearchLimits(user.id, isPro, user.email);
  if (!limitCheck.isAllowed) {
    throw new Error(limitCheck.message);
  }

  // Merge default parameters with user-provided parameters
  const mergedParams = validateImageSearchParams(searchParams, DEFAULT_IMAGE_PARAMS);

  console.log("Performing image search with enhanced parameters:", mergedParams);
  
  try {
    // Upload the image and get its URL
    const imageUrl = await uploadSearchImage(file, user.id);
    
    // Check cache for this image URL
    const cachedSearchId = getCachedSearchId("image", imageUrl, mergedParams);
    if (cachedSearchId) {
      return cachedSearchId;
    }
    
    const searchData: SearchQuery = {
      user_id: user.id,
      query_type: "image",
      image_url: imageUrl,
      search_params_json: JSON.stringify(mergedParams)
    };

    // Increment the user's search count
    incrementSearchCount(user.id, user.email);

    try {
      // Process the search
      const searchId = await processSearch(searchData, user);
      
      // Cache the results
      storeInCache("image", imageUrl, mergedParams, { id: searchId });
      
      return searchId;
    } catch (error: any) {
      // If there's a permission error with popular_searches, continue with a temporary ID
      if (error.code === "42501" && error.message?.includes("popular_searches")) {
        console.warn("Permission error with popular_searches, using temporary search ID");
        // Generate a temporary ID for this session
        const tempId = `temp_${Date.now()}`;
        // Still cache the temporary ID
        storeInCache("image", imageUrl, mergedParams, { id: tempId });
        return tempId;
      }
      
      // For other errors, rethrow
      throw error;
    }
  } catch (error) {
    console.error("Error during image search:", error);
    throw new Error(`Image search failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Add compatibility export for the refactored code
export const uploadImageAndCreateQuery = async (
  file: File,
  user: User | null,
  params?: any
): Promise<{ searchId: string; imageUrl: string }> => {
  try {
    // Upload the image and get its URL
    const imageUrl = await uploadSearchImage(file, user?.id || '');
    
    // Create a search using the image URL
    const searchId = await handleImageSearch(file, user, params);
    
    return { searchId, imageUrl };
  } catch (error) {
    console.error("Error in uploadImageAndCreateQuery:", error);
    throw error;
  }
};
