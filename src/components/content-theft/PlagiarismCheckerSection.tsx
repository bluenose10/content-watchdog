
import { useState } from "react";
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
  const { toast } = useToast();

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
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      console.log('File uploaded successfully:', uploadData);
      
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
