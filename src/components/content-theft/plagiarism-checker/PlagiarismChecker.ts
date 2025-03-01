
import { optimizedSearch } from "@/lib/search";
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
  authenticityCheck?: AuthenticityCheck;
}

export interface AuthenticityCheck {
  isAuthentic: boolean;
  aiGeneratedProbability: number;
  manipulationProbability: number;
  originalityScore: number;
  detailsText: string;
  verificationMethod: string;
}

export const checkPlagiarism = async (text: string): Promise<PlagiarismResult> => {
  const chunkSize = 50;
  const words = text.split(/\s+/);
  const chunks = [];
  
  for (let i = 0; i < words.length; i += Math.floor(chunkSize / 2)) {
    if (i + chunkSize <= words.length) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    } else if (i < words.length) {
      chunks.push(words.slice(i).join(' '));
    }
  }
  
  const chunksToProcess = chunks.slice(0, 5);
  const matches: PlagiarismMatch[] = [];
  
  for (const chunk of chunksToProcess) {
    try {
      const searchResults = await optimizedSearch("web", `"${chunk}"`, {
        exactMatch: true,
        maxResults: 10
      });
      
      if (searchResults && searchResults.items && searchResults.items.length > 0) {
        const relevantResults = searchResults.items.filter(item => {
          if (!item.title || !item.description || 
              item.title.length < 10 || item.description.length < 20) {
            return false;
          }
          return true;
        });
        
        for (const result of relevantResults) {
          const sharedWords = chunk.split(/\s+/).filter(word => 
            result.description.toLowerCase().includes(word.toLowerCase())
          ).length;
          const similarity = sharedWords / chunk.split(/\s+/).length;
          
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
  
  let overallScore = 0;
  if (matches.length > 0) {
    const totalChunks = chunks.length;
    const matchedChunksRatio = Math.min(matches.length / totalChunks, 1);
    const avgSimilarity = matches.reduce((sum, match) => sum + match.similarity, 0) / matches.length;
    
    overallScore = Math.round(matchedChunksRatio * avgSimilarity * 100);
  }
  
  let aiAnalysis = undefined;
  let aiConfidenceScore = undefined;
  let authenticityCheck = undefined;
  
  if (text.length > 100) {
    try {
      console.log('Requesting AI analysis for plagiarism check');
      const { data, error } = await supabase.functions.invoke('ai-plagiarism-analysis', {
        body: { 
          text, 
          existingMatches: matches.slice(0, 10),
          performAuthenticityCheck: true
        }
      });
      
      if (error) {
        console.error('Error invoking AI analysis:', error);
      } else if (data) {
        aiAnalysis = data.aiAnalysis;
        aiConfidenceScore = data.aiConfidenceScore;
        
        if (data.authenticityCheck) {
          authenticityCheck = {
            isAuthentic: data.authenticityCheck.isAuthentic,
            aiGeneratedProbability: data.authenticityCheck.aiGeneratedProbability,
            manipulationProbability: data.authenticityCheck.manipulationProbability,
            originalityScore: data.authenticityCheck.originalityScore || 0,
            detailsText: data.authenticityCheck.detailsText || '',
            verificationMethod: data.authenticityCheck.verificationMethod || 'combined'
          };
        }
        
        console.log('AI analysis completed with confidence score:', aiConfidenceScore);
        
        if (aiConfidenceScore !== undefined) {
          overallScore = Math.round((overallScore * 0.7) + (aiConfidenceScore * 0.3));
        }
      }
    } catch (error) {
      console.error('Error during AI analysis:', error);
    }
  }
  
  return {
    score: overallScore,
    matches: matches.slice(0, 10),
    aiAnalysis,
    aiConfidenceScore,
    authenticityCheck
  };
};

export const verifyContentAuthenticity = async (
  content: string | File, 
  contentType: 'text' | 'image' | 'video' | 'audio'
): Promise<AuthenticityCheck> => {
  try {
    console.log(`Requesting authenticity verification for ${contentType} content`);
    
    let contentData;
    if (typeof content !== 'string' && content instanceof File) {
      const buffer = await content.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      contentData = {
        fileName: content.name,
        fileType: content.type,
        fileSize: content.size,
        fileData: `data:${content.type};base64,${base64}`
      };
    } else {
      contentData = content;
    }
    
    const { data, error } = await supabase.functions.invoke('content-authenticity-verification', {
      body: {
        content: contentData,
        contentType,
        storeResult: false
      }
    });
    
    if (error) {
      console.error('Error invoking authenticity verification:', error);
      throw new Error(`Authenticity verification failed: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No data returned from authenticity verification');
    }
    
    return {
      isAuthentic: data.isAuthentic,
      aiGeneratedProbability: data.aiGeneratedProbability,
      manipulationProbability: data.manipulationProbability,
      originalityScore: data.originalityScore || 0,
      detailsText: data.detailsText || '',
      verificationMethod: data.verificationMethod || 'combined'
    };
  } catch (error) {
    console.error('Error during authenticity verification:', error);
    throw error;
  }
};
