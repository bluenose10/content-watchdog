
import { useState } from "react";
import { FileUploader } from "@/components/content-theft/plagiarism-checker/FileUploader";
import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { verifyContentAuthenticity } from "@/components/content-theft/plagiarism-checker/PlagiarismChecker";
import { AuthenticityCheck } from "@/components/content-theft/plagiarism-checker/PlagiarismChecker";

interface FileUploadTabProps {
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  setResult: (result: AuthenticityCheck | undefined) => void;
  setFileName: (fileName: string) => void;
}

export const FileUploadTab = ({ isProcessing, setIsProcessing, setResult, setFileName }: FileUploadTabProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileSubmit = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      // Store only the file name for reference, not the file content
      setFileName(file.name);
      
      const authenticityResult = await verifyContentAuthenticity(
        file,
        file.type.startsWith('image/') ? 'image' : 
        file.type.startsWith('video/') ? 'video' : 
        file.type.startsWith('audio/') ? 'audio' : 'text'
      );
      
      setResult(authenticityResult);
      
      toast({
        title: "Verification complete",
        description: "The content has been analyzed for authenticity",
        variant: "success"
      });
      
      // File is not stored in database, only processed transiently
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "An error occurred during verification",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <FileUploader 
      file={file}
      setFile={(newFile) => {
        setFile(newFile);
        if (newFile) setFileName(newFile.name);
        setResult(undefined);
      }}
      isUploading={isProcessing}
      onSubmit={handleFileSubmit}
    />
  );
};
