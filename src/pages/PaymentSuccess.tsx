
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Check, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Get session_id from URL or state
  const sessionId = searchParams.get("session_id") || 
                   (location.state as { sessionId?: string })?.sessionId;

  useEffect(() => {
    // Verify the checkout session
    const verifySession = async () => {
      try {
        if (!sessionId) {
          throw new Error("No session ID found in URL or state");
        }
        
        console.log("Verifying session ID:", sessionId);
        
        // For demo purposes, we'll just simulate a successful verification
        // In a real app, we would call the Supabase Edge Function to verify
        if (sessionId.startsWith('cs_test_')) {
          // Simulate successful verification
          setIsSuccess(true);
          setIsLoading(false);
          return;
        }
        
        // Call Supabase Edge Function to verify session
        const { data, error } = await supabase.functions.invoke('verify-checkout', {
          body: { sessionId }
        });
        
        if (error) {
          throw new Error(`Failed to verify session: ${error.message}`);
        }
        
        if (!data || !data.success) {
          throw new Error(data?.message || "Session verification failed");
        }
        
        setIsSuccess(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error verifying payment session:", error);
        setErrorMessage(error instanceof Error ? error.message : "Failed to verify payment");
        setIsSuccess(false);
        setIsLoading(false);
      }
    };

    verifySession();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 space-y-6 bg-card rounded-lg shadow-lg">
        {isLoading ? (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <h1 className="text-2xl font-bold">Verifying payment...</h1>
            <p className="text-muted-foreground">Please wait while we confirm your payment.</p>
          </div>
        ) : isSuccess ? (
          <div className="text-center space-y-4">
            <div className="bg-green-100 p-3 rounded-full inline-flex">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Payment Successful</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your subscription has been activated.
            </p>
            
            <div className="pt-4">
              <Button onClick={() => navigate("/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-red-100 p-3 rounded-full inline-flex">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold">Payment Verification Failed</h1>
            <p className="text-muted-foreground">
              {errorMessage || "We couldn't verify your payment. Please contact support."}
            </p>
            
            <Alert className="my-4 bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-700">Important</AlertTitle>
              <AlertDescription className="text-amber-600 text-sm">
                If you believe this is an error and your card was charged, please contact our support team.
              </AlertDescription>
            </Alert>
            
            <div className="pt-4 space-y-2">
              <Button onClick={() => navigate("/dashboard")} className="w-full">
                Return to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "mailto:support@example.com"} 
                className="w-full"
              >
                Contact Support
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
