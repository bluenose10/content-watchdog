
import { PRICING_PLANS } from "@/lib/constants";
import { PricingCard } from "@/components/ui/pricing-card";

interface PricingCardsProps {
  onPlanClick: (planId: string) => void;
}

export function PricingCards({ onPlanClick }: PricingCardsProps) {
  return (
    <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-6 max-w-6xl mx-auto">
      {PRICING_PLANS.map((plan) => (
        <PricingCard
          key={plan.id}
          name={plan.name}
          description={plan.description}
          price={plan.price}
          features={plan.features}
          limitations={[]}
          cta={plan.cta}
          popular={plan.popular}
          onClick={() => onPlanClick(plan.id)}
          planId={plan.id}
          className="animate-scale-in w-full md:w-1/3"
        />
      ))}
    </div>
  );
}
