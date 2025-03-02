
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { googleApiManager } from "@/lib/google-api-manager";
import { loadGoogleApiCredentials } from "@/lib/pre-fetch-service";
import { Loader2, AlertTriangle } from "lucide-react";

interface GoogleApiSetupProps {
  onComplete?: () => void;
}

export function GoogleApiSetup({ onComplete }: GoogleApiSetupProps) {
  const [apiKey, setApiKey] = useState("");
  const [cseId, setCseId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSupabase, setCheckingSupabase] = useState(true);
  const [supbaseCheckFailed, setSupabaseCheckFailed] = useState(false);

  // Try to load credentials from Supabase on mount
  useEffect(() => {
    const loadCredentials = async () => {
      setCheckingSupabase(true);
      try {
        console.log("GoogleApiSetup: Attempting to load credentials from Supabase");
        const success = await loadGoogleApiCredentials();
        if (success) {
          console.log("GoogleApiSetup: Successfully loaded credentials from Supabase");
          toast.success("Google API credentials loaded from Supabase");
          if (onComplete) {
            onComplete();
          }
        } else {
          console.warn("GoogleApiSetup: Failed to load credentials from Supabase");
          setSupabaseCheckFailed(true);
        }
      } catch (error) {
        console.error("GoogleApiSetup: Error loading credentials from Supabase:", error);
        setSupabaseCheckFailed(true);
      } finally {
        setCheckingSupabase(false);
      }
    };

    loadCredentials();
  }, [onComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey || !cseId) {
      toast("Both API Key and CSE ID are required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save credentials
      googleApiManager.setCredentials(apiKey, cseId);
      
      // Store in session storage for persistence
      sessionStorage.setItem("GOOGLE_API_KEY", apiKey);
      sessionStorage.setItem("GOOGLE_CSE_ID", cseId);
      
      toast.success("Google API credentials saved successfully");
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving credentials:", error);
      toast.error("Failed to save credentials");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSupabase) {
    return (
      <Card className="w-full max-w-xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-center">Checking for API credentials from Supabase...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Set Up Google API</CardTitle>
        <CardDescription>
          Enter your Google API key and Custom Search Engine ID to enable search functionality.
        </CardDescription>
      </CardHeader>
      
      {supbaseCheckFailed && (
        <CardContent className="pb-0">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-800 font-medium">Failed to load Google API credentials from Supabase</p>
              <p className="text-xs text-amber-700 mt-1">
                Make sure your Supabase project has the GOOGLE_API_KEY and GOOGLE_CSE_ID secrets correctly set.
              </p>
            </div>
          </div>
        </CardContent>
      )}
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Google API Key</Label>
            <Input
              id="apiKey"
              placeholder="Enter your Google API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from the{" "}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Google Cloud Console
              </a>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cseId">Custom Search Engine ID</Label>
            <Input
              id="cseId"
              placeholder="Enter your CSE ID"
              value={cseId}
              onChange={(e) => setCseId(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Create a Custom Search Engine at{" "}
              <a
                href="https://programmablesearchengine.google.com/cse/all"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Programmable Search Engine
              </a>
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : "Save Credentials"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
