
import { createSearchQuery, uploadSearchImage } from "@/lib/db-service";
import { SearchQuery, TextSearchParams, ImageSearchParams } from "@/lib/db-types";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { SEARCH_LIMITS } from "@/lib/constants";
import { getCacheKey, getCachedResults, cacheResults } from "@/lib/search-cache";
import { supabase } from "@/lib/supabase";

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

// Admin emails with no search limits
const ADMIN_EMAILS = ['admin@influenceguard.com', 'test@example.com'];

// Track user search counts (in-memory for demo purposes, should be persisted in production)
const userSearchCounts: Record<string, { 
  monthly: number, 
  weekly: number,
  lastReset: { 
    monthly: number,
    weekly: number
  } 
}> = {};

// Cache search parameters for retrieval in results page
function cacheSearchParams(searchId: string, params: any): void {
  try {
    sessionStorage.setItem(`search_params_${searchId}`, JSON.stringify(params));
  } catch (error) {
    console.error("Error caching search parameters:", error);
  }
}

/**
 * Check if user has exceeded their search limits based on subscription tier
 * @param userId User ID
 * @param isPro Whether the user has a Pro subscription
 * @param userEmail User's email address to check admin status
 * @returns Object with isAllowed and message
 */
async function checkSearchLimits(userId: string, isPro: boolean, userEmail?: string): Promise<{ isAllowed: boolean, message: string }> {
  // Admin users have unlimited searches
  if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
    console.log("Admin user detected - bypassing search limits");
    return { isAllowed: true, message: "" };
  }

  // Initialize user search counts if not present
  if (!userSearchCounts[userId]) {
    userSearchCounts[userId] = {
      monthly: 0,
      weekly: 0,
      lastReset: {
        monthly: Date.now(),
        weekly: Date.now()
      }
    };
  }

  const now = Date.now();
  const oneMonth = 30 * 24 * 60 * 60 * 1000;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const user = userSearchCounts[userId];

  // Check if we need to reset monthly count
  if (now - user.lastReset.monthly > oneMonth) {
    user.monthly = 0;
    user.lastReset.monthly = now;
  }
  
  // Check if we need to reset weekly count
  if (now - user.lastReset.weekly > oneWeek) {
    user.weekly = 0;
    user.lastReset.weekly = now;
  }

  // Check limits based on subscription tier
  if (isPro) {
    // Pro user checks
    if (user.monthly >= SEARCH_LIMITS.PRO.MONTHLY) {
      return { 
        isAllowed: false, 
        message: `You've reached your monthly search limit (${SEARCH_LIMITS.PRO.MONTHLY} searches). Monthly limit resets in ${formatTimeRemaining(user.lastReset.monthly + oneMonth - now)}.`
      };
    }
    
    if (user.weekly >= SEARCH_LIMITS.PRO.WEEKLY) {
      return {
        isAllowed: false,
        message: `You've reached your weekly search limit (${SEARCH_LIMITS.PRO.WEEKLY} searches). Weekly limit resets in ${formatTimeRemaining(user.lastReset.weekly + oneWeek - now)}.`
      };
    }
  } else {
    // Basic user checks
    if (user.monthly >= SEARCH_LIMITS.BASIC.MONTHLY) {
      return { 
        isAllowed: false, 
        message: `You've reached your monthly search limit (${SEARCH_LIMITS.BASIC.MONTHLY} searches). Monthly limit resets in ${formatTimeRemaining(user.lastReset.monthly + oneMonth - now)}.`
      };
    }
    
    if (user.weekly >= SEARCH_LIMITS.BASIC.WEEKLY) {
      return {
        isAllowed: false,
        message: `You've reached your weekly search limit (${SEARCH_LIMITS.BASIC.WEEKLY} search). Weekly limit resets in ${formatTimeRemaining(user.lastReset.weekly + oneWeek - now)}.`
      };
    }
  }

  return { isAllowed: true, message: "" };
}

/**
 * Format time remaining in a human-readable format
 */
