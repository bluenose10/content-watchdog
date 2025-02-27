
// Follow Deno and Oak best practices
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// For development/demo environment
const MOCK_MODE = true; // Set to false when ready for production

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Edge function invoked: create-checkout");
    
    // Parse the request body
    const requestData = await req.json();
    const { planId, priceId, returnUrl, userId } = requestData;
    
    console.log("Request parameters:", requestData);
    
    // Validate inputs
    if (!planId || !returnUrl) {
      console.error("Missing required parameters", { planId, returnUrl });
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters',
          details: { planId, returnUrl }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }
    
    // For demo/development, use mock checkout instead of real Stripe
    if (MOCK_MODE) {
      console.log("Using mock checkout mode");
      
      // Generate a fake session ID
      const mockSessionId = `mock_sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      
      // Create mock checkout URL that goes to our own mock checkout page
      const origin = new URL(returnUrl).origin;
      const mockCheckoutUrl = `${origin}/mock-checkout?session_id=${mockSessionId}&plan_id=${planId}&return_url=${encodeURIComponent(returnUrl)}`;
      
      console.log("Created mock checkout session:", mockSessionId);
      console.log("Mock checkout URL:", mockCheckoutUrl);
      
      return new Response(
        JSON.stringify({
          sessionId: mockSessionId,
          url: mockCheckoutUrl,
          mockMode: true
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 200 
        }
      );
    }
    
    // For production: use real Stripe checkout
    // Initialize Stripe
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set");
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing Stripe key' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
    
    // Create Stripe client
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16', // Use a stable API version
    });
    
    // Create checkout session
    console.log("Creating Stripe checkout session with price ID:", priceId);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      client_reference_id: userId || undefined,
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(returnUrl).origin}/canceled`,
    });
    
    console.log("Checkout session created successfully:", session.id);
    
    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error in create-checkout function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown server error',
        stack: error.stack,
        name: error.name
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
