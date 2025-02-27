
// Define CORS headers for edge functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define the Stripe domain (needed for some CORS operations)
export const stripeDomain = Deno.env.get('SUPABASE_URL') || '';
