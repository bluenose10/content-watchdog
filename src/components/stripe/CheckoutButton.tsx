
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast as sonnerToast } from "sonner";
import { supabase } from "@/lib/supabase";
import { PRICING_PLANS } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
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
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const handleCheckout = async () => {
    try {
      // Check if user is logged in
      if (!user || !session) {
        sonnerToast.error("Authentication required", {
          description: "Please log in to subscribe to a plan",
        });
        // Store the current path to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        navigate('/login');
        return;
      }

      setIsLoading(true);
      
      // Find the selected plan
      const selectedPlan = PRICING_PLANS.find(plan => plan.id === planId);
      
      if (!selectedPlan) {
        throw new Error(`Plan with ID ${planId} not found`);
      }
      
      // Make sure the plan has a Stripe Price ID (free plan won't)
      if (!selectedPlan.stripePriceId && selectedPlan.price > 0) {
        throw new Error(`No Stripe Price ID configured for plan ${selectedPlan.name}`);
      }
      
      // Show loading toast
      sonnerToast.loading("Creating checkout session...", {
        id: "checkout-toast",
        description: "Please wait while we redirect you to the payment page"
      });
      
      // Get the return URL for after checkout
      const returnUrl = `${window.location.origin}/success`;
      console.log('Return URL:', returnUrl);
      
      try {
        // Get the user's session token
        const accessToken = session.access_token;
        if (!accessToken) {
          throw new Error("No access token available");
        }
        
        console.log('Calling create-checkout with planId:', planId);
        
        // Call the Supabase Edge Function with proper authentication
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: { 
            planId, 
            priceId: selectedPlan.stripePriceId,
            returnUrl 
          }
        });
        
        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(`Failed to create checkout session: ${error.message}`);
        }
        
        console.log('Checkout session response:', data);
        
        if (!data || !data.url) {
          console.error('Invalid response from checkout function:', data);
          throw new Error('No checkout URL returned from server');
        }
        
        // Success toast
        sonnerToast.success("Redirecting to checkout", {
          id: "checkout-toast",
          description: "You'll be redirected to Stripe to complete your payment"
        });
        
        console.log('Redirecting to:', data.url);
        
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } catch (functionError) {
        console.error('Function call error:', functionError);
        throw new Error(`Checkout error: ${functionError.message}`);
      }
      
    } catch (error) {
      console.error('Error initiating checkout:', error);
      
      sonnerToast.error("Checkout failed", {
        id: "checkout-toast",
        description: "There was a problem creating your checkout session"
      });
      
      setError(error instanceof Error ? error.message : "Could not initiate checkout process. Please try again.");
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
              <AlertDialogTitle>Checkout Error</AlertDialogTitle>
              <AlertDialogDescription>
                <span>{error || "Something went wrong with the checkout process."}</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-4 p-3 bg-muted rounded-md text-sm">
              <p className="font-medium">Troubleshooting tips:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Check your internet connection</li>
                <li>Refresh the page and try again</li>
                <li>Ensure you are logged in</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction>Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
