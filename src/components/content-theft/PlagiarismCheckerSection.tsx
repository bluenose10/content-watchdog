
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { optimizedSearch } from "@/lib/google-api-manager";

export const PlagiarismCheckerSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    matches: Array<{ text: string; source: string; similarity: number }>;
  } | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check file type - accept only text and document files
      const validTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a .txt, .pdf, or .docx file.",
          variant: "destructive"
        });
        return;
      }
      // Check file size (limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setFile(selectedFile);
      setResults(null); // Clear previous results
    }
  };

  // Function to extract text content from a file
  const extractTextFromFile = async (file: File): Promise<string> => {
    // For text files, we can directly read the content
    if (file.type === 'text/plain') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    }
    
    // For other file types (PDF, DOCX), we'd need server-side processing
    // Since we don't have that available, we'll extract some sample text from the beginning
    // This is a limitation of the current implementation
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // This is a simplified approach for demo purposes
        // In a real application, you'd want to use libraries to properly extract text
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        
        // Try to extract some readable text from the beginning of the file
        // This is very rudimentary and won't work well for binary files
        let text = '';
        for (let i = 0; i < Math.min(5000, bytes.length); i++) {
          if (bytes[i] >= 32 && bytes[i] <= 126) { // ASCII printable chars
            text += String.fromCharCode(bytes[i]);
          }
        }
        
        // Clean up the text a bit
        text = text.replace(/[^\x20-\x7E]/g, ' ').trim();
        
        // If we couldn't extract meaningful text, provide a fallback message
        if (text.length < 100) {
          reject(new Error("Could not extract text from this file type. Try uploading a plain text (.txt) file."));
          return;
        }
        
        resolve(text);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Function to check for plagiarism using Google Search
  const checkPlagiarism = async (text: string) => {
    // Break the text into chunks to search for matches
    // This helps find partial matches across the document
    const chunkSize = 50; // Number of words per chunk
    const words = text.split(/\s+/);
    const chunks = [];
    
    // Create overlapping chunks of text to search
    for (let i = 0; i < words.length; i += Math.floor(chunkSize / 2)) {
      if (i + chunkSize <= words.length) {
        chunks.push(words.slice(i, i + chunkSize).join(' '));
      } else if (i < words.length) {
        chunks.push(words.slice(i).join(' '));
      }
    }
    
    // Only process a limited number of chunks to avoid excessive API calls
    const chunksToProcess = chunks.slice(0, 5);
    const matches = [];
    
    // Search for each chunk using Google Search API
    for (const chunk of chunksToProcess) {
      try {
        // Use the existing optimizedSearch function from google-api-manager
        const searchResults = await optimizedSearch("web", `"${chunk}"`, {
          exactMatch: true,
          maxResults: 10
        });
        
        if (searchResults && searchResults.items && searchResults.items.length > 0) {
          // Filter out results that don't seem relevant
          const relevantResults = searchResults.items.filter(item => {
            // Skip results with very short titles or descriptions
            if (!item.title || !item.description || 
                item.title.length < 10 || item.description.length < 20) {
              return false;
            }
            return true;
          });
          
          // Add the relevant matches
          for (const result of relevantResults) {
            // Calculate a simple similarity score based on word matching
            // In a real system this would be more sophisticated
            const sharedWords = chunk.split(/\s+/).filter(word => 
              result.description.toLowerCase().includes(word.toLowerCase())
            ).length;
            const similarity = sharedWords / chunk.split(/\s+/).length;
            
            // Only include if similarity is above threshold
            if (similarity > 0.3) {
              matches.push({
                text: chunk,
                source: result.url || result.displayUrl || '',
                similarity: similarity
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error searching for chunk: ${chunk}`, error);
      }
    }
    
    // Calculate overall plagiarism score
    // This is a simplified approach - real plagiarism checkers use more complex algorithms
    let overallScore = 0;
    if (matches.length > 0) {
      // Calculate weighted score based on match count and similarities
      const totalChunks = chunks.length;
      const matchedChunksRatio = Math.min(matches.length / totalChunks, 1);
      const avgSimilarity = matches.reduce((sum, match) => sum + match.similarity, 0) / matches.length;
      
      // Combine factors for final score (0-100)
      overallScore = Math.round(matchedChunksRatio * avgSimilarity * 100);
    }
    
    return {
      score: overallScore,
      matches: matches.slice(0, 10) // Limit to top 10 matches
    };
  };

  const uploadAndCheckPlagiarism = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Generate a unique filename to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `plagiarism-checks/${fileName}`;
      
      // Upload file to temporary storage
      const { error: uploadError } = await supabase.storage
        .from('temp-uploads')
        .upload(filePath, file);
        
      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      // Extract text from the file
      let fileText;
      try {
        fileText = await extractTextFromFile(file);
      } catch (error) {
        throw new Error(`Failed to extract text: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
      
      // Check for plagiarism using Google Search
      const plagiarismResults = await checkPlagiarism(fileText);
      setResults(plagiarismResults);
      
      // Clean up the file after results are shown
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

      <div className="mt-4 space-y-4">
        <div className="relative">
          <Input
            type="file"
            id="document-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=".txt,.pdf,.doc,.docx"
          />
          <label 
            htmlFor="document-upload" 
            className="flex items-center justify-center w-full p-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div className="flex flex-col items-center space-y-2">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">
                {file ? file.name : "Click to upload a document"}
              </span>
              {file && (
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)}MB
                </span>
              )}
            </div>
          </label>
        </div>

        <Button
          onClick={uploadAndCheckPlagiarism}
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">●</span>
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              Check for Plagiarism
            </span>
          )}
        </Button>
      </div>

      {results && (
        <div className="mt-6 p-4 border rounded-md bg-background">
          <h4 className="text-lg font-medium mb-2">Results</h4>
          <div className="flex items-center space-x-2 mb-4">
            <div className="text-sm font-medium">Similarity Score:</div>
            <div className="text-sm font-bold">
              {results.score.toFixed(1)}%
            </div>
            <div 
              className={`w-2 h-2 rounded-full ${
                results.score < 20 
                  ? "bg-green-500" 
                  : results.score < 50 
                    ? "bg-yellow-500" 
                    : "bg-red-500"
              }`}
            />
          </div>
          
          {results.matches.length > 0 ? (
            <div className="space-y-4">
              <h5 className="text-sm font-medium">Potential Matches:</h5>
              {results.matches.map((match, index) => (
                <div key={index} className="p-3 bg-accent/40 rounded-md">
                  <div className="text-sm italic mb-1">"{match.text}"</div>
                  <div className="flex justify-between text-xs">
                    <a 
                      href={match.source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {match.source}
                    </a>
                    <span className="font-medium">
                      {(match.similarity * 100).toFixed(1)}% similar
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No significant matches found.</p>
          )}
        </div>
      )}
    </section>
  );
};
