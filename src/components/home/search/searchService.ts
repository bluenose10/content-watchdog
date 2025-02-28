
import { createSearchQuery, uploadSearchImage } from "@/lib/db-service";
import { SearchQuery } from "@/lib/db-types";
import { User } from "@supabase/supabase-js";

// Handles text-based searches (name or hashtag)
export async function handleTextSearch(
  query: string, 
  queryType: "name" | "hashtag", 
  user: User | null,
  searchParams?: {
    exactMatch?: boolean;
    dateRestrict?: string; // last24h, lastWeek, lastMonth, lastYear
    searchType?: string; // web, image, news, etc.
    contentFilter?: string; // high, medium, off
  }
): Promise<string> {
  const searchData: SearchQuery = {
    user_id: user?.id || '00000000-0000-0000-0000-000000000000', // Anonymous user ID
    query_type: queryType,
    query_text: query,
    // Store searchParams as a JSON string instead of directly
    search_params_json: searchParams ? JSON.stringify(searchParams) : null
  };

  return await processSearch(searchData, user);
}

// Handles image-based searches
export async function handleImageSearch(
  file: File, 
  user: User | null,
  searchParams?: {
    similarityThreshold?: number; // 0.0 - 1.0
    maxResults?: number;
    searchMode?: "strict" | "relaxed";
  }
): Promise<string> {
  if (!user) {
    throw new Error("User must be signed in for image search");
  }

  const imageUrl = await uploadSearchImage(file, user.id);
  
  const searchData: SearchQuery = {
    user_id: user.id,
    query_type: "image",
    image_url: imageUrl,
    // Store searchParams as a JSON string instead of directly
    search_params_json: searchParams ? JSON.stringify(searchParams) : null
  };

  return await processSearch(searchData, user);
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
