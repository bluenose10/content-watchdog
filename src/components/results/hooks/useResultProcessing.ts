
import { useState } from "react";

type ResultProcessingProps = {
  setResults: React.Dispatch<React.SetStateAction<any[]>>;
  setTotalResults: React.Dispatch<React.SetStateAction<number>>;
};

export function useResultProcessing({ setResults, setTotalResults }: ResultProcessingProps) {
  
  const processSearchResponse = (searchResponse: any, queryText: string, queryType: string) => {
    setTotalResults(searchResponse.searchInformation?.totalResults || searchResponse.items.length);
    
    // Transform Google API response to our format
    const formattedResults = searchResponse.items.map((item: any, index: number) => {
      // Extract thumbnail with fallbacks
      const thumbnailUrl = 
        item.pagemap?.cse_thumbnail?.[0]?.src || 
        item.pagemap?.cse_image?.[0]?.src || 
        item.image?.thumbnailLink ||
        `https://picsum.photos/200/300?random=${index+1}`;
      
      // Determine result type based on URL, pagemap, or other factors
      const source = item.displayLink || "unknown";
      let type = 'website';
      
      if (item.pagemap?.videoobject || 
          source.includes('youtube') || 
          source.includes('vimeo') || 
          source.includes('tiktok') ||
          item.title?.toLowerCase().includes('video')) {
        type = 'social';
      } else if (
          item.pagemap?.imageobject || 
          item.pagemap?.cse_image ||
          source.includes('instagram') || 
          source.includes('flickr') || 
          source.includes('pinterest') ||
          item.title?.toLowerCase().includes('image') ||
          item.title?.toLowerCase().includes('photo') ||
          queryType === 'image'
      ) {
        type = 'image';
      } else if (
          source.includes('twitter') || 
          source.includes('facebook') || 
          source.includes('linkedin') || 
          source.includes('reddit') ||
          item.title?.toLowerCase().includes('profile')
      ) {
        type = 'social';
      }
      
      // Determine match level based on ranking factors
      const matchScore = calculateMatchScore(item, index, queryText, searchResponse.items.length);
      
      let matchLevel = 'Medium';
      if (matchScore > 0.65) matchLevel = 'High';
      else if (matchScore < 0.3) matchLevel = 'Low';
      
      return {
        id: `result-${index}`,
        title: item.title,
        url: item.link,
        thumbnail: thumbnailUrl,
        source: source,
        match_level: matchLevel,
        found_at: new Date().toISOString(),
        type: type,
        snippet: item.snippet || null
      };
    });
    
    setResults(formattedResults);
    console.log("Formatted results:", formattedResults);
  };

  const calculateMatchScore = (item: any, index: number, queryText: string, totalItems: number) => {
    let matchScore = 0;
    
    // Position in results matters (earlier = better)
    matchScore += Math.max(0, 1 - (index / totalItems));
    
    // Exact title match is a strong signal
    if (item.title && item.title.toLowerCase().includes(queryText.toLowerCase())) {
      matchScore += 0.4;
    }
    
    // Snippet/description match is also important
    if (item.snippet && item.snippet.toLowerCase().includes(queryText.toLowerCase())) {
      matchScore += 0.2;
    }
    
    // Metatags match
    if (item.pagemap?.metatags?.[0]?.['og:title']?.toLowerCase().includes(queryText.toLowerCase())) {
      matchScore += 0.2;
    }
    
    // URL match
    if (item.link?.toLowerCase().includes(queryText.toLowerCase().replace(/\s+/g, ''))) {
      matchScore += 0.2;
    }

    // Final normalization of score to 0-1 range
    return Math.min(1, matchScore);
  };

  return { processSearchResponse };
}
