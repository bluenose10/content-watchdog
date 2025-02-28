
import { createSearchQuery, uploadSearchImage } from "@/lib/db-service";
import { SearchQuery, TextSearchParams, ImageSearchParams } from "@/lib/db-types";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { SEARCH_LIMITS } from "@/lib/constants";
import { getCacheKey, getCachedResults, cacheResults } from "@/lib/search-cache";

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
  
  const searchData: SearchQuery = {
    user_id: user.id,
    query_type: queryType,
    query_text: formattedQuery,
    search_params_json: JSON.stringify(mergedParams)
  };

  // Increment the user's search count
  incrementSearchCount(user.id, user.email);

  // Process the search
  const searchId = await processSearch(searchData, user);
  
  // Cache the results
  // Note: In a real implementation, we would fetch the results and cache them here
  // For this mock implementation, we're just caching the search ID
  cacheResults(cacheKey, { id: searchId });
  
  return searchId;
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

    // Process the search
    const searchId = await processSearch(searchData, user);
    
    // Cache the results
    cacheResults(cacheKey, { id: searchId });
    
    return searchId;
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
  if (!user) {
    throw new Error("User must be signed in to perform searches");
  }
  
  // For registered users, create a permanent search query
  const newSearch = await createSearchQuery(searchData);
  if (!newSearch || !newSearch.id) {
    throw new Error("Failed to create search");
  }
  
  return newSearch.id;
}
