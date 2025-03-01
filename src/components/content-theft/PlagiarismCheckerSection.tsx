
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileUploader } from "./plagiarism-checker/FileUploader";
import { PlagiarismResult } from "./plagiarism-checker/PlagiarismChecker";
import { PlagiarismResults } from "./plagiarism-checker/PlagiarismResults";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { checkAndCreateBucket } from "./plagiarism-checker/BucketManager";
import { uploadAndCheckPlagiarism } from "./plagiarism-checker/PlagiarismService";
import { generatePlagiarismPdfReport } from "./plagiarism-checker/PdfReportGenerator";

export const PlagiarismCheckerSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<PlagiarismResult | null>(null);
  const [isBucketChecked, setIsBucketChecked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const initBucket = async () => {
      const success = await checkAndCreateBucket();
      setIsBucketChecked(true);
    };
    
    initBucket();
  }, []);

  const downloadPdf = async () => {
    if (!results || !file) return;
    
    setIsDownloading(true);
    try {
      await generatePlagiarismPdfReport(results, file.name, toast.toast);
    } catch (error) {
      // Error handling is done inside the generatePlagiarismPdfReport function
      console.error("Error in downloadPdf:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePlagiarismCheck = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const plagiarismResults = await uploadAndCheckPlagiarism(file, user?.id, toast.toast);
      setResults(plagiarismResults);
    } catch (error) {
      // Error handling is done inside the uploadAndCheckPlagiarism function
      console.error("Error in handlePlagiarismCheck:", error);
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
        onSubmit={handlePlagiarismCheck}
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
