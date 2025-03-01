
// Types specific to image search functionality
export interface ImageSearchOptions {
  similarityThreshold?: number;
  maxResults?: number;
  searchMode?: 'strict' | 'relaxed';
  includeSimilarColors?: boolean;
  includePartialMatches?: boolean;
  minSize?: 'small' | 'medium' | 'large' | 'xlarge';
  imageType?: 'face' | 'photo' | 'clipart' | 'lineart' | 'animated';
  imageColorType?: string;
  dominantColor?: string;
}

export interface ImageSearchResult {
  title: string;
  link: string;
  displayLink: string;
  snippet: string;
  image?: {
    contextLink: string;
    thumbnailLink: string;
    thumbnailHeight?: number;
    thumbnailWidth?: number;
  };
  pagemap?: {
    cse_image?: Array<{ src: string }>;
    imageobject?: Array<{
      contenturl: string;
      width: string;
      height: string;
    }>;
    metatags?: Array<{
      'og:image'?: string;
      'og:type'?: string;
    }>;
  };
  similarityScore?: number;
  matchQuality?: string;
  size?: string;
  colorType?: string;
  dominantColor?: string;
}

export interface ImageSearchResponse {
  searchInformation?: {
    totalResults: string;
    formattedTotalResults: string;
    searchTime: number;
    formattedSearchTime: string;
  };
  items?: ImageSearchResult[];
  error?: {
    code: number;
    message: string;
  };
}
