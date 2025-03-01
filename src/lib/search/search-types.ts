
import { QuotaConfig } from './quota-manager';

// Interface for search engine configuration
export interface SearchEngineConfig {
  name: string;
  enabled: boolean;
  priority: number; // Higher number = higher priority
  quotaConfig: QuotaConfig;
}

// Request interface with userId
export interface QueuedRequest {
  execute: () => Promise<any>;
  userId?: string;
}

// Bing API response interfaces
export interface BingWebResult {
  id?: string;
  name?: string;
  url?: string;
  displayUrl?: string;
  snippet?: string;
  dateLastCrawled?: string;
  language?: string;
  isNavigational?: boolean;
}

export interface BingImageResult {
  name?: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  hostPageUrl?: string;
  hostPageDisplayUrl?: string;
  width?: number;
  height?: number;
  thumbnail?: {
    width?: number;
    height?: number;
  };
  imageInsightsToken?: string;
  imageId?: string;
  accentColor?: string;
}

export interface BingVideoResult {
  name?: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  hostPageUrl?: string;
  hostPageDisplayUrl?: string;
  duration?: string;
  motionThumbnailUrl?: string;
  thumbnail?: {
    width?: number;
    height?: number;
  };
  publisher?: {
    name?: string;
  }[];
  viewCount?: number;
}

export interface BingNewsResult {
  name?: string;
  url?: string;
  description?: string;
  provider?: {
    name?: string;
  }[];
  datePublished?: string;
  category?: string;
  image?: {
    thumbnail?: {
      contentUrl?: string;
      width?: number;
      height?: number;
    };
  };
}
