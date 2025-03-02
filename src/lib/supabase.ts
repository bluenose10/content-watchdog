
import { createClient } from '@supabase/supabase-js';

// Use the actual Supabase project values from the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://phkdkwusblkngypuwgao.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoa2Rrd3VzYmxrbmd5cHV3Z2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NTk2NTMsImV4cCI6MjA1NjIzNTY1M30.3EqEUglSG8hAqwkKMul68LOzvnhQ6Z7M-LEXslPdVTY';

// Create the Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  realtime: {
    timeout: 30000,
  },
});

// Add a function to test the connection
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('dummy_check').select('count').limit(1);
    
    // If there's a permission error, that's actually good - it means the connection worked
    // but we just don't have access to that table
    if (error && error.code !== 'PGRST116') {
      console.error("Supabase connection test failed:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to connect to Supabase:", error);
    return false;
  }
}
