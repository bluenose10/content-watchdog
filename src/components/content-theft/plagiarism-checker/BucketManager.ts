
import { supabase } from "@/lib/supabase";

export const checkAndCreateBucket = async (): Promise<boolean> => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking buckets:", error);
      return false;
    }
    
    const tempUploadsBucketExists = buckets.some(bucket => bucket.name === 'temp-uploads');
    
    if (!tempUploadsBucketExists) {
      console.log("temp-uploads bucket doesn't exist, attempting to create it...");
      
      const { data, error: createError } = await supabase.functions.invoke('create_bucket', {
        body: { bucketName: 'temp-uploads' }
      });
      
      if (createError) {
        console.error("Failed to create temp-uploads bucket:", createError);
        return false;
      } else {
        console.log("Bucket creation response:", data);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in bucket check:", error);
    return false;
  }
};
