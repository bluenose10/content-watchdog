
/**
 * Simple but effective in-memory rate limiter implementation
 * This tracks and limits API requests by user or IP
 */

import { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX_REQUESTS } from './constants';

// Rate limit tracking
interface RateLimitEntry {
  timestamp: number;
  requestCount: number;
  lastRequestTime: number;
}

// Storage for rate limits (in-memory)
const rateLimitStore: Record<string, RateLimitEntry> = {};

/**
 * Check if a request from a specific user/IP is allowed
 * @param identifier User ID or IP address
 * @param maxRequests Maximum allowed requests in time window (defaults from constants)
 * @param timeWindow Time window in milliseconds (defaults from constants)
 * @returns Object with allowed status and reset time
 */
export const checkRateLimit = (
  identifier: string,
  maxRequests: number = RATE_LIMIT_MAX_REQUESTS,
  timeWindow: number = RATE_LIMIT_WINDOW
): { allowed: boolean; remaining: number; resetTime: number; retryAfter?: number } => {
  const now = Date.now();
  
  // Initialize entry if it doesn't exist
  if (!rateLimitStore[identifier]) {
    rateLimitStore[identifier] = {
      timestamp: now,
      requestCount: 0,
      lastRequestTime: now
    };
  }
  
  const entry = rateLimitStore[identifier];
  
  // Reset counter if time window has passed
  if (now - entry.timestamp > timeWindow) {
    entry.timestamp = now;
    entry.requestCount = 0;
  }
  
  // Check if rate limit is exceeded
  const isAllowed = entry.requestCount < maxRequests;
  const remaining = Math.max(0, maxRequests - entry.requestCount);
  const resetTime = entry.timestamp + timeWindow;
  
  // Calculate retry after time in seconds if rate limit exceeded
  let retryAfter: number | undefined;
  if (!isAllowed) {
    retryAfter = Math.ceil((resetTime - now) / 1000);
  }
  
  // Update counters if request is allowed
  if (isAllowed) {
    entry.requestCount += 1;
    entry.lastRequestTime = now;
  }
  
  return { 
    allowed: isAllowed, 
    remaining, 
    resetTime,
    retryAfter
  };
};

/**
 * Get dynamic rate limits based on user tier/status
 * @param userId User identifier
 * @param userTier User subscription tier
 * @returns Rate limit configuration
 */
export const getUserRateLimits = (
  userId: string | null,
  userTier: 'anonymous' | 'basic' | 'premium' | 'admin' = 'basic'
): { maxRequests: number; timeWindow: number } => {
  // Rate limits based on user tier
  switch (userTier) {
    case 'admin':
      // Admin users have no practical limits
      return { maxRequests: 1000, timeWindow: RATE_LIMIT_WINDOW };
    
    case 'premium':
      // Premium users get higher rate limits
      return { maxRequests: 100, timeWindow: RATE_LIMIT_WINDOW };
    
    case 'basic':
      // Authenticated users get standard rate limits
      return { maxRequests: 30, timeWindow: RATE_LIMIT_WINDOW };
    
    case 'anonymous':
      // Anonymous users get the most restrictive rate limits
      return { maxRequests: 10, timeWindow: RATE_LIMIT_WINDOW };
    
    default:
      return { maxRequests: RATE_LIMIT_MAX_REQUESTS, timeWindow: RATE_LIMIT_WINDOW };
  }
};

/**
 * Clear rate limit data for a specific user or all users
 * @param identifier Optional user ID to clear. If not provided, clears all rate limits
 */
export const clearRateLimits = (identifier?: string): void => {
  if (identifier) {
    delete rateLimitStore[identifier];
  } else {
    Object.keys(rateLimitStore).forEach(key => delete rateLimitStore[key]);
  }
};

/**
 * Get rate limit statistics for monitoring
 */
export const getRateLimitStats = (): {
  totalTrackedUsers: number;
  blockedRequestsCount: number;
  activeUsers: Array<{id: string; requestCount: number; lastRequest: number}>
} => {
  const now = Date.now();
  let blockedRequestsCount = 0;
  
  // Calculate active users (requested in the last hour)
  const activeUsers = Object.entries(rateLimitStore)
    .filter(([_, data]) => now - data.lastRequestTime < 3600000)
    .map(([id, data]) => ({
      id,
      requestCount: data.requestCount,
      lastRequest: data.lastRequestTime
    }))
    .sort((a, b) => b.requestCount - a.requestCount);
  
  // Calculate how many requests are currently being blocked
  Object.values(rateLimitStore).forEach(entry => {
    if (entry.requestCount >= RATE_LIMIT_MAX_REQUESTS && now - entry.timestamp < RATE_LIMIT_WINDOW) {
      blockedRequestsCount++;
    }
  });
  
  return {
    totalTrackedUsers: Object.keys(rateLimitStore).length,
    blockedRequestsCount,
    activeUsers: activeUsers.slice(0, 10) // Only return top 10 most active users
  };
};

/**
 * Periodically clean up old rate limit entries to prevent memory leaks
 * This runs every hour and removes entries older than 24 hours
 */
const cleanupRateLimits = (): void => {
  const now = Date.now();
  const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
  
  Object.entries(rateLimitStore).forEach(([id, entry]) => {
    if (now - entry.lastRequestTime > expirationTime) {
      delete rateLimitStore[id];
    }
  });
};

// Set up periodic cleanup
if (typeof window !== 'undefined') {
  setInterval(cleanupRateLimits, 60 * 60 * 1000); // Run every hour
}
