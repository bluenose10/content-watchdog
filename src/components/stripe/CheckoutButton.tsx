
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast as sonnerToast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CheckoutButtonProps {
  planId: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "blue" | "purple";
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
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      // Show loading toast
      sonnerToast.loading("Preparing checkout...", {
        id: "checkout-toast",
        description: "Please wait while we prepare your checkout"
      });
      
      // Simulate API call to create checkout session
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success toast
      sonnerToast.success("Checkout ready", {
        id: "checkout-toast",
        description: "You're being redirected to the payment page"
      });
      
      // In a real implementation, you would redirect to the Stripe checkout page
      // For demo purposes, we'll navigate to a success page after a short delay
      setTimeout(() => {
        navigate("/success");
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error initiating checkout:', error);
      
      sonnerToast.error("Checkout failed", {
        id: "checkout-toast",
        description: "There was a problem with the checkout process"
      });
      
      setError("Could not initiate checkout process. Please try again.");
      setShowErrorDialog(true);
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
      
      {showErrorDialog && (
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
                    <li>Refresh the page and try again</li>
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
      )}
    </>
  );
}
