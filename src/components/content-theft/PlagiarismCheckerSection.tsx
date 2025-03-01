import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { FileUploader } from "./plagiarism-checker/FileUploader";
import { extractTextFromFile } from "./plagiarism-checker/TextExtractor";
import { checkPlagiarism, PlagiarismResult } from "./plagiarism-checker/PlagiarismChecker";
import { PlagiarismResults } from "./plagiarism-checker/PlagiarismResults";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from "@/context/AuthContext";

export const PlagiarismCheckerSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<PlagiarismResult | null>(null);
  const [isBucketChecked, setIsBucketChecked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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

  const saveResultsToDatabase = async (results: PlagiarismResult, fileName: string) => {
    if (!user) {
      console.log("User not logged in, skipping database save");
      return;
    }

    try {
      const { data: searchQuery, error: searchQueryError } = await supabase
        .from('search_queries')
        .insert({
          user_id: user.id,
          query_type: 'plagiarism',
          query_text: `Plagiarism Check: ${fileName}`,
          search_params_json: JSON.stringify({ 
            fileName,
            score: results.score,
            checkedAt: new Date().toISOString(),
            aiEnhanced: !!results.aiAnalysis,
            aiConfidenceScore: results.aiConfidenceScore
          })
        })
        .select()
        .single();

      if (searchQueryError) {
        console.error("Error saving search query:", searchQueryError);
        throw new Error(`Failed to save search query: ${searchQueryError.message}`);
      }

      if (results.matches.length > 0 && searchQuery?.id) {
        const searchResults = results.matches.map(match => ({
          search_id: searchQuery.id,
          title: match.text.substring(0, 50) + (match.text.length > 50 ? '...' : ''),
          url: match.source,
          thumbnail: '',
          source: new URL(match.source).hostname,
          match_level: match.similarity > 0.7 ? 'High' : match.similarity > 0.4 ? 'Medium' : 'Low',
          found_at: new Date().toISOString(),
          similarity_score: match.similarity
        }));

        const { error: resultsError } = await supabase
          .from('search_results')
          .insert(searchResults);

        if (resultsError) {
          console.error("Error saving search results:", resultsError);
          throw new Error(`Failed to save search results: ${resultsError.message}`);
        }
      }

      toast({
        title: "Results saved",
        description: "Plagiarism check results have been saved to your dashboard.",
        variant: "success"
      });

    } catch (error) {
      console.error("Error saving results to database:", error);
      toast({
        title: "Error saving results",
        description: error instanceof Error ? error.message : "Failed to save results to database",
        variant: "destructive"
      });
    }
  };

  const downloadPdf = async () => {
    if (!results || !file) return;
    
    setIsDownloading(true);
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("Plagiarism Check Report", 14, 22);
      
      doc.setFontSize(12);
      doc.text(`File: ${file.name}`, 14, 32);
      
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 39);
      
      doc.setFontSize(14);
      doc.text(`Similarity Score: ${results.score.toFixed(1)}%`, 14, 49);
      
      doc.setFontSize(14);
      doc.text("Potential Matches:", 14, 59);
      
      if (results.matches.length > 0) {
        const tableData = results.matches.map((match, index) => [
          index + 1,
          match.text.length > 50 ? match.text.substring(0, 50) + "..." : match.text,
          match.source,
          `${(match.similarity * 100).toFixed(1)}%`
        ]);
        
        autoTable(doc, {
          startY: 65,
          head: [["#", "Text", "Source", "Similarity"]],
          body: tableData,
          styles: { overflow: 'linebreak' },
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 80 },
            2: { cellWidth: 50 },
            3: { cellWidth: 20 }
          },
        });
      } else {
        doc.setFontSize(12);
        doc.text("No significant matches found.", 14, 65);
      }
      
      doc.save(`plagiarism-report-${file.name.split('.')[0]}.pdf`);
      
      toast({
        title: "Report downloaded",
        description: "Plagiarism check report has been downloaded.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download PDF report",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const uploadAndCheckPlagiarism = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `plagiarism-checks/${fileName}`;
      
      console.log('Attempting to upload file to temp-uploads bucket...');
      
      const { error: uploadError, data: uploadData } = await supabase.storage
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
            return;
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
      setResults(plagiarismResults);
      console.log('Plagiarism check completed');
      
      if (plagiarismResults.aiAnalysis) {
        console.log('AI analysis included in results');
      }
      
      if (user) {
        await saveResultsToDatabase(plagiarismResults, file.name);
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
    } catch (error) {
      console.error("Error during plagiarism check:", error);
      
      if (error instanceof Error && 
          (error.message.includes('OpenAI API key') || 
           error.message.includes('OpenAI API error'))) {
        toast({
          title: "API Key Required",
          description: "An OpenAI API key is required for enhanced AI analysis. The check was completed with basic analysis only.",
          variant: "warning"
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to check for plagiarism",
          variant: "destructive"
        });
      }
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
          setResults(null);
        }}
        isUploading={isUploading}
        onSubmit={uploadAndCheckPlagiarism}
      />

      {results && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={downloadPdf}
            disabled={isDownloading}
          >
            <Download size={16} />
            {isDownloading ? "Generating..." : "Download Report"}
          </Button>
        </div>
      )}

      <PlagiarismResults results={results} />
    </section>
  );
};
