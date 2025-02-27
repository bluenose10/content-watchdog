
// Follow Deno and Oak best practices
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

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
    
    // Get request body
    const { planId, priceId, returnUrl } = await req.json();
    console.log("Request payload:", { planId, priceId, returnUrl });

    // Basic validation
    if (!priceId) {
      console.error("Missing required parameter: priceId");
      return new Response(
        JSON.stringify({ error: 'Missing Stripe Price ID' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    if (!returnUrl) {
      console.error("Missing required parameter: returnUrl");
      return new Response(
        JSON.stringify({ error: 'Missing return URL' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error("Missing environment variable: STRIPE_SECRET_KEY");
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing Stripe secret key' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2022-11-15',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Get the Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase credentials");
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing Supabase credentials' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user's ID from the auth header
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader) {
      try {
        console.log("Authenticating user with token...");
        const { data: { user }, error: userError } = await supabase.auth.getUser(
          authHeader.replace('Bearer ', '')
        );

        if (userError) {
          console.error("Error authenticating user:", userError);
          return new Response(
            JSON.stringify({ error: 'Authentication failed: ' + userError.message }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
              status: 401 
            }
          );
        }

        if (user) {
          userId = user.id;
          console.log("Authenticated user:", userId);
        }
      } catch (error) {
        console.error("Exception during authentication:", error);
        return new Response(
          JSON.stringify({ error: 'Authentication error: ' + error.message }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 500 
          }
        );
      }
    } else {
      console.warn("No Authorization header present");
      // For development purposes, we might continue without a user ID,
      // but for production this should return an error
      userId = "anonymous";
    }

    try {
      // Create a Stripe checkout session
      console.log("Creating Stripe checkout session...");
      
      const sessionParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${new URL(returnUrl).origin}/payment-canceled`,
        metadata: {
          planId,
          userId,
        },
      };
      
      // Add customer_email if we have a user ID
      if (userId && userId !== "anonymous") {
        // We might want to fetch the user's email from our database here
        const { data: userData, error: userError } = await supabase
          .from('auth.users')
          .select('email')
          .eq('id', userId)
          .single();
          
        if (!userError && userData?.email) {
          sessionParams.customer_email = userData.email;
          console.log("Added customer email to session:", userData.email);
        }
      }
      
      const session = await stripe.checkout.sessions.create(sessionParams);
      console.log("Checkout session created:", session.id);

      // Return the checkout URL to the client
      return new Response(
        JSON.stringify({ 
          url: session.url,
          sessionId: session.id
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 200 
        }
      );
    } catch (stripeError) {
      console.error("Stripe error:", stripeError);
      return new Response(
        JSON.stringify({ error: 'Stripe error: ' + stripeError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }
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
