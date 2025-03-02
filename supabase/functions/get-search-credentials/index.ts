
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

console.log('get-search-credentials function initialization')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Fetching Google API credentials from Supabase secrets')
    
    // Get secrets from environment
    const apiKey = Deno.env.get('GOOGLE_API_KEY')
    const cseId = Deno.env.get('GOOGLE_CSE_ID')
    
    // Log status (without revealing the full key for security)
    console.log(`API Key status: ${apiKey ? 'Found (starts with ' + apiKey.substring(0, 4) + '...)' : 'Not found'}`)
    console.log(`CSE ID status: ${cseId ? 'Found (starts with ' + cseId.substring(0, 4) + '...)' : 'Not found'}`)
    
    if (!apiKey || !cseId) {
      console.error('Missing required Google API credentials in Supabase secrets')
      return new Response(
        JSON.stringify({
          error: 'Missing required Google API credentials in Supabase secrets'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }
    
    // Return the credentials
    console.log('Successfully retrieved Google API credentials')
    return new Response(
      JSON.stringify({
        apiKey,
        cseId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error(`Error in get-search-credentials function: ${error.message}`)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
