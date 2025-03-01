
import { SEARCH_LIMITS } from '../constants';
import { UserRateLimits } from './types';

// Admin emails with no rate limits
const ADMIN_EMAILS = ['admin@influenceguard.com', 'test@example.com'];

/**
 * Check if user email is admin
 */
export function isAdminUser(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Get appropriate rate limits for each user tier
 */
export function getUserRateLimits(
  userId: string | null, 
  userTier: 'anonymous' | 'basic' | 'premium' | 'admin'
): UserRateLimits {
  // Admin users have no limits
  if (userTier === 'admin') {
    return { 
      maxRequests: Number.MAX_SAFE_INTEGER,
      timeWindow: 60 * 1000,
      maxWeeklyRequests: Number.MAX_SAFE_INTEGER,
      maxMonthlyRequests: Number.MAX_SAFE_INTEGER
    };
  }

  // Return limits based on user tier
  switch (userTier) {
    case 'anonymous':
      return { 
        maxRequests: 10, 
        timeWindow: 60 * 1000, // 1 minute
        maxWeeklyRequests: 0,
        maxMonthlyRequests: 0
      };
    case 'basic':
      return { 
        maxRequests: 20, 
        timeWindow: 60 * 1000, // 1 minute
        maxWeeklyRequests: SEARCH_LIMITS.BASIC.WEEKLY,  // Usually 4-5 searches per week
        maxMonthlyRequests: SEARCH_LIMITS.BASIC.MONTHLY // 20 searches per month
      };
    case 'premium':
      return { 
        maxRequests: 50, 
        timeWindow: 60 * 1000, // 1 minute
        maxWeeklyRequests: SEARCH_LIMITS.PRO.WEEKLY,   // 50 searches per week 
        maxMonthlyRequests: SEARCH_LIMITS.PRO.MONTHLY  // 200 searches per month
      };
    default:
      return { 
        maxRequests: 10, 
        timeWindow: 60 * 1000, // 1 minute
        maxWeeklyRequests: 0,
        maxMonthlyRequests: 0
      };
  }
}
