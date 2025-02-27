
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

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
    
    // Initialize Stripe
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set");
      return new Response(
        JSON.stringify({ success: false, message: 'Server configuration error' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
    
    // Create Stripe client
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
    
    try {
      // Retrieve the session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log('Session status:', session.status);
      
      // Check if payment was successful
      if (session.payment_status === 'paid') {
        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Extract customer information
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const userId = session.client_reference_id;  // This should be set during checkout creation
        
        if (userId) {
          try {
            // Get subscription details from Stripe
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            
            // Update or create user subscription in database
            const { data, error } = await supabase
              .from('user_subscriptions')
              .upsert({
                user_id: userId,
                status: subscription.status,
                plan_id: subscription.items.data[0].price.lookup_key || subscription.items.data[0].price.id,
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              })
              .select();
            
            if (error) {
              console.error('Error updating subscription in database:', error);
            } else {
              console.log('Subscription updated in database:', data);
            }
          } catch (dbError) {
            console.error('Error saving subscription details:', dbError);
          }
        }
        
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
            message: `Payment not completed. Status: ${session.payment_status}` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Stripe error: ${stripeError.message}` 
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
