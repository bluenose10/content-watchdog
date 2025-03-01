
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Info, AlertCircle } from "lucide-react";

export const InfoSidebar = () => {
  return (
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
  );
};
