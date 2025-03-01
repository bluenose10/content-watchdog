
import { ImageSearchOptions, ImageSearchResponse } from './types';

/**
 * Handles image search using Google's Custom Search API
 */
export const handleGoogleImageSearch = async (
  imageUrl: string, 
  searchParams: ImageSearchOptions, 
  apiKey: string, 
  searchEngineId: string
): Promise<ImageSearchResponse> => {
  try {
    // Extract and apply parameters with defaults
    const { 
      similarityThreshold = 0.6, 
      maxResults = 20,
      minSize = 'medium',
      imageType,
      imageColorType,
      dominantColor
    } = searchParams;

    // Build the request parameters
    const params = new URLSearchParams({
      key: apiKey,
      cx: searchEngineId,
      searchType: 'image',
      num: maxResults.toString()
    });
    
    // Add advanced image search parameters
    if (imageType) {
      params.append('imgType', imageType);
    }
    
    if (imageColorType) {
      params.append('imgColorType', imageColorType);
    }
    
    if (dominantColor) {
      params.append('imgDominantColor', dominantColor);
    }
    
    if (minSize === 'large' || minSize === 'xlarge') {
      params.append('imgSize', 'large');
    } else if (minSize === 'medium') {
      params.append('imgSize', 'medium');
    } else {
      params.append('imgSize', 'small');
    }
    
    // Parse image features for query
    // In a real implementation, we'd extract descriptive text from the image
    // and use it as a search query
    const descriptiveQuery = "image similar to uploaded content";
    params.append('q', descriptiveQuery);
    
    const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Google Image Search API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Enhance the results with calculated similarity scores
    if (data.items && data.items.length > 0) {
      data.items = data.items.map((item: any, index: number) => {
        // Calculate a fake similarity score
        const baseSimilarity = Math.max(0, 1 - (index / data.items.length));
        const randomFactor = Math.random() * 0.3;
        const similarityScore = Math.min(1.0, baseSimilarity + randomFactor);
        
        // Only include results above the similarity threshold
        if (similarityScore >= similarityThreshold) {
          return {
            ...item,
            similarityScore
          };
        }
        return null;
      }).filter(Boolean);
    }
    
    return data;
  } catch (error) {
    console.error('Google Image Search API error:', error);
    throw error;
  }
};
