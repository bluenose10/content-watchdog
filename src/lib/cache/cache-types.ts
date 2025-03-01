
/**
 * Defines the structure for a cache entry
 */
export interface CacheEntry {
  data: any;
  timestamp: number;
  hits: number;
  lastAccessed: number;
  source?: string; // Track if this came from Google API
  costEstimate?: number; // Estimate API cost for budget tracking
}

/**
 * Statistics for cache monitoring
 */
export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  maxSize: number;
  keyAccess: Record<string, number>;
  apiCalls: {
    google: number;
    other: number;
  };
  estimatedCost: number;
}

/**
 * Return type for cache statistics
 */
export interface CacheStatsResult {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  hitRate: number;
  popularQueries: Array<{ key: string; hits: number }>;
  averageHitCount: number;
  apiCalls: {
    google: number;
    other: number;
  };
  estimatedCost: number;
}
