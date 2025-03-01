
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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
      
      // Get the URL of the uploaded file
      const { data: urlData } = await supabase.storage
        .from('temp-uploads')
        .createSignedUrl(filePath, 600); // URL valid for 10 minutes
      
      if (!urlData?.signedUrl) {
        throw new Error("Failed to get file URL");
      }

      // Send the file URL to our plagiarism detection service
      // For now, we'll simulate a response with mock data
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      // Simulate plagiarism check results
      const mockResults = {
        score: Math.random() * 100,
        matches: [
          {
            text: "This is a sample text that was found in another source.",
            source: "https://example.com/article1",
            similarity: 0.85
          },
          {
            text: "Another example of potentially plagiarized content.",
            source: "https://example.org/research-paper",
            similarity: 0.72
          }
        ]
      };
      
      setResults(mockResults);
      
      // Clean up the file after results are shown
      // In a production environment, you would set up a scheduled task to clean old files
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
        </div>
      )}
    </section>
  );
};
