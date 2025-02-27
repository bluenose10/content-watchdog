
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import Stripe from 'https://esm.sh/stripe@12.16.0?target=deno';

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
    console.log('Create-checkout function invoked');
    
    // Get request data
    const requestData = await req.json();
    const { planId, returnUrl } = requestData;
    console.log('Request data:', { planId, returnUrl });
    
    if (!planId || !returnUrl) {
      console.error('Missing required parameters:', { planId, returnUrl });
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters. Both planId and returnUrl are required.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Get authentication information from the request
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log('Initializing Supabase client');
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false }
    });
    
    // Get the user from the auth header
    let userId = 'anonymous';
    let userEmail = 'guest@example.com';
    
    if (authHeader) {
      console.log('Getting user from auth header');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
      } else if (user) {
        userId = user.id;
        userEmail = user.email || userEmail;
        console.log('User authenticated:', { userId, email: userEmail });
      } else {
        console.log('No user found in auth header');
      }
    } else {
      console.log('No auth header, proceeding as guest checkout');
    }
    
    // Get the plan details
    console.log('Fetching plan details for planId:', planId);
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single();
      
    if (planError) {
      console.error('Error fetching plan:', planError);
      return new Response(
        JSON.stringify({ error: 'Plan not found', details: planError.message }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    if (!plan) {
      console.error('No plan found with id:', planId);
      return new Response(
        JSON.stringify({ error: 'Plan not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log('Plan details retrieved:', plan);
    
    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY environment variable not set');
      return new Response(
        JSON.stringify({ 
          error: 'Stripe secret key not found. Please configure STRIPE_SECRET_KEY in Supabase Edge Function Secrets.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log('Initializing Stripe client');
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });
    
    // Create a Stripe checkout session
    console.log('Creating Stripe checkout session');
    
    // Format price to avoid errors (ensure it's a number and multiply by 100 for cents)
    const priceInCents = Math.round(Number(plan.price) * 100);
    if (isNaN(priceInCents)) {
      console.error('Invalid price format:', plan.price);
      return new Response(
        JSON.stringify({ error: 'Invalid price format in plan' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Set up cancellation URL
    const cancelUrl = returnUrl.includes('/success') 
      ? returnUrl.replace('/success', '/canceled') 
      : `${window.location.origin}/canceled`;
      
    console.log('Success URL:', returnUrl);
    console.log('Cancel URL:', cancelUrl);
    
    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.name} Subscription`,
              description: `Subscribe to our ${plan.name} plan`,
            },
            unit_amount: priceInCents,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      customer_email: userEmail,
      metadata: {
        user_id: userId,
        plan_id: planId,
      },
    };
    
    console.log('Stripe session params:', JSON.stringify(sessionParams));
    
    try {
      const session = await stripe.checkout.sessions.create(sessionParams);
      console.log('Stripe session created successfully:', { 
        sessionId: session.id, 
        url: session.url 
      });
      
      // Return the checkout URL to the client
      return new Response(
        JSON.stringify({ sessionId: session.id, url: session.url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (stripeError) {
      console.error('Error creating Stripe session:', stripeError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create Stripe checkout session', 
          details: stripeError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
  } catch (error) {
    console.error('Unexpected error in create-checkout function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
