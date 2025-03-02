
import { useState } from "react";

type ResultProcessingProps = {
  setResults: React.Dispatch<React.SetStateAction<any[]>>;
  setTotalResults: React.Dispatch<React.SetStateAction<number>>;
};

export function useResultProcessing({ setResults, setTotalResults }: ResultProcessingProps) {
  
  const processSearchResponse = (searchResponse: any, queryText: string, queryType: string) => {
    setTotalResults(searchResponse.searchInformation?.totalResults || searchResponse.items.length);
    
    // Filter out results with very low relevance or missing key data
    const filteredItems = searchResponse.items.filter((item: any) => {
      // Skip results without title, snippets, or with very short content
      if (!item.title || item.title.length < 3) return false;
      if (!item.snippet || item.snippet.length < 10) return false;
      
      // If URL is malformed or missing, filter out
      try {
        new URL(item.link);
      } catch (e) {
        return false;
      }
      
      return true;
    });
    
    // Transform Google API response to our format with enhanced validation
    const formattedResults = filteredItems.map((item: any, index: number) => {
      // Extract thumbnail with improved fallbacks
      const thumbnailUrl = 
        item.pagemap?.cse_thumbnail?.[0]?.src || 
        item.pagemap?.cse_image?.[0]?.src || 
        item.image?.thumbnailLink ||
        `https://picsum.photos/seed/${item.link.replace(/[^a-zA-Z0-9]/g, '')}/200/300`;
      
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
      
      // Determine match level with more sophisticated algorithm
      const matchScore = calculateMatchScore(item, index, queryText, filteredItems.length);
      
      let matchLevel = 'Medium';
      if (matchScore > 0.65) matchLevel = 'High';
      else if (matchScore < 0.3) matchLevel = 'Low';
      
      // Improve snippet display
      let enhancedSnippet = item.snippet;
      if (item.pagemap?.metatags?.[0]?.['og:description']) {
        // If the meta description is significantly longer, prefer it
        const metaDesc = item.pagemap.metatags[0]['og:description'];
        if (metaDesc && metaDesc.length > item.snippet?.length * 1.2) {
          enhancedSnippet = metaDesc;
        }
      }
      
      return {
        id: `result-${index}`,
        title: item.title,
        url: item.link,
        thumbnail: thumbnailUrl,
        source: source,
        match_level: matchLevel,
        found_at: new Date().toISOString(),
        type: type,
        snippet: enhancedSnippet || item.snippet || null
      };
    });
    
    // Add additional sort by match_level
    const sortedResults = formattedResults.sort((a: any, b: any) => {
      const matchOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
      return matchOrder[a.match_level] - matchOrder[b.match_level];
    });
    
    setResults(sortedResults);
    console.log("Processed results:", sortedResults);
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
    
    // Content length bonuses - longer content is usually better
    if (item.snippet) {
      // Longer snippets get a small boost
      matchScore += Math.min(0.1, item.snippet.length / 1000);
    }
    
    // Domain authority (approximated based on known domains)
    const authorityDomains = [
      'wikipedia.org', 'github.com', 'linkedin.com', 'medium.com', 
      'nytimes.com', 'cnn.com', 'bbc.com', 'reddit.com'
    ];
    
    if (item.link && authorityDomains.some(domain => item.link.includes(domain))) {
      matchScore += 0.15;
    }

    // Final normalization of score to 0-1 range
    return Math.min(1, matchScore);
  };

  return { processSearchResponse };
}
