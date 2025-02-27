
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
    const { planId, returnUrl } = await req.json();
    console.log('Request data:', { planId, returnUrl });
    
    // Get authentication information from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(JSON.stringify({ error: 'No authorization header' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    
    console.log('Initializing Supabase client');
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false }
    });
    
    // Get the user from the auth header
    console.log('Getting user from auth header');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return new Response(JSON.stringify({ error: 'Unable to get user' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    if (!user) {
      console.error('No user found');
      return new Response(JSON.stringify({ error: 'User not found' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    console.log('User authenticated:', { userId: user.id, email: user.email });
    
    // Get the plan details
    console.log('Fetching plan details for planId:', planId);
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single();
      
    if (planError) {
      console.error('Error fetching plan:', planError);
      return new Response(JSON.stringify({ error: 'Plan not found' }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    if (!plan) {
      console.error('No plan found with id:', planId);
      return new Response(JSON.stringify({ error: 'Plan not found' }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    console.log('Plan details retrieved:', plan);
    
    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY environment variable not set');
      return new Response(JSON.stringify({ error: 'Stripe secret key not found' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    console.log('Initializing Stripe client');
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });
    
    // Create a Stripe checkout session
    console.log('Creating Stripe checkout session');
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
            unit_amount: Math.round(plan.price * 100), // Convert to cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl.replace('/success', '/canceled')}`,
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
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
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
