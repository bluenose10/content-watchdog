
import { createSearchQuery, uploadSearchImage } from "@/lib/db-service";
import { SearchQuery, TextSearchParams, ImageSearchParams } from "@/lib/db-types";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

// Enhanced search parameters for text-based searches
const DEFAULT_TEXT_PARAMS: TextSearchParams = {
  exactMatch: false,
  contentFilter: 'medium',
  sortBy: 'relevance',
  searchType: 'web',
  language: 'en',
  country: 'us',
  rights: undefined,
  dateRestrict: undefined,
  siteFilter: [],
  excludeSites: []
};

// Enhanced search parameters for image-based searches
const DEFAULT_IMAGE_PARAMS: ImageSearchParams = {
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

// Handles text-based searches (name or hashtag) with enhanced parameters
export async function handleTextSearch(
  query: string, 
  queryType: "name" | "hashtag", 
  user: User | null,
  searchParams?: Partial<TextSearchParams>
): Promise<string> {
  // Validate and sanitize input
  const sanitizedQuery = sanitizeSearchQuery(query);
  if (!sanitizedQuery) {
    throw new Error("Search query cannot be empty");
  }

  // Merge default parameters with user-provided parameters
  const mergedParams: TextSearchParams = {
    ...DEFAULT_TEXT_PARAMS,
    ...searchParams
  };

  // If it's a hashtag search, ensure the query has a # prefix
  const formattedQuery = queryType === 'hashtag' && !sanitizedQuery.startsWith('#') 
    ? `#${sanitizedQuery}` 
    : sanitizedQuery;

  console.log(`Performing ${queryType} search with enhanced parameters:`, mergedParams);
  
  const searchData: SearchQuery = {
    user_id: user?.id || '00000000-0000-0000-0000-000000000000', // Anonymous user ID
    query_type: queryType,
    query_text: formattedQuery,
    search_params_json: JSON.stringify(mergedParams)
  };

  return await processSearch(searchData, user);
}

// Handles image-based searches with enhanced parameters
export async function handleImageSearch(
  file: File, 
  user: User | null,
  searchParams?: Partial<ImageSearchParams>
): Promise<string> {
  if (!user) {
    throw new Error("User must be signed in for image search");
  }

  // Validate file type and size
  validateImageFile(file);

  // Merge default parameters with user-provided parameters
  const mergedParams: ImageSearchParams = {
    ...DEFAULT_IMAGE_PARAMS,
    ...searchParams
  };

  console.log("Performing image search with enhanced parameters:", mergedParams);
  
  try {
    // Upload the image and get its URL
    const imageUrl = await uploadSearchImage(file, user.id);
    
    const searchData: SearchQuery = {
      user_id: user.id,
      query_type: "image",
      image_url: imageUrl,
      search_params_json: JSON.stringify(mergedParams)
    };

    return await processSearch(searchData, user);
  } catch (error) {
    console.error("Error during image search:", error);
    throw new Error(`Image search failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Helper function to sanitize search queries
function sanitizeSearchQuery(query: string): string {
  // Remove excessive whitespace
  let sanitized = query.trim().replace(/\s+/g, ' ');
  
  // Remove potentially harmful characters
  sanitized = sanitized.replace(/[<>]/g, '');
  
  return sanitized;
}

// Helper function to validate image files
function validateImageFile(file: File): void {
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

// Common processing for all search types
async function processSearch(
  searchData: SearchQuery, 
  user: User | null
): Promise<string> {
  let searchId: string;
  
  if (user) {
    // For registered users, create a permanent search query
    const newSearch = await createSearchQuery(searchData);
    if (!newSearch || !newSearch.id) {
      throw new Error("Failed to create search");
    }
    searchId = newSearch.id;
  } else {
    // For anonymous users, create a temporary search ID
    searchId = `temp_${crypto.randomUUID()}`;
    // Store search data in session storage for anonymous users
    sessionStorage.setItem(`temp_search_${searchId}`, JSON.stringify(searchData));
  }
  
  return searchId;
}
