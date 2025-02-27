
import { supabase } from './supabase';

export const createCheckoutSession = async (planId: string) => {
  try {
    // Get the current URL to use for success/cancel redirects
    const returnUrl = window.location.origin;
    
    console.log('Creating checkout session for plan:', planId);
    console.log('Return URL:', returnUrl);
    
    // Call our Supabase Edge Function
    console.log('Invoking create-checkout Edge Function...');
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { planId, returnUrl },
    });
    
    console.log('Edge Function response received:', { data, error });
    
    if (error) {
      console.error('Error from Edge Function:', error);
      throw new Error(error.message || 'Failed to create checkout session');
    }
    
    if (!data) {
      console.error('No data returned from Edge Function');
      throw new Error('No data returned from checkout function');
    }
    
    if (!data.url || !data.sessionId) {
      console.error('Invalid data returned from Edge Function:', data);
      throw new Error('Invalid checkout data returned');
    }
    
    console.log('Checkout session created successfully:', {
      sessionId: data.sessionId,
      url: data.url
    });
    
    // Return the checkout URL and session ID
    return {
      sessionId: data.sessionId,
      url: data.url,
    };
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    
    // Log more details about the error
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    throw error;
  }
};
