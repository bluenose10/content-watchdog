
import { createClient } from '@supabase/supabase-js';

// Use the actual Supabase project values from the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://phkdkwusblkngypuwgao.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoa2Rrd3VzYmxrbmd5cHV3Z2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NTk2NTMsImV4cCI6MjA1NjIzNTY1M30.3EqEUglSG8hAqwkKMul68LOzvnhQ6Z7M-LEXslPdVTY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
