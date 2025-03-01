
import { uploadSearchImage } from "@/lib/db-service";
import { ImageSearchParams, SearchQuery } from "@/lib/db-types";
import { User } from "@supabase/supabase-js";
import { getCacheKey, getCachedResults, cacheResults } from "@/lib/search-cache";
import { optimizedSearch } from "@/lib/search";
import { checkSearchLimits, incrementSearchCount } from "./quota-manager";
import { processSearch } from "./search-utils";

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
  const mergedParams: ImageSearchParams = {
    ...DEFAULT_IMAGE_PARAMS,
    ...searchParams
  };

  console.log("Performing image search with enhanced parameters:", mergedParams);
  
  try {
    // Upload the image and get its URL
    const imageUrl = await uploadSearchImage(file, user.id);
    
    // Check cache for this image
    // Note: For image search, we'd ideally use perceptual hashing to check for similar images
    // For this implementation, we'll use the image URL as cache key
    const cacheKey = getCacheKey("image", imageUrl, mergedParams);
    const cachedResults = getCachedResults(cacheKey);
    
    if (cachedResults) {
      console.log(`Using cached results for image search: ${imageUrl}`);
      return cachedResults.id || `cache_${crypto.randomUUID()}`;
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
      cacheResults(cacheKey, { id: searchId });
      
      return searchId;
    } catch (error: any) {
      // If there's a permission error with popular_searches, continue with a temporary ID
      if (error.code === "42501" && error.message?.includes("popular_searches")) {
        console.warn("Permission error with popular_searches, using temporary search ID");
        // Generate a temporary ID for this session
        const tempId = `temp_${Date.now()}`;
        // Still cache the temporary ID
        cacheResults(cacheKey, { id: tempId });
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

// Helper function to validate image files
export function validateImageFile(file: File): void {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Please use JPEG, PNG, WebP, or GIF.`);
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    throw new Error(`File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size is 10MB.`);
  }
}
