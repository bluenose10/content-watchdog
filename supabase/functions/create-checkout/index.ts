
// Follow Deno and Oak best practices
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Edge function invoked: create-checkout");
    
    // Parse the request body
    const { planId, priceId, returnUrl } = await req.json();
    
    console.log("Request parameters:", { planId, priceId, returnUrl });
    
    // Validate inputs
    if (!planId || !returnUrl) {
      console.error("Missing required parameters");
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }
    
    // For this demo version, we'll just return a mock checkout session
    // In a real implementation, you would integrate with Stripe here
    const mockSessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;
    
    console.log("Created mock session:", mockSessionId);
    
    return new Response(
      JSON.stringify({ 
        url: "https://checkout.stripe.com/mock-checkout-session",
        sessionId: mockSessionId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(
      JSON.stringify({ error: 'Server error: ' + error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
