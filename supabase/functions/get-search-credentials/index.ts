
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
const GOOGLE_CSE_ID = Deno.env.get("GOOGLE_CSE_ID");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
      console.error("Missing Google API credentials in environment");
      return new Response(
        JSON.stringify({ 
          error: "Google API credentials are not configured on the server" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Return the credentials
    return new Response(
      JSON.stringify({ 
        apiKey: GOOGLE_API_KEY, 
        cseId: GOOGLE_CSE_ID 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in get-search-credentials function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
