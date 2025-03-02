
import { TextSearchParams } from '../../../db-types';

// Type for pending requests tracking
export type PendingRequest = Promise<any>;

// Enhanced results with relevance scoring
export interface EnhancedSearchResult {
  title?: string;
  link?: string;
  displayLink?: string;
  snippet?: string;
  pagemap?: any;
  relevanceScore?: number;
}

// Google API response interface
export interface GoogleSearchResponse {
  items?: EnhancedSearchResult[];
  searchInformation?: {
    totalResults?: string;
    formattedTotalResults?: string;
    searchTime?: number;
    formattedSearchTime?: string;
  };
  _source?: string; // Adding this field to fix TypeScript errors
}
