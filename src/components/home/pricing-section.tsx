
import { PricingCard } from "@/components/ui/pricing-card";
import { PRICING_PLANS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function PricingSection() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePlanClick = (planId: string) => {
    if (planId === "free") {
      navigate("/signup");
    } else {
      if (!user) {
        toast({
          title: "Sign up required",
          description: "Please sign up first to upgrade to this plan.",
        });
        navigate("/signup");
      }
    }
  };

  // Find popular plan or default to first plan
  const displayPlan = PRICING_PLANS.find(plan => plan.popular) || PRICING_PLANS[0];

  return (
    <section id="pricing" className="h-full relative overflow-hidden">
      <div className="h-full">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Pricing Plans</h2>
          <p className="text-sm text-muted-foreground">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="flex justify-center">
          <PricingCard
            key={displayPlan.id}
            name={displayPlan.name}
            description={displayPlan.description}
            price={displayPlan.price}
            features={displayPlan.features.slice(0, 3)} // Show fewer features for compact view
            limitations={[]} // Don't show limitations in compact view
            cta={displayPlan.cta}
            popular={displayPlan.popular}
            onClick={() => handlePlanClick(displayPlan.id)}
            planId={displayPlan.id}
            className="animate-scale-in w-full"
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            14-day money-back guarantee. No contracts.
          </p>
        </div>
      </div>
    </section>
  );
}
