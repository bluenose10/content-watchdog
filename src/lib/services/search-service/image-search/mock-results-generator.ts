
import { ImageSearchOptions, ImageSearchResponse } from './types';

/**
 * Generates mock image search results based on provided parameters
 */
export const generateMockImageResults = (searchParams: ImageSearchOptions = {}): ImageSearchResponse => {
  // Extract and apply parameters with defaults
  const {
    similarityThreshold = 0.65,
    maxResults = 20,
    searchMode = 'relaxed',
    includeSimilarColors = true,
    includePartialMatches = true,
    minSize = 'medium',
    imageType,
    imageColorType,
    dominantColor
  } = searchParams;
  
  console.log('Enhanced image search params:', { 
    similarityThreshold, 
    maxResults, 
    searchMode,
    includeSimilarColors,
    includePartialMatches,
    minSize,
    imageType,
    imageColorType,
    dominantColor
  });
  
  const getMatchQuality = (index: number) => {
    if (searchMode === 'strict') {
      if (index < 3) return { quality: 'high', score: 0.85 + (Math.random() * 0.15) };
      if (index < 8) return { quality: 'medium', score: 0.65 + (Math.random() * 0.15) };
      return { quality: 'low', score: 0.4 + (Math.random() * 0.2) };
    } 
    
    if (index < 6) return { quality: 'high', score: 0.8 + (Math.random() * 0.2) };
    if (index < 12) return { quality: 'medium', score: 0.6 + (Math.random() * 0.2) };
    return { quality: 'low', score: 0.3 + (Math.random() * 0.3) };
  };
  
  // Filter sources based on image search parameters
  let sources = [
    'linkedin.com', 'facebook.com', 'instagram.com', 'twitter.com', 
    'youtube.com', 'tiktok.com', 'pinterest.com', 'reddit.com', 
    'tumblr.com', 'flickr.com', 'deviantart.com', 'behance.net', 
    'dribbble.com', 'unsplash.com', 'pexels.com', 'shutterstock.com', 
    'gettyimages.com', 'stock.adobe.com', 'istockphoto.com', 'medium.com'
  ];
  
  // If we're looking for specific image types, filter accordingly
  if (imageType) {
    switch (imageType) {
      case 'face':
        sources = sources.filter(s => ['facebook.com', 'linkedin.com', 'instagram.com'].includes(s));
        break;
      case 'photo':
        sources = sources.filter(s => ['unsplash.com', 'pexels.com', 'flickr.com', 'instagram.com'].includes(s));
        break;
      case 'clipart':
        sources = sources.filter(s => ['shutterstock.com', 'stock.adobe.com', 'istockphoto.com'].includes(s));
        break;
      case 'lineart':
        sources = sources.filter(s => ['behance.net', 'dribbble.com', 'deviantart.com'].includes(s));
        break;
      case 'animated':
        sources = sources.filter(s => ['giphy.com', 'tenor.com', 'tumblr.com'].includes(s));
        break;
    }
  }
  
  const mockItems = sources.map((source, index) => {
    const matchQuality = getMatchQuality(index);
    
    // Apply similarity threshold filter
    if (matchQuality.score < similarityThreshold) {
      return null;
    }
    
    // Apply color type filter
    if (imageColorType && Math.random() > 0.7) {
      return null;
    }
    
    // Apply dominant color filter
    if (dominantColor && Math.random() > 0.6) {
      return null;
    }
    
    // Apply partial match filtering
    if (!includePartialMatches && Math.random() < 0.3) {
      return null;
    }
    
    // Apply color similarity filtering
    if (!includeSimilarColors && Math.random() < 0.4) {
      return null;
    }
    
    // Build a rich result object
    return {
      title: `${source.split('.')[0].charAt(0).toUpperCase() + source.split('.')[0].slice(1)} Visual Match`,
      link: `https://${source}/image-match-${index}`,
      displayLink: source,
      snippet: `${matchQuality.quality.charAt(0).toUpperCase() + matchQuality.quality.slice(1)} match (${Math.round(matchQuality.score * 100)}% similar) to your uploaded image.`,
      image: {
        contextLink: `https://${source}`,
        thumbnailLink: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/200/300`,
        thumbnailHeight: 300,
        thumbnailWidth: 200
      },
      pagemap: {
        cse_image: [{ 
          src: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/800/600` 
        }],
        imageobject: [{
          contenturl: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/800/600`,
          width: "800",
          height: "600"
        }],
        metatags: [{
          'og:image': `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/800/600`,
          'og:type': 'image'
        }]
      },
      similarityScore: matchQuality.score,
      matchQuality: matchQuality.quality,
      // Additional metadata for advanced filtering
      size: minSize,
      colorType: imageColorType,
      dominantColor: dominantColor
    };
  }).filter(Boolean);
  
  const sortedItems = mockItems.sort((a: any, b: any) => b.similarityScore - a.similarityScore).slice(0, maxResults);
  
  return {
    searchInformation: {
      totalResults: sortedItems.length.toString(),
      formattedTotalResults: sortedItems.length.toString(),
      searchTime: 0.5,
      formattedSearchTime: "0.5"
    },
    items: sortedItems
  };
};

/**
 * Generates fallback results for when all other methods fail
 */
export const generateFallbackResults = (): ImageSearchResponse => {
  return {
    searchInformation: {
      totalResults: "3",
      formattedTotalResults: "3",
      searchTime: 0.1,
      formattedSearchTime: "0.1"
    },
    items: [
      {
        title: 'LinkedIn Profile Match',
        link: 'https://linkedin.com/in/profile-match',
        displayLink: 'linkedin.com',
        snippet: 'Professional profile page with potential image match.',
        image: {
          contextLink: 'https://linkedin.com',
          thumbnailLink: 'https://picsum.photos/id/1005/200/300',
          thumbnailHeight: 300,
          thumbnailWidth: 200
        },
        pagemap: {
          cse_image: [{ src: 'https://picsum.photos/id/1005/800/600' }]
        },
        similarityScore: 0.85
      },
      {
        title: 'Facebook Profile Match',
        link: 'https://facebook.com/profile-match',
        displayLink: 'facebook.com',
        snippet: 'Social media profile with potential image match.',
        image: {
          contextLink: 'https://facebook.com',
          thumbnailLink: 'https://picsum.photos/id/1012/200/300',
          thumbnailHeight: 300,
          thumbnailWidth: 200
        },
        pagemap: {
          cse_image: [{ src: 'https://picsum.photos/id/1012/800/600' }]
        },
        similarityScore: 0.75
      },
      {
        title: 'Instagram Post',
        link: 'https://instagram.com/p/abcdef123456',
        displayLink: 'instagram.com',
        snippet: 'Image post with similar visual elements.',
        image: {
          contextLink: 'https://instagram.com',
          thumbnailLink: 'https://picsum.photos/id/1027/200/300',
          thumbnailHeight: 300,
          thumbnailWidth: 200
        },
        pagemap: {
          cse_image: [{ src: 'https://picsum.photos/id/1027/800/600' }]
        },
        similarityScore: 0.68
      }
    ]
  };
};
