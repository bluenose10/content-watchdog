
import { createClient } from '@supabase/supabase-js';
import type { Database } from './db-types';

// Use mock values if environment variables are not available
// This prevents the app from crashing during development or when env vars aren't set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key-for-development';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
