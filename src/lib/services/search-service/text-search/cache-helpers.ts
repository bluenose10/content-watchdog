
import { getCacheKey, getCachedResults } from '../../../search-cache';
import { PendingRequest } from './types';

// Cache for pending requests to prevent duplicate calls
export const pendingRequests: Record<string, PendingRequest> = {};

/**
 * Check if a request is already pending or cached
 * @param query The search query
 * @param searchParams Additional search parameters
 * @returns The cached result or pending request if available
 */
export function checkRequestCache(query: string, searchParams: any): { 
  cacheKey: string; 
  cachedResult: any | null;
  pendingRequest: PendingRequest | null;
} {
  const cacheKey = getCacheKey('text', query, searchParams);
  
  const pendingRequest = pendingRequests[cacheKey] || null;
  if (pendingRequest) {
    console.log('Returning existing pending request for:', query);
    return { cacheKey, cachedResult: null, pendingRequest };
  }
  
  const cachedResult = getCachedResults(cacheKey);
  return { cacheKey, cachedResult, pendingRequest: null };
}

/**
 * Register a pending request in the cache
 * @param cacheKey The cache key
 * @param request The pending request
 */
export function registerPendingRequest(cacheKey: string, request: PendingRequest): void {
  pendingRequests[cacheKey] = request;
  
  // Clean up the pending request after completion
  setTimeout(() => {
    delete pendingRequests[cacheKey];
  }, 100);
}
