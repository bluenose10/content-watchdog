
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/payment-service";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface CheckoutButtonProps {
  planId: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "blue";
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({ 
  planId, 
  variant = "default",
  className = "",
  children = "Subscribe"
}: CheckoutButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Starting checkout for plan:', planId);
      
      const { url } = await createCheckoutSession(planId);
      
      // Redirect to Stripe Checkout
      if (url) {
        console.log('Redirecting to Stripe checkout:', url);
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      
      // Create a more descriptive error message
      let errorMessage = error.message || "Failed to start checkout process";
      
      // Add more context for common errors
      if (errorMessage.includes('status code 500')) {
        errorMessage = 'Server error: The payment service is currently unavailable. Please try again later.';
      } else if (errorMessage.includes('status code 404')) {
        errorMessage = 'Error: The requested plan was not found.';
      } else if (errorMessage.includes('status code 401')) {
        errorMessage = 'Authentication error: Please log in again to continue.';
      } else if (errorMessage.includes('network')) {
        errorMessage = 'Network error: Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
      setShowErrorDialog(true);
      
      toast({
        title: "Checkout Error",
        description: "There was a problem starting the checkout process. See details for more information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        className={className}
        onClick={handleCheckout}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : children}
      </Button>
      
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Error</AlertDialogTitle>
            <AlertDialogDescription>
              {error || "Something went wrong with the payment process."}
              <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                <p className="font-medium">Troubleshooting tips:</p>
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Check your internet connection</li>
                  <li>Verify your Stripe configuration in Supabase</li>
                  <li>Ensure the plan exists in your database</li>
                  <li>Try again in a few minutes</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
