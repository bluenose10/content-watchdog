
import { optimizedSearch } from "@/lib/google-api-manager";

export interface PlagiarismMatch {
  text: string;
  source: string;
  similarity: number;
}

export interface PlagiarismResult {
  score: number;
  matches: PlagiarismMatch[];
}

// Function to check for plagiarism using Google Search and enhanced ML techniques
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
        
        // Add the relevant matches with enhanced similarity scoring
        for (const result of relevantResults) {
          // Enhanced similarity calculation using TF-IDF approach
          const similarity = calculateEnhancedSimilarity(chunk, result.description);
          
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
  
  // Calculate overall plagiarism score with machine learning enhancement
  let overallScore = calculateMLEnhancedScore(matches, chunks.length);
  
  return {
    score: overallScore,
    matches: matches.slice(0, 10) // Limit to top 10 matches
  };
};

/**
 * Enhanced similarity calculation using TF-IDF inspired approach
 * This simulates basic NLP techniques for better text matching
 */
function calculateEnhancedSimilarity(sourceText: string, targetText: string): number {
  if (!targetText) return 0;
  
  // Convert to lowercase for comparison
  const source = sourceText.toLowerCase();
  const target = targetText.toLowerCase();
  
  // Extract words for TF-IDF calculation
  const sourceWords = source.split(/\s+/).filter(w => w.length > 3);
  const targetWords = target.split(/\s+/).filter(w => w.length > 3);
  
  if (sourceWords.length === 0 || targetWords.length === 0) return 0;
  
  // Calculate term frequency in target
  const termFrequency: Record<string, number> = {};
  targetWords.forEach(word => {
    termFrequency[word] = (termFrequency[word] || 0) + 1;
  });
  
  // Calculate inverse document frequency weight (simplified)
  const uniqueTargetWords = new Set(targetWords);
  
  // Count matches with TF-IDF weighting
  let weightedMatchCount = 0;
  let totalWeight = 0;
  
  sourceWords.forEach(word => {
    // Term frequency weight
    const tf = termFrequency[word] || 0;
    
    // Inverse document frequency (simplified)
    // Words that are less common get higher weight
    const idf = uniqueTargetWords.has(word) ? 1 : 2;
    
    // Calculate weighted score
    const weight = tf * idf;
    weightedMatchCount += weight;
    totalWeight += 2; // Maximum possible weight
  });
  
  // Exact phrase matching boost
  let phraseMatchBoost = 0;
  
  // Check for 3-word phrases
  for (let i = 0; i < sourceWords.length - 2; i++) {
    const phrase = sourceWords.slice(i, i + 3).join(' ');
    if (target.includes(phrase)) {
      phraseMatchBoost += 0.1; // Boost for each 3-word phrase match
    }
  }
  
  // Combine term matching with phrase matching
  let similarity = (weightedMatchCount / Math.max(1, totalWeight)) + phraseMatchBoost;
  
  // Normalize to 0-1 range
  return Math.min(1, Math.max(0, similarity));
}

/**
 * Calculate overall plagiarism score using a machine learning inspired approach
 * This function combines multiple factors with learned weights
 */
function calculateMLEnhancedScore(matches: PlagiarismMatch[], totalChunks: number): number {
  if (matches.length === 0) return 0;
  
  // Factor 1: Matched chunks ratio (how much of the document has matches)
  const matchedChunksRatio = Math.min(matches.length / totalChunks, 1);
  
  // Factor 2: Average similarity of matches
  const avgSimilarity = matches.reduce((sum, match) => sum + match.similarity, 0) / matches.length;
  
  // Factor 3: Highest individual match similarity
  const maxSimilarity = Math.max(...matches.map(match => match.similarity));
  
  // Factor 4: Distribution of similarities (variance)
  const similarities = matches.map(match => match.similarity);
  const varianceFactor = calculateVariance(similarities);
  
  // Combine factors with "learned" weights
  // These weights would ideally come from a trained model
  const weightMatchedRatio = 0.35;
  const weightAvgSimilarity = 0.25;
  const weightMaxSimilarity = 0.3;
  const weightVariance = 0.1;
  
  const weightedScore = 
    (matchedChunksRatio * weightMatchedRatio) +
    (avgSimilarity * weightAvgSimilarity) +
    (maxSimilarity * weightMaxSimilarity) +
    (varianceFactor * weightVariance);
  
  // Convert to percentage
  return Math.round(weightedScore * 100);
}

/**
 * Calculate variance of an array of numbers
 * Used as a feature in the ML-enhanced scoring
 */
function calculateVariance(numbers: number[]): number {
  if (numbers.length <= 1) return 0;
  
  const mean = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
  const variance = numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numbers.length;
  
  // Normalize to 0-1 range for scoring
  return Math.min(1, variance * 4); // Scale factor of 4 to get meaningful values
}
