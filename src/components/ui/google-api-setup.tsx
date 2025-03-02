
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { googleApiManager } from "@/lib/google-api-manager";
import { loadGoogleApiCredentials } from "@/lib/pre-fetch-service";
import { Loader2, AlertTriangle, RefreshCw, CheckCircle } from "lucide-react";

interface GoogleApiSetupProps {
  onComplete?: () => void;
  skipSupabaseCheck?: boolean;
}

export function GoogleApiSetup({ onComplete, skipSupabaseCheck = false }: GoogleApiSetupProps) {
  const [apiKey, setApiKey] = useState("");
  const [cseId, setCseId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSupabase, setCheckingSupabase] = useState(!skipSupabaseCheck);
  const [supbaseCheckFailed, setSupabaseCheckFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  const [testMessage, setTestMessage] = useState("");

  // Try to load credentials from Supabase on mount
  useEffect(() => {
    const loadCredentials = async () => {
      if (skipSupabaseCheck) {
        setCheckingSupabase(false);
        return;
      }
      
      setCheckingSupabase(true);
      try {
        console.log("GoogleApiSetup: Attempting to load credentials from Supabase, attempt #", retryCount + 1);
        
        // Clear any possible cached credentials to ensure fresh retrieval
        sessionStorage.removeItem("GOOGLE_API_KEY");
        sessionStorage.removeItem("GOOGLE_CSE_ID");
        
        const success = await loadGoogleApiCredentials();
        if (success) {
          console.log("GoogleApiSetup: Successfully loaded credentials from Supabase");
          toast.success("Google API credentials loaded from Supabase");
          
          // Set the state variables for display
          const cachedApiKey = sessionStorage.getItem("GOOGLE_API_KEY") || "";
          const cachedCseId = sessionStorage.getItem("GOOGLE_CSE_ID") || "";
          if (cachedApiKey) setApiKey(cachedApiKey.substring(0, 4) + "..." + cachedApiKey.substring(cachedApiKey.length - 4));
          if (cachedCseId) setCseId(cachedCseId.substring(0, 4) + "..." + cachedCseId.substring(cachedCseId.length - 4));
          
          setTestSuccess(true);
          setTestMessage("Credentials successfully loaded from Supabase");
          
          // If there's a completion callback, run it
          if (onComplete) {
            onComplete();
          }
        } else {
          console.warn("GoogleApiSetup: Failed to load credentials from Supabase");
          setSupabaseCheckFailed(true);
          
          // Attempt to pre-fill form with any values we might have found
          const cachedApiKey = localStorage.getItem("GOOGLE_API_KEY") || import.meta.env.VITE_GOOGLE_API_KEY;
          const cachedCseId = localStorage.getItem("GOOGLE_CSE_ID") || import.meta.env.VITE_GOOGLE_CSE_ID;
          
          if (cachedApiKey) setApiKey(cachedApiKey);
          if (cachedCseId) setCseId(cachedCseId);
          
          setTestSuccess(false);
          setTestMessage("Failed to load credentials from Supabase");
        }
      } catch (error) {
        console.error("GoogleApiSetup: Error loading credentials from Supabase:", error);
        setSupabaseCheckFailed(true);
        setTestSuccess(false);
        setTestMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      } finally {
        setCheckingSupabase(false);
      }
    };

    loadCredentials();
  }, [onComplete, skipSupabaseCheck, retryCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey || !cseId) {
      toast.error("Both API Key and CSE ID are required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save credentials
      googleApiManager.setCredentials(apiKey, cseId);
      
      // Store in both session and local storage for better persistence
      sessionStorage.setItem("GOOGLE_API_KEY", apiKey);
      sessionStorage.setItem("GOOGLE_CSE_ID", cseId);
      localStorage.setItem("GOOGLE_API_KEY", apiKey);
      localStorage.setItem("GOOGLE_CSE_ID", cseId);
      
      // Test the credentials by checking the API setup status
      const apiStatus = googleApiManager.checkApiCredentials();
      if (apiStatus.configured) {
        setTestSuccess(true);
        setTestMessage("Credentials validated and saved successfully");
        toast.success("Google API credentials saved successfully");
        
        // Call the onComplete callback if provided
        if (onComplete) {
          onComplete();
        }
      } else {
        setTestSuccess(false);
        setTestMessage("Credentials saved but validation failed");
        toast.warning("Credentials saved but validation failed");
      }
    } catch (error) {
      console.error("Error saving credentials:", error);
      toast.error("Failed to save credentials");
      setTestSuccess(false);
      setTestMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrySupabaseCheck = () => {
    // Clear any cached credentials
    sessionStorage.removeItem("GOOGLE_API_KEY");
    sessionStorage.removeItem("GOOGLE_CSE_ID");
    
    // Increment retry count to trigger the useEffect
    setRetryCount(prev => prev + 1);
    setTestSuccess(null);
    setTestMessage("");
    
    toast.info("Retrying to fetch credentials from Supabase...");
  };

  const handleClearAllStoredCredentials = () => {
    // Clear all stored credentials
    sessionStorage.removeItem("GOOGLE_API_KEY");
    sessionStorage.removeItem("GOOGLE_CSE_ID");
    localStorage.removeItem("GOOGLE_API_KEY");
    localStorage.removeItem("GOOGLE_CSE_ID");
    setApiKey("");
    setCseId("");
    setTestSuccess(null);
    setTestMessage("");
    
    toast.info("All stored credentials have been cleared");
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
            <div className="flex-1">
              <p className="text-sm text-amber-800 font-medium">Failed to load Google API credentials from Supabase</p>
              <p className="text-xs text-amber-700 mt-1">
                Make sure your Supabase project has the GOOGLE_API_KEY and GOOGLE_CSE_ID secrets correctly set.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                  onClick={handleRetrySupabaseCheck}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry Supabase Check
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                  onClick={handleClearAllStoredCredentials}
                >
                  Clear All Stored Credentials
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      )}
      
      {testSuccess !== null && (
        <CardContent className="pb-0">
          <div 
            className={`${
              testSuccess 
                ? "bg-green-50 border-green-200 text-green-800" 
                : "bg-red-50 border-red-200 text-red-800"
            } border rounded-md p-3 flex items-start gap-3 mb-4`}
          >
            {testSuccess ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{testSuccess ? "Success" : "Error"}</p>
              <p className="text-xs mt-1">{testMessage}</p>
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
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : "Save Credentials"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={handleClearAllStoredCredentials}
          >
            Clear All Stored Credentials
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
