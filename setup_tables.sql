
-- Create search_queries table
CREATE TABLE search_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query_text TEXT,
  query_type TEXT NOT NULL CHECK (query_type IN ('name', 'hashtag', 'image')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  search_params_json TEXT,
  scheduled BOOLEAN DEFAULT false,
  schedule_interval TEXT,
  last_run TIMESTAMP WITH TIME ZONE,
  
  -- Make sure image_url is present for image searches, and query_text for other types
  CONSTRAINT valid_search_data CHECK (
    (query_type = 'image' AND image_url IS NOT NULL) OR 
    (query_type != 'image' AND query_text IS NOT NULL)
  )
);

-- ADD INDEXES for frequently queried columns
CREATE INDEX idx_search_queries_user_id ON search_queries(user_id);
CREATE INDEX idx_search_queries_query_type ON search_queries(query_type);
CREATE INDEX idx_search_queries_created_at ON search_queries(created_at DESC);
CREATE INDEX idx_search_queries_scheduled ON search_queries(scheduled) WHERE scheduled = true;

-- Create search_results table
CREATE TABLE search_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  search_id UUID NOT NULL REFERENCES search_queries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  source TEXT NOT NULL,
  match_level TEXT NOT NULL CHECK (match_level IN ('Low', 'Medium', 'High')),
  found_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  similarity_score FLOAT,
  relevance_score FLOAT
);

-- ADD INDEXES for search_results
CREATE INDEX idx_search_results_search_id ON search_results(search_id);
CREATE INDEX idx_search_results_match_level ON search_results(match_level, search_id);
CREATE INDEX idx_search_results_similarity ON search_results(similarity_score DESC) WHERE similarity_score IS NOT NULL;
CREATE INDEX idx_search_results_relevance ON search_results(relevance_score DESC) WHERE relevance_score IS NOT NULL;

-- Create plans table for subscription plans
CREATE TABLE plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  search_limit INTEGER NOT NULL,
  result_limit INTEGER NOT NULL,
  monitoring_limit INTEGER NOT NULL,
  scheduled_search_limit INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_subscriptions table
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id)
);

-- ADD INDEX for subscription lookup
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status, current_period_end);

-- Insert default plans
INSERT INTO plans (id, name, price, search_limit, result_limit, monitoring_limit, scheduled_search_limit) VALUES
('free', 'Free', 0, 5, 5, 0, 0),
('pro', 'Pro', 19.99, 50, -1, 10, 5),
('business', 'Business', 49.99, -1, -1, -1, -1);

-- Enable RLS on all tables
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own search queries
CREATE POLICY select_own_search_queries ON search_queries 
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own search queries
CREATE POLICY insert_own_search_queries ON search_queries 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to view results of their searches
CREATE POLICY select_own_search_results ON search_results 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM search_queries 
      WHERE search_queries.id = search_results.search_id 
      AND search_queries.user_id = auth.uid()
    )
  );

-- Allow all users to view plan details
CREATE POLICY select_plans ON plans 
  FOR SELECT USING (true);
  
-- Allow users to view their own subscription
CREATE POLICY select_own_subscription ON user_subscriptions 
  FOR SELECT USING (auth.uid() = user_id);

-- Create storage bucket for uploads
-- Note: You'll need to create this in the Supabase dashboard or API
-- INSERT INTO storage.buckets (id, name) VALUES ('uploads', 'User uploads');

-- Set up storage RLS
-- GRANT ALL ON storage.buckets TO authenticated;
-- GRANT ALL ON storage.objects TO authenticated;

-- Create stats tables for performance monitoring
CREATE TABLE search_metrics (
  id SERIAL PRIMARY KEY,
  query_type TEXT NOT NULL,
  execution_time_ms INTEGER NOT NULL,
  result_count INTEGER NOT NULL,
  cache_hit BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create materialized view for popular searches
CREATE MATERIALIZED VIEW popular_searches AS
SELECT 
  query_text,
  query_type,
  COUNT(*) as search_count
FROM 
  search_queries
WHERE 
  created_at > (CURRENT_DATE - INTERVAL '30 days')
  AND query_text IS NOT NULL
GROUP BY 
  query_text, query_type
ORDER BY 
  search_count DESC
LIMIT 100;

-- Create index on the materialized view
CREATE INDEX idx_popular_searches_count ON popular_searches(search_count DESC);

-- Create function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_popular_searches()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY popular_searches;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to refresh the view periodically (every 100 inserts)
CREATE TRIGGER refresh_popular_searches_trigger
AFTER INSERT ON search_queries
REFERENCING NEW TABLE AS new_table
FOR EACH STATEMENT
WHEN (pg_trigger_depth() = 0)
EXECUTE PROCEDURE refresh_popular_searches();
