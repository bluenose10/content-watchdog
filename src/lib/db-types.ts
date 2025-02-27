
export type SearchQuery = {
  id?: string;
  user_id: string;
  query_text?: string;
  query_type: 'name' | 'hashtag' | 'image';
  image_url?: string;
  created_at?: string;
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
}

export type UserSubscription = {
  id?: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: string;
  created_at?: string;
}

export type Plan = {
  id: string;
  name: string;
  price: number;
  search_limit: number;
  result_limit: number;
  monitoring_limit: number;
}
