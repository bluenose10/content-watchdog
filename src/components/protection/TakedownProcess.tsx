
import { AlertTriangle, ExternalLink, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface TakedownProcessProps {
  onNewTakedownRequest: () => void;
  onTemplateSelect: (type: "standard" | "social" | "hosting") => void;
}

export const TakedownProcess = ({ onNewTakedownRequest, onTemplateSelect }: TakedownProcessProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <span>DMCA Takedown Process</span>
            </CardTitle>
            <CardDescription>
              How to get unauthorized copies of your content removed
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200">
            <Zap className="h-3 w-3" />
            Automated Filing Available
          </Badge>
        </div>
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
                We'll automatically submit the notice and track the removal process for you.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button 
              variant="default" 
              className="flex items-center gap-2"
              onClick={onNewTakedownRequest}
            >
              <Zap className="h-4 w-4" />
              Start Automated DMCA Filing
            </Button>
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
                    onClick={() => onTemplateSelect("standard")}
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
                    onClick={() => onTemplateSelect("social")}
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
                    onClick={() => onTemplateSelect("hosting")}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