function formatTimeRemaining(timeMs: number): string {
  const days = Math.floor(timeMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((timeMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours !== 1 ? 's' : ''}`;
}

/**
 * Increment user search count
 */
function incrementSearchCount(userId: string, userEmail?: string): void {
  // Admin users don't have their counts incremented
  if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
    console.log("Admin user - not incrementing search count");
    return;
  }

  if (!userSearchCounts[userId]) {
    userSearchCounts[userId] = {
      monthly: 0,
      weekly: 0,
      lastReset: {
        monthly: Date.now(),
        weekly: Date.now()
      }
    };
  }
  
  userSearchCounts[userId].monthly += 1;
  userSearchCounts[userId].weekly += 1;
}

// Handles text-based searches (name or hashtag) with enhanced parameters
export async function handleTextSearch(
  query: string, 
  queryType: "name" | "hashtag", 
  user: User | null,
  searchParams?: Partial<TextSearchParams>
): Promise<string> {
  // Check if user is authenticated
  if (!user) {
    throw new Error("You must be signed in to perform searches");
  }

  // Validate and sanitize input
  const sanitizedQuery = sanitizeSearchQuery(query);
  if (!sanitizedQuery) {
    throw new Error("Search query cannot be empty");
  }

  // Check search limits for this user (simplified check - in production would query DB)
  const isPro = true; // Mock function - in production should check subscription status
  const limitCheck = await checkSearchLimits(user.id, isPro, user.email);
  if (!limitCheck.isAllowed) {
    throw new Error(limitCheck.message);
  }

  // Check cache first for this query
  const formattedQuery = queryType === 'hashtag' && !sanitizedQuery.startsWith('#') 
    ? `#${sanitizedQuery}` 
    : sanitizedQuery;

  // Merge default parameters with user-provided parameters
  const mergedParams: TextSearchParams = {
    ...DEFAULT_TEXT_PARAMS,
    ...searchParams
  };

  // Generate cache key
  const cacheKey = getCacheKey(queryType, formattedQuery, mergedParams);
  const cachedResults = getCachedResults(cacheKey);
  
  if (cachedResults) {
    console.log(`Using cached results for ${queryType} search: ${formattedQuery}`);
    return cachedResults.id || `cache_${crypto.randomUUID()}`;
  }

  console.log(`Performing ${queryType} search with enhanced parameters:`, mergedParams);
  
  // Increment the user's search count
  incrementSearchCount(user.id, user.email);

  try {
    // Process the search using our secure function
    const searchId = await processSearch({
      user_id: user.id,
      query_type: queryType,
      query_text: formattedQuery,
      search_params_json: JSON.stringify(mergedParams)
    }, user);
    
    // Cache the search parameters for the results page
    cacheSearchParams(searchId, {
      user_id: user.id,
      query_type: queryType,
      query_text: formattedQuery,
      search_params_json: JSON.stringify(mergedParams) 
    });
    
    // Cache the results
    cacheResults(cacheKey, { id: searchId });
    
    return searchId;
  } catch (error) {
    // If there's an error with the materialized view refresh, we can still continue
    // by generating a mock search ID for the client
    console.error("Search query processing error:", error);
    
    // Create a fallback search ID
    const fallbackId = `fallback_${crypto.randomUUID()}`;
    
    // Cache search parameters for fallback ID
    cacheSearchParams(fallbackId, {
      user_id: user.id,
      query_type: queryType,
      query_text: formattedQuery,
      search_params_json: JSON.stringify(mergedParams)
    });
    
    cacheResults(cacheKey, { id: fallbackId });
    
    return fallbackId;
  }
}

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
    const cacheKey = getCacheKey("image", imageUrl, mergedParams);
    const cachedResults = getCachedResults(cacheKey);
    
    if (cachedResults) {
      console.log(`Using cached results for image search: ${imageUrl}`);
      return cachedResults.id || `cache_${crypto.randomUUID()}`;
    }
    
    // Increment the user's search count
    incrementSearchCount(user.id, user.email);

    try {
      // Process the search using our secure function
      const searchId = await processSearch({
        user_id: user.id,
        query_type: "image",
        image_url: imageUrl,
        search_params_json: JSON.stringify(mergedParams)
      }, user);
      
      // Cache search parameters for the results page
      cacheSearchParams(searchId, {
        user_id: user.id,
        query_type: "image",
        image_url: imageUrl,
        search_params_json: JSON.stringify(mergedParams)
      });
      
      // Cache the results
      cacheResults(cacheKey, { id: searchId });
      
      return searchId;
    } catch (dbError) {
      // If there's an error with the database operation, use a fallback ID
      console.error("Image search database error:", dbError);
      const fallbackId = `fallback_${crypto.randomUUID()}`;
      
      // Cache search parameters for fallback ID
      cacheSearchParams(fallbackId, {
        user_id: user.id,
        query_type: "image",
        image_url: imageUrl,
        search_params_json: JSON.stringify(mergedParams)
      });
      
      cacheResults(cacheKey, { id: fallbackId });
      return fallbackId;
    }
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

// Common processing for all search types - updated to handle database errors gracefully
async function processSearch(
  searchData: SearchQuery, 
  user: User | null
): Promise<string> {
  if (!user) {
    throw new Error("User must be signed in to perform searches");
  }
  
  try {
    // Use the secure function instead of direct table insertion
    const { data, error } = await supabase.rpc(
      'insert_search_query',
      {
        p_user_id: searchData.user_id,
        p_query_type: searchData.query_type,
        p_query_text: searchData.query_text || null,
        p_search_params_json: searchData.search_params_json || null,
        p_image_url: searchData.image_url || null
      }
    );
    
    if (error) {
      // Check if it's the materialized view error
      if (error.message && error.message.includes('materialized view')) {
        console.error("Materialized view error, but continuing with search:", error);
        // Generate a random ID to allow the search to continue
        return `generated_${crypto.randomUUID()}`;
      }
      
      console.error("Error creating search query:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("Failed to create search query");
    }
    
    return data;
  } catch (error) {
    console.error("Error in processSearch:", error);
    // If any unexpected error happens, throw a more user-friendly message
    // but still allow processing to continue with a generated ID
    if (error instanceof Error && error.message.includes('materialized view')) {
      return `recovery_${crypto.randomUUID()}`;
    }
    throw new Error(`Failed to create search: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
