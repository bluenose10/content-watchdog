
export type SearchQuery = {
  id?: string;
  user_id: string;
  query_text?: string;
  query_type: 'name' | 'hashtag' | 'image';
  image_url?: string;
  created_at?: string;
  search_params_json?: string | null; // Changed from search_params to search_params_json
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
  scheduled_search_limit?: number; // New field: Number of scheduled searches allowed
  created_at?: string;
}
