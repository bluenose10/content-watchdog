
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
    
    // Get authentication information from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ success: false, message: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY environment variable not set');
      return new Response(
        JSON.stringify({ success: false, message: 'Stripe secret key not found' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Initializing Stripe client');
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });
    
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
      return new Response(
        JSON.stringify({ success: false, message: 'Unable to get user' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!user) {
      console.error('No user found');
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('User authenticated:', { userId: user.id, email: user.email });
    
    // Retrieve the checkout session from Stripe
    console.log('Retrieving checkout session from Stripe');
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log('Stripe session retrieved:', { 
        sessionId: session.id, 
        status: session.status,
        customerId: session.customer 
      });
      
      // Check if the payment was successful
      if (session.payment_status !== 'paid') {
        console.error('Payment not completed:', session.payment_status);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Payment not completed. Status: ${session.payment_status}` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Check if this session belongs to the current user
      if (session.client_reference_id !== user.id) {
        console.error('Session does not belong to current user');
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Session does not belong to current user' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Update user subscription in Supabase
      console.log('Updating user subscription');
      const planId = session.metadata?.plan_id;
      
      if (!planId) {
        console.error('No plan ID found in session metadata');
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'No plan ID found in session metadata' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Check if subscription already exists
      const { data: existingSubscription, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error('Error checking existing subscription:', subscriptionError);
      }
      
      // If subscription exists, update it, otherwise create new one
      let subscriptionResult;
      if (existingSubscription) {
        console.log('Updating existing subscription');
        subscriptionResult = await supabase
          .from('user_subscriptions')
          .update({
            plan_id: planId,
            stripe_subscription_id: session.subscription as string,
            stripe_customer_id: session.customer as string,
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        console.log('Creating new subscription');
        subscriptionResult = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_id: planId,
            stripe_subscription_id: session.subscription as string,
            stripe_customer_id: session.customer as string,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
      
      if (subscriptionResult.error) {
        console.error('Error updating subscription in database:', subscriptionResult.error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Error updating subscription in database' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Subscription updated successfully');
      
      // Return success
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Payment verified and subscription activated' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } catch (stripeError) {
      console.error('Error retrieving Stripe session:', stripeError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Error retrieving Stripe session', 
          details: stripeError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
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
