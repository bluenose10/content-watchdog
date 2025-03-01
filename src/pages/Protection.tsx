import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, FileCheck, AlertTriangle, Mail, RefreshCw, Settings, HelpCircle, ExternalLink } from "lucide-react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TakedownForm } from "@/components/protection/TakedownForm";
import { useNavigate } from "react-router-dom";

export default function Protection() {
  const { user } = useAuth();
  const { isReady } = useProtectedRoute(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showTakedownForm, setShowTakedownForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"standard" | "social" | "hosting" | null>(null);
  const navigate = useNavigate();
  
  if (!isReady || isLoading) {
    return <LoadingState />;
  }

  const fullName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const firstName = fullName.split(' ')[0];
  const avatarUrl = user?.user_metadata?.avatar_url;
  const userInitials = getInitials(fullName);

  // Instead of showing the form, redirect to signup
  const handleRedirectToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-12">
        <div className="flex items-center gap-4 mb-8 pt-8">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-primary">Content Protection</h1>
            <p className="text-muted-foreground">Tools and resources to protect your digital content</p>
          </div>
        </div>
        
        <Tabs defaultValue="protection" className="mb-8">
          <TabsList className="mb-4 flex flex-col sm:flex-row w-full sm:w-auto gap-1 sm:gap-0">
            <TabsTrigger value="protection">Protection Tools</TabsTrigger>
            <TabsTrigger value="takedowns">Takedown Process</TabsTrigger>
            <TabsTrigger value="resources">Legal Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="protection">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>Active Protection</span>
                    </CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Enabled
                    </Badge>
                  </div>
                  <CardDescription>
                    Your content is being actively monitored across platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4 bg-muted/20">
                      <h3 className="font-medium mb-2">Currently Monitoring</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-green-600" />
                          <span className="text-sm">12 Images</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-green-600" />
                          <span className="text-sm">3 Videos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-green-600" />
                          <span className="text-sm">5 Text Content</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-green-600" />
                          <span className="text-sm">2 Brand Names</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="secondary" size="sm" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Adjust Monitoring Settings
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Last Scan Results</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Updated 2 hours ago
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-yellow-50 border border-yellow-100 rounded-md">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium">3 new matches found</span>
                          </div>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-50 border border-green-100 rounded-md">
                          <div className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">2 successful takedowns</span>
                          </div>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="secondary" size="sm" className="w-full">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Run Manual Scan
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Protection Status</span>
                  </CardTitle>
                  <CardDescription>
                    Strengthen your content protection with these actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertTitle>Protection Score: 7/10</AlertTitle>
                      <AlertDescription>
                        Complete the recommended actions below to improve your protection.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Register Copyright</p>
                          <p className="text-sm text-muted-foreground">Formally register your work for legal protection</p>
                        </div>
                        <Button size="sm">Register</Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Add Watermarks</p>
                          <p className="text-sm text-muted-foreground">Add watermarks to your content for easy identification</p>
                        </div>
                        <Button size="sm">Setup</Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Setup Automatic Takedowns</p>
                          <p className="text-sm text-muted-foreground">Enable automatic DMCA notices for detected content</p>
                        </div>
                        <Button size="sm">Enable</Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 border rounded-md bg-muted/10">
                        <div>
                          <p className="font-medium">Create Content Registry</p>
                          <p className="text-sm text-muted-foreground">Document evidence of content ownership</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="takedowns">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <span>DMCA Takedown Process</span>
                </CardTitle>
                <CardDescription>
                  How to get unauthorized copies of your content removed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-md">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                        <span className="font-bold text-primary">1</span>
                      </div>
                      <h3 className="font-medium mb-2">Identify Infringement</h3>
                      <p className="text-sm text-muted-foreground">
                        Our system detects unauthorized uses of your content across the web.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                        <span className="font-bold text-primary">2</span>
                      </div>
                      <h3 className="font-medium mb-2">Generate Notice</h3>
                      <p className="text-sm text-muted-foreground">
                        Create a legally compliant DMCA takedown notice automatically.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                        <span className="font-bold text-primary">3</span>
                      </div>
                      <h3 className="font-medium mb-2">Submit & Track</h3>
                      <p className="text-sm text-muted-foreground">
                        We submit the notice and track the removal process for you.
                      </p>
                    </div>
                  </div>
                  
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Important Notice</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Filing false DMCA claims can have legal consequences. Make sure you own the content and that the use is unauthorized before submitting a takedown.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-muted/30 p-3 border-b">
                      <h3 className="font-medium">Takedown Templates</h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Standard DMCA Notice</p>
                            <p className="text-sm text-muted-foreground">For most websites and platforms</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleRedirectToSignup}
                          >
                            Use Template
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Social Media Takedown</p>
                            <p className="text-sm text-muted-foreground">Optimized for social platforms</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleRedirectToSignup}
                          >
                            Use Template
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Hosting Provider Notice</p>
                            <p className="text-sm text-muted-foreground">For content hosted on servers</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleRedirectToSignup}
                          >
                            Use Template
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Button 
                          className="w-full"
                          onClick={handleRedirectToSignup}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Start New Takedown Request
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <span>Legal Resources</span>
                </CardTitle>
                <CardDescription>
                  Helpful resources to protect your intellectual property
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Copyright Basics</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Learn the fundamentals of copyright law and how it protects your creative work.
                      </p>
                      <div className="flex justify-center">
                        <a href="https://en.wikipedia.org/wiki/Copyright" target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            Read Guide <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </a>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Trademark Protection</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Understand how to protect your brand names, logos, and other identifying marks.
                      </p>
                      <div className="flex justify-center">
                        <a href="https://www.uspto.gov/trademarks/basics/what-trademark" target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            Read Guide <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </a>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">International Protection</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Learn about protecting your content across different countries and jurisdictions.
                      </p>
                      <div className="flex justify-center">
                        <a href="https://en.wikipedia.org/wiki/International_copyright_treaties" target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            Read Guide <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </a>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Fair Use Guidelines</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Understanding when others may legally use portions of your content.
                      </p>
                      <div className="flex justify-center">
                        <a href="https://en.wikipedia.org/wiki/Fair_use" target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            Read Guide <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-muted/30 p-3 border-b">
                      <h3 className="font-medium">Legal Assistance</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Need specialized legal assistance? Our network of IP lawyers can help with complex cases and issues.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">IP Attorney Consultation</p>
                            <p className="text-sm text-muted-foreground">30-minute consultation with a specialized attorney</p>
                          </div>
                          <Button variant="outline" size="sm">Book</Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Document Review</p>
                            <p className="text-sm text-muted-foreground">Have legal documents reviewed by professionals</p>
                          </div>
                          <Button variant="outline" size="sm">Request</Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Custom Legal Strategy</p>
                            <p className="text-sm text-muted-foreground">Develop a comprehensive strategy for your content</p>
                          </div>
                          <Button variant="outline" size="sm">Inquire</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {/* We'll keep this dialog but use it only for educational purposes if needed */}
      <Dialog open={showTakedownForm} onOpenChange={setShowTakedownForm}>
        <DialogContent className="max-w-2xl">
          {selectedTemplate && (
            <TakedownForm
              templateType={selectedTemplate}
              onBack={() => setShowTakedownForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
