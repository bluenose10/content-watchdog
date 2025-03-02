
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PricingCards } from "./pricing/PricingCards";
import { useEffect, useState } from "react";

export function PricingSection() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Add error handling for initial load
  useEffect(() => {
    console.log("PricingSection initializing...");
    try {
      // Simulate a small delay to ensure all dependencies are loaded
      const timer = setTimeout(() => {
        console.log("PricingSection finished loading");
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error in PricingSection initialization:", error);
      setHasError(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Log component mounting for debugging
    console.log("PricingSection mounted, auth state:", !!user);
  }, [user]);

  const handlePlanClick = (planId: string) => {
    try {
      console.log("Plan clicked:", planId, "User state:", !!user);
      
      if (planId === "basic") {
        if (!user) {
          // Free plan should navigate to signup
          navigate("/signup");
        } else {
          toast({
            title: "Already on Basic Plan",
            description: "You're already using the basic plan features.",
          });
        }
      } else {
        if (!user) {
          toast({
            title: "Sign up required",
            description: "Please sign up first to upgrade to this plan.",
          });
          navigate("/signup");
        } else {
          // Navigate to checkout with plan ID parameter
          navigate(`/checkout?plan_id=${planId}`);
        }
      }
    } catch (error) {
      console.error("Error in handlePlanClick:", error);
      toast({
        title: "Navigation Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (hasError) {
    return (
      <section id="pricing" className="relative overflow-hidden py-6 md:py-4">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-3 text-gradient">Pricing Plans</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unable to load pricing information. Please refresh the page or try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            >
              Refresh
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section id="pricing" className="relative overflow-hidden py-6 md:py-4">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-3 text-gradient">Pricing Plans</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Loading pricing information...
            </p>
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="relative overflow-hidden py-6 md:py-4">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-3 text-gradient">Pricing Plans</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs
          </p>
        </div>

        <PricingCards onPlanClick={handlePlanClick} />

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            14-day money-back guarantee. No contracts.
          </p>
        </div>
      </div>
    </section>
  );
}
