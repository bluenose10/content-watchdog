
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useBucketManager = () => {
  const [isBucketChecked, setIsBucketChecked] = useState(false);
  const [isBucketReady, setIsBucketReady] = useState(false);

  // Check if the required bucket exists on component mount
  useEffect(() => {
    const checkAndCreateBucket = async () => {
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error("Error checking buckets:", error);
          setIsBucketChecked(true);
          return;
        }
        
        const tempUploadsBucketExists = buckets.some(bucket => bucket.name === 'temp-uploads');
        
        if (!tempUploadsBucketExists) {
          console.log("temp-uploads bucket doesn't exist, attempting to create it...");
          
          // Call the edge function to create the bucket
          const { data, error: createError } = await supabase.functions.invoke('create_bucket', {
            body: { bucketName: 'temp-uploads' }
          });
          
          if (createError) {
            console.error("Failed to create temp-uploads bucket:", createError);
            setIsBucketReady(false);
          } else {
            console.log("Bucket creation response:", data);
            setIsBucketReady(true);
          }
        } else {
          setIsBucketReady(true);
        }
      } catch (error) {
        console.error("Error in bucket check:", error);
        setIsBucketReady(false);
      } finally {
        setIsBucketChecked(true);
      }
    };
    
    checkAndCreateBucket();
  }, []);

  return { isBucketChecked, isBucketReady };
};
