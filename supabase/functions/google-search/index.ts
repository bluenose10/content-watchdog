
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.8.0'

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define comprehensive social media platforms for different content types
const PLATFORMS = {
  // Professional networks
  professional: [
    'linkedin.com',
    'xing.com',
    'glassdoor.com',
    'indeed.com',
  ],
  // Major social networks
  social: [
    'facebook.com',
    'instagram.com',
    'twitter.com',
    'threads.net',
    'pinterest.com',
  ],
  // Video platforms
  video: [
    'youtube.com',
    'tiktok.com',
    'vimeo.com',
    'twitch.tv',
    'dailymotion.com',
  ],
  // Content sharing and blogging
  content: [
    'medium.com',
    'tumblr.com',
    'wordpress.com',
    'blogger.com',
    'substack.com',
  ],
  // Creative platforms
  creative: [
    'behance.net',
    'dribbble.com',
    'deviantart.com',
    'artstation.com',
    'flickr.com',
  ],
  // Discussion and community
  community: [
    'reddit.com',
    'quora.com',
    'discord.com',
    'telegram.org',
    'whatsapp.com',
  ],
};

// Combine all platforms into a single string
const ALL_PLATFORMS = Object.values(PLATFORMS)
  .flat()
  .join(',');

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
    console.log('Request data:', { query, userId, isImageSearch });
    
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
    
    // Determine search type and configure accordingly
    if (isImageSearch) {
      // Image search configuration
      searchUrl.searchParams.append('searchType', 'image')
      searchUrl.searchParams.append('q', query)
      searchUrl.searchParams.append('imgSize', 'large')
    } else {
      // Text-based search (name, hashtag, etc.)
      let searchQuery = query;
      
      // If it's a hashtag search, ensure proper formatting
      if (query.startsWith('#')) {
        // Remove # and add specific terms to find social media posts
        searchQuery = `${query.slice(1)} site:${PLATFORMS.social.join(' OR site:')}`;
      } else {
        // For name searches, look for profiles and mentions
        searchQuery = `"${query}" OR @${query.replace(/\s+/g, '')} site:${ALL_PLATFORMS}`;
      }
      
      searchUrl.searchParams.append('q', searchQuery)
    }

    // Add site search restrictions to focus on social media platforms
    searchUrl.searchParams.append('siteSearch', ALL_PLATFORMS)
    searchUrl.searchParams.append('siteSearchFilter', 'i') // Include only these sites
    searchUrl.searchParams.append('num', '20') // Request more results

    console.log(`Performing ${isImageSearch ? 'image' : 'text'} search for query:`, query)
    console.log('Search URL:', searchUrl.toString())
    console.log('Searching across platforms:', ALL_PLATFORMS)

    // Make the request to Google Custom Search API
    const response = await fetch(searchUrl.toString())
    
    if (!response.ok) {
      console.error(`Google API error: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.error('Error details:', errorText)
      throw new Error(`Google API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()

    if (data.error) {
      console.error('Google API error:', data.error)
      throw new Error(data.error.message)
    }

    // Log the results
    console.log(`Got response with ${data.items?.length || 0} results`)
    if (data.items?.[0]) {
      console.log('First result:', JSON.stringify(data.items[0]).substring(0, 500))
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Log search query for analytics
    if (userId) {
      try {
        const { error } = await supabase
          .from('search_logs')
          .insert({
            user_id: userId,
            query: query,
            results_count: data.items?.length || 0,
            search_type: isImageSearch ? 'image' : 'text',
            platforms_searched: ALL_PLATFORMS
          })
        
        if (error) {
          console.error('Error logging search:', error)
        }
      } catch (logError) {
        console.error('Error inserting search log:', logError)
      }
    }

    // Categorize results by platform type
    const categorizedResults = data.items?.reduce((acc: any, item: any) => {
      const url = new URL(item.link);
      const domain = url.hostname.replace('www.', '');
      
      // Determine which category this result belongs to
      for (const [category, platforms] of Object.entries(PLATFORMS)) {
        if (platforms.some(platform => domain.includes(platform))) {
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          break;
        }
      }
      return acc;
    }, {});

    // Return the search results with additional metadata
    return new Response(
      JSON.stringify({
        ...data,
        categorizedResults,
        metadata: {
          platforms: PLATFORMS,
          total_platforms: ALL_PLATFORMS.split(',').length,
          is_image_search: isImageSearch,
          query_type: query.startsWith('#') ? 'hashtag' : 'name',
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
