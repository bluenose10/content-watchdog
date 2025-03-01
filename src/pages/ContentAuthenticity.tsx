
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Fingerprint, Upload, Link as LinkIcon } from "lucide-react";
import { FileUploadTab } from "@/components/content-theft/content-authenticity/FileUploadTab";
import { UrlVerificationTab } from "@/components/content-theft/content-authenticity/UrlVerificationTab";
import { InfoSidebar } from "@/components/content-theft/content-authenticity/InfoSidebar";
import { VerificationResults } from "@/components/content-theft/content-authenticity/VerificationResults";
import { AuthenticityCheck } from "@/components/content-theft/plagiarism-checker/PlagiarismChecker";

export default function ContentAuthenticity() {
  const { user } = useAuth();
  useProtectedRoute(true, true);
  const [activeTab, setActiveTab] = useState("file");
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AuthenticityCheck | undefined>(undefined);

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
                      <FileUploadTab 
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                        setResult={setResult}
                        setFileName={setFileName}
                      />
                    </TabsContent>
                    
                    <TabsContent value="url">
                      <UrlVerificationTab 
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                        setResult={setResult}
                        setFileName={setFileName}
                      />
                    </TabsContent>
                  </Tabs>

                  <VerificationResults result={result} fileName={fileName} />
                </CardContent>
              </Card>
            </div>

            <div>
              <InfoSidebar />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
