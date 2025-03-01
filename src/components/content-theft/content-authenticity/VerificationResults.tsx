
import { AuthenticityDisplay } from "@/components/content-theft/plagiarism-checker/AuthenticityDisplay";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { AuthenticityCheck } from "@/components/content-theft/plagiarism-checker/PlagiarismChecker";
import { generateAuthenticityPdfReport } from "@/components/content-theft/plagiarism-checker/AuthenticityReportGenerator";
import { useToast } from "@/hooks/use-toast";

interface VerificationResultsProps {
  result: AuthenticityCheck | undefined;
  fileName: string;
}

export const VerificationResults = ({ result, fileName }: VerificationResultsProps) => {
  const { toast } = useToast();
  
  const handleDownloadReport = async () => {
    if (!result) return;
    
    try {
      await generateAuthenticityPdfReport(result, fileName || "content", toast);
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };
  
  if (!result) return null;
  
  return (
    <div className="mt-6">
      <AuthenticityDisplay authenticityCheck={result} />
      
      <div className="flex justify-end mt-4">
        <Button 
          onClick={handleDownloadReport} 
          variant="secondary"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF Report
        </Button>
      </div>
    </div>
  );
};
