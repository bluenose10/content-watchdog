
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.8.0'

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle preflight requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    })
  }

  try {
    // Get the request body
    const { query, userId } = await req.json()
    
    // Validate request
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Google Custom Search API credentials
    // Get from environment variables
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')
    const GOOGLE_CSE_ID = Deno.env.get('GOOGLE_CSE_ID')

    if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
      console.error('Missing Google API credentials')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Build the Google Custom Search API URL
    const searchUrl = new URL('https://www.googleapis.com/customsearch/v1')
    searchUrl.searchParams.append('key', GOOGLE_API_KEY)
    searchUrl.searchParams.append('cx', GOOGLE_CSE_ID)
    searchUrl.searchParams.append('q', query)
    searchUrl.searchParams.append('searchType', 'image') // Remove this if you want to search for all types of content

    console.log(`Performing search for query: ${query}`)

    // Make the request to Google Custom Search API
    const response = await fetch(searchUrl.toString())
    const data = await response.json()

    console.log(`Got response with ${data.items?.length || 0} results`)
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Log search query for analytics (optional)
    if (userId) {
      const { error } = await supabase
        .from('search_logs')
        .insert({
          user_id: userId,
          query: query,
          results_count: data.items?.length || 0,
          search_type: 'google-cse',
        })
      
      if (error) {
        console.error('Error logging search:', error)
      }
    }

    // Return the search results
    return new Response(
      JSON.stringify(data),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
