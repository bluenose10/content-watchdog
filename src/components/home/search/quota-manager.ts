import { SEARCH_LIMITS } from "@/lib/constants";

// Admin emails with no search limits
const ADMIN_EMAILS = ['admin@influenceguard.com', 'test@example.com'];

// Track user search counts (in-memory for demo purposes, should be persisted in production)
const userSearchCounts: Record<string, { 
  monthly: number, 
  weekly: number,
  lastReset: { 
    monthly: number,
    weekly: number
  } 
}> = {};

/**
 * Check if user has exceeded their search limits based on subscription tier
 * @param userId User ID
 * @param isPro Whether the user has a Pro subscription
 * @param userEmail User's email address to check admin status
 * @returns Object with isAllowed and message
 */
export async function checkSearchLimits(userId: string, isPro: boolean, userEmail?: string): Promise<{ isAllowed: boolean, message: string }> {
  // Admin users have unlimited searches
  if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
    console.log("Admin user detected - bypassing search limits");
    return { isAllowed: true, message: "" };
  }

  // Initialize user search counts if not present
  if (!userSearchCounts[userId]) {
    userSearchCounts[userId] = {
      monthly: 0,
      weekly: 0,
      lastReset: {
        monthly: Date.now(),
        weekly: Date.now()
      }
    };
  }

  const now = Date.now();
  const oneMonth = 30 * 24 * 60 * 60 * 1000;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const user = userSearchCounts[userId];

  // Check if we need to reset monthly count
  if (now - user.lastReset.monthly > oneMonth) {
    user.monthly = 0;
    user.lastReset.monthly = now;
  }
  
  // Check if we need to reset weekly count
  if (now - user.lastReset.weekly > oneWeek) {
    user.weekly = 0;
    user.lastReset.weekly = now;
  }

  // Check limits based on subscription tier
  if (isPro) {
    // Pro user checks
    if (user.monthly >= SEARCH_LIMITS.PRO.MONTHLY) {
      return { 
        isAllowed: false, 
        message: `You've reached your monthly search limit (${SEARCH_LIMITS.PRO.MONTHLY} searches). Monthly limit resets in ${formatTimeRemaining(user.lastReset.monthly + oneMonth - now)}.`
      };
    }
    
    if (user.weekly >= SEARCH_LIMITS.PRO.WEEKLY) {
      return {
        isAllowed: false,
        message: `You've reached your weekly search limit (${SEARCH_LIMITS.PRO.WEEKLY} searches). Weekly limit resets in ${formatTimeRemaining(user.lastReset.weekly + oneWeek - now)}.`
      };
    }
  } else {
    // Basic user checks
    if (user.monthly >= SEARCH_LIMITS.BASIC.MONTHLY) {
      return { 
        isAllowed: false, 
        message: `You've reached your monthly search limit (${SEARCH_LIMITS.BASIC.MONTHLY} searches). Monthly limit resets in ${formatTimeRemaining(user.lastReset.monthly + oneMonth - now)}.`
      };
    }
    
    if (user.weekly >= SEARCH_LIMITS.BASIC.WEEKLY) {
      return {
        isAllowed: false,
        message: `You've reached your weekly search limit (${SEARCH_LIMITS.BASIC.WEEKLY} search). Weekly limit resets in ${formatTimeRemaining(user.lastReset.weekly + oneWeek - now)}.`
      };
    }
  }

  return { isAllowed: true, message: "" };
}

// Export the existing functions
export { formatTimeRemaining, incrementSearchCount, isAdminUser };

// Alias for compatibility with the search handlers
export const checkRateLimit = checkSearchLimits;
