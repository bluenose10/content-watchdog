
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { FileUploader } from "./plagiarism-checker/FileUploader";
import { PlagiarismResults } from "./plagiarism-checker/PlagiarismResults";
import { PlagiarismResult } from "./plagiarism-checker/PlagiarismChecker";
import { useBucketManager } from "./plagiarism-checker/BucketManager";
import { usePlagiarismAnalyzer } from "./plagiarism-checker/PlagiarismAnalyzer";
import { usePlagiarismReport } from "./plagiarism-checker/PlagiarismReportGenerator";

export const PlagiarismCheckerSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<PlagiarismResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Use the bucket manager hook
  const { isBucketChecked, isBucketReady } = useBucketManager();
  
  // Use the plagiarism analyzer hook
  const { uploadAndCheckPlagiarism } = usePlagiarismAnalyzer({
    file,
    setResults,
    setIsUploading,
    isUploading,
    setSaveError
  });
  
  // Use the report generator hook
  const { generatePdfReport } = usePlagiarismReport();

  const downloadPdf = async () => {
    if (!results || !file) return;
    
    setIsDownloading(true);
    try {
      await generatePdfReport(results, file.name);
    } finally {
      setIsDownloading(false);
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
          setSaveError(null); // Clear any previous errors
        }}
        isUploading={isUploading}
        onSubmit={uploadAndCheckPlagiarism}
      />

      {saveError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span className="text-sm">{saveError}</span>
        </div>
      )}

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
