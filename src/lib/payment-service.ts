
import { supabase } from './supabase';

// This is a simplified version that avoids potential issues
export const createCheckoutSession = async (planId: string) => {
  try {
    const returnUrl = window.location.origin;
    
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { planId, returnUrl },
    });
    
    if (error) {
      throw new Error('Failed to create checkout session');
    }
    
    return {
      sessionId: data?.sessionId,
      url: data?.url,
    };
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    throw error;
  }
};
