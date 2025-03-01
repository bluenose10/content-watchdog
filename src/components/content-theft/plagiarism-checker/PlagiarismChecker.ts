
import { optimizedSearch } from "@/lib/google-api-manager";
import { supabase } from "@/lib/supabase";

export interface PlagiarismMatch {
  text: string;
  source: string;
  similarity: number;
}

export interface PlagiarismResult {
  score: number;
  matches: PlagiarismMatch[];
  aiAnalysis?: string;
  aiConfidenceScore?: number;
}

// Function to check for plagiarism using Google Search
export const checkPlagiarism = async (text: string): Promise<PlagiarismResult> => {
  // Break the text into chunks to search for matches
  // This helps find partial matches across the document
  const chunkSize = 50; // Number of words per chunk
  const words = text.split(/\s+/);
  const chunks = [];
  
  // Create overlapping chunks of text to search
  for (let i = 0; i < words.length; i += Math.floor(chunkSize / 2)) {
    if (i + chunkSize <= words.length) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    } else if (i < words.length) {
      chunks.push(words.slice(i).join(' '));
    }
  }
  
  // Only process a limited number of chunks to avoid excessive API calls
  const chunksToProcess = chunks.slice(0, 5);
  const matches: PlagiarismMatch[] = [];
  
  // Search for each chunk using Google Search API
  for (const chunk of chunksToProcess) {
    try {
      // Use the existing optimizedSearch function from google-api-manager
      const searchResults = await optimizedSearch("web", `"${chunk}"`, {
        exactMatch: true,
        maxResults: 10
      });
      
      if (searchResults && searchResults.items && searchResults.items.length > 0) {
        // Filter out results that don't seem relevant
        const relevantResults = searchResults.items.filter(item => {
          // Skip results with very short titles or descriptions
          if (!item.title || !item.description || 
              item.title.length < 10 || item.description.length < 20) {
            return false;
          }
          return true;
        });
        
        // Add the relevant matches
        for (const result of relevantResults) {
          // Calculate a simple similarity score based on word matching
          // In a real system this would be more sophisticated
          const sharedWords = chunk.split(/\s+/).filter(word => 
            result.description.toLowerCase().includes(word.toLowerCase())
          ).length;
          const similarity = sharedWords / chunk.split(/\s+/).length;
          
          // Only include if similarity is above threshold
          if (similarity > 0.3) {
            matches.push({
              text: chunk,
              source: result.url || result.displayUrl || '',
              similarity: similarity
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error searching for chunk: ${chunk}`, error);
    }
  }
  
  // Calculate overall plagiarism score
  // This is a simplified approach - real plagiarism checkers use more complex algorithms
  let overallScore = 0;
  if (matches.length > 0) {
    // Calculate weighted score based on match count and similarities
    const totalChunks = chunks.length;
    const matchedChunksRatio = Math.min(matches.length / totalChunks, 1);
    const avgSimilarity = matches.reduce((sum, match) => sum + match.similarity, 0) / matches.length;
    
    // Combine factors for final score (0-100)
    overallScore = Math.round(matchedChunksRatio * avgSimilarity * 100);
  }
  
  // Get AI analysis if we have enough text to analyze
  let aiAnalysis = undefined;
  let aiConfidenceScore = undefined;
  
  // Only perform AI analysis if the text is substantial enough
  if (text.length > 100) {
    try {
      console.log('Requesting AI analysis for plagiarism check');
      const { data, error } = await supabase.functions.invoke('ai-plagiarism-analysis', {
        body: { 
          text, 
          existingMatches: matches.slice(0, 10) // Pass top 10 matches to the AI
        }
      });
      
      if (error) {
        console.error('Error invoking AI analysis:', error);
      } else if (data) {
        aiAnalysis = data.aiAnalysis;
        aiConfidenceScore = data.aiConfidenceScore;
        console.log('AI analysis completed with confidence score:', aiConfidenceScore);
        
        // Adjust the overall score based on AI confidence
        if (aiConfidenceScore !== undefined) {
          // Blend the search-based score with the AI confidence score
          // Weight: 70% search results, 30% AI analysis
          overallScore = Math.round((overallScore * 0.7) + (aiConfidenceScore * 0.3));
        }
      }
    } catch (error) {
      console.error('Error during AI analysis:', error);
    }
  }
  
  return {
    score: overallScore,
    matches: matches.slice(0, 10), // Limit to top 10 matches
    aiAnalysis,
    aiConfidenceScore
  };
};
