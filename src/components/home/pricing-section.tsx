
import { PricingCard } from "@/components/ui/pricing-card";
import { PRICING_PLANS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function PricingSection() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePlanClick = (planId: string) => {
    if (planId === "free") {
      navigate("/signup");
    } else {
      toast({
        title: "Upgrade to Premium",
        description: "Please sign up first to upgrade to this plan.",
      });
      navigate("/signup");
    }
  };

  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 animate-floating" style={{ animationDelay: "0.2s" }} />
        <div className="absolute bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/5 animate-floating" style={{ animationDelay: "0.7s" }} />
      </div>
      
      <div className="container relative">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground">
            Choose the plan that works best for you. All plans include core features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan, index) => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              features={plan.features}
              limitations={plan.limitations}
              cta={plan.cta}
              popular={plan.popular}
              onClick={() => handlePlanClick(plan.id)}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day money-back guarantee. No contracts or commitments.
          </p>
        </div>
      </div>
    </section>
  );
}
