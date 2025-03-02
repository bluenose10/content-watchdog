
export type SearchQuery = {
  id?: string;
  user_id: string;
  query_text?: string;
  query_type: 'name' | 'hashtag' | 'image' | 'plagiarism';
  image_url?: string;
  created_at?: string;
  search_params_json?: string | null; // Stores advanced search parameters
  scheduled?: boolean; // Whether this is a scheduled search
  schedule_interval?: string; // Schedule interval (hourly, daily, weekly, etc.)
  last_run?: string; // When the scheduled search was last executed
}

export type SearchResult = {
  id?: string;
  search_id: string;
  title: string;
  url: string;
  thumbnail: string;
  source: string;
  match_level: 'Low' | 'Medium' | 'High';
  found_at: string;
  created_at?: string;
  similarity_score?: number; // For image searches
  relevance_score?: number; // For text searches
}

export type UserSubscription = {
  id?: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: string;
  created_at?: string;
  plans?: Plan;
}

export type Plan = {
  id: string;
  name: string;
  price: number;
  search_limit: number;
  result_limit: number;
  monitoring_limit: number;
  scheduled_search_limit?: number; // Number of scheduled searches allowed
  created_at?: string;
}

// Advanced search parameter types
export type TextSearchParams = {
  exactMatch?: boolean;
  dateRestrict?: 'last24h' | 'lastWeek' | 'lastMonth' | 'lastYear' | string;
  searchType?: 'web' | 'image' | 'news' | 'social' | string;
  contentFilter?: 'high' | 'medium' | 'off' | string;
  siteFilter?: string[]; // Array of domains to filter results to
  excludeSites?: string[]; // Array of domains to exclude
  language?: string; // Language code (e.g., 'en', 'es')
  country?: string; // Country code (e.g., 'us', 'uk')
  fileType?: string; // Specific file types to search for
  rights?: 'cc_publicdomain' | 'cc_attribute' | 'cc_sharealike' | 'cc_noncommercial' | 'cc_nonderived' | string; // Creative Commons licenses
  sortBy?: 'relevance' | 'date' | string; // How to sort results
  maxResults?: number; // Maximum number of results to return
}

export type ImageSearchParams = {
  similarityThreshold?: number; // 0.0 - 1.0
  maxResults?: number;
  searchMode?: 'strict' | 'relaxed' | string;
  includeSimilarColors?: boolean; // Include results with similar color profiles
  includePartialMatches?: boolean; // Include results that only match part of the image
  minSize?: 'small' | 'medium' | 'large' | 'xlarge' | string; // Minimum image size
  imageType?: 'face' | 'photo' | 'clipart' | 'lineart' | 'animated' | string; // Type of image
  imageColorType?: 'color' | 'gray' | 'mono' | 'trans' | string; // Color type of images
  dominantColor?: string; // Dominant color in the image
}
