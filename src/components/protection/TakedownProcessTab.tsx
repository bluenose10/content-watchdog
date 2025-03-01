
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TakedownForm } from "./TakedownForm";
import { useToast } from "@/hooks/use-toast";

export const TakedownProcessTab = () => {
  const [showTakedownForm, setShowTakedownForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"standard" | "social" | "hosting" | null>(null);
  const { toast } = useToast();

  const handleShowForm = (template: "standard" | "social" | "hosting") => {
    setSelectedTemplate(template);
    setShowTakedownForm(true);
  };

  const handleNewRequest = () => {
    toast({
      title: "Feature coming soon",
      description: "The ability to create custom takedown requests will be available soon.",
      variant: "default"
    });
  };

  return (
    <>
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
                      onClick={() => handleShowForm("standard")}
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
                      onClick={() => handleShowForm("social")}
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
                      onClick={() => handleShowForm("hosting")}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button 
                    className="w-full"
                    onClick={handleNewRequest}
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
      
      {/* Dialog for takedown form */}
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
    </>
  );
};
