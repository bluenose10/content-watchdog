
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Verify-checkout function invoked');
    
    // Get request data
    const { sessionId } = await req.json();
    console.log('Session ID:', sessionId);
    
    if (!sessionId) {
      console.error('No session ID provided');
      return new Response(
        JSON.stringify({ success: false, message: 'No session ID provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // For demo purposes, we'll just simulate a successful verification
    // In a real app, we would verify with Stripe
    if (sessionId.startsWith('cs_test_')) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Payment verified successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid session ID' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Unexpected error in verify-checkout function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
