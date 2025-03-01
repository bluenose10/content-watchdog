
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fingerprint } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { verifyContentAuthenticity } from "@/components/content-theft/plagiarism-checker/PlagiarismChecker";
import { AuthenticityCheck } from "@/components/content-theft/plagiarism-checker/PlagiarismChecker";

interface UrlVerificationTabProps {
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  setResult: (result: AuthenticityCheck | undefined) => void;
  setFileName: (fileName: string) => void;
}

export const UrlVerificationTab = ({ isProcessing, setIsProcessing, setResult, setFileName }: UrlVerificationTabProps) => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");

  const handleUrlSubmit = async () => {
    if (!url) return;
    
    setIsProcessing(true);
    try {
      // Extract just the filename from URL for reference
      const urlFileName = url.split('/').pop() || "url-content";
      setFileName(urlFileName);
      
      let contentType: 'text' | 'image' | 'video' | 'audio' = 'text';
      
      if (url.match(/\.(jpeg|jpg|gif|png|webp|bmp)($|\?)/i)) {
        contentType = 'image';
      } else if (url.match(/\.(mp4|webm|mov|avi|wmv)($|\?)/i)) {
        contentType = 'video';
      } else if (url.match(/\.(mp3|wav|ogg|m4a)($|\?)/i)) {
        contentType = 'audio';
      }
      
      const authenticityResult = await verifyContentAuthenticity(url, contentType);
      
      setResult(authenticityResult);
      
      toast({
        title: "Verification complete",
        description: "The URL content has been analyzed for authenticity",
        variant: "success"
      });
    } catch (error) {
      console.error('URL verification error:', error);
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setResult(undefined);
          }}
        />
        <p className="text-xs text-muted-foreground">
          Enter the URL of an image, text, or other content to verify
        </p>
      </div>
      
      <Button
        onClick={handleUrlSubmit}
        disabled={!url || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2">●</span>
            Verifying...
          </span>
        ) : (
          <span className="flex items-center">
            <Fingerprint className="mr-2 h-4 w-4" />
            Verify Content
          </span>
        )}
      </Button>
    </div>
  );
};
