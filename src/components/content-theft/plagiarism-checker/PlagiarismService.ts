
import { supabase } from "@/lib/supabase";
import { extractTextFromFile } from "./TextExtractor";
import { checkPlagiarism, PlagiarismResult } from "./PlagiarismChecker";
import { savePlagiarismResultsToDatabase } from "./PlagiarismDbService";

export const uploadAndCheckPlagiarism = async (
  file: File,
  userId: string | undefined,
  toast: (props: { title: string; description: string; variant?: "default" | "destructive" | "success" }) => void
): Promise<PlagiarismResult> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `plagiarism-checks/${fileName}`;
  
  console.log('Attempting to upload file to temp-uploads bucket...');
  
  try {
    const { error: uploadError } = await supabase.storage
      .from('temp-uploads')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Upload error:', uploadError);
      
      if (uploadError.message.includes('bucket') && uploadError.message.includes('not found')) {
        console.log("Bucket not found, attempting to create it and retry...");
        
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
          throw new Error("Storage setup failed");
        }
        
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
    
    let fileText;
    try {
      console.log('Extracting text from file...');
      fileText = await extractTextFromFile(file);
      console.log('Text extracted successfully');
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error(`Failed to extract text: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    
    console.log('Checking for plagiarism...');
    const plagiarismResults = await checkPlagiarism(fileText);
    console.log('Plagiarism check completed');
    
    if (plagiarismResults.aiAnalysis) {
      console.log('AI analysis included in results');
    }
    
    if (userId) {
      await savePlagiarismResultsToDatabase(plagiarismResults, file.name, userId, toast);
    }
    
    console.log('Cleaning up temporary file...');
    await supabase.storage
      .from('temp-uploads')
      .remove([filePath]);
    
    toast({
      title: "Analysis complete",
      description: "Your document has been analyzed for plagiarism.",
      variant: "success"
    });

    return plagiarismResults;
  } catch (error) {
    console.error("Error during plagiarism check:", error);
    
    if (error instanceof Error && 
        (error.message.includes('OpenAI API key') || 
         error.message.includes('OpenAI API error'))) {
      toast({
        title: "API Key Required",
        description: "An OpenAI API key is required for enhanced AI analysis. The check was completed with basic analysis only.",
        variant: "default"
      });
    } else {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check for plagiarism",
        variant: "destructive"
      });
    }
    throw error;
  }
};
