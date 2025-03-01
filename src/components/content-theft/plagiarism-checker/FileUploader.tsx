
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  isUploading: boolean;
  onSubmit: () => void;
}

export const FileUploader = ({ file, setFile, isUploading, onSubmit }: FileUploaderProps) => {
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
    }
  };

  return (
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
        onClick={onSubmit}
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
  );
};
