
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { FileUploader } from "./plagiarism-checker/FileUploader";
import { extractTextFromFile } from "./plagiarism-checker/TextExtractor";
import { checkPlagiarism, PlagiarismResult } from "./plagiarism-checker/PlagiarismChecker";
import { PlagiarismResults } from "./plagiarism-checker/PlagiarismResults";

export const PlagiarismCheckerSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<PlagiarismResult | null>(null);
  const [isBucketChecked, setIsBucketChecked] = useState(false);
  const { toast } = useToast();

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
          } else {
            console.log("Bucket creation response:", data);
          }
        }
      } catch (error) {
        console.error("Error in bucket check:", error);
      } finally {
        setIsBucketChecked(true);
      }
    };
    
    checkAndCreateBucket();
  }, []);

  const uploadAndCheckPlagiarism = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Generate a unique filename to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `plagiarism-checks/${fileName}`;
      
      console.log('Attempting to upload file to temp-uploads bucket...');
      
      // Upload file to temporary storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('temp-uploads')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // If bucket not found, attempt to create it and retry once
        if (uploadError.message.includes('bucket') && uploadError.message.includes('not found')) {
          console.log("Bucket not found, attempting to create it and retry...");
          
          // Call the edge function to create the bucket
          const { error: createError } = await supabase.functions.invoke('create_bucket', {
            body: { bucketName: 'temp-uploads' }
          });
          
          if (createError) {
            console.error("Failed to create bucket:", createError);
            toast({
              title: "Storage setup failed",
              description: "Could not set up the required storage. Please try again later or contact support.",
              variant: "destructive"
            });
            return;
          }
          
          // Retry the upload after creating the bucket
          console.log("Retrying upload after bucket creation...");
          const { error: retryError } = await supabase.storage
            .from('temp-uploads')
            .upload(filePath, file);
            
          if (retryError) {
            console.error("Retry upload error:", retryError);
            throw new Error(`Upload failed after bucket creation: ${retryError.message}`);
          }
        } else {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
      }
      
      console.log('File uploaded successfully');
      
      // Extract text from the file
      let fileText;
      try {
        console.log('Extracting text from file...');
        fileText = await extractTextFromFile(file);
        console.log('Text extracted successfully');
      } catch (error) {
        console.error('Text extraction error:', error);
        throw new Error(`Failed to extract text: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
      
      // Check for plagiarism using Google Search
      console.log('Checking for plagiarism...');
      const plagiarismResults = await checkPlagiarism(fileText);
      setResults(plagiarismResults);
      console.log('Plagiarism check completed');
      
      // Clean up the file after results are shown
      console.log('Cleaning up temporary file...');
      await supabase.storage
        .from('temp-uploads')
        .remove([filePath]);
      
      toast({
        title: "Analysis complete",
        description: "Your document has been analyzed for plagiarism.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error during plagiarism check:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check for plagiarism",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="p-6 bg-card rounded-lg shadow-sm space-y-6">
      <div className="flex flex-col space-y-2">
        <h3 className="text-xl font-semibold">Plagiarism Checker</h3>
        <p className="text-muted-foreground">
          Upload a document to check for potential plagiarism. 
          Supported formats: .txt, .pdf, .docx (max 5MB)
        </p>
      </div>

      <FileUploader 
        file={file}
        setFile={(newFile) => {
          setFile(newFile);
          setResults(null); // Clear previous results when a new file is selected
        }}
        isUploading={isUploading}
        onSubmit={uploadAndCheckPlagiarism}
      />

      <PlagiarismResults results={results} />
    </section>
  );
};
