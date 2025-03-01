
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "@/components/content-theft/plagiarism-checker/FileUploader";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useProtectedRoute, PremiumFeature } from "@/hooks/useProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import { AuthenticityDisplay } from "@/components/content-theft/plagiarism-checker/AuthenticityDisplay";
import { verifyContentAuthenticity } from "@/components/content-theft/plagiarism-checker/PlagiarismChecker";
import { Fingerprint, Upload, Link as LinkIcon, AlertCircle, Info, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateAuthenticityPdfReport } from "@/components/content-theft/plagiarism-checker/AuthenticityReportGenerator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ContentAuthenticity() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasPremiumFeature } = useProtectedRoute(true, true);
  const [activeTab, setActiveTab] = useState("file");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(undefined);

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
  
  const handleDownloadReport = async () => {
    if (!result) return;
    
    try {
      await generateAuthenticityPdfReport(result, fileName || "content", toast);
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-64 bg-card shadow-sm border-r">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 container max-w-6xl py-8 px-4 md:px-8">
          <div className="mb-8 section-padding border-b border-border/40 pb-4">
            <h1 className="text-3xl font-bold flex items-center gap-2 text-gradient">
              <Fingerprint className="h-8 w-8 text-primary" />
              Content Authenticity Verification
            </h1>
            <p className="text-muted-foreground mt-2">
              Verify if content is authentic, AI-generated, or manipulated
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Verify Content</CardTitle>
                  <CardDescription>
                    Upload a file or provide a URL to check content authenticity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="file" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4 w-full">
                      <TabsTrigger value="file" className="flex-1">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload File
                      </TabsTrigger>
                      <TabsTrigger value="url" className="flex-1">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        URL
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="file">
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
                    </TabsContent>
                    
                    <TabsContent value="url">
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
                    </TabsContent>
                  </Tabs>

                  {result && (
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
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>About Authenticity Verification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>How it works</AlertTitle>
                    <AlertDescription>
                      Our AI-powered system analyzes content to determine if it's authentic, AI-generated, or manipulated.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Verification checks:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>AI generation patterns</li>
                      <li>Digital manipulation traces</li>
                      <li>Content fingerprinting</li>
                      <li>Metadata analysis</li>
                      <li>Pattern recognition</li>
                    </ul>
                  </div>
                  
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important Note</AlertTitle>
                    <AlertDescription>
                      While our system is highly accurate, no verification tool is perfect. Results should be used as guidance, not definitive proof.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="border rounded-md p-3 bg-muted/30 mt-4">
                    <h3 className="text-sm font-medium mb-2">Privacy Information</h3>
                    <p className="text-xs text-muted-foreground">
                      Your files are analyzed but never stored in our database. All processing is done transiently to maintain privacy and reduce storage costs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
