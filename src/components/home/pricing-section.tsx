
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
    if (planId === "basic") {
      // Free plan should navigate to signup
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

  // Update pricing plans to include scheduled searches
  const updatedPlans = PRICING_PLANS.map(plan => {
    if (plan.id === "pro") {
      return {
        ...plan,
        features: [
          ...plan.features,
          "5 scheduled automated searches",
        ]
      };
    }
    if (plan.id === "business") {
      return {
        ...plan,
        features: [
          ...plan.features,
          "20 scheduled automated searches",
        ]
      };
    }
    return plan;
  });

  return (
    <section id="pricing" className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-3">Pricing Plans</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-6 max-w-6xl mx-auto">
          {updatedPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              features={plan.features}
              limitations={[]}
              cta={plan.cta}
              popular={plan.popular}
              onClick={() => handlePlanClick(plan.id)}
              planId={plan.id}
              className="animate-scale-in w-full md:w-1/3"
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            14-day money-back guarantee. No contracts.
          </p>
        </div>
      </div>
    </section>
  );
}
