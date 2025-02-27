
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

  // A more robust checkout handler that better handles errors
  const handleCheckout = () => {
    try {
      setIsLoading(true);
      
      // For demo purposes, instead of trying to go to a non-existent API endpoint,
      // let's redirect to the pricing section on the home page for now
      sonnerToast.success("Redirecting to pricing page", {
        description: "This is a demo. In a real app, you would be redirected to a payment page."
      });
      
      // Redirect to pricing section after a short delay
      setTimeout(() => {
        navigate("/#pricing");
        setIsLoading(false);
      }, 1500);
      
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
