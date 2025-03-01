
import { formatTimeRemaining } from "../searchService";

interface RateLimitResultType {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
  weeklyRemaining?: number;
  weeklyResetTime?: number;
  monthlyRemaining?: number;
  monthlyResetTime?: number;
}

export function getLimitExceededMessage(rateLimitResult: RateLimitResultType): string {
  const now = Date.now();
  
  // Check which limit was exceeded
  if (rateLimitResult.weeklyRemaining === 0) {
    const timeRemaining = formatTimeRemaining(
      rateLimitResult.weeklyResetTime! - now
    );
    return `You've reached your weekly search limit. New search available in ${timeRemaining}.`;
  } else if (rateLimitResult.monthlyRemaining === 0) {
    const timeRemaining = formatTimeRemaining(
      rateLimitResult.monthlyResetTime! - now
    );
    return `You've reached your monthly search limit. Next month starts in ${timeRemaining}.`;
  } else {
    // Default to minute-based rate limit message
    const retrySeconds = rateLimitResult.retryAfter || 60;
    const retryMinutes = Math.ceil(retrySeconds / 60);
    return `Rate limit exceeded. Please try again in ${retryMinutes} ${retryMinutes === 1 ? 'minute' : 'minutes'}.`;
  }
}
