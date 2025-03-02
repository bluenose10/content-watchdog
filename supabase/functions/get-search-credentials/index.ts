
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    })
  }

  try {
    // Get Google API credentials from environment variables
    const apiKey = Deno.env.get('GOOGLE_API_KEY')
    const cseId = Deno.env.get('GOOGLE_CSE_ID')

    console.log('Edge function: Retrieving Google API credentials')
    console.log(`API Key present: ${apiKey ? 'Yes (starts with ' + apiKey.substring(0, 4) + '...)' : 'No'}`)
    console.log(`CSE ID present: ${cseId ? 'Yes (starts with ' + cseId.substring(0, 4) + '...)' : 'No'}`)

    if (!apiKey || !cseId) {
      console.error('Edge function: Missing Google API credentials')
      return new Response(
        JSON.stringify({
          error: 'Missing Google API credentials',
          apiKeyPresent: !!apiKey,
          cseIdPresent: !!cseId
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Return credentials
    return new Response(
      JSON.stringify({
        apiKey,
        cseId,
        message: 'Google API credentials retrieved successfully'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Edge function error:', error.message)
    
    return new Response(
      JSON.stringify({
        error: 'Failed to retrieve Google API credentials',
        details: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
