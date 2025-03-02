
// Define cache-related types
export interface CacheEntry {
  data: any;
  timestamp: number;
  hits: number;
  lastAccessed: number;
  source?: string; // Track if this came from Google API
  costEstimate?: number; // Estimate API cost for budget tracking
}

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

export interface CachedSearchResult {
  query: string;
  results: any[];
}
