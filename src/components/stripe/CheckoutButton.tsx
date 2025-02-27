
import { Button } from "@/components/ui/button";
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
      
      // Display a toast notification to inform the user
      toast({
        title: "Redirecting to checkout",
        description: "Please wait while we prepare your checkout experience.",
      });
      
      // Manually build the URL to the Supabase function
      // This is a fallback approach to avoid issues with the Supabase client
      const url = "/api/checkout?planId=" + encodeURIComponent(planId);
      
      // Navigate to the checkout URL
      window.location.href = url;
      
    } catch (error) {
      console.error('Error during checkout process:', error);
      
      // Create a descriptive error message
      const errorMessage = "Failed to start checkout process. Please try again later.";
      
      setError(errorMessage);
      setShowErrorDialog(true);
      
      toast({
        title: "Checkout Error",
        description: "There was a problem starting the checkout process.",
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
