
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = searchParams.get("session_id");
  const isDemo = searchParams.get("demo") === "true";

  useEffect(() => {
    // In a real implementation, you would verify the session with the Stripe API
    const verifySession = async () => {
      try {
        // Simulate verification
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (error) {
        console.error("Error verifying payment session:", error);
        setIsLoading(false);
      }
    };

    if (sessionId || isDemo) {
      verifySession();
    } else {
      setIsLoading(false);
    }
  }, [sessionId, isDemo]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 space-y-6 bg-card rounded-lg shadow-lg">
        {isLoading ? (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <h1 className="text-2xl font-bold">Simulating checkout...</h1>
            <p className="text-muted-foreground">This is a demo. No actual payment is being processed.</p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <Alert className="mb-6 bg-yellow-50 border-yellow-200">
              <Info className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-700">Demo Mode</AlertTitle>
              <AlertDescription className="text-yellow-600 text-sm">
                This is a demonstration only. No payment has been processed and no subscription has actually been activated.
              </AlertDescription>
            </Alert>
            
            <div className="bg-green-100 p-3 rounded-full inline-flex">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Demo Checkout Complete</h1>
            <p className="text-muted-foreground">
              In a real application, this page would appear after a successful payment processing.
            </p>
            
            <div className="pt-4">
              <Button onClick={() => navigate("/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
