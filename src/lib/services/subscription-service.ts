
import { supabase } from '../supabase';
import { UserSubscription } from '../db-types';

// Cache for user subscription data to reduce DB calls
const userSubscriptionCache: Record<string, { data: any, timestamp: number }> = {};
const SUBSCRIPTION_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getUserSubscription = async (userId: string) => {
  try {
    // Check cache first
    const now = Date.now();
    const cachedData = userSubscriptionCache[userId];
    
    if (cachedData && (now - cachedData.timestamp) < SUBSCRIPTION_CACHE_TTL) {
      console.log('Using cached subscription data for user:', userId);
      return cachedData.data;
    }
    
    // If not in cache or expired, fetch from database
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*, plans(*)')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    // Cache the result
    userSubscriptionCache[userId] = {
      data,
      timestamp: now
    };
    
    return data;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    throw error;
  }
};

export const createUserSubscription = async (subscription: UserSubscription) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .upsert(subscription)
    .select();
  
  if (error) throw error;
  
  // Invalidate cache for this user
  if (userSubscriptionCache[subscription.user_id]) {
    delete userSubscriptionCache[subscription.user_id];
  }
  
  return data?.[0];
};

export const getFreePlan = async () => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('id', 'free')
    .single();
  
  if (error) throw error;
  return data;
};

export const getPlans = async () => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('price', { ascending: true });
  
  if (error) throw error;
  return data;
};

// Clear the subscription cache for testing or when needed
export const clearSubscriptionCache = (): void => {
  Object.keys(userSubscriptionCache).forEach(key => {
    delete userSubscriptionCache[key];
  });
  console.log('Subscription cache cleared');
};
