
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.8.0'

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define social media platforms to search
const SOCIAL_MEDIA_PLATFORMS = [
  'linkedin.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'tiktok.com',
  'youtube.com',
  'pinterest.com',
  'reddit.com',
  'snapchat.com',
  'threads.net',
  'flickr.com',
  'vimeo.com',
  'tumblr.com',
  'medium.com',
  'behance.net',
  'dribbble.com',
  'deviantart.com',
  'artstation.com',
  'weibo.com',
  'vk.com'
].join(',');

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
      // For image searches
      searchUrl.searchParams.append('searchType', 'image')
      searchUrl.searchParams.append('q', query || 'reverse image search')
      
      // Add all social media platforms to search scope
      searchUrl.searchParams.append('siteSearch', SOCIAL_MEDIA_PLATFORMS)
      searchUrl.searchParams.append('siteSearchFilter', 'i') // Include only these sites
      
      // Additional parameters to improve image search
      searchUrl.searchParams.append('imgSize', 'large') // Prefer larger images
      searchUrl.searchParams.append('num', '20') // Request more results
      searchUrl.searchParams.append('safe', 'off') // Don't filter results
    } else {
      // For text searches
      searchUrl.searchParams.append('q', query)
      // Also include social media platforms for text searches
      searchUrl.searchParams.append('siteSearch', SOCIAL_MEDIA_PLATFORMS)
      searchUrl.searchParams.append('siteSearchFilter', 'i')
    }

    console.log(`Performing ${isImageSearch ? 'image' : 'text'} search for query: ${query}`)
    console.log(`Search URL: ${searchUrl.toString()}`)
    console.log('Searching across platforms:', SOCIAL_MEDIA_PLATFORMS)

    // Make the request to Google Custom Search API
    const response = await fetch(searchUrl.toString())
    const data = await response.json()

    if (data.error) {
      console.error('Google API error:', data.error)
      throw new Error(data.error.message)
    }

    console.log(`Got response with ${data.items?.length || 0} results`)
    console.log(`Response data:`, JSON.stringify(data).substring(0, 500) + '...')
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Log search query for analytics
    if (userId) {
      const { error } = await supabase
        .from('search_logs')
        .insert({
          user_id: userId,
          query: query,
          results_count: data.items?.length || 0,
          search_type: isImageSearch ? 'image' : 'text',
          platforms_searched: SOCIAL_MEDIA_PLATFORMS
        })
      
      if (error) {
        console.error('Error logging search:', error)
      }
    }

    // Return the search results with additional metadata
    return new Response(
      JSON.stringify({
        ...data,
        metadata: {
          platforms_searched: SOCIAL_MEDIA_PLATFORMS.split(','),
          total_platforms: SOCIAL_MEDIA_PLATFORMS.split(',').length,
          is_image_search: isImageSearch,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
