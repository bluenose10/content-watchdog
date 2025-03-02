
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

console.log("Loading get-search-credentials Edge Function")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Log incoming request
    console.log("Received request for Google API credentials")
    
    // Get the API key and CSE ID from environment variables
    const apiKey = Deno.env.get('GOOGLE_API_KEY')
    const cseId = Deno.env.get('GOOGLE_CSE_ID')
    
    // Log status of found credentials (without revealing the actual values)
    console.log(`API Key found: ${apiKey ? 'Yes' : 'No'}`)
    console.log(`CSE ID found: ${apiKey ? 'Yes' : 'No'}`)
    
    // Check if both credentials are available
    if (!apiKey || !cseId) {
      console.error("Missing Google API credentials in environment variables")
      return new Response(
        JSON.stringify({
          error: 'Missing credentials',
          message: 'Google API Key or CSE ID not found in environment variables',
          apiKeyFound: !!apiKey,
          cseIdFound: !!cseId
        }),
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }
    
    // Return the credentials
    console.log("Successfully returning Google API credentials")
    return new Response(
      JSON.stringify({
        apiKey,
        cseId,
      }),
      { 
        status: 200,
        headers: corsHeaders
      }
    )
  } catch (error) {
    // Log and return any errors
    console.error("Error in get-search-credentials function:", error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Unknown error',
        message: 'Failed to retrieve Google API credentials'
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    )
  }
})
