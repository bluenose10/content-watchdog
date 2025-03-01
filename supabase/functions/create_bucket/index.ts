
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { bucketName } = await req.json();
    
    if (!bucketName) {
      return new Response(
        JSON.stringify({ error: 'Bucket name is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Attempting to create bucket: ${bucketName}`);

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      return new Response(
        JSON.stringify({ error: 'Failed to list buckets', details: listError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // If bucket already exists, return success
    if (buckets.some(bucket => bucket.name === bucketName)) {
      console.log(`Bucket ${bucketName} already exists`);
      return new Response(
        JSON.stringify({ message: `Bucket ${bucketName} already exists` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Create the bucket
    const { data, error } = await supabaseAdmin.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 5242880, // 5MB limit
    });

    if (error) {
      console.error("Error creating bucket:", error);
      return new Response(
        JSON.stringify({ error: 'Failed to create bucket', details: error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log(`Successfully created bucket: ${bucketName}`);

    // Create policies for the bucket
    const setupPolicies = async () => {
      // Allow authenticated users to upload files
      await supabaseAdmin.rpc('create_storage_policy', {
        bucket_id: bucketName,
        policy_name: `Allow authenticated users to upload files to ${bucketName}`,
        operation: 'INSERT',
        definition: `(bucket_id = '${bucketName}' AND auth.role() = 'authenticated')`
      });

      // Allow authenticated users to select files
      await supabaseAdmin.rpc('create_storage_policy', {
        bucket_id: bucketName,
        policy_name: `Allow authenticated users to select files from ${bucketName}`,
        operation: 'SELECT',
        definition: `(bucket_id = '${bucketName}' AND auth.role() = 'authenticated')`
      });

      // Allow authenticated users to delete files
      await supabaseAdmin.rpc('create_storage_policy', {
        bucket_id: bucketName,
        policy_name: `Allow authenticated users to delete files from ${bucketName}`,
        operation: 'DELETE',
        definition: `(bucket_id = '${bucketName}' AND auth.role() = 'authenticated')`
      });
    };

    try {
      await setupPolicies();
      console.log(`Successfully created policies for bucket: ${bucketName}`);
    } catch (policyError) {
      console.error("Error creating policies:", policyError);
      // Don't fail the whole operation if policy creation fails
    }

    return new Response(
      JSON.stringify({ message: `Bucket ${bucketName} created successfully` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
