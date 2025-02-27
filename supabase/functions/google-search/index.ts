
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
    const { query, userId, isImageSearch } = await req.json()
    
    // Validate request
    if (!query && !isImageSearch) {
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
    
    if (isImageSearch) {
      // For image searches, we use 'searchType=image' and the imageUrl as the query
      searchUrl.searchParams.append('searchType', 'image')
      // If this is a reverse image search, include proper parameters
      searchUrl.searchParams.append('q', query || 'reverse image search')
      // Add sites to focus on, including social media platforms
      searchUrl.searchParams.append('siteSearch', 'linkedin.com,facebook.com,instagram.com,twitter.com')
    } else {
      // For text searches
      searchUrl.searchParams.append('q', query)
    }

    console.log(`Performing ${isImageSearch ? 'image' : 'text'} search for query: ${query}`)
    console.log(`Search URL: ${searchUrl.toString()}`)

    // Make the request to Google Custom Search API
    const response = await fetch(searchUrl.toString())
    const data = await response.json()

    console.log(`Got response with ${data.items?.length || 0} results`)
    console.log(`Response data:`, JSON.stringify(data).substring(0, 500) + '...')
    
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
          search_type: isImageSearch ? 'image' : 'text',
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
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
