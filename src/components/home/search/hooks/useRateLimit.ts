
import { AccessLevel } from "@/hooks/useProtectedRoute";
import { checkRateLimit, getUserRateLimits } from "@/lib/rate-limiter";
import { User } from "@supabase/supabase-js";

export function useRateLimit() {
  const checkUserRateLimit = (user: User | null, accessLevel: AccessLevel): { 
    allowed: boolean; 
    remaining: number; 
    resetTime: number; 
    retryAfter?: number;
    weeklyRemaining?: number;
    weeklyResetTime?: number;
    monthlyRemaining?: number;
    monthlyResetTime?: number;
  } => {
    // Treat all environments as production by default
    const rateLimit = true;
    
    // Only skip rate limiting in explicit development mode with the flag set to false
    if (import.meta.env.DEV === true && import.meta.env.VITE_ENABLE_RATE_LIMIT_IN_DEV === "false") {
      console.log("Rate limiting disabled in development mode");
      return { 
        allowed: true, 
        remaining: 1000, 
        resetTime: Date.now() + 3600000, // 1 hour from now
        weeklyRemaining: 1000,
        weeklyResetTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
        monthlyRemaining: 1000,
        monthlyResetTime: Date.now() + 30 * 24 * 60 * 60 * 1000
      };
    }
    
    // Determine user tier from accessLevel
    let userTier: 'anonymous' | 'basic' | 'premium' | 'admin' = 'anonymous';
    
    if (!user) {
      userTier = 'anonymous';
    } else if (accessLevel === AccessLevel.ADMIN) {
      userTier = 'admin';
    } else if (accessLevel === AccessLevel.PREMIUM) {
      userTier = 'premium';
    } else {
      userTier = 'basic';
    }
    
    // Get appropriate rate limits for user tier
    const { maxRequests, timeWindow, maxWeeklyRequests, maxMonthlyRequests } = getUserRateLimits(user?.id || null, userTier);
    
    // Check if user is within rate limits
    return checkRateLimit(
      user?.id || 'anonymous', 
      maxRequests, 
      timeWindow,
      maxWeeklyRequests,
      maxMonthlyRequests
    );
  };

  return { checkUserRateLimit };
}
