
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { text, existingMatches } = await req.json();
    
    // If no text is provided, return an error
    if (!text || text.length < 50) {
      return new Response(
        JSON.stringify({ 
          error: 'Text is too short for analysis'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Get the OpenAI API key from environment variables
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.log('OpenAI API key not found in environment variables');
      throw new Error('OpenAI API key is required for AI analysis');
    }
    
    // Prepare the prompt for GPT
    // We'll include existing matches if available
    let prompt = "Analyze the following text for potential plagiarism. ";
    
    if (existingMatches && existingMatches.length > 0) {
      prompt += "We've found these potential matches through web searches:\n\n";
      
      existingMatches.forEach((match: any, index: number) => {
        prompt += `Match ${index + 1}: "${match.text}" (${Math.round(match.similarity * 100)}% similar, source: ${match.source})\n\n`;
      });
      
      prompt += "Based on these matches and your own analysis, ";
    }
    
    prompt += `Please analyze this text:
    
"${text.substring(0, 3000)}"${text.length > 3000 ? '...(text truncated for length)' : ''}

Provide a detailed analysis including:
1. Is this text likely original or plagiarized? Why?
2. Are there any distinctive writing patterns that suggest plagiarism?
3. If it appears plagiarized, what type of plagiarism might it be (direct copying, paraphrasing, etc.)?
4. Provide a confidence score from 0-100% on your assessment.

Format your response like this:
Confidence Score: [0-100]%

[Your detailed analysis here]
`;
    
    console.log('Sending request to OpenAI API');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert academic integrity analyst specializing in detecting plagiarism. You provide detailed, objective analyses of text to determine if it contains plagiarized content.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || JSON.stringify(errorData)}`);
    }
    
    const completion = await response.json();
    const aiAnalysis = completion.choices[0].message.content;
    
    // Extract confidence score from AI analysis
    let aiConfidenceScore = 0;
    const confidenceMatch = aiAnalysis.match(/Confidence Score: (\d+)%/i);
    if (confidenceMatch && confidenceMatch[1]) {
      aiConfidenceScore = parseInt(confidenceMatch[1], 10);
    }
    
    // Clean up the analysis text by removing the confidence score line
    const cleanedAnalysis = aiAnalysis.replace(/Confidence Score: \d+%\s*/i, '').trim();
    
    return new Response(
      JSON.stringify({ 
        aiAnalysis: cleanedAnalysis, 
        aiConfidenceScore 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error in AI plagiarism analysis:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error during AI analysis' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
