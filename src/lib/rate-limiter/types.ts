
// Rate limiter types

// Store request counts with timestamps per user
export interface RateLimitRecord {
  count: number;
  lastReset: number;
  weeklyCount: number;
  weeklyLastReset: number;
  monthlyCount: number;
  monthlyLastReset: number;
}

// Rate limit check result interface
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
  weeklyRemaining?: number;
  weeklyResetTime?: number;
  monthlyRemaining?: number;
  monthlyResetTime?: number;
}

// User tier limits interface
export interface UserRateLimits {
  maxRequests: number;
  timeWindow: number;
  maxWeeklyRequests?: number;
  maxMonthlyRequests?: number;
}
