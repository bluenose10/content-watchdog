
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Edge Function: get-search-credentials started")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Edge Function: Retrieving Google API credentials")
    
    // Get the API keys from environment variables
    const apiKey = Deno.env.get('GOOGLE_API_KEY')
    const cseId = Deno.env.get('GOOGLE_CSE_ID')
    
    // Debug logging (this will show up in Supabase Function logs)
    console.log(`Edge Function: API Key exists: ${Boolean(apiKey)}`)
    console.log(`Edge Function: CSE ID exists: ${Boolean(cseId)}`)
    
    // Validate the credentials
    if (!apiKey || !cseId) {
      console.error("Edge Function: Missing Google API credentials")
      return new Response(
        JSON.stringify({
          error: 'Missing Google API credentials',
          message: 'Both GOOGLE_API_KEY and GOOGLE_CSE_ID must be set in the Supabase Function Secrets.',
          apiKeyExists: Boolean(apiKey),
          cseIdExists: Boolean(cseId)
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    // Return the API keys
    console.log("Edge Function: Successfully retrieved credentials")
    return new Response(
      JSON.stringify({ 
        apiKey, 
        cseId,
        message: 'Credentials retrieved successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error("Edge Function: Error retrieving credentials:", error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Server error', 
        message: error.message || 'Unknown error occurred',
        stack: Deno.env.get('ENVIRONMENT') === 'development' ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

// To invoke:
// curl -i --location --request GET 'https://phkdkwusblkngypuwgao.functions.supabase.co/get-search-credentials'
