
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
    // Test basic Supabase connection first
    console.log("Testing basic Supabase connection...");
    try {
      const { data, error } = await supabase.from('dummy_check').select('count').limit(1);
      
      // If there's a permission error, that's actually good - it means the connection worked
      // but we just don't have access to that table
      if (error && error.code !== 'PGRST116') {
        console.log("Supabase basic connection check response:", error);
      } else {
        console.log("Supabase basic connection successful");
      }
    } catch (basicError) {
      console.warn("Basic Supabase connection check failed, continuing with edge function test:", basicError);
    }
    
    // Try calling the function directly to check if it's accessible
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/get-search-credentials`;
    console.log(`Testing connection to Supabase edge function at: ${edgeFunctionUrl}`);
    
    // First try to get the token
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    
    if (!token) {
      console.warn("No auth token available for Supabase function call");
      // Try an anonymous request to see if the endpoint is reachable
      const response = await fetch(edgeFunctionUrl, {
        method: 'OPTIONS',
        headers: {
          'apikey': supabaseAnonKey
        }
      });
      
      if (response.status === 404) {
        console.error("Supabase edge function not found (404)");
        return false;
      }
      
      // Even a CORS preflight response means the endpoint is reachable
      console.log("Supabase edge function reachable via OPTIONS preflight");
      return true;
    }
    
    // Full test with authorization
    const response = await fetch(edgeFunctionUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Edge function response status:", response.status);
    
    if (response.ok) {
      const responseData = await response.json();
      console.log("Supabase edge function connection test successful with data:", responseData);
      return true;
    } else {
      const errorText = await response.text();
      console.error("Supabase edge function test failed:", response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error("Failed to connect to Supabase:", error);
    return false;
  }
}
