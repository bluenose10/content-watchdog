
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const { text, existingMatches } = await req.json();
    
    if (!text) {
      throw new Error('No text provided for analysis');
    }

    console.log(`Analyzing text (${text.length} characters) with OpenAI`);
    
    // Create a system prompt that instructs the model on plagiarism detection
    const systemPrompt = `
You are an advanced plagiarism detection assistant. Your task is to analyze the given text for potential plagiarism.
Focus on:
1. Identifying text that appears to be directly copied from common sources
2. Detecting paraphrased content that maintains the same meaning but uses different words
3. Recognizing content that has distinctive style or terminology specific to known authors or sources
4. Finding any academic or technical phrases that are likely taken from scholarly works

If I provide information about existing matches found through search engines, incorporate this information in your analysis.
`;

    // Create a user prompt with the text to analyze and existing matches
    let userPrompt = `Analyze the following text for potential plagiarism:\n\n${text}\n\n`;
    
    // Include information about existing matches if available
    if (existingMatches && existingMatches.length > 0) {
      userPrompt += "Here are matches already found through search engines:\n";
      existingMatches.forEach((match, index) => {
        userPrompt += `Match ${index + 1}: "${match.text}" (similarity: ${Math.round(match.similarity * 100)}%) from source: ${match.source}\n`;
      });
      userPrompt += "\nGiven these existing matches, provide deeper analysis on potential plagiarism in the text.";
    } else {
      userPrompt += "No existing matches were found through search engines. Please provide your independent analysis on potential plagiarism.";
    }

    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a smaller model for cost efficiency
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3, // Lower temperature for more focused analysis
        max_tokens: 1000, // Limit response length
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiAnalysis = data.choices[0].message.content;
    
    // Calculate an AI confidence score (0-100) based on the analysis content
    // This is a simplified approach - in a real system this would be more sophisticated
    let aiConfidenceScore = 0;
    
    if (aiAnalysis.toLowerCase().includes('highly likely') || 
        aiAnalysis.toLowerCase().includes('clear evidence') ||
        aiAnalysis.toLowerCase().includes('definitely plagiarized')) {
      aiConfidenceScore = 85;
    } else if (aiAnalysis.toLowerCase().includes('likely') || 
               aiAnalysis.toLowerCase().includes('strong indication') ||
               aiAnalysis.toLowerCase().includes('probable plagiarism')) {
      aiConfidenceScore = 65;
    } else if (aiAnalysis.toLowerCase().includes('possibly') || 
               aiAnalysis.toLowerCase().includes('some indication') ||
               aiAnalysis.toLowerCase().includes('potential plagiarism')) {
      aiConfidenceScore = 40;
    } else if (aiAnalysis.toLowerCase().includes('unlikely') || 
               aiAnalysis.toLowerCase().includes('no clear evidence') ||
               aiAnalysis.toLowerCase().includes('appears to be original')) {
      aiConfidenceScore = 10;
    } else {
      aiConfidenceScore = 30; // Default moderate score
    }

    console.log('AI analysis completed successfully');
    
    // Return the AI analysis and confidence score
    return new Response(
      JSON.stringify({
        aiAnalysis,
        aiConfidenceScore
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in ai-plagiarism-analysis function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred during AI plagiarism analysis' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
