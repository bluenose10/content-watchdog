
import { supabase } from './supabase';

export const createCheckoutSession = async (planId: string) => {
  try {
    // Get the current URL to use for success/cancel redirects
    const returnUrl = window.location.origin;
    
    console.log('Starting checkout session creation for plan:', planId);
    console.log('Return URL:', returnUrl);
    
    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { planId, returnUrl },
    });
    
    if (error) {
      console.error('Error creating checkout session:', error);
      throw new Error(error.message || 'Failed to create checkout session');
    }
    
    if (!data) {
      console.error('No data returned from checkout function');
      throw new Error('No data returned from checkout function');
    }
    
    console.log('Checkout session created successfully:', data);
    
    // Return the checkout URL and session ID
    return {
      sessionId: data.sessionId,
      url: data.url,
    };
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    // Include more detailed error information
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};
