
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, FileCheck, AlertTriangle, RefreshCw, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ProtectionToolsTab = () => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "Action requested",
      description: `Your request to ${action} has been received. This feature will be available soon.`,
      variant: "default"
    });
  };

  return (
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
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleAction("adjust monitoring settings")}
                >
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAction("view matches")}
                  >
                    View
                  </Button>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 border border-green-100 rounded-md">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">2 successful takedowns</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAction("view takedowns")}
                  >
                    View
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleAction("run manual scan")}
                >
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
                <Button 
                  size="sm"
                  onClick={() => handleAction("register copyright")}
                >
                  Register
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <p className="font-medium">Add Watermarks</p>
                  <p className="text-sm text-muted-foreground">Add watermarks to your content for easy identification</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleAction("setup watermarks")}
                >
                  Setup
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <p className="font-medium">Setup Automatic Takedowns</p>
                  <p className="text-sm text-muted-foreground">Enable automatic DMCA notices for detected content</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleAction("enable automatic takedowns")}
                >
                  Enable
                </Button>
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
  );
};
