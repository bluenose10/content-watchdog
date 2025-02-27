
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

    if (sessionId) {
      verifySession();
    } else {
      setIsLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 space-y-6 bg-card rounded-lg shadow-lg">
        {isLoading ? (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <h1 className="text-2xl font-bold">Processing your payment...</h1>
            <p className="text-muted-foreground">Please wait while we confirm your payment.</p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-green-100 p-3 rounded-full inline-flex">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your subscription has been activated.
            </p>
            
            <Alert className="my-4 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-700">Demo Mode</AlertTitle>
              <AlertDescription className="text-blue-600 text-sm">
                This is a demonstration. No actual payment was processed. In a production environment, this page would only appear after completing the payment process.
              </AlertDescription>
            </Alert>
            
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
