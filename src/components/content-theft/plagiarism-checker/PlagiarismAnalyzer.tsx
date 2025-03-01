
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { extractTextFromFile } from "./TextExtractor";
import { checkPlagiarism, PlagiarismResult } from "./PlagiarismChecker";
import { usePlagiarismDatabase } from "./PlagiarismDatabaseService";
import { useAuth } from "@/context/AuthContext";

interface PlagiarismAnalyzerProps {
  file: File | null;
  setResults: (results: PlagiarismResult | null) => void;
  setIsUploading: (isUploading: boolean) => void;
  isUploading: boolean;
  setSaveError?: (error: string | null) => void;
}

export const usePlagiarismAnalyzer = ({ 
  file, 
  setResults, 
  setIsUploading, 
  isUploading,
  setSaveError 
}: PlagiarismAnalyzerProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { saveResultsToDatabase } = usePlagiarismDatabase();

  const uploadAndCheckPlagiarism = async () => {
    if (!file) return;
    
    setIsUploading(true);
    if (setSaveError) setSaveError(null);
    
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
      
      // Save results to database
      if (user) {
        try {
          const saveSuccess = await saveResultsToDatabase(plagiarismResults, file.name, user.id);
          if (!saveSuccess && setSaveError) {
            setSaveError("Results available on this device only due to a database permission issue.");
          }
        } catch (saveError) {
          console.error("Error saving results to database:", saveError);
          if (setSaveError) {
            setSaveError("Results available on this device only. Database save failed.");
          }
        }
      }
      
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

  return { uploadAndCheckPlagiarism };
};
