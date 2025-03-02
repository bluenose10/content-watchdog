
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
}

// Function to generate a response with CORS headers
function corsResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })
}

serve(async (req) => {
  console.log('Edge Function: get-search-credentials called')
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Get Google API Key and CSE ID from Supabase secrets
    const apiKey = Deno.env.get('GOOGLE_API_KEY')
    const cseId = Deno.env.get('GOOGLE_CSE_ID')
    
    // Validate that both values exist
    if (!apiKey || !cseId) {
      console.error('Missing Google API credentials in environment variables')
      
      if (!apiKey) console.error('GOOGLE_API_KEY is missing')
      if (!cseId) console.error('GOOGLE_CSE_ID is missing')
      
      return corsResponse({
        error: 'Google API credentials not configured in Supabase secrets'
      }, 500)
    }
    
    console.log('Successfully retrieved Google API credentials')
    
    // Return the credentials
    return corsResponse({
      apiKey,
      cseId
    })
  } catch (error) {
    console.error(`Error retrieving Google API credentials: ${error.message}`)
    return corsResponse({
      error: `Failed to retrieve Google API credentials: ${error.message}`
    }, 500)
  }
})
