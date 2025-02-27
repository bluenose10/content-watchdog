
import { supabase } from './supabase';

export const createCheckoutSession = async (planId: string) => {
  try {
    // Get the current URL to use for success/cancel redirects
    const returnUrl = window.location.origin;
    
    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { planId, returnUrl },
    });
    
    if (error) {
      console.error('Error creating checkout session:', error);
      throw new Error(error.message || 'Failed to create checkout session');
    }
    
    // Return the checkout URL and session ID
    return {
      sessionId: data.sessionId,
      url: data.url,
    };
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    throw error;
  }
};
