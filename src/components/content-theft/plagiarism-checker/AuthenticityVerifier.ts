
import { supabase } from "@/lib/supabase";

export interface AuthenticityCheck {
  isAuthentic: boolean;
  aiGeneratedProbability: number;
  manipulationProbability: number;
  originalityScore: number;
  detailsText: string;
  verificationMethod: string;
}

/**
 * Verifies the authenticity of different types of content to determine if it's authentic,
 * AI-generated, or manipulated in some way.
 */
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
