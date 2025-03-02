import { 
  BingWebResult, 
  BingImageResult, 
  BingVideoResult, 
  BingNewsResult 
} from './search-types';

export class BingSearchProcessor {
  /**
   * Map content filter parameter to Bing's safeSearch parameter
   */
  public mapContentFilterToSafeSearch(contentFilter: string): string {
    switch(contentFilter.toLowerCase()) {
      case 'high':
      case 'strict':
        return 'Strict';
      case 'medium':
      case 'moderate':
        return 'Moderate';
      case 'low':
      case 'off':
        return 'Off';
      default:
        return 'Moderate';
    }
  }
  
  /**
   * Map image type parameter to Bing's imageType parameter
   */
  public mapImageTypeForBing(imageType: string): string {
    switch(imageType.toLowerCase()) {
      case 'photo':
      case 'photograph':
        return 'Photo';
      case 'clipart':
        return 'Clipart';
      case 'lineart':
      case 'line-drawing':
        return 'Line';
      case 'gif':
      case 'animated':
        return 'AnimatedGif';
      default:
        return 'All';
    }
  }
  
  /**
   * Process and normalize Bing web search results
   */
  public processBingWebResults(results: BingWebResult[]): any[] {
    return results.map(result => ({
      title: result.name || '',
      url: result.url || '',
      displayUrl: result.displayUrl || '',
      description: result.snippet || '',
      lastCrawled: result.dateLastCrawled || '',
      source_engine: 'bing'
    }));
  }
  
  /**
   * Process and normalize Bing image search results
   */
  public processBingImageResults(results: BingImageResult[]): any[] {
    return results.map(result => ({
      title: result.name || '',
      url: result.contentUrl || '',
      thumbnailUrl: result.thumbnailUrl || '',
      hostPageUrl: result.hostPageUrl || '',
      width: result.width || 0,
      height: result.height || 0,
      source_engine: 'bing'
    }));
  }
  
  /**
   * Process and normalize Bing video search results
   */
  public processBingVideoResults(results: BingVideoResult[]): any[] {
    return results.map(result => ({
      title: result.name || '',
      url: result.contentUrl || '',
      thumbnailUrl: result.thumbnailUrl || '',
      hostPageUrl: result.hostPageUrl || '',
      duration: result.duration || '',
      publisher: result.publisher?.[0]?.name || '',
      viewCount: result.viewCount || 0,
      source_engine: 'bing'
    }));
  }
  
  /**
   * Process and normalize Bing news search results
   */
  public processBingNewsResults(results: BingNewsResult[]): any[] {
    return results.map(result => ({
      title: result.name || '',
      url: result.url || '',
      description: result.description || '',
      publisher: result.provider?.[0]?.name || '',
      datePublished: result.datePublished || '',
      category: result.category || '',
      thumbnailUrl: result.image?.thumbnail?.contentUrl || '',
      source_engine: 'bing'
    }));
  }
  
  /**
   * Execute a search using the Bing API
   */
  public async executeBingSearch(
    type: string,
    query: string,
    params: any = {}
  ): Promise<any> {
    try {
      console.log(`Executing Bing ${type} search for: ${query}`);
      
      // Get the Bing API key from environment
      const apiKey = import.meta.env.VITE_BING_API_KEY || '';
      
      if (!apiKey) {
        console.error('ERROR: VITE_BING_API_KEY not configured, Bing search cannot proceed');
        throw new Error('Bing API key not configured. Please set VITE_BING_API_KEY');
      }
      
      // Determine the appropriate Bing API endpoint based on search type
      let searchType = 'web'; // Default to web search
      
      if (type === 'image') {
        searchType = 'images';
      } else if (type === 'video') {
        searchType = 'videos';
      } else if (type === 'news') {
        searchType = 'news';
      } else if (type === 'hashtag') {
        // For hashtags, we'll use web search but format the query
        query = query.startsWith('#') ? query : `#${query}`;
      }
      
      // Craft the Bing API URL
      const endpoint = `https://api.bing.microsoft.com/v7.0/${searchType}/search`;
      
      // Build request options
      const requestOptions = {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Accept': 'application/json'
        }
      };
      
      // Extract relevant parameters
      const count = params.maxResults || 20;
      const offset = params.offset || 0;
      const mkt = params.market || 'en-US';
      const safeSearch = params.contentFilter ? 
        this.mapContentFilterToSafeSearch(params.contentFilter) : 'Moderate';
      
      // Construct query URL with parameters
      const url = new URL(endpoint);
      url.searchParams.append('q', query);
      url.searchParams.append('count', count.toString());
      url.searchParams.append('offset', offset.toString());
      url.searchParams.append('mkt', mkt);
      url.searchParams.append('safeSearch', safeSearch);
      
      // Add optional filters based on type and params
      if (type === 'image' && params.imageType) {
        url.searchParams.append('imageType', this.mapImageTypeForBing(params.imageType));
      }
      
      console.log(`Making Bing API request to ${endpoint}`);
      
      // Execute the API request
      const response = await fetch(url.toString(), requestOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Bing API error (${response.status}): ${errorText}`);
      }
      
      const bingResults = await response.json();
      console.log(`Received Bing results with ${bingResults.value?.length || 0} items`);
      
      // Process and normalize the results based on search type
      let items: any[] = [];
      
      if (searchType === 'web' && bingResults.webPages?.value) {
        items = this.processBingWebResults(bingResults.webPages.value);
      } else if (searchType === 'images' && bingResults.value) {
        items = this.processBingImageResults(bingResults.value);
      } else if (searchType === 'videos' && bingResults.value) {
        items = this.processBingVideoResults(bingResults.value);
      } else if (searchType === 'news' && bingResults.value) {
        items = this.processBingNewsResults(bingResults.value);
      }
      
      // Return normalized results
      return {
        items,
        engine: 'bing',
        query,
        totalResults: bingResults.totalEstimatedMatches || items.length,
        hasMoreResults: bingResults.webPages?.value?.length === count
      };
      
    } catch (error) {
      console.error('Bing search error:', error);
      throw new Error(`Bing search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Create singleton instance
export const bingSearchProcessor = new BingSearchProcessor();
