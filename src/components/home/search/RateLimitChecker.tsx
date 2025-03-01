
import { toast } from "@/hooks/use-toast";
import { checkRateLimit, getUserRateLimits } from "@/lib/rate-limiter";
import { AccessLevel } from "@/hooks/useProtectedRoute";

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
  weeklyRemaining?: number;
  weeklyResetTime?: number;
  monthlyRemaining?: number;
  monthlyResetTime?: number;
};

/**
 * Checks user rate limits based on their access level
 */
export const checkUserRateLimit = (
  userId: string | null,
  accessLevel: AccessLevel
): RateLimitResult => {
  // Skip rate limiting for non-production environments but maintain consistent return type
  if (import.meta.env.DEV && !import.meta.env.VITE_ENABLE_RATE_LIMIT_IN_DEV) {
    return {
      allowed: true,
      remaining: 1000,
      resetTime: Date.now() + 3600000, // 1 hour from now
      weeklyRemaining: 1000,
      weeklyResetTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
      monthlyRemaining: 1000,
      monthlyResetTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
  }

  // Determine user tier from accessLevel
  let userTier: "anonymous" | "basic" | "premium" | "admin" = "anonymous";

  if (!userId) {
    userTier = "anonymous";
  } else if (accessLevel === AccessLevel.ADMIN) {
    userTier = "admin";
  } else if (accessLevel === AccessLevel.PREMIUM) {
    userTier = "premium";
  } else {
    userTier = "basic";
  }

  // Get appropriate rate limits for user tier
  const { maxRequests, timeWindow, maxWeeklyRequests, maxMonthlyRequests } =
    getUserRateLimits(userId, userTier);

  // Check if user is within rate limits
  return checkRateLimit(
    userId || "anonymous",
    maxRequests,
    timeWindow,
    maxWeeklyRequests,
    maxMonthlyRequests
  );
};

/**
 * Formats time remaining from milliseconds to human-readable string
 */
export const formatTimeRemainingFromMs = (timeMs: number): string => {
  const seconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days !== 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }
};

/**
 * Gets appropriate message for rate limit exceeded
 */
export const getLimitExceededMessage = (
  rateLimitResult: RateLimitResult
): string => {
  const now = Date.now();

  // Check which limit was exceeded
  if (rateLimitResult.weeklyRemaining === 0) {
    const timeRemaining = formatTimeRemainingFromMs(
      rateLimitResult.weeklyResetTime! - now
    );
    return `You've reached your weekly search limit. New search available in ${timeRemaining}.`;
  } else if (rateLimitResult.monthlyRemaining === 0) {
    const timeRemaining = formatTimeRemainingFromMs(
      rateLimitResult.monthlyResetTime! - now
    );
    return `You've reached your monthly search limit. Next month starts in ${timeRemaining}.`;
  } else {
    // Default to minute-based rate limit message
    const retrySeconds = rateLimitResult.retryAfter || 60;
    const retryMinutes = Math.ceil(retrySeconds / 60);
    return `Rate limit exceeded. Please try again in ${retryMinutes} ${
      retryMinutes === 1 ? "minute" : "minutes"
    }.`;
  }
};
