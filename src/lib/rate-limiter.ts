
// Rate limiter for API requests - A simple in-memory implementation
// In production, use Redis or a similar distributed store

import { SEARCH_LIMITS } from './constants';

// Store request counts with timestamps per user
interface RateLimitRecord {
  count: number;
  lastReset: number;
  weeklyCount: number;
  weeklyLastReset: number;
  monthlyCount: number;
  monthlyLastReset: number;
}

// Track rate limits by user ID
const rateLimits: Record<string, RateLimitRecord> = {};

// Get appropriate rate limits for each user tier
export function getUserRateLimits(
  userId: string | null, 
  userTier: 'anonymous' | 'basic' | 'premium' | 'admin'
): { maxRequests: number; timeWindow: number; maxWeeklyRequests?: number; maxMonthlyRequests?: number } {
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
        maxWeeklyRequests: SEARCH_LIMITS.BASIC.WEEKLY,  // 1 search per week
        maxMonthlyRequests: SEARCH_LIMITS.BASIC.MONTHLY // 4 searches per month
      };
    case 'premium':
      return { 
        maxRequests: 50, 
        timeWindow: 60 * 1000, // 1 minute
        maxWeeklyRequests: SEARCH_LIMITS.PRO.WEEKLY,   // 10 searches per week 
        maxMonthlyRequests: SEARCH_LIMITS.PRO.MONTHLY  // 40 searches per month
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

/**
 * Check if a request is within rate limits
 * @param userId User ID or anonymous
 * @param maxRequests Maximum requests allowed in the time window
 * @param timeWindow Time window in milliseconds
 * @returns Object with allowed status, remaining requests, and reset time
 */
export function checkRateLimit(
  userId: string,
  maxRequests: number,
  timeWindow: number,
  maxWeeklyRequests?: number,
  maxMonthlyRequests?: number
): { 
  allowed: boolean; 
  remaining: number; 
  resetTime: number; 
  retryAfter?: number;
  weeklyRemaining?: number;
  weeklyResetTime?: number;
  monthlyRemaining?: number;
  monthlyResetTime?: number;
} {
  const now = Date.now();
  
  // Initialize if not exists
  if (!rateLimits[userId]) {
    rateLimits[userId] = {
      count: 0,
      lastReset: now,
      weeklyCount: 0,
      weeklyLastReset: now,
      monthlyCount: 0,
      monthlyLastReset: now
    };
  }
  
  const record = rateLimits[userId];
  
  // Reset minute counter if time window has passed
  if (now - record.lastReset > timeWindow) {
    record.count = 0;
    record.lastReset = now;
  }
  
  // Reset weekly counter if a week has passed
  const weekInMs = 7 * 24 * 60 * 60 * 1000;
  if (now - record.weeklyLastReset > weekInMs) {
    record.weeklyCount = 0;
    record.weeklyLastReset = now;
  }
  
  // Reset monthly counter if a month has passed (approximate)
  const monthInMs = 30 * 24 * 60 * 60 * 1000;
  if (now - record.monthlyLastReset > monthInMs) {
    record.monthlyCount = 0;
    record.monthlyLastReset = now;
  }
  
  // Check if request is within limits
  const withinMinuteLimit = record.count < maxRequests;
  const withinWeeklyLimit = maxWeeklyRequests === undefined || record.weeklyCount < maxWeeklyRequests;
  const withinMonthlyLimit = maxMonthlyRequests === undefined || record.monthlyCount < maxMonthlyRequests;
  
  const allowed = withinMinuteLimit && withinWeeklyLimit && withinMonthlyLimit;
  
  if (allowed) {
    // Increment counters
    record.count++;
    if (maxWeeklyRequests !== undefined) record.weeklyCount++;
    if (maxMonthlyRequests !== undefined) record.monthlyCount++;
  }
  
  // Calculate retry after time based on which limit was exceeded
  let retryAfter;
  if (!withinMinuteLimit) {
    retryAfter = (record.lastReset + timeWindow - now) / 1000; // seconds
  } else if (!withinWeeklyLimit) {
    retryAfter = (record.weeklyLastReset + weekInMs - now) / 1000; // seconds
  } else if (!withinMonthlyLimit) {
    retryAfter = (record.monthlyLastReset + monthInMs - now) / 1000; // seconds
  }
  
  return {
    allowed,
    remaining: Math.max(0, maxRequests - record.count),
    resetTime: record.lastReset + timeWindow,
    retryAfter,
    weeklyRemaining: maxWeeklyRequests !== undefined ? Math.max(0, maxWeeklyRequests - record.weeklyCount) : undefined,
    weeklyResetTime: record.weeklyLastReset + weekInMs,
    monthlyRemaining: maxMonthlyRequests !== undefined ? Math.max(0, maxMonthlyRequests - record.monthlyCount) : undefined,
    monthlyResetTime: record.monthlyLastReset + monthInMs
  };
}

/**
 * Clear all rate limits for a specific user
 * @param userId The user ID to clear limits for
 */
export function clearUserRateLimit(userId: string): void {
  delete rateLimits[userId];
}

/**
 * Clear all rate limits for all users
 */
export function clearRateLimits(): void {
  Object.keys(rateLimits).forEach(key => {
    delete rateLimits[key];
  });
}

/**
 * Get statistics about the rate limiter
 */
export function getRateLimitStats() {
  const now = Date.now();
  const stats = {
    totalTrackedUsers: Object.keys(rateLimits).length,
    blockedRequestsCount: 0,
    activeUsers: [] as {
      id: string;
      requestCount: number;
      weeklyCount: number;
      monthlyCount: number;
      lastRequest: number;
    }[]
  };
  
  // Get users who have made requests in the last hour
  const hourAgo = now - (60 * 60 * 1000);
  
  Object.entries(rateLimits).forEach(([userId, record]) => {
    // Check if any user is currently blocked
    if (record.count >= 30) {
      stats.blockedRequestsCount++;
    }
    
    // Add to active users if they've made a request in the last hour
    if (record.lastReset > hourAgo && record.count > 0) {
      stats.activeUsers.push({
        id: userId,
        requestCount: record.count,
        weeklyCount: record.weeklyCount,
        monthlyCount: record.monthlyCount,
        lastRequest: record.lastReset
      });
    }
  });
  
  // Sort active users by request count (highest first)
  stats.activeUsers.sort((a, b) => b.requestCount - a.requestCount);
  
  return stats;
}
