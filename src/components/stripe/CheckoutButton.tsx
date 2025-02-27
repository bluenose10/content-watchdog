
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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

  // A simplified checkout handler that minimizes potential points of failure
  const handleCheckout = () => {
    try {
      setIsLoading(true);
      
      // Show toast first for immediate feedback
      toast({
        title: "Starting checkout process",
        description: "Please wait while we prepare your checkout page.",
      });
      
      // Simple timeout to allow the toast to be displayed
      setTimeout(() => {
        // Direct navigation to checkout URL
        window.location.href = `/api/checkout?planId=${encodeURIComponent(planId)}&timestamp=${Date.now()}`;
      }, 100);
      
    } catch (error) {
      console.error('Error initiating checkout:', error);
      
      setError("Could not initiate checkout process. Please try again.");
      setShowErrorDialog(true);
      
      toast({
        title: "Checkout Error",
        description: "There was a problem starting the checkout process.",
        variant: "destructive",
      });
      
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
